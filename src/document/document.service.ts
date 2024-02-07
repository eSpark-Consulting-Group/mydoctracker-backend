import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceService } from 'src/device/device.service';
import { Document } from 'src/entities/Document.entity';
import { Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { AddDocumentDTO, EditDocumentDTO } from './dto/document-dto';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { S3_ENUMS } from 'enum';
import { DocumentHistory } from 'src/entities/DocumentHistory.entity';
import { OTPService } from 'src/otp/otp.service';
import { OtpPurpose } from 'src/entities/otp.entity';
import { EmailService } from 'src/utils/helpers/email';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

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
  ) {}
  async getCurrentUserDoc(id: string, assignee: Users) {
    const document = await this.documentRepositry.findOne({
      where: { id, assignee, isDeleted: false },
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

  async addDocument(
    user: Users,
    documentData: AddDocumentDTO,
    file: Express.Multer.File,
  ) {
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
      assignee: user,
      creationDate: documentData.creationDate,
      file: '',
      title: documentData.title,
      tracker: device,
    });
    if (documentData.fields) {
      newDocument.meta = {
        fields: JSON.parse(documentData.fields),
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
  }

  async editDocument(
    user: Users,
    documentData: EditDocumentDTO,
    file: Express.Multer.File,
    id: string,
  ) {
    const document = await this.getCurrentUserDoc(id, user);
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
        fields: JSON.parse(documentData.fields),
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
    document.isDeleted = true;
    await this.documentRepositry.save(document);
  }

  async getDocumentHistory(
    assignee: Users,
    id: string,
    options: IPaginationOptions,
  ) {
    await this.getCurrentUserDoc(id, assignee);
    const queryBuilder = this.documentHistoryRepositry
      .createQueryBuilder('history')
      .where('history.documentId = :id', { id })
      .orderBy('history.createdAt', 'DESC');
    return paginate(queryBuilder, options);
  }

  async geAllDocuments(assignee: Users) {
    const documents = await this.documentRepositry
      .createQueryBuilder('document')
      .innerJoin('document.tracker', 't')
      .where('document.assignee = :assignee', { assignee: assignee.id })
      .andWhere('document.isDeleted = :isDeleted', { isDeleted: false })
      .select(['document', 't.batteryPercentage', 't.id'])
      .getMany();
    for (let i = 0; i < documents.length; i++) {
      const device = await this.deviceService.isDeviceActive(
        documents[i].tracker.id,
      );
      const status = device.status ? 'active' : 'inactive';
      documents[i].active = device.status;
      Object.assign(documents[i], {
        status,
      });
    }
    return documents;
  }

  async getDocumentById(id: string, assignee: Users) {
    const document = await this.documentRepositry
      .createQueryBuilder('document')
      .innerJoin('document.tracker', 't')
      .innerJoinAndSelect('document.assignee', 'as')
      .where('document.id = :id', { id })
      .andWhere('document.assignee = :assignee', { assignee: assignee.id })
      .andWhere('document.isDeleted = :isDeleted', { isDeleted: false })
      .select([
        'document',
        't.batteryPercentage',
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
    const device = await this.deviceService.isDeviceActive(document.tracker.id);
    document.active = device.status;
    return {
      document,
      lastActivity: {
        lat: device.device.lat,
        lng: device.device.lng,
        state: device.device.state,
        status: document.active ? 'active' : 'inactive',
      },
    };
  }
}
