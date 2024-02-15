import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DocumentType } from 'enum';

class FieldDto {
  @ApiProperty({ example: 'fieldName' })
  name: string;

  @ApiProperty({ example: 'fieldValue' })
  value: string;
}

const transformField = ({ value }) => {
  try {
    const parsedValue = JSON.parse(value);
    if (
      Array.isArray(parsedValue) &&
      parsedValue.every(
        (item) =>
          item && typeof item === 'object' && 'name' in item && 'value' in item,
      )
    ) {
      return parsedValue as FieldDto[];
    }
    throw Error('Invalid array structure');
  } catch (error) {
    throw new BadRequestException('Invalid JSON array format for fields array');
  }
};

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
  readonly file: Express.Multer.File;

  @ApiProperty({
    type: [FieldDto],
    example: [{ name: 'fieldName', value: 'fieldValue' }],
  })
  @Transform(transformField)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  fields?: string;

  @ApiProperty({
    type: String,
    example: 4013,
  })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @Min(1000)
  @Max(9999)
  readonly otp: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Employee_id',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly employeeId?: string;
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
    type: [FieldDto],
    example: [{ name: 'fieldName', value: 'fieldValue' }],
    required: false,
  })
  @Transform(transformField)
  @IsOptional()
  @IsArray()
  fields?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  readonly file: Express.Multer.File;
}
