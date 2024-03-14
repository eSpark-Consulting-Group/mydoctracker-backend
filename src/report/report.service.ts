import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports } from 'src/entities/Report.entity';
import { Repository } from 'typeorm';
import { ReportProblemDTO } from './dto/report-dto';
import { S3_ENUMS } from 'enum';
import { Users } from 'src/entities/User.entity';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';

@Injectable()
export class ReportService {
  constructor(
    private fileUploadService: CloudStorageService,
    @InjectRepository(Reports)
    private reportRepositry: Repository<Reports>,
  ) {}

  async reportProblem(
    reportData: ReportProblemDTO,
    user: Users,
    file: Express.Multer.File,
  ) {
    if (file) {
      const uploadFile = await this.fileUploadService.uploadReportFile(
        file,
        user,
        S3_ENUMS.reports,
      );
      const problemPicture = this.reportRepositry.create({
        email: reportData.email,
        description: reportData.description,
        file: `${S3_ENUMS.URL}/${uploadFile.fileName}`,
        user: user,
      });
      await this.reportRepositry.save(problemPicture);
    }
  }
}
