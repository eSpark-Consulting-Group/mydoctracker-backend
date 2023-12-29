import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/User.entity';

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
  data: User;
}
export class LoginResponseDto {
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
  data: User;
}
