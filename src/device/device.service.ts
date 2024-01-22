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
} from './dto/device-dto';
import { DeviceStates } from 'src/mongodb/schemas/device_telemetry.entity';
import { Users } from 'src/entities/User.entity';
import { Document } from 'src/entities/Document.entity';
import { v4 as uuidv4 } from 'uuid';
import { Admin } from 'src/entities/Admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceInventory)
    private deviceInventory: Repository<DeviceInventory>,
    @InjectRepository(Document)
    private documentRespositry: Repository<Document>,
    @InjectRepository(Admin)
    private adminRespositry: Repository<Admin>,
    private mongodDBService: MongoDBService,
  ) {}

  private async getCurrentUserDocument(assignee: Users, id: string) {
    const document = await this.documentRespositry.findOne({
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
    await this.documentRespositry.save(document);
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
    await this.documentRespositry.save(document);
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
    await this.documentRespositry.save(document);
  }

  async getDeviceInfo(macAddress: string) {
    const tracker = await this.checkDeviceByMac(macAddress);
    const document = await this.documentRespositry.findOne({
      where: { tracker },
    });
    let documentData;
    if (document) {
      documentData = {
        geofences: document.meta?.geofences,
        idleStateInterval: document.idleStateInterval,
        mobileStateInterval: document.mobileStateInterval,
      };
    }
    return { document: documentData, device: tracker };
  }

  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(5);
    const hashedPassowrd: string = bcrypt.hashSync(password, salt);
    return hashedPassowrd;
  }

  async addFakeDevice(macAddress: string) {
    let admin: Admin;
    const foundDevice = await this.deviceInventory.findOne({
      where: { macAddress: macAddress },
    });
    if (foundDevice) {
      throw new BadRequestException(
        `Device alread exists with this macAdress!`,
      );
    }
    const email = 'admin@admin.com';
    admin = await this.adminRespositry.findOne({
      where: { email },
    });
    if (!admin) {
      const newAdmin = this.adminRespositry.create({
        email,
        password: this.hashPassword('admin123'),
        username: 'admin',
      });
      admin = await this.adminRespositry.save(newAdmin);
    }
    const device = this.deviceInventory.create({
      addedBy: admin,
      email,
      macAddress,
    });
    await this.deviceInventory.save(device);
    setInterval(async () => {
      console.log(
        `adding telemetry for deviceId: ${device.id} and macAdress = ${macAddress}`,
      );
      const telemetryData = {
        lat: 90,
        lng: 180,
        state: DeviceStates.idle,
        nextUpdateAt: Math.floor((Date.now() + 60000 * 5) / 1000),
        sentAt: Date.now(),
      };
      await this.addTelemetry(telemetryData, macAddress);
    }, 300000);
  }
}
