import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  SigninDTO,
  SignupDTO,
  UpdateProfileDTO,
} from './dto/users-dto';
import {
  APIResponseType,
  ErrorResponseBody,
  NotFoundResponseBody,
} from 'src/utils/APIResponse';
import {
  ChangePasswordResponseDto,
  ForgotPasswordResponseDto,
  SigninResponseDto,
  SingupResponseDto,
  UpdateProfileResponseDto,
} from './dto/response-dto';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/User.entity';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';
import { STRINGS } from 'enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(STRINGS.USERS_ROUTE)
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @ApiOperation({
    summary: 'Signup a single user',
    description:
      'Initiates the user registration process by accepting user-provided signup data. The "SignupDTO" includes necessary details like username, email, and password. Utilizes the "UserService.signupSingleUser" method to create a new user account based on the received data, ensuring data integrity and validation. Upon successful account creation, responds with a "status" indicating success, a confirmation "message", and "data" representing the newly created user details. Failed registration attempts prompt appropriate error handling or status codes. This endpoint is crucial for user registration and maintains data consistency.',
  })
  @Post('/signup')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: SingupResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async signup(@Body() reqData: SignupDTO) {
    const data = await this.userService.signupUser(reqData);
    return {
      status: 'success',
      message: 'Your account has been created successfully!',
      data,
    };
  }
  @ApiOperation({
    summary: 'Signin',
    description:
      'Initiates the login process by verifying user-provided credentials against stored data. Upon successful authentication, generates a JWT token to authorize subsequent requests. The "SigninDTO" contains user login details like email/username and password for validation. If authentication succeeds, the response includes a "token" granting access to protected routes. Utilizes the "UserService.signin" method to validate credentials and produce the token. Successful login triggers a response with status "success" and a confirmation message. In case of failed login attempts, appropriate error responses or status codes are provided.',
  })
  @Post('/signin')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: SigninResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async signin(@Body() reqData: SigninDTO) {
    const data = await this.userService.signin(reqData);
    return {
      status: 'success',
      message: 'You have successfully logged in',
      data,
    };
  }

  @ApiSecurity('key')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change Password',
    description:
      'Facilitates the password change process for a specific user identified by "username". Accepts "ChangePasswordDTO" containing old and new password details for validation. Utilizes the "UserService.changePassword" method to update the user password securely, requiring correct authentication before modifying the password data. The endpoint responds with a "status" indicating success upon a successful password change. It ensures security and data integrity by enforcing the password change only for the authenticated user. Failed password change attempts prompt relevant error responses or appropriate status codes. This endpoint is crucial for ensuring user account security and password management.',
  })
  @ApiResponse({
    description: 'Not found',
    type: NotFoundResponseBody,
    status: 404,
  })
  @UseGuards(ApiKeyAuthGuard, JwtGuard)
  @ApiQuery({ name: 'token', required: false })
  @Put(`${STRINGS.CHANGE_PASSWORD_ROUTE}`)
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: ChangePasswordResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async changePassword(
    @Body() requestData: ChangePasswordDTO,
    @CurrentUser() user: Users,
    @Query('token') token: string,
  ): Promise<APIResponseType> {
    await this.userService.changePassword({ ...requestData, token }, user);
    return {
      status: 'success',
      message: 'Your password has been changed successfully!',
    };
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Profile',
    description:
      'Updates user profile information, including a new profile picture. Accepts an "UpdateProfileDTO" in the request body for other profile details. The "UploadedFile" decorator captures a "profilePicture" file from the request. Utilizes the "UserService.updateProfile" method to apply changes to the user profile. Requires the authenticated user details obtained from the "@CurrentUser" decorator.  Responds with "status" indicating the success of the operation and a confirmation "message". This endpoint is crucial for users to modify their profile details and upload a new profile picture.',
  })
  @UseGuards(JwtGuard)
  @Put('/update')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: UpdateProfileResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpeg|jpg|png)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Body() reqData: UpdateProfileDTO,
    @CurrentUser() user: Users,
  ): Promise<APIResponseType> {
    const data = await this.userService.updateProfile(reqData, file, user);
    return {
      data,
      status: 'success',
      message: 'Your profile has been updated successfully!',
    };
  }

  @ApiOperation({
    summary: 'Generate password reset link',
    description:
      'Initiates the password reset process for a user who has forgotten their password. Accepts "ForgotPasswordDTO" containing the user email for identification. Captures the client IP address using the "@Ip" decorator and device information from the request. Utilizes the "UserService.forgotPassword" method to generate a password reset token and send an email with instructions for resetting the password. Responds with "status" indicating the success of the operation and a confirmation "message". This endpoint is crucial for users who need to recover access to their accounts.',
  })
  @Post('/password/forget')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(
    @Body() reqData: ForgotPasswordDTO,
    @Ip() ip: string,
    @Req() request: any,
  ) {
    await this.userService.forgotPassword(
      reqData.email,
      ip,
      request.device,
      reqData.host,
    );
    return {
      status: 'success',
      message: 'Email has been sent for password reset!',
    };
  }
}
