import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3_ENUMS } from 'enum';
import { Request, RequestStatus, RequestType } from 'src/entities/Request.entity';
import { UserRoles, Users } from 'src/entities/User.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { Repository } from 'typeorm';
import { RequestUpdateDTO } from './dto/request-dto';
import { DocumentService } from 'src/document/document.service';

export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepositry: Repository<Request>,
    private subsidiaryService: SubsidiaryService,
    private fileUploadService: CloudStorageService,
    private documentService: DocumentService,
  ) {}
  async createRequestForDocument(user: Users, data: any, docID: string) {
    const document = await this.documentService.getCurrentUserDoc(docID, user);
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
  async getPendingReqs(user: Users) {
    if (user.role === UserRoles.CU) {
      return this.requestRepositry
        .createQueryBuilder('request')
        .innerJoin('request.subsidiary', 'subsidiary')
        .leftJoin('subsidiary.admin', 'admin')
        .andWhere('subsidiary.admin IS NULL')
        .andWhere('subsidiary.createdBy = :createdBy', { createdBy: user.id })
        .getMany();
    }
    return this.requestRepositry
      .createQueryBuilder('request')
      .innerJoin('request.subsidiary', 'subsidiary')
      .where('subsidiary.admin = :admin', { admin: user.id })
      .getMany();
  }
  async respondToDocRequest(
    user: Users,
    { status }: RequestUpdateDTO,
    requestId: string,
  ) {
    let request: Request;
    if (user.role === UserRoles.CU) {
      request = await this.requestRepositry
        .createQueryBuilder('request')
        .where('request.id = :requestId', { requestId })
        .innerJoin('request.subsidiary', 'subsidiary')
        .leftJoin('subsidiary.admin', 'admin')
        .andWhere('subsidiary.admin IS NULL')
        .andWhere('subsidiary.createdBy = :createdBy', { createdBy: user.id })
        .innerJoinAndSelect('request.createdBy', 'createdBy')
        .getOne();
    }
    request = await this.requestRepositry
      .createQueryBuilder('request')
      .where('request.id = :requestId', { requestId })
      .innerJoin('request.subsidiary', 'subsidiary')
      .andWhere('subsidiary.admin = :admin', { admin: user.id })
      .innerJoinAndSelect('request.createdBy', 'createdBy')
      .getOne();

    if (!request) {
      throw new NotFoundException('Request not found!');
    }
    if (status === RequestStatus.APPROVED) {
      await this.documentService.editDocument(
        request.createdBy,
        request.meta,
        request.documentId,
      );
    }
    return this.requestRepositry.delete({ id: request.id });
  }
}
