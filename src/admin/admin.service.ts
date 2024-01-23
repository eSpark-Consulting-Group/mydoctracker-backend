import { InjectRepository } from '@nestjs/typeorm';
import { S3_ENUMS } from 'enum';
import { Admin } from 'src/entities/Admin.entity';
import { Firmware } from 'src/entities/Firmware.entity';
import { FirmwareService } from 'src/firmware/firmware.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { Repository } from 'typeorm';

// @Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepositry: Repository<Admin>,
    private fimwareService: FirmwareService,
  ) {}
  async getAdminById(id: string) {
    return this.adminRepositry.findOne({ where: { id } });
  }
  async uploadFirmware(file: Express.Multer.File) {
    return this.fimwareService.uploadFirmware(file);
  }
}
