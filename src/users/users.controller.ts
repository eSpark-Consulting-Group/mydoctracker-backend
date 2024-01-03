import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SigninDTO, SignupDTO } from './dto/users-dto';
import { ErrorResponseBody } from 'src/utils/APIResponse';
import { SingupResponseDto } from './dto/response-dto';

@Controller('users')
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
  @ApiOperation({ summary: 'Singin' })
  @Post('/signin')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: SingupResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async signin(@Body() reqData: SigninDTO) {
    const token = await this.userService.signin(reqData);
    return {
      status: 'success',
      message: 'Your account has been created successfully!',
      data: token,
    };
  }
}
