import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReportProblemDTO } from './dto/report-dto';
import { ReportService } from './report.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidator } from 'src/utils/helpers/file.validation';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/User.entity';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Report a problem faced by user',
  })
  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('reportPicture'))
  async reportProblem(
    @UploadedFile(
      fileValidator({
        fileIsRequired: true,
        fileType: /^image\/(jpeg|jpg|png)$/,
      }),
    )
    file: Express.Multer.File,
    @Body() reqData: ReportProblemDTO,
    @CurrentUser() user: Users,
  ) {
    await this.reportService.reportProblem(reqData, user, file);
    return {
      status: 'success',
      message: 'Your problem has been reported successfully!',
    };
  }
}
