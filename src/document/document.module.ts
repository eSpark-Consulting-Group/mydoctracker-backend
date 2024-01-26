import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DcoumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from 'src/entities/Document.entity';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/entities/User.entity';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { DeviceService } from 'src/device/device.service';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { MongoDBService } from 'src/mongodb/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeviceTelemetrySchema,
  DeviceTelemtry,
} from 'src/mongodb/schemas/device_telemetry.entity';
import { DocumentHistory } from 'src/entities/DocumentHistory.entity';
import { OTPService } from 'src/otp/otp.service';
import { OTP } from 'src/entities/otp.entity';
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
      Document,
      Users,
      DeviceInventory,
      DocumentHistory,
      OTP,
      Admin,
      Firmware,
    ]),
  ],
  controllers: [DcoumentController],
  providers: [
    DocumentService,
    UsersService,
    CloudStorageService,
    EmailService,
    DeviceService,
    MongoDBService,
    OTPService,
    FirmwareService,
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
