import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceService } from 'src/device/device.service';
import { Document } from 'src/entities/Document.entity';
import { UserRoles, Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import {
  AddDocumentDTO,
  EditDocumentDTO,
  DocumentFilters,
} from './dto/document-dto';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { S3_ENUMS } from 'enum';
import { DocumentHistory } from 'src/entities/DocumentHistory.entity';
import { OTPService } from 'src/otp/otp.service';
import { OtpPurpose } from 'src/entities/otp.entity';
import { EmailService } from 'src/utils/helpers/email';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepositry: Repository<Document>,
    @InjectRepository(DocumentHistory)
    private documentHistoryRepositry: Repository<DocumentHistory>,
    private deviceService: DeviceService,
    private fileUploadService: CloudStorageService,
    private otpService: OTPService,
    private emailService: EmailService,
    private userService: UsersService,
  ) {}
  async getCurrentUserDoc(id: string, assignee: Users) {
    const document = await this.documentRepositry.findOne({
      where: { id, active: true, assigneeId: assignee.id },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }
  async generateOTPForAddDoc(assignee: Users) {
    const purpose = OtpPurpose.add_document;
    const expiresAt = new Date(Date.now() + 60000);
    const otp = await this.otpService.generatOTP(assignee, purpose, expiresAt);
    await this.emailService.sendOtpEmail(assignee.email, otp.otp);
    return otp;
  }
  async addDocument(user: Users, documentData: AddDocumentDTO) {
    try {
      const file = documentData.file;
      const employeeId = documentData.employeeId;
      if (employeeId && user.role === UserRoles.SU) {
        throw new UnauthorizedException(
          'You cannot add document for an employee',
        );
      }
      const otpID = await this.otpService.verifyOTP(
        user,
        OtpPurpose.add_document,
        documentData.otp,
      );
      const device = await this.deviceService.getDeviceById(
        documentData.deviceId,
      );
      const isActive = await this.deviceService.isDeviceActive(device.id);
      if (!isActive.status) {
        throw new BadRequestException('Device is offline');
      }
      const newDocument = this.documentRepositry.create({
        assigneeId: user.id,
        assignee: user,
        creationDate: documentData.creationDate,
        file: '',
        title: documentData.title,
        tracker: device,
      });
      if (employeeId) {
        const employee = await this.userService.getEmployeeByCU({
          createdBy: user.id,
          userId: employeeId,
        });
        if (!employee) {
          throw new NotFoundException('Employee not found!');
        }
        newDocument.assigneeId = employee.id;
        newDocument.assignee = employee;
      } else if (user.role !== UserRoles.SU) {
        throw new ForbiddenException(
          "You're not allowd to add document for yourself",
        );
      }
      if (documentData.fields) {
        newDocument.meta = {
          fields: documentData.fields,
        };
      }
      const document = await this.documentRepositry.save(newDocument);
      if (file) {
        const response = await this.fileUploadService.uploadDocumentFile(
          file,
          user,
          S3_ENUMS.docs,
        );
        const fileName = `${S3_ENUMS.URL}/${response.fileName}`;
        document.file = fileName;
        await this.documentRepositry.save(document);
      }
      const documentHistory = this.documentHistoryRepositry.create({
        type: document.type,
        title: document.title,
        creationDate: document.creationDate,
        documentId: document.id,
        file: document.file,
        meta: document.meta,
        document: document,
      });
      await this.documentHistoryRepositry.save(documentHistory);
      await this.otpService.deleteOtp(otpID);
      return document;
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Device is already attached to a document');
      }
      throw error;
    }
  }
  async editDocument(user: Users, documentData: EditDocumentDTO, id: string) {
    if (user.role === UserRoles.BCU && !user.accessibility?.doc) {
      throw new UnauthorizedException('You cannot edit document');
    }
    const document = await this.getCurrentUserDoc(id, user);
    const file = documentData.file;
    if (file) {
      const response = await this.fileUploadService.uploadDocumentFile(
        file,
        user,
        S3_ENUMS.docs,
      );
      document.file = `${S3_ENUMS.URL}/${response.fileName}`;
    }
    document.creationDate = documentData.creationDate || document.creationDate;
    document.title = documentData.title || document.title;
    document.type = documentData.type || document.type;
    if (documentData.fields) {
      document.meta = {
        ...document.meta,
        fields: documentData.fields,
      };
    }
    const documentHistory = this.documentHistoryRepositry.create({
      type: document.type,
      title: document.title,
      creationDate: document.creationDate,
      documentId: document.id,
      file: document.file,
      meta: document.meta,
      document: document,
    });
    await this.documentRepositry.save(document);
    await this.documentHistoryRepositry.save(documentHistory);
    return document;
  }
  async deleteDocument(assignee: Users, id: string) {
    const document = await this.getCurrentUserDoc(id, assignee);
    await this.documentRepositry.delete(document.id);
  }
  async getDocumentHistory(
    assignee: Users,
    id: string,
    options: IPaginationOptions,
  ) {
    const queryBuilder = this.documentHistoryRepositry
      .createQueryBuilder('history')
      .where('history.documentId = :id', { id })
      .orderBy('history.createdAt', 'DESC');
    if (assignee.role === UserRoles.CU) {
      const document = await this.documentRepositry
        .createQueryBuilder('document')
        .where('document.id = :id', { id })
        .innerJoin('document.assignee', 'assignee')
        .innerJoin('assignee.subsidiary', 'subsidiary')
        .innerJoin('subsidiary.createdBy', 'createdBy')
        .andWhere('createdBy.id = :createdBy', {
          createdBy: assignee.id,
        })
        .getOne();
      if (!document) {
        throw new NotFoundException('Document not found');
      }
      return paginate(queryBuilder, options);
    }
    await this.getCurrentUserDoc(id, assignee);
    return paginate(queryBuilder, options);
  }
  async geAllDocuments(assignee: Users) {
    const documents = await this.documentRepositry
      .createQueryBuilder('document')
      .innerJoin('document.tracker', 't')
      .where('document.assignee = :assignee', { assignee: assignee.id })
      .select(['document', 't.lastActivity', 't.id'])
      .getMany();
    return documents;
  }
  async getDocumentById(id: string, assignee: Users) {
    const queryBuilder = this.documentRepositry
      .createQueryBuilder('document')
      .where('document.id = :id', { id })
      .innerJoin('document.tracker', 't')
      .innerJoinAndSelect('document.assignee', 'as');
    if (assignee.role === UserRoles.CU) {
      const document = await queryBuilder
        .innerJoin('as.subsidiary', 'subsidiary')
        .andWhere('subsidiary.createdBy = :createdBy', {
          createdBy: assignee.id,
        })
        .getOne();
      if (!document) {
        throw new NotFoundException('Document not found!');
      }
      return document;
    }
    const document = await queryBuilder
      .andWhere('document.assignee = :assignee', { assignee: assignee.id })
      .select([
        'document',
        't.lastActivity',
        't.id',
        'as.email',
        'as.firstName',
        'as.lastName',
        'as.contact',
      ])
      .getOne();
    if (!document) {
      throw new NotFoundException('Document not found!');
    }
    return document;
  }
  async getDocumentsByEmployee(employeeId: string, currentUser: Users) {
    const employee = await this.userService.getEmployeeByCUandACU(
      employeeId,
      currentUser.id,
    );
    if (!employee) {
      throw new NotFoundException('Employee not found!');
    }
    return this.documentRepositry.find({
      where: { assigneeId: employee.id, active: true },
    });
  }
  async getAllEmployeesDocuments(
    user: Users,
    options: IPaginationOptions,
    filters: DocumentFilters,
  ) {
    const { search, type } = filters;
    const queryBuilder = this.documentRepositry
      .createQueryBuilder('document')
      .innerJoin('document.assignee', 'assignee')
      .innerJoin('document.tracker', 'tracker')
      .innerJoin('assignee.subsidiary', 'subsidiary')
      .select([
        'document',
        'tracker.id',
        'assignee.id',
        'assignee.firstName',
        'assignee.lastName',
        'assignee.profilePicture',
      ]);
    if (search) {
      queryBuilder.andWhere(
        '(tracker.id LIKE :trackerId OR assignee.firstName LIKE :name OR assignee.lastName LIKE :name)',
        { trackerId: `%${search}%`, name: `%${search}%` },
      );
    }
    if (type) {
      queryBuilder.andWhere('document.type = :type', { type });
    }
    if (user.role === UserRoles.CU) {
      queryBuilder.andWhere('subsidiary.createdBy = :createdBy', {
        createdBy: user.id,
      });
      return paginate(queryBuilder, options);
    }
    queryBuilder
      .andWhere('subsidiary.admin = :adminId', { adminId: user.id })
      .andWhere('assignee.id <> :adminId', { adminId: user.id });
    return paginate(queryBuilder, options);
  }
  async getAllDocumentsInSubsidiary(
    user: Users,
    subsidiaryId: string,
    options: IPaginationOptions,
    filters: DocumentFilters,
  ) {
    const { search, type } = filters;
    const queryBuilder = this.documentRepositry
      .createQueryBuilder('document')
      .innerJoin('document.assignee', 'assignee')
      .innerJoin('document.tracker', 'tracker')
      .innerJoin('assignee.subsidiary', 'subsidiary')
      .where('subsidiary.id = :subsidiaryId', { subsidiaryId })
      .andWhere('subsidiary.createdBy = :createdBy', {
        createdBy: user.id,
      })
      .select([
        'document',
        'tracker.id',
        'assignee.id',
        'assignee.firstName',
        'assignee.lastName',
        'assignee.profilePicture',
      ]);
    if (search) {
      queryBuilder.andWhere(
        '(tracker.id LIKE :trackerId OR assignee.firstName LIKE :name OR assignee.lastName LIKE :name)',
        { trackerId: `%${search}%`, name: `%${search}%` },
      );
    }
    if (type) {
      queryBuilder.andWhere('document.type = :type', { type });
    }
    return paginate(queryBuilder, options);
  }
}
