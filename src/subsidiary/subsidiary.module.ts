import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import { SubsidiaryController } from './subsidiary.controller';
import { SubsidiaryService } from './subsidiary.service';
import { UsersService } from 'src/users/users.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { Subsidiary } from 'src/entities/Subsidiary.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Users, Subsidiary])],
  controllers: [SubsidiaryController],
  providers: [
    SubsidiaryService,
    UsersService,
    CloudStorageService,
    EmailService,
  ],
  exports: [SubsidiaryService],
})
export class SubsidiaryModule {}
