import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { ErrorResponseBody } from 'src/utils/APIResponse';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/User.entity';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { AddDocumentDTO, EditDocumentDTO } from './dto/document-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Document')
@Controller('document')
export class DcoumentController {
  constructor(private documentService: DocumentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all documents',
  })
  @UseGuards(JwtGuard)
  @Get('/')
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async getAllDocuments(@CurrentUser() user: Users) {
    const data = await this.documentService.geAllDocuments(user);
    return {
      status: 'success',
      message: 'Documents have been fetched successfully!',
      data,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a Document',
  })
  @UseGuards(JwtGuard)
  @Post('/')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: '',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async addDocument(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpeg|jpg|png)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
    @Body() reqData: AddDocumentDTO,
    @CurrentUser() user: Users,
  ) {
    const data = await this.documentService.addDocument(user, reqData, file);
    return {
      status: 'success',
      message: 'Document has been created successfully!',
      data,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get OTP for adding a  Document',
  })
  @UseGuards(JwtGuard)
  @Get('otp')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: '',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
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
  @UseGuards(JwtGuard)
  @Get('/history/:id')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: '',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @ApiParam({ name: 'id', example: 'e1cb1cef-913e-4ca5-af16-0cdd4c4e05e2' })
  async getDocumentHistory(
    @CurrentUser() user: Users,
    @Param() id: { id: string },
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
  @ApiOperation({
    summary: 'Edit a Document',
  })
  @UseGuards(JwtGuard)
  @Put('/:id')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: '',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @ApiParam({ name: 'id', example: 'e1cb1cef-913e-4ca5-af16-0cdd4c4e05e2' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async editDocument(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpeg|jpg|png)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
    @Body() reqData: EditDocumentDTO,
    @CurrentUser() user: Users,
    @Param() id: { id: string },
  ) {
    const data = await this.documentService.editDocument(
      user,
      reqData,
      file,
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
  @UseGuards(JwtGuard)
  @Delete('/:id')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: '',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @ApiParam({ name: 'id', example: 'e1cb1cef-913e-4ca5-af16-0cdd4c4e05e2' })
  async deleteDocument(
    @CurrentUser() user: Users,
    @Param() id: { id: string },
  ) {
    await this.documentService.deleteDocument(user, id.id);
    return {
      status: 'success',
      message: 'Document has been deleted successfully!',
    };
  }
}
