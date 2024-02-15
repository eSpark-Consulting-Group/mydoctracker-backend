import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { CONTACT_REGEX } from 'enum';

const invalidContactMsg =
  'Invalid contact number format. It should be like (123) 456-7890 | (123)456-7890 | 123-456-7890 | 1234567890';

export class CreateCompanyDTO {
  @ApiProperty({
    type: String,
    example: 'Company Name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'company@email.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Matches(CONTACT_REGEX, { message: invalidContactMsg })
  readonly contact: string;
}
