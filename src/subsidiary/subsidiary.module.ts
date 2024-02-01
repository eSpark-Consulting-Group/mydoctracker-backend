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
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/entities/Company.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Users, Subsidiary, Company]),
  ],
  controllers: [SubsidiaryController],
  providers: [
    SubsidiaryService,
    UsersService,
    CloudStorageService,
    EmailService,
    CompanyService,
  ],
  exports: [SubsidiaryService],
})
export class SubsidiaryModule {}
