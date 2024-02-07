import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeviceStates } from 'src/mongodb/schemas/device_telemetry.entity';
import { IsAfterNow } from 'src/utils/decorators/future-date';

export class AddTelemetryDTO {
  @ApiProperty({
    type: Number,
    example: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly lat: number;

  @ApiProperty({
    type: Number,
    example: 90,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly lng: number;

  @ApiProperty({
    type: Number,
    example: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly batteryPercentage: number;

  @ApiProperty({
    type: String,
    example: DeviceStates.idle,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DeviceStates)
  readonly state: DeviceStates;

  @ApiProperty({
    type: Number,
    example: Math.floor((Date.now() + 60000 * 5) / 1000),
  })
  @IsNotEmpty()
  @IsAfterNow()
  readonly nextUpdateAt: number;
}

export class DeviceMacDTO {
  @ApiProperty({
    type: String,
    example: 'a1:2B:3c:D4:e5:6F',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
    message: 'Invalid MAC Address!',
  })
  readonly macaddress: string;
}

class GeofencePoint {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsNotEmpty()
  readonly lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  readonly lng: number;
}

export class AddGeofenceDTO {
  @ApiProperty({
    type: String,
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: [{ lat: 90, lng: 180 }],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GeofencePoint)
  @IsObject({ each: true })
  geofence: GeofencePoint[];
}
export class EditGeofenceDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly geofenceId: string;

  @ApiProperty({
    type: String,
    example: 'name',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    example: [{ lat: 90, lng: 180 }],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GeofencePoint)
  @IsObject({ each: true })
  geofence: GeofencePoint[];
}

export class FakeDeviceDTO {
  @ApiProperty({
    type: String,
    example: DeviceStates.idle,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DeviceStates)
  readonly state: DeviceStates;
}
