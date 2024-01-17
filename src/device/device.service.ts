import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { MongoDBService } from 'src/mongodb/mongodb.service';
import { Repository } from 'typeorm';
import { AddTelemetryDTO, DeviceMacDTO } from './dto/device-dto';
import { DeviceStates } from 'src/mongodb/schemas/device_telemetry.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceInventory)
    private deviceInventory: Repository<DeviceInventory>,
    private mongodDBService: MongoDBService,
  ) {}

  async checkDeviceByMac(macAddress: string) {
    const foundDevice = await this.deviceInventory.findOne({
      where: { macAddress: macAddress },
    });
    if (!foundDevice) {
      throw new NotFoundException(`Device not found!`);
    }
    return foundDevice;
  }

  async getDeviceById(id: string) {
    const foundDevice = await this.deviceInventory.findOne({
      where: { id },
    });
    if (!foundDevice) {
      throw new NotFoundException(`Device not found!`);
    }
    return foundDevice;
  }

  async addTelemetry(telemetryData: AddTelemetryDTO, macAddress: string) {
    const device = await this.checkDeviceByMac(macAddress);
    await this.mongodDBService.addDeviceTelemetry(
      {
        ...telemetryData,
      },
      device,
    );
  }

  async isDeviceActive(deviceId: string) {
    const device = await this.mongodDBService.getDeviceLastTelemetry(deviceId);
    if (!device) {
      throw new NotFoundException('No telemetry found for this device');
    }
    const utcSeconds = device.nextUpdateAt;
    const deviceNextUpdateAt = new Date(0);
    deviceNextUpdateAt.setUTCSeconds(utcSeconds);
    const thirtyMinutes = 1.8e6;
    const oneHour = 3.6e6;
    if (device.state === DeviceStates.idle) {
      if (deviceNextUpdateAt.getTime() + oneHour > Date.now()) {
        return true;
      } else {
        return false;
      }
    }
    if (deviceNextUpdateAt.getTime() + thirtyMinutes > Date.now()) {
      return true;
    } else {
      return false;
    }
  }
}
