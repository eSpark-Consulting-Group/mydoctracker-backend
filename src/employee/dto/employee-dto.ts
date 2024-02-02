import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from 'src/entities/User.entity';
import { SignupDTO } from 'src/users/dto/users-dto';

enum EmployeeRoles {
  ACU = UserRoles.ACU,
  BCU = UserRoles.BCU,
  RCU = UserRoles.RCU,
}

export class AddEmployeeDTO extends SignupDTO {
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
}
