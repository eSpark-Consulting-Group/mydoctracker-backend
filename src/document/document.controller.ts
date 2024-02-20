import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { DocumentService } from './document.service';
import { ErrorResponseBody } from 'src/utils/APIResponse';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { UserRoles, Users } from 'src/entities/User.entity';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { AddDocumentDTO, EditDocumentDTO } from './dto/document-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/guard/roles-decorator';
import { ParamDTO } from 'src/subsidiary/dto/subsidiary-dto';
import { fileValidator } from 'src/utils/helpers/file.validation';

@ApiTags('Document')
@Controller('document')
@UseGuards(JwtGuard)
export class DcoumentController {
  constructor(private documentService: DocumentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all documents',
  })
  @Get('/')
  @HttpCode(200)
  @Roles([UserRoles.SU, UserRoles.ACU, UserRoles.BCU, UserRoles.RCU])
  async getAllDocuments(@CurrentUser() user: Users) {
    const data = await this.documentService.geAllDocuments(user);
    return {
      status: 'success',
      message: 'Documents have been fetched successfully!',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles([UserRoles.SU, UserRoles.CU])
  @ApiOperation({
    summary: 'Add a Document',
  })
  @Post('/')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async addDocument(
    @UploadedFile(
      fileValidator({
        fileIsRequired: true,
        fileType: /^image\/(jpeg|jpg|png)$/,
      }),
    )
    file: Express.Multer.File,
    @Body() reqData: AddDocumentDTO,
    @CurrentUser() user: Users,
  ) {
    const data = await this.documentService.addDocument(user, {
      ...reqData,
      file,
    });
    return {
      status: 'success',
      message: 'Document has been created successfully!',
      data,
    };
  }
  @Roles([UserRoles.SU, UserRoles.CU])
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get OTP for adding a  Document',
  })
  @Get('otp')
  @HttpCode(200)
  async generateOTP(@CurrentUser() user: Users) {
    await this.documentService.generateOTPForAddDoc(user);
    return {
      status: 'success',
      message: 'OTP has been sent to your email address!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Document history',
  })
  @Get('/history/:id')
  @HttpCode(200)
  async getDocumentHistory(
    @CurrentUser() user: Users,
    @Param() id: ParamDTO,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 10 ? 10 : limit;
    const data = await this.documentService.getDocumentHistory(user, id.id, {
      page,
      limit,
    });
    return {
      status: 'success',
      message: 'Document history has been fetched successfully!',
      data,
    };
  }

  @ApiBearerAuth()
  @Roles([UserRoles.SU, UserRoles.ACU])
  @ApiOperation({
    summary: 'Edit a Document',
  })
  @Put('/:id')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async editDocument(
    @UploadedFile(
      fileValidator({
        fileIsRequired: false,
        fileType: /^image\/(jpeg|jpg|png)$/,
      }),
    )
    file: Express.Multer.File,
    @Body() reqData: EditDocumentDTO,
    @CurrentUser() user: Users,
    @Param() id: ParamDTO,
  ) {
    const data = await this.documentService.editDocument(
      user,
      { ...reqData, file },
      id.id,
    );
    return {
      status: 'success',
      message: 'Document has been edited successfully!',
      data,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a Document',
  })
  @Delete('/:id')
  @HttpCode(200)
  async deleteDocument(@CurrentUser() user: Users, @Param() id: ParamDTO) {
    await this.documentService.deleteDocument(user, id.id);
    return {
      status: 'success',
      message: 'Document has been deleted successfully!',
    };
  }

  @ApiBearerAuth()
  @Roles([UserRoles.CU, UserRoles.ACU])
  @ApiOperation({
    summary: 'Get All Documents for an Employee using Employee ID',
  })
  @Get('/employee/:id')
  @HttpCode(200)
  async getDocumentsByEmployee(
    @CurrentUser() user: Users,
    @Param() id: ParamDTO,
  ) {
    const data = await this.documentService.getDocumentsByEmployee(id.id, user);
    return {
      data,
      status: 'success',
      message: 'Documents have been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Document By ID',
  })
  @Get('/:id')
  @HttpCode(200)
  async getDocumentById(@CurrentUser() user: Users, @Param() id: ParamDTO) {
    const data = await this.documentService.getDocumentById(id.id, user);
    return {
      data,
      status: 'success',
      message: 'Document has been fetched successfully!',
    };
  }
}
