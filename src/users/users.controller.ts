import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePasswordDTO, SigninDTO, SignupDTO } from './dto/users-dto';
import {
  APIResponseType,
  ErrorResponseBody,
  NotFoundResponseBody,
} from 'src/utils/APIResponse';
import {
  ChangePasswordResponseDto,
  SigninResponseDto,
  SingupResponseDto,
} from './dto/response-dto';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) { }
  @ApiOperation({ summary: 'Signup a single user', description: 'Initiates the user registration process by accepting user-provided signup data. The "SignupDTO" includes necessary details like username, email, and password. Utilizes the "UserService.signupSingleUser" method to create a new user account based on the received data, ensuring data integrity and validation. Upon successful account creation, responds with a "status" indicating success, a confirmation "message", and "data" representing the newly created user details. Failed registration attempts prompt appropriate error handling or status codes. This endpoint is crucial for user registration and maintains data consistency.' })
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
  async signupSingleUser(@Body() reqData: SignupDTO) {
    const data = await this.userService.signupSingleUser(reqData);
    return {
      status: 'success',
      message: 'Your account has been created successfully!',
      data,
    };
  }
  @ApiOperation({ summary: 'Signin', description: 'Initiates the login process by verifying user-provided credentials against stored data. \nUpon successful authentication, generates a JWT token to authorize subsequent requests. \nThe "SigninDTO" contains user login details like email/username and password for validation. If authentication succeeds, the response includes a "token" granting access to protected routes. Utilizes the "UserService.signin" method to validate credentials and produce the token. Successful login triggers a response with status "success" and a confirmation message. In case of failed login attempts, appropriate error responses or status codes are provided.' })
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
    const token = await this.userService.signin(reqData);
    return {
      status: 'success',
      message: 'You have successfully logged in',
      data: { token },
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change Password By Username',
    description: 'Facilitates the password change process for a specific user identified by "username". Accepts "ChangePasswordDTO" containing old and new password details for validation. Utilizes the "UserService.changePassword" method to update the user password securely, requiring correct authentication before modifying the password data. The endpoint responds with a "status" indicating success upon a successful password change. It ensures security and data integrity by enforcing the password change only for the authenticated user. Failed password change attempts prompt relevant error responses or appropriate status codes. This endpoint is crucial for ensuring user account security and password management.',
  })
  @ApiResponse({
    description: 'Not found',
    type: NotFoundResponseBody,
    status: 404,
  })
  @UseGuards(JwtGuard)
  @Put('/:username/password')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: ChangePasswordResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @ApiParam({ name: 'username', example: 'fName-lName' })
  async changePassword(
    @Param('username') username: string,
    @Body() requestData: ChangePasswordDTO,
  ): Promise<APIResponseType> {
    await this.userService.changePassword({ ...requestData, username });
    return {
      status: 'success',
      message: 'Your password has been changed successfully!',
    };
  }
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update Profile By Username' })
  // @UseGuards(JwtGuard)
  // @Put('/:username/update')
  // @HttpCode(200)
  // @ApiOkResponse({
  //   description: 'Successful response',
  //   type: ChangePasswordResponseDto,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: 'Internal server error',
  //   type: ErrorResponseBody,
  // })
  // @ApiParam({ name: 'username', example: 'fName-lName' })
  // async updateProfile(
  //   @Param('username') username: string,
  //   @Body() requestData: ChangePasswordDTO,
  // ): Promise<APIResponseType> {
  //   await this.userService.changePassword({ ...requestData, username });
  //   return {
  //     status: 'success',
  //     message: 'Your password has been changed successfully!',
  //   };
  // }
}
