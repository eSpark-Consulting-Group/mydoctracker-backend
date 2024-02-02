import { InjectRepository } from '@nestjs/typeorm';
import { Subsidiary } from 'src/entities/Subsidiary.entity';
import { Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { CreateSubsidiaryDTO, EditSubsidiaryDTO } from './dto/subsidiary-dto';
import { CompanyService } from 'src/company/company.service';
import { NotFoundException } from '@nestjs/common';

export class SubsidiaryService {
  constructor(
    @InjectRepository(Subsidiary)
    private subsidiaryRepositry: Repository<Subsidiary>,
    private companyService: CompanyService,
  ) {}
  async createSubsidiary(user: Users, data: CreateSubsidiaryDTO) {
    const company = await this.companyService.getCompanyById(
      data.company,
      user,
    );
    if (!company) {
      throw new NotFoundException('Company not found!');
    }
    const newSubsidiary = this.subsidiaryRepositry.create({
      company,
      user,
      name: data.name,
    });
    return this.subsidiaryRepositry.save(newSubsidiary);
  }
  async editSubsidiary(user: Users, data: EditSubsidiaryDTO, id: string) {
    const subsidiary = await this.subsidiaryRepositry.findOne({
      where: { id, user },
    });
    if (!subsidiary) {
      throw new NotFoundException('Subsidiary not found!');
    }
    subsidiary.name = data.name;
    return this.subsidiaryRepositry.save(subsidiary);
  }
  async deleteSubsidiary(user: Users, id: string) {
    const subsidiary = await this.subsidiaryRepositry.findOne({
      where: { id, user },
    });
    if (!subsidiary) {
      throw new NotFoundException('Subsidiary not found!');
    }
    const deletionResult = await this.subsidiaryRepositry.delete(subsidiary);

    if (deletionResult.affected === 0) {
      throw new NotFoundException('Subsidiary not found!');
    }
  }
}
