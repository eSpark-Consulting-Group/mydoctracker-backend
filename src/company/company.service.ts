import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/Company.entity';
import { Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDTO } from './dto/company-dto';
import { ConflictException } from '@nestjs/common';

export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepositry: Repository<Company>,
  ) {}
  getCompanyById(id: string, user: Users) {
    return this.companyRepositry.findOne({ where: { id, user } });
  }
  async createCompany(user: Users, companyDetails: CreateCompanyDTO) {
    try {
      const { contact, email, name } = companyDetails;
      const company = this.companyRepositry.create({
        contact,
        email,
        name,
        user,
      });
      const savedCompany = await this.companyRepositry.save(company);
      return savedCompany;
    } catch (error) {
      if (error.errno === 1062) {
        console.log(error);
        const match = error?.sqlMessage?.match(/for key '(.*?)'/);
        const keyName = match ? match[1] : 'unknown';
        if (keyName === 'company.IDX_b0fc567cf51b1cf717a9e8046a') {
          throw new ConflictException(
            'Company with email email already exists!',
          );
        } else if (keyName === 'company.IDX_b898bab85587799452c67d9158') {
          throw new ConflictException(
            'Company with this contact already exists!',
          );
        } else if (keyName === 'company.IDX_66339e402b71b3193d3e99a85d') {
          throw new ConflictException('Your company has already been created!');
        } else {
          throw new ConflictException(
            'Duplicate entry for a unique constraint!',
          );
        }
      } else {
        throw error;
      }
    }
  }
  getCurrentUserCompany(user: Users) {
    return this.companyRepositry.findOne({ where: { user } });
  }
}
