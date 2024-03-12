import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from 'src/entities/Report.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reports]), UsersModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
