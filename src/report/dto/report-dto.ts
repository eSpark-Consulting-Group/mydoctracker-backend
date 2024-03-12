import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RequestStatus } from 'src/entities/Request.entity';

export class ReportProblemDTO {
  @ApiProperty({
    required: true,
    type: 'string',
    example: 'email@email.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true,
    type: 'string',
    example: 'This is the description of the problem being reported',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary',
  })
  readonly reportPicture: Express.Multer.File;
}
