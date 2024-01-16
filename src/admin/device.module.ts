import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([DeviceInventory])],
    controllers:[DeviceController],
    providers: [DeviceService],
    exports: [DeviceService],
})
export class DeviceModule {}
