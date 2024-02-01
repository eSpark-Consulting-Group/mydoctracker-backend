import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import { SubsidiaryController } from './subsidiary.controller';
import { SubsidiaryService } from './subsidiary.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([])],
  controllers: [SubsidiaryController],
  providers: [SubsidiaryService],
  exports: [SubsidiaryService],
})
export class SubsidiaryModule {}
