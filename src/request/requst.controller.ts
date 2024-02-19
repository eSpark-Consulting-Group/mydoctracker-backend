import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
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
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-decorator';
import { UserRoles, Users } from 'src/entities/User.entity';
import { RequestService } from './request.service';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { EditDocumentDTO } from 'src/document/dto/document-dto';
import { ParamDTO } from 'src/subsidiary/dto/subsidiary-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidator } from 'src/utils/helpers/file.validation';

@Controller('request')
@UseGuards(JwtGuard)
@ApiTags('Request')
export class RequestController {
  constructor(private requestService: RequestService) {}
  @ApiOperation({
    summary: 'Get all requests for update document',
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @Roles([UserRoles.ACU, UserRoles.CU])
  @Get('doc')
  async getAllReqsForUpdateDoc(@CurrentUser() user: Users) {
    const data = await this.requestService.getAllReqsForUpdateDoc(user);
    return {
      data,
      status: 'success',
      message: 'All requests have been fetched successfully!',
    };
  }

  @ApiOperation({
    summary: 'Create a document update request using document ID',
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @Roles([UserRoles.RCU, UserRoles.BCU])
  @Post('doc/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createRequestForDocument(
    @CurrentUser() user: Users,
    @Body() reqData: EditDocumentDTO,
    @UploadedFile(
      fileValidator({
        fileIsRequired: false,
        fileType: /^image\/(jpeg|jpg|png)$/,
      }),
    )
    file: Express.Multer.File,
    @Param()
    id: ParamDTO,
  ) {
    await this.requestService.createRequestForDocument(
      user,
      { ...reqData, file },
      id.id,
    );
    return {
      status: 'success',
      message: 'Your request has been submitted successfully!',
    };
  }
}
