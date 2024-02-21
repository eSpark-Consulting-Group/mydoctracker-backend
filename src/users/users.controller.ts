import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
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
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ChangePasswordDTO,
  CUSignupDTO,
  ForgotPasswordDTO,
  SigninDTO,
  SUSignupDTO,
  UpdateProfileDTO,
} from './dto/users-dto';
import { APIResponseType } from 'src/utils/APIResponse';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/User.entity';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';
import { STRINGS } from 'enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidator } from 'src/utils/helpers/file.validation';

@Controller(STRINGS.USERS_ROUTE)
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @ApiOperation({
    summary: 'Signup a single user',
  })
  @Post('/signup/su')
  @HttpCode(200)
  async signupSU(@Body() reqData: SUSignupDTO) {
    const data = await this.userService.signupSU(reqData);
    return {
      status: 'success',
      message: 'Your account has been created successfully!',
      data,
    };
  }
  @ApiOperation({
    summary: 'Signup a Coporate user',
  })
  @Post('/signup/cu')
  @HttpCode(200)
  async signupCU(@Body() reqData: CUSignupDTO) {
    const data = await this.userService.signupCU(reqData);
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
  @UseGuards(ApiKeyAuthGuard, JwtGuard)
  @ApiQuery({ name: 'token', required: false })
  @Put(`${STRINGS.CHANGE_PASSWORD_ROUTE}`)
  @HttpCode(200)
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfile(
    @UploadedFile(
      fileValidator({
        fileIsRequired: false,
        fileType: /^image\/(jpeg|jpg|png)$/,
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get User Info',
  })
  @UseGuards(JwtGuard)
  @Get('/info')
  @HttpCode(200)
  getUserInfo(@CurrentUser() user: Users) {
    return {
      status: 'success',
      message: 'User info has been fetched successfully!',
      data: user,
    };
  }
}
