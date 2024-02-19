import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RequestStatus } from 'src/entities/Request.entity';

enum ResponseEnum {
  APPROVED = RequestStatus.APPROVED,
  REJECTED = RequestStatus.REJECTED,
}

export class RequestUpdateDTO {
  @ApiProperty({
    type: String,
    example: ResponseEnum.APPROVED,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ResponseEnum)
  readonly status: RequestStatus;
}
