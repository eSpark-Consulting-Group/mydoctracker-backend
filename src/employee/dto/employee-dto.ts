import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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
