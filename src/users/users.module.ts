import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, CloudStorageService, EmailService],
  exports: [UsersService, CloudStorageService],
})
export class UsersModule {}
