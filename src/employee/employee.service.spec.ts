import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRoles, Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { Subsidiary } from 'src/entities/Subsidiary.entity';
import { Company } from 'src/entities/Company.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/utils/helpers/email';
import { CompanyService } from 'src/company/company.service';
import { AddEmployeeDTO, EditEmployeeDTO } from './dto/employee-dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('EmployeeService', () => {
  const addEmployeeDTO: AddEmployeeDTO = {
    contact: '123',
    email: 'abc@abc.com',
    firstName: 'test',
    lastName: 'test',
    password: '123',
    role: UserRoles.BCU,
    subsidiary: 'mockSubsidiary',
    username: 'test',
  };
  const editEmployeeDTO: EditEmployeeDTO = {
    firstName: 'test edit',
  };
  const mockSubsidiary = new Subsidiary();
  const mockUser = new Users();
  mockUser.id = '1';

  let employeeService: EmployeeService;
  let subsidiaryService: SubsidiaryService;
  let userService: UsersService;
  let fileUploadService: CloudStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        UsersService,
        CloudStorageService,
        SubsidiaryService,
        JwtService,
        EmailService,
        CompanyService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Subsidiary),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Company),
          useClass: Repository,
        },
      ],
    }).compile();

    employeeService = module.get<EmployeeService>(EmployeeService);
    subsidiaryService = module.get<SubsidiaryService>(SubsidiaryService);
    userService = module.get<UsersService>(UsersService);
    fileUploadService = module.get<CloudStorageService>(CloudStorageService);
  });

  it('should be defined', () => {
    expect(employeeService).toBeDefined();
  });

  describe('addEmployee', () => {
    it('should add an employee successfully', async () => {
      jest
        .spyOn(subsidiaryService, 'getSubsidiaryByOwner')
        .mockResolvedValueOnce(mockSubsidiary);
      jest.spyOn(userService, 'create').mockReturnValueOnce(mockUser);
      jest.spyOn(userService, 'save').mockResolvedValue(mockUser);
      const result = await employeeService.addEmployee(
        mockUser,
        addEmployeeDTO,
      );
      expect(result).toEqual(mockUser);
    });
    it('should throw NotFoundException for non-existing subsidiary', async () => {
      jest
        .spyOn(subsidiaryService, 'getSubsidiaryByOwner')
        .mockResolvedValueOnce(undefined);
      await expect(
        employeeService.addEmployee(mockUser, addEmployeeDTO),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw ConflictException for duplicate entry', async () => {
      jest
        .spyOn(subsidiaryService, 'getSubsidiaryByOwner')
        .mockResolvedValueOnce(mockSubsidiary);
      jest.spyOn(userService, 'create').mockReturnValueOnce(mockUser);
      jest.spyOn(userService, 'save').mockImplementation(() => {
        throw {
          errno: 1062,
          sqlMessage: 'Duplicate entry for a unique constraint.',
        };
      });

      await expect(
        employeeService.addEmployee(mockUser, addEmployeeDTO),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('editEmployeeDetails', () => {
    it('should edit employee details successfully', async () => {
      jest.spyOn(userService, 'getEmployeeByCU').mockResolvedValue(mockUser);
      jest.spyOn(userService, 'save').mockResolvedValue(mockUser);
      const userId = 'mockUserId';
      const createdBy = 'mockCreatedBy';
      const result = await employeeService.editEmployeeDetails(
        editEmployeeDTO,
        userId,
        createdBy,
      );
      expect(userService.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
    it('should throw NotFoundException for non-existing user', async () => {
      jest.spyOn(userService, 'getEmployeeByCU').mockResolvedValue(undefined);
      const userId = 'mockUserId';
      const createdBy = 'mockCreatedBy';
      await expect(
        employeeService.editEmployeeDetails(editEmployeeDTO, userId, createdBy),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw ConflictException for duplicate entry', async () => {
      jest.spyOn(userService, 'getEmployeeByCU').mockResolvedValue(mockUser);
      jest.spyOn(userService, 'create').mockReturnValueOnce(mockUser);
      jest.spyOn(userService, 'save').mockImplementation(() => {
        throw {
          errno: 1062,
          sqlMessage: 'Duplicate entry for a unique constraint.',
        };
      });
      const userId = 'mockUserId';
      const createdBy = 'mockCreatedBy';

      // Assertions
      await expect(
        employeeService.editEmployeeDetails(editEmployeeDTO, userId, createdBy),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee successfully', async () => {
      jest.spyOn(userService, 'getEmployeeByCU').mockResolvedValue(mockUser);
      jest
        .spyOn(userService, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });
      const createdBy = 'mockCreatedBy';
      const result = await employeeService.deleteEmployee({
        userId: mockUser.id,
        createdBy,
      });
      expect(userService.delete).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(undefined);
    });
    it('should throw NotFoundException for non-existing user', async () => {
      jest.spyOn(userService, 'getEmployeeByCU').mockResolvedValue(undefined);
      const createdBy = 'mockCreatedBy';
      await expect(
        employeeService.deleteEmployee({
          userId: mockUser.id,
          createdBy,
        }),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw NotFoundException if deletionResult.affected is 0', async () => {
      const createdBy = 'mockCreatedBy';
      jest.spyOn(userService, 'getEmployeeByCU').mockResolvedValue(mockUser);
      jest
        .spyOn(userService, 'delete')
        .mockResolvedValue({ affected: 0, raw: [] });
      await expect(
        employeeService.deleteEmployee({
          userId: mockUser.id,
          createdBy,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
