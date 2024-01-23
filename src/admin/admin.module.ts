import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from 'src/entities/Admin.entity';
import { Firmware } from 'src/entities/Firmware.entity';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Admin, Firmware])],
  controllers: [AdminController],
  providers: [AdminService, CloudStorageService],
  exports: [AdminService],
})
export class AdminModule {}
