import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDTO {
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
    example: 'fName-lName',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

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
    example: 'Admin@test123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Matches(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/, {
    message:
      'Invalid contact number format. It should be like (123) 456-7890 | (123)456-7890 | 123-456-7890 | 1234567890',
  })
  readonly contact: string;

  @ApiProperty({
    type: String,
    example: true,
  })
  @IsBoolean()
  readonly rememberMe: boolean;
}

export class SigninDTO {
  @ApiProperty({
    type: String,
    example: 'fName-lName',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    type: String,
    example: 'Admin@test123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    example: true,
  })
  @IsBoolean()
  readonly rememberMe: boolean;
}
export class ChangePasswordDTO {
  @ApiProperty({
    type: String,
    example: 'Admin@test123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
  readonly oldPassword: string;

  @ApiProperty({
    type: String,
    example: 'Admin@test123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
  readonly newPassword: string;
}

export class UpdateProfileDTO {
  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  readonly firstName: string;

  @ApiProperty({ type: String, required: false })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({ type: String, required: false })
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty({ type: String, required: false })
  @IsDefined()
  @Matches(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/, {
    message:
      'Invalid contact number format. It should be like (123) 456-7890 | (123)456-7890 | 123-456-7890 | 1234567890',
  })
  @IsOptional()
  readonly contact: string;
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  readonly profilePicture: File;
}
