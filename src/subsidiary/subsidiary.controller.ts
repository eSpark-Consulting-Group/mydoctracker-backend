import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubsidiaryService } from './subsidiary.service';
import { ErrorResponseBody } from 'src/utils/APIResponse';
import { CorporateUserJwtGuard } from 'src/auth/guard/corporate-user-auth-guard';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/User.entity';
import {
  CreateSubsidiaryDTO,
  EditSubsidiaryDTO,
  SubsidiaryIdDTO,
} from './dto/subsidiary-dto';

@ApiTags('Subsidiary')
@Controller('subsidiary')
export class SubsidiaryController {
  constructor(private readonly subsidiaryService: SubsidiaryService) {}
  @ApiBearerAuth()
  @UseGuards(CorporateUserJwtGuard)
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @Post()
  async createSubsidiary(
    @CurrentUser() user: Users,
    @Body() reqBody: CreateSubsidiaryDTO,
  ) {
    const data = await this.subsidiaryService.createSubsidiary(user, reqBody);
    return {
      status: 'success',
      message: 'Subsidiary has been created successfully!',
      data,
    };
  }
  @ApiBearerAuth()
  @UseGuards(CorporateUserJwtGuard)
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @Put(':id')
  async editSubsidiary(
    @CurrentUser() user: Users,
    @Body() reqBody: EditSubsidiaryDTO,
    @Param() param: SubsidiaryIdDTO,
  ) {
    const data = await this.subsidiaryService.editSubsidiary(
      user,
      reqBody,
      param.id,
    );
    return {
      status: 'success',
      message: 'Subsidiary has been edited successfully!',
      data,
    };
  }
  @ApiBearerAuth()
  @UseGuards(CorporateUserJwtGuard)
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @Delete(':id')
  async deleteSubsidiary(
    @CurrentUser() user: Users,
    @Param() param: SubsidiaryIdDTO,
  ) {
    await this.subsidiaryService.deleteSubsidiary(user, param.id);
    return {
      status: 'success',
      message: 'Subsidiary has been deleted successfully!',
    };
  }
}
