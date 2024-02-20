import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { RequestController } from './requst.controller';
import { UsersService } from 'src/users/users.service';
import { RequestService } from './request.service';
import { Request } from 'src/entities/Request.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { Subsidiary } from 'src/entities/Subsidiary.entity';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/entities/Company.entity';
import { Document } from 'src/entities/Document.entity';
import { DocumentService } from 'src/document/document.service';
import { DocumentHistory } from 'src/entities/DocumentHistory.entity';
import { DeviceService } from 'src/device/device.service';
import { OTPService } from 'src/otp/otp.service';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { FirmwareService } from 'src/firmware/firmware.service';
import { MongoDBService } from 'src/mongodb/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeviceTelemetrySchema,
  DeviceTelemtry,
} from 'src/mongodb/schemas/device_telemetry.entity';
import { Admin } from 'src/entities/Admin.entity';
import { OTP } from 'src/entities/otp.entity';
import { Firmware } from 'src/entities/Firmware.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: DeviceTelemtry.name, schema: DeviceTelemetrySchema },
    ]),
    TypeOrmModule.forFeature([
      Users,
      Request,
      Subsidiary,
      Company,
      Document,
      DocumentHistory,
      DeviceInventory,
      Admin,
      OTP,
      Firmware
    ]),
  ],
  controllers: [RequestController],
  providers: [
    RequestService,
    UsersService,
    CloudStorageService,
    EmailService,
    SubsidiaryService,
    CompanyService,
    DocumentService,
    DeviceService,
    OTPService,
    FirmwareService,
    MongoDBService,
  ],
  exports: [],
})
export class RequestModule {}
