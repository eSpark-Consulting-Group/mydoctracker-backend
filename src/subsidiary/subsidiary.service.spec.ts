import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubsidiaryService } from './subsidiary.service';
import { CreateSubsidiaryDTO } from './dto/subsidiary-dto';
import { Subsidiary } from 'src/entities/Subsidiary.entity';
import { Users } from 'src/entities/User.entity';
import { Company } from 'src/entities/Company.entity';
import { CompanyService } from 'src/company/company.service';

describe('SubsidiaryService', () => {
  const mockCompanyService = {
    getCompanyById: jest.fn(),
  };
  let subsidiaryService: SubsidiaryService;
  let subsidiaryRepository: Repository<Subsidiary>;
  const mockUser = new Users();
  const mockCompany = new Company();
  mockUser.id = 'user_id';
  mockCompany.id = 'company_id';
  const SUBSIDIARY_TOKEN = getRepositoryToken(Subsidiary);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubsidiaryService,
        { provide: CompanyService, useValue: mockCompanyService },
        {
          provide: SUBSIDIARY_TOKEN,
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Company),
          useClass: Repository,
        },
      ],
    }).compile();

    subsidiaryService = module.get<SubsidiaryService>(SubsidiaryService);
    subsidiaryRepository = module.get<Repository<Subsidiary>>(SUBSIDIARY_TOKEN);
  });

  describe('createSubsidiary', () => {
    it('should create a subsidiary successfully', async () => {
      // Mock data
      const createSubsidiaryDTO: CreateSubsidiaryDTO = {
        name: 'Subsidiary Name',
      };

      // Mock the repository methods
      jest.spyOn(subsidiaryRepository, 'create').mockReturnValue({
        id: '1',
        createdBy: mockUser,
        company: mockCompany,
        name: 'Subsidiary Name',
      });
      jest.spyOn(subsidiaryRepository, 'save').mockResolvedValue({
        id: '1',
        createdBy: mockUser,
        company: mockCompany,
        name: 'Subsidiary Name',
      });
      mockCompanyService.getCompanyById.mockResolvedValue(mockCompany);
      const result = await subsidiaryService.createSubsidiary(
        mockUser,
        createSubsidiaryDTO,
        'company_id',
      );
      expect(result).toEqual({
        id: '1',
        user: mockUser,
        company: mockCompany,
        name: 'Subsidiary Name',
      });
    });

    it('should throw NotFoundException if company is not found', async () => {
      const createSubsidiaryDTO: CreateSubsidiaryDTO = {
        name: 'Subsidiary Name',
      };
      mockCompanyService.getCompanyById.mockResolvedValue(undefined);
      await expect(
        subsidiaryService.createSubsidiary(
          mockUser,
          createSubsidiaryDTO,
          'non_existent_company_id',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('editSubsidiary', () => {
    it('should edit a subsidiary successfully', async () => {
      const editSubsidiaryDTO: CreateSubsidiaryDTO = {
        name: 'New Subsidiary Name',
      };
      const subsidiary = new Subsidiary();
      // Mock the repository methods
      jest.spyOn(subsidiaryRepository, 'findOne').mockResolvedValue(subsidiary);
      jest.spyOn(subsidiaryRepository, 'save').mockResolvedValue(subsidiary);

      // Execute the service method
      const result = await subsidiaryService.editSubsidiary(
        mockUser,
        editSubsidiaryDTO,
        'subsidiary_id',
      );

      // Assertions
      expect(subsidiaryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'subsidiary_id', user: mockUser },
      });
      expect(subsidiaryRepository.save).toHaveBeenCalledWith(subsidiary);
      expect(result).toEqual(subsidiary);
    });

    it('should throw NotFoundException if subsidiary is not found', async () => {
      const editSubsidiaryDTO: CreateSubsidiaryDTO = {
        name: 'New Subsidiary Name',
      };
      jest.spyOn(subsidiaryRepository, 'findOne').mockResolvedValue(undefined);
      await expect(
        subsidiaryService.editSubsidiary(
          mockUser,
          editSubsidiaryDTO,
          'non_existent_subsidiary_id',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteSubsidiary', () => {
    it('should delete a subsidiary successfully', async () => {
      const subsidiary = new Subsidiary();
      jest.spyOn(subsidiaryRepository, 'findOne').mockResolvedValue(subsidiary);
      jest
        .spyOn(subsidiaryRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      // Execute the service method
      await subsidiaryService.deleteSubsidiary(mockUser, 'subsidiary_id');

      // Assertions
      expect(subsidiaryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'subsidiary_id', user: mockUser },
      });
      expect(subsidiaryRepository.delete).toHaveBeenCalledWith(subsidiary);
    });

    it('should throw NotFoundException if subsidiary is not found', async () => {
      jest.spyOn(subsidiaryRepository, 'findOne').mockResolvedValue(undefined);
      await expect(
        subsidiaryService.deleteSubsidiary(
          mockUser,
          'non_existent_subsidiary_id',
        ),
      ).rejects.toThrow(NotFoundException);
      expect(subsidiaryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non_existent_subsidiary_id', user: mockUser },
      });
    });

    it('should throw NotFoundException if deletionResult.affected is 0', async () => {
      const subsidiary = new Subsidiary();
      jest.spyOn(subsidiaryRepository, 'findOne').mockResolvedValue(subsidiary);
      jest
        .spyOn(subsidiaryRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: [] });
      await expect(
        subsidiaryService.deleteSubsidiary(mockUser, 'subsidiary_id'),
      ).rejects.toThrow(NotFoundException);
      expect(subsidiaryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'subsidiary_id', user: mockUser },
      });
      expect(subsidiaryRepository.delete).toHaveBeenCalledWith(subsidiary);
    });
  });

  describe('getAllSubsidiariesByCompany', () => {
    it('should get all subsidiaries by company successfully', async () => {
      // Mock the company service to return a company
      jest
        .spyOn(mockCompanyService, 'getCompanyById')
        .mockResolvedValue(mockCompany);

      // Mock the repository method
      jest
        .spyOn(subsidiaryRepository, 'find')
        .mockResolvedValue([
          { id: 'subsidiary_id', createdBy: mockUser, company: mockCompany },
        ] as Subsidiary[]);

      // Execute the service method
      const result = await subsidiaryService.getAllSubsidiariesByCompany(
        mockCompany.id,
        mockUser,
      );

      // Assertions
      expect(mockCompanyService.getCompanyById).toHaveBeenCalledWith(
        mockCompany.id,
        mockUser,
      );
      expect(subsidiaryRepository.find).toHaveBeenCalledWith({
        where: { company: mockCompany, user: mockUser },
      });
      expect(result).toEqual([
        { id: 'subsidiary_id', user: mockUser, company: mockCompany },
      ]);
    });

    it('should throw NotFoundException if company is not found', async () => {
      // Mock data
      const companyId = 'non_existent_company_id';
      const user = { id: 'user_id', username: 'testuser' } as Users;

      // Mock the company service to return null (company not found)
      jest
        .spyOn(mockCompanyService, 'getCompanyById')
        .mockReturnValue(Promise.resolve(null));

      // Execute the service method and expect it to throw NotFoundException
      await expect(
        subsidiaryService.getAllSubsidiariesByCompany(companyId, user),
      ).rejects.toThrow(NotFoundException);

      // Assertions
      expect(mockCompanyService.getCompanyById).toHaveBeenCalledWith(
        companyId,
        user,
      );
    });

    // Add more test cases for different scenarios
  });
});
