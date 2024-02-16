import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from 'src/entities/Company.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Users, Company])],
  controllers: [CompanyController],
  providers: [CompanyService, UsersService, CloudStorageService, EmailService],
  exports: [CompanyService],
})
export class CompanyModule {}
