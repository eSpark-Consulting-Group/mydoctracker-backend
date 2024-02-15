import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { RequestController } from './requst.controller';
import { UsersService } from 'src/users/users.service';
import { RequestService } from './request.service';
import { Request } from 'src/entities/Request.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { Subsidiary } from 'src/entities/Subsidiary.entity';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/entities/Company.entity';
import { Document } from 'src/entities/Document.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Users, Request, Subsidiary, Company, Document]),
  ],
  controllers: [RequestController],
  providers: [
    RequestService,
    UsersService,
    CloudStorageService,
    EmailService,
    SubsidiaryService,
    CompanyService,
  ],
  exports: [],
})
export class RequestModule {}
