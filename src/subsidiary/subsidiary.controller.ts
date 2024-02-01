import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubsidiaryService } from './subsidiary.service';

@ApiTags('Subsidiary')
@Controller('subsidiary')
export class SubsidiaryController {
  constructor(private readonly subsidiaryService: SubsidiaryService) {}

  @Post()
  async createSubsidiary() {
    return this.subsidiaryService.createSubsidiary();
  }
}
