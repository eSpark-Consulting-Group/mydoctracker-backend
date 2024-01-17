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

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepositry: Repository<Document>,
    @InjectRepository(DocumentHistory)
    private documentHistoryRepositry: Repository<DocumentHistory>,
    private deviceService: DeviceService,
    private fileUploadService: CloudStorageService,
  ) {}

  async addDocument(user: Users, documentData: AddDocumentDTO, file: any) {
    const device = await this.deviceService.getDeviceById(
      documentData.deviceId,
    );
    const isActive = await this.deviceService.isDeviceActive(device.id);
    if (!isActive) {
      throw new BadRequestException('Device is offline');
    }
    let fileName = '';
    if (file && file.length) {
      const response = await this.fileUploadService.uploadDocumentFile(
        file[0],
        user,
        S3_ENUMS.docs,
      );
      fileName = `${S3_ENUMS.URL}/${response.fileName}`;
    }
    const newDevice = this.documentRepositry.create({
      assignee: user,
      creationDate: documentData.creationDate,
      file: fileName,
      title: documentData.title,
      tracker: device,
    });
    const document = await this.documentRepositry.save(newDevice);
    return document;
  }

  async editDocument(
    user: Users,
    documentData: EditDocumentDTO,
    file: any,
    id: string,
  ) {
    const document = await this.documentRepositry.findOne({
      where: { id, assignee: user, isDeleted: false },
    });
    if (!document) {
      throw new NotFoundException('Document not found!');
    }
    const fileName = document.file;
    if (file && file.length) {
      const response = await this.fileUploadService.uploadDocumentFile(
        file[0],
        user,
        S3_ENUMS.docs,
      );
      document.file = `${S3_ENUMS.URL}/${response.fileName}`;
    }
    const documentHistory = this.documentHistoryRepositry.create({
      type: document.type,
      title: document.title,
      creationDate: document.creationDate,
      documentId: document,
      file: fileName,
    });
    document.creationDate = documentData.creationDate;
    document.title = documentData.title;
    document.type = documentData.type;
    await this.documentRepositry.save(document);
    await this.documentHistoryRepositry.save(documentHistory);
    return document;
  }

  async deleteDocument(assignee: Users, id: string) {
    const document = await this.documentRepositry.findOne({
      where: { id, assignee, isDeleted: false },
    });
    if (!document) {
      throw new NotFoundException('Document not found!');
    }
    document.isDeleted = true;
    await this.documentRepositry.save(document);
  }

  async getDocumentHistory(assignee: Users, id: string) {
    const document = await this.documentRepositry.findOne({
      where: { id, assignee, isDeleted: false },
    });
    if (!document) {
      throw new NotFoundException('Document not found!');
    }
    const history = await this.documentHistoryRepositry.find({
      where: { documentId: document },
    });
    return history;
  }
}
