import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/User.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { Repository } from 'typeorm';
import { AddEmployeeDTO } from './dto/employee-dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Users)
    private userRepositry: Repository<Users>,
    private subsidiaryService: SubsidiaryService,
    private userService: UsersService,
  ) {}
  async addEmployee(user: Users, data: AddEmployeeDTO) {
    const {
      contact,
      email,
      firstName,
      lastName,
      password,
      role,
      subsidiary,
      username,
    } = data;
    const foundSubsidiary = await this.subsidiaryService.getSubsidiaryById(
      user,
      subsidiary,
    );
    if (!foundSubsidiary) {
      throw new NotFoundException('Subsidiary not found!');
    }
    const employee = this.userRepositry.create({
      contact,
      email,
      employeePassword: password,
      firstName,
      lastName,
      subsidiary: foundSubsidiary,
      hashedPassword: this.userService.hashPassword(password),
      username,
      role,
    });
    return this.userRepositry.save(employee);
  }
}
