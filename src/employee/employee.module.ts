import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { UsersService } from 'src/users/users.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { Subsidiary } from 'src/entities/Subsidiary.entity';
import { DocumentModule } from 'src/document/document.module';
import { OTPService } from 'src/otp/otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Subsidiary]), DocumentModule],
  providers: [
    EmployeeService,
    UsersService,
    CloudStorageService,
    EmailService,
    SubsidiaryService,
    OTPService,
  ],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
