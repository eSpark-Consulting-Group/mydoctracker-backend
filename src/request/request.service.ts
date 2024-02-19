import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3_ENUMS } from 'enum';
import { Document } from 'src/entities/Document.entity';
import { Request, RequestType } from 'src/entities/Request.entity';
import { UserRoles, Users } from 'src/entities/User.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { Repository } from 'typeorm';

export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepositry: Repository<Request>,
    @InjectRepository(Document)
    private documentRepositry: Repository<Document>,
    private subsidiaryService: SubsidiaryService,
    private fileUploadService: CloudStorageService,
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
  async createRequestForDocument(user: Users, data: any, docID: string) {
    const document = await this.getCurrentUserDoc(docID, user);
    const foundRequest = await this.requestRepositry.findOneBy({
      documentId: document.id,
      createdBy: user,
    });

    if (foundRequest) {
      throw new ConflictException('Request already created!');
    }
    const subsidiary = await this.subsidiaryService.getSubsidiaryById(
      user.subsidiary.id,
    );
    let file: string = null;
    if (data.file) {
      const response = await this.fileUploadService.uploadDocumentFile(
        data.file,
        user,
        S3_ENUMS.docs,
      );
      file = `${S3_ENUMS.URL}/${response.fileName}`;
    }
    if (data) delete data.file;
    const req = this.requestRepositry.create({
      createdBy: user,
      meta: data,
      type: RequestType.DOC,
      subsidiary,
      document,
      documentId: document.id,
    });
    if (file) req.meta = { ...req.meta, file };
    return this.requestRepositry.save(req);
  }
  async getAllReqsForUpdateDoc(user: Users) {
    if (user.role === UserRoles.CU) {
      return this.requestRepositry
        .createQueryBuilder('request')
        .innerJoinAndSelect('request.subsidiary', 'subsidiary')
        .leftJoinAndSelect('subsidiary.admin', 'admin')
        .where('subsidiary.admin IS NULL')
        .andWhere('subsidiary.createdBy = :createdBy', { createdBy: user.id })
        .getMany();
    }
    return this.requestRepositry
      .createQueryBuilder('request')
      .innerJoin('request.subsidiary', 'subsidiary')
      .where('subsidiary.admin = :admin', { admin: user.id })
      .getMany();
  }
}
