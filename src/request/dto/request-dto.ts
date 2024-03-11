import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RequestStatus } from 'src/entities/Request.entity';

enum ResponseEnum {
  APPROVE = RequestStatus.APPROVE,
  REJECT = RequestStatus.REJECT,
}

export class RequestUpdateDTO {
  @ApiProperty({
    type: String,
    example: ResponseEnum.APPROVE,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ResponseEnum)
  readonly status: RequestStatus;
}
