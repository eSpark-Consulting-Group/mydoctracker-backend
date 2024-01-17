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
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
