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
  constructor(private userService: UsersService) {}
  @ApiOperation({ summary: 'Signup' })
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
  @ApiOperation({ summary: 'Signin' })
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
    description:
      "This API will change user's password with the request body defined below. This API will give different responses based on the request. These responses are defined below",
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
