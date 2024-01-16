import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([DeviceInventory])],
    controllers:[AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule {}
