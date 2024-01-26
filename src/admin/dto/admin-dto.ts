import { ApiProperty } from '@nestjs/swagger';

export class UploadFirmwareDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  readonly file: Express.Multer.File;
}
