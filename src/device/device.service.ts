import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { MongoDBService } from 'src/mongodb/mongodb.service';
import { Repository } from 'typeorm';
import {
  AddTelemetryDTO,
  AddGeofenceDTO,
  EditGeofenceDTO,
  FakeDeviceDTO,
} from './dto/device-dto';
import { DeviceStates } from 'src/mongodb/schemas/device_telemetry.entity';
import { Users } from 'src/entities/User.entity';
import {
  Document,
  IdleStateIntervals,
  MobileStateIntervals,
} from 'src/entities/Document.entity';
import { v4 as uuidv4 } from 'uuid';
import { Admin } from 'src/entities/Admin.entity';
import * as bcrypt from 'bcrypt';
import { FirmwareService } from 'src/firmware/firmware.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceInventory)
    private deviceInventory: Repository<DeviceInventory>,
    @InjectRepository(Document)
    private documentRepositry: Repository<Document>,
    @InjectRepository(Admin)
    private adminRepositry: Repository<Admin>,
    private mongodDBService: MongoDBService,
    private firmwareService: FirmwareService,
  ) {}

  private async getCurrentUserDocument(assignee: Users, id: string) {
    const document = await this.documentRepositry.findOne({
      where: { id, assignee },
    });
    if (!document) {
      throw new NotFoundException('Document not found!');
    }
    return document;
  }

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

  async addTelemetry(telemetryData: AddTelemetryDTO, device: DeviceInventory) {
    device.batteryPercentage = telemetryData.batteryPercentage;
    await this.deviceInventory.save(device);
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
        return { status: true, device };
      } else {
        return { status: false, device };
      }
    }
    if (deviceNextUpdateAt.getTime() + thirtyMinutes > Date.now()) {
      return { status: true, device };
    } else {
      return { status: false, device };
    }
  }

  async createGeofence(
    assignee: Users,
    id: string,
    geofenceData: AddGeofenceDTO,
  ) {
    const document = await this.getCurrentUserDocument(assignee, id);
    const geofence = {
      id: uuidv4(),
      name: geofenceData.name,
      geofence: geofenceData.geofence,
    };
    if (document.meta?.geofences) {
      document.meta.geofences.push(geofence);
    } else {
      document.meta = {
        geofences: [geofence],
      };
    }
    await this.documentRepositry.save(document);
    return geofence;
  }

  async editGeofence(
    assignee: Users,
    ids: { documentId: string; geofenceId: string },
    geofenceData: EditGeofenceDTO,
  ) {
    const document = await this.getCurrentUserDocument(
      assignee,
      ids.documentId,
    );
    const geofence = document.meta?.geofences?.find(
      (geo) => geo.id === ids.geofenceId,
    );
    if (!geofence) {
      throw new NotFoundException('geofence not found!');
    }
    geofence.name = geofenceData.name || geofence.name;
    geofence.geofence = geofenceData.geofence || geofence.geofence;
    await this.documentRepositry.save(document);
    return geofence;
  }

  async getAllGeofences(assignee: Users, id: string) {
    const document = await this.getCurrentUserDocument(assignee, id);
    return document.meta?.geofences || [];
  }
  async getGeofenceByID(
    assignee: Users,
    ids: { documentId: string; geofenceId: string },
  ) {
    const document = await this.getCurrentUserDocument(
      assignee,
      ids.documentId,
    );
    const geofence = document.meta?.geofences?.find(
      (geo) => geo.id === ids.geofenceId,
    );
    if (!geofence) {
      throw new NotFoundException('Geofence not found!');
    }
    return geofence;
  }

  async deleteGeofence(
    assignee: Users,
    ids: { documentId: string; geofenceId: string },
  ) {
    const document = await this.getCurrentUserDocument(
      assignee,
      ids.documentId,
    );
    const index = document.meta?.geofences?.findIndex(
      (geo) => geo.id === ids.geofenceId,
    );
    if (index === undefined || index < 0) {
      throw new NotFoundException('Geofence not found!');
    }
    if (index > -1) {
      document.meta.geofences.splice(index, 1);
    }
    await this.documentRepositry.save(document);
  }

  async getDeviceInfo(device: DeviceInventory) {
    const document = await this.documentRepositry
      .createQueryBuilder('document')
      .innerJoin('document.tracker', 'tracker')
      .where('tracker.macAddress = :macAddress', {
        macAddress: device.macAddress,
      })
      .getOne();
    const documentData = {
      geofences: [],
      idleStateInterval: IdleStateIntervals.SIX_HOURS,
      mobileStateInterval: MobileStateIntervals.FIVE_MINUTES,
    };
    if (!document) {
      return documentData;
    }
    documentData.geofences = document.meta?.geofences || [];
    documentData.idleStateInterval = document.idleStateInterval;
    documentData.mobileStateInterval = document.mobileStateInterval;
    return documentData;
  }
  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(5);
    const hashedPassowrd: string = bcrypt.hashSync(password, salt);
    return hashedPassowrd;
  }

  private async deviceTelemetryRunner(
    macAddress: string,
    device: DeviceInventory,
    state: DeviceStates,
  ) {
    const { idleStateInterval, mobileStateInterval } =
      await this.getDeviceInfo(device);
    console.log(
      `Adding telemetry for device id = ${device.id} & macAddress = ${macAddress}`,
    );
    const telemetryData = {
      lat: 90,
      lng: 180,
      state: DeviceStates.idle,
      nextUpdateAt: Math.floor((Date.now() + 60000 * 5) / 1000),
      sentAt: Date.now(),
      batteryPercentage: 100,
    };
    let interval = 60000;
    if (state === DeviceStates.idle) {
      interval = interval * idleStateInterval;
    } else {
      const lat = Math.floor(Math.random() * (90 - -90 + 1) - 90);
      const lng = Math.floor(Math.random() * (180 - -180 + 1) - 180);
      telemetryData.state = DeviceStates.moving;
      telemetryData.lat = lat;
      telemetryData.lng = lng;
      interval = interval * mobileStateInterval;
    }
    await this.addTelemetry(telemetryData, device);
    setTimeout(
      () => this.deviceTelemetryRunner(macAddress, device, state),
      interval,
    );
  }

  async addFakeDevice(macAddress: string, deviceData: FakeDeviceDTO) {
    let admin: Admin;
    const foundDevice = await this.deviceInventory.findOne({
      where: { macAddress },
    });
    if (foundDevice) {
      throw new BadRequestException(
        `Device already exists with this macAdress!`,
      );
    }
    const email = 'admin@admin.com';
    admin = await this.adminRepositry.findOne({
      where: { email },
    });
    if (!admin) {
      const newAdmin = this.adminRepositry.create({
        email,
        password: this.hashPassword('admin123'),
        username: 'admin',
      });
      admin = await this.adminRepositry.save(newAdmin);
    }
    const device = this.deviceInventory.create({
      addedBy: admin,
      email,
      macAddress,
    });
    await this.deviceInventory.save(device);
    this.deviceTelemetryRunner(macAddress, device, deviceData.state);
    return { id: device.id };
  }

  getDeviceByMac(macAddress: string) {
    return this.deviceInventory.findOne({ where: { macAddress } });
  }

  async getLatestFirmware() {
    const firmware = await this.firmwareService.getLatestFirmware();
    return { build: firmware.build, version: firmware.version };
  }

  async getFirmwaresList() {
    const firmwares = await this.firmwareService.getFirmwaresList();
    return firmwares.map((firmware) => ({
      build: firmware.build,
      version: firmware.version,
    }));
  }
}
