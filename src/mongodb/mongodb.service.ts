import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeviceStates,
  DeviceTelemetryDocument,
  DeviceTelemtry,
} from './schemas/device_telemetry.entity';
import { AddTelemetryDTO } from 'src/device/dto/device-dto';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';

export class MongoDBService {
  constructor(
    @InjectModel(DeviceTelemtry.name)
    private deviceTelemetryModel: Model<DeviceTelemetryDocument>,
  ) {}
  async addDeviceTelemetry(
    telemetryData: AddTelemetryDTO,
    device: DeviceInventory,
  ) {
    const telemetry = new this.deviceTelemetryModel({
      ...telemetryData,
      deviceId: device.id,
    });
    return telemetry.save();
  }
  async getDeviceLastTelemetry(deviceId: string) {
    return this.deviceTelemetryModel.findOne(
      { deviceId },
      {},
      { sort: { sentAt: -1 } },
    );
  }
}
