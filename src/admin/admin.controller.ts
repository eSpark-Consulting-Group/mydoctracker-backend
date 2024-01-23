import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard } from 'src/auth/guard/admin-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFirmwareDTO } from './dto/admin-dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @ApiBearerAuth()
  @UseGuards(AdminJwtGuard)
  @Post('/firmware/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UploadFirmwareDTO })
  async uploadFirmaware(
    @UploadedFile(
      new ParseFilePipeBuilder().build({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const data = await this.adminService.uploadFirmware(file);
    return {
      data,
      status: 'success',
      message: 'Firware has been uploaded!',
    };
  }
}
