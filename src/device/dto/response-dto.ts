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
export class AddGeofenceResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Geofence has been created!',
  })
  message: string;

  @ApiProperty({
    description: 'Response message',
  })
  data: {};
}
export class EditGeofenceResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Geofence has been edited!',
  })
  message: string;

  @ApiProperty({
    description: 'Response message',
  })
  data: {};
}
export class GetGeofencesResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Geofences have been fetched!',
  })
  message: string;

  @ApiProperty({
    description: 'Response message',
  })
  data: {};
}
export class GetGeofenceResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Geofence has been fetched!',
  })
  message: string;

  @ApiProperty({
    description: 'Response message',
  })
  data: {};
}
export class DeleteGeofenceResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Geofence has been delted!',
  })
  message: string;

  @ApiProperty({
    description: 'Response message',
  })
  data: {};
}
