import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MongoDBService } from 'src/mongodb/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeviceTelemetrySchema,
  DeviceTelemtry,
} from 'src/mongodb/schemas/device_telemetry.entity';
import { Document } from 'src/entities/Document.entity';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/entities/User.entity';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { Admin } from 'src/entities/Admin.entity';
import { FirmwareService } from 'src/firmware/firmware.service';
import { Firmware } from 'src/entities/Firmware.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: DeviceTelemtry.name, schema: DeviceTelemetrySchema },
    ]),
    TypeOrmModule.forFeature([
      DeviceInventory,
      Document,
      Users,
      Admin,
      Firmware,
    ]),
  ],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    MongoDBService,
    UsersService,
    CloudStorageService,
    EmailService,
    FirmwareService,
  ],
  exports: [DeviceService],
})
export class DeviceModule {}
