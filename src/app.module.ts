import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { MongoDBModule } from './mongodb/mongodb.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentModule } from './document/document.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { SubsidiaryModule } from './subsidiary/subsidiary.module';
import { EmployeeModule } from './employee/employee.module';
import { RequestModule } from './request/request.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'mydoctracker_dev',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AdminModule,
    AuthModule,
    UsersModule,
    DeviceModule,
    MongoDBModule,
    DocumentModule,
    SubsidiaryModule,
    EmployeeModule,
    RequestModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
