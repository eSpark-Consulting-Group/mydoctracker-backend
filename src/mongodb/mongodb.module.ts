import { Module } from '@nestjs/common';
import { MongoDBService } from './mongodb.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeviceTelemetrySchema,
  DeviceTelemtry,
} from './schemas/device_telemetry.entity';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: DeviceTelemtry.name, schema: DeviceTelemetrySchema },
    ]),
  ],
  controllers: [],
  providers: [MongoDBService],
})
export class MongoDBModule {}
