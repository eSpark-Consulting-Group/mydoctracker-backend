import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/Company.entity';
import { Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepositry: Repository<Company>,
  ) {}
  getCompanyById(id: string, user: Users) {
    return this.companyRepositry.findOne({ where: { id, user } });
  }
}
