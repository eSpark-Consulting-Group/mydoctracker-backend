import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { DeviceMacDTO } from 'src/users/dto/device-dto';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(DeviceInventory)
        private deviceInventory: Repository<DeviceInventory>,
    ) { }

    async checkDeviceByMac(macAddress: DeviceMacDTO) {
        const foundDevice = await this.deviceInventory.findOne({
            where: { macAddress: macAddress.macAddress },
        });
        if (!foundDevice) {
            throw new NotFoundException(`Device not found!`);
        }
        return foundDevice
    }
}
