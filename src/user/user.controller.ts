import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto, SingupResponseDto } from './dto/response-dto';
import { ErrorResponseBody } from 'src/utils/ApiResponse';
import {
  LoginUserDto,
  SignupCorporateUserDto,
  SignupSingleUserDto,
} from './dto/user-dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Signup as Single User' })
  @Post('/signup-user')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: SingupResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async signupSingleUser(@Body() reqData: SignupSingleUserDto) {
    const user = await this.userService.signupSingleUser(reqData);
    delete user.password;
    return {
      status: 'success',
      message: 'Your account has been created successfully!',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Signup as Corporate User' })
  @Post('/signup-corporate')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: SingupResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async signupCoporateUser(@Body() reqData: SignupCorporateUserDto) {
    const user = await this.userService.signupCorporateUser(reqData);
    delete user.password;
    return {
      status: 'success',
      message: 'Your account has been created successfully!',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Login as Single User or Corporate User' })
  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: LoginResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async loginUser(@Body() reqData: LoginUserDto) {
    const token = await this.userService.loginUser(reqData);
    return {
      status: 'success',
      message: 'You have sucessfully logged in!',
      data: { token },
    };
  }
}
