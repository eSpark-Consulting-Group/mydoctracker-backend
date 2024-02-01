import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubsidiaryDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly company: string;
}
export class EditSubsidiaryDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
export class SubsidiaryIdDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
