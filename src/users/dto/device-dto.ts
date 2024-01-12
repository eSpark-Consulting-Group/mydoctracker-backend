import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { DeviceInventory } from '../../entities/DeviceInventory.entity';

export class DeviceMacDTO {
  @ApiProperty({
    type: String,
    example: 'a1:2B:3c:D4:e5:6F',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/, {
    message: 'Invalid MAC Address found!',
  })
  // data: DeviceInventory;
  readonly macAddress: string;
}
