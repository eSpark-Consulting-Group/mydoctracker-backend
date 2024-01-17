import { ApiProperty } from '@nestjs/swagger';

export class AddTelemetryResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Telemetry has been added!',
  })
  message: string;
}
