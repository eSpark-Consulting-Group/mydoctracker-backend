import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubsidiaryDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
export class ParamDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
