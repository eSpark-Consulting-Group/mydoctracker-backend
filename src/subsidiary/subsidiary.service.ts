import { InjectRepository } from '@nestjs/typeorm';
import { Subsidiary } from 'src/entities/Subsidiary.entity';
import { Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { CreateSubsidiaryDTO } from './dto/subsidiary-dto';
import { NotFoundException } from '@nestjs/common';

export class SubsidiaryService {
  constructor(
    @InjectRepository(Subsidiary)
    private subsidiaryRepositry: Repository<Subsidiary>,
  ) {}
  getSubsidiaryByOwner(user: Users, id: string) {
    return this.subsidiaryRepositry.findOne({ where: { id, createdBy: user } });
  }
  getSubsidiaryById(id: string) {
    return this.subsidiaryRepositry.findOne({ where: { id } });
  }
  async createSubsidiary(user: Users, data: CreateSubsidiaryDTO) {
    const newSubsidiary = this.subsidiaryRepositry.create({
      createdBy: user,
      name: data.name,
    });
    return this.subsidiaryRepositry.save(newSubsidiary);
  }
  async editSubsidiary(user: Users, data: CreateSubsidiaryDTO, id: string) {
    const subsidiary = await this.subsidiaryRepositry.findOne({
      where: { id, createdBy: user },
    });
    if (!subsidiary) {
      throw new NotFoundException('Subsidiary not found!');
    }
    subsidiary.name = data.name;
    return this.subsidiaryRepositry.save(subsidiary);
  }
  async deleteSubsidiary(user: Users, id: string) {
    const subsidiary = await this.subsidiaryRepositry.findOne({
      where: { id, createdBy: user },
    });
    if (!subsidiary) {
      throw new NotFoundException('Subsidiary not found!');
    }
    const deletionResult = await this.subsidiaryRepositry.delete(subsidiary);

    if (deletionResult.affected === 0) {
      throw new NotFoundException('Subsidiary not found!');
    }
  }
  async getAllSubsidiaries(user: Users) {
    return this.subsidiaryRepositry.find({
      where: { createdBy: user },
    });
  }
  save(subsidiary: Subsidiary) {
    return this.subsidiaryRepositry.save(subsidiary);
  }
}
