import { InjectRepository } from '@nestjs/typeorm';
import { S3_ENUMS } from 'enum';
import { Firmware } from 'src/entities/Firmware.entity';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { Repository } from 'typeorm';

export class FirmwareService {
  constructor(
    @InjectRepository(Firmware)
    private firmwareRepositry: Repository<Firmware>,
    private fileUploadService: CloudStorageService,
  ) {}

  private incrementVersion(currentVersion: string) {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    if (patch < 9) {
      return `${major}.${minor}.${patch + 1}`;
    }
    if (minor < 9) {
      return `${major}.${minor + 1}.0`;
    }
    return `${major + 1}.0.0`;
  }

  getLatestFirmware() {
    return this.firmwareRepositry.findOne({
      where: {},
      order: { timestamp: 'DESC' },
    });
  }
  getFirmwaresList() {
    return this.firmwareRepositry.find({});
  }

  async uploadFirmware(file: Express.Multer.File) {
    const firmwareDetails = await this.firmwareRepositry.findOne({
      where: {},
      order: { timestamp: 'DESC' },
    });
    let version = '0.0.1';
    if (firmwareDetails) {
      const currentVersion = firmwareDetails.version;
      version = this.incrementVersion(currentVersion);
    }
    const response = await this.fileUploadService.uploadBuildFile(
      file,
      S3_ENUMS.firmwares,
      version,
    );
    const build = `${S3_ENUMS.URL}/${response.fileName}`;
    const firmware = this.firmwareRepositry.create({
      build,
      version,
    });
    return this.firmwareRepositry.save(firmware);
  }
}
