import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
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
import { UserRoles, Users } from 'src/entities/User.entity';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';
import { STRINGS } from 'enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidator } from 'src/utils/helpers/file.validation';
import { Roles } from 'src/auth/guard/roles-decorator';

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
  })
  @UseGuards(ApiKeyAuthGuard, JwtGuard)
  @Roles([UserRoles.SU, UserRoles.CU])
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
  })
  @UseGuards(JwtGuard)
  @Roles([UserRoles.SU, UserRoles.CU])
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
  })
  @Post('/password/forget')
  @HttpCode(200)
  async forgotPassword(@Body() reqData: ForgotPasswordDTO) {
    await this.userService.forgotPassword(reqData.email, reqData.host);
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
