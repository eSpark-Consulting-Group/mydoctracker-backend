import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONTACT_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from 'enum';

const invalidContactMsg = "Invalid contact number format. It should be like (123) 456-7890 | (123)456-7890 | 123-456-7890 | 1234567890"
const invalidUsernameMsg = "Username should only contain alphanumeric characters (letters and numbers), Small Letters, Underscores (_) and hyphens (-)."

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
    example: 'fname_lname',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Ussername must be at least 3 characters long' })
  @MaxLength(20, { message: 'Ussername must not exceed 20 characters' })
  @Matches(USERNAME_REGEX, { message: invalidUsernameMsg })
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
  @Matches(PASSWORD_REGEX, {
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
  @Matches(CONTACT_REGEX, { message: invalidContactMsg, })
  readonly contact: string;

  @ApiProperty({
    type: String,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  readonly rememberMe: boolean;
}

export class SigninDTO {
  @ApiProperty({
    type: String,
    example: 'fname_lname',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Ussername must be at least 3 characters long' })
  @MaxLength(20, { message: 'Ussername must not exceed 20 characters' })
  @Matches(USERNAME_REGEX, { message: invalidUsernameMsg })
  readonly username: string;

  @ApiProperty({
    type: String,
    example: 'Admin@test123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
  readonly password: string;

  @ApiProperty({
    type: String,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  readonly rememberMe: boolean;
}
export class ChangePasswordDTO {
  @ApiProperty({
    type: String,
    example: 'Admin@test123',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Old password should not be empty' })
  @MinLength(8, { message: 'Old Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Old Password must not exceed 20 characters' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Old Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
  readonly oldPassword?: string;

  @ApiProperty({
    type: String,
    example: 'Admin@test123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'New Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'New Password must not exceed 20 characters' })
  @Matches(PASSWORD_REGEX, {
    message:
      'New Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
  })
  readonly newPassword: string;
}

export class ForgotPasswordDTO {
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
    example: 'abc.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  readonly host: string;
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
  @Matches(CONTACT_REGEX, { message: invalidContactMsg, })
  @IsOptional()
  readonly contact: string;
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  readonly profilePicture?: Express.Multer.File;
}
