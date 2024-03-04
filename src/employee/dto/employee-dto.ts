import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PASSWORD_REGEX } from 'enum';
import { UserRoles } from 'src/entities/User.entity';
import { SUSignupDTO, UpdateProfileDTO } from 'src/users/dto/users-dto';

enum EmployeeRoles {
  ACU = UserRoles.ACU,
  BCU = UserRoles.BCU,
  RCU = UserRoles.RCU,
}
class AccessibilityDTO {
  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly doc: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly share: boolean;
}

export class AddEmployeeDTO extends SUSignupDTO {
  @ApiProperty({
    type: String,
    example: EmployeeRoles.BCU,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(EmployeeRoles)
  readonly role: UserRoles;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly subsidiary: string;

  @ApiProperty({
    type: AccessibilityDTO,
  })
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => AccessibilityDTO)
  readonly accessibility?: AccessibilityDTO;
}
export class EditEmployeeDTO extends UpdateProfileDTO {}
export class SubsdiaryIdDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly subsidiary: string;
}
export class SearchFilter {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly search?: string;
}

export class ResetPasswordDTO {
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
    type: Number,
    example: 4013,
  })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @Min(1000)
  @Max(9999)
  readonly otp: number;
}
