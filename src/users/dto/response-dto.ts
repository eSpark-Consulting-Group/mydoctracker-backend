import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/entities/User.entity';

export class SingupResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Your account has been created successfully!',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: Users;
}
class TokenDto {
  @ApiProperty()
  token: string;
}
export class SigninResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'You have successfully logged in!',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: TokenDto;
}
export class ChangePasswordResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Your password has been changed successfully!',
  })
  message: string;
}
export class UpdateProfileResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Your profile has been updated successfully!',
  })
  message: string;
}
export class GetDeviceByMacDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Your device has been connected successfully!',
  })
  message: string;
}
