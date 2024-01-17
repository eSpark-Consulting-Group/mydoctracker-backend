import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DocumentType } from 'src/entities/Document.entity';

export class AddDocumentDTO {
  @ApiProperty({
    type: String,
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  readonly deviceId: string;

  @ApiProperty({
    type: String,
    example: DocumentType.SINGLE,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DocumentType)
  readonly type: DocumentType;

  @ApiProperty({
    type: String,
    example: 'Document Title',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    type: String,
    example: new Date(),
  })
  @IsDateString()
  readonly creationDate: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  readonly file: File;
}
export class EditDocumentDTO {
  @ApiProperty({
    required: false,
    type: String,
    example: DocumentType.SINGLE,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DocumentType)
  @IsOptional()
  readonly type: DocumentType;

  @ApiProperty({
    required: false,
    type: String,
    example: 'Document Title',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    required: false,
    type: String,
    example: new Date(),
  })
  @IsDateString()
  @IsOptional()
  readonly creationDate: Date;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  readonly file: File;
}
