import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupSingleUserDto {
  @ApiProperty({
    type: String,
    example: 'First Name',
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    type: String,
    example: 'Last Name',
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    type: String,
    example: 'email@email.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    example: 'test123',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    type: String,
    example: 'test123',
  })
  @IsString()
  @IsNotEmpty()
  readonly contact: string;
}
export class SignupCorporateUserDto extends SignupSingleUserDto {
  @ApiProperty({
    type: String,
    example: 'Company Name',
  })
  @IsString()
  @IsNotEmpty()
  readonly companyName: string;

  @ApiProperty({
    type: String,
    example: 'company@email.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly companyEmail: string;

  @ApiProperty({
    type: String,
    example: 'Company Address',
  })
  @IsString()
  @IsNotEmpty()
  readonly companyAddress: string;

  @ApiProperty({
    type: String,
    example: 'Company Contact',
  })
  @IsString()
  @IsNotEmpty()
  readonly companyContact: string;
}

export class LoginUserDto {
  @ApiProperty({
    type: String,
    example: 'email@email.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    example: 'test123',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
