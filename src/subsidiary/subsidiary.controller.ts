import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SubsidiaryService } from './subsidiary.service';
import { ErrorResponseBody } from 'src/utils/APIResponse';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { UserRoles, Users } from 'src/entities/User.entity';
import { CreateSubsidiaryDTO, ParamDTO } from './dto/subsidiary-dto';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-decorator';

@ApiTags('Subsidiary')
@UseGuards(JwtGuard)
@Controller('subsidiary')
export class SubsidiaryController {
  constructor(private readonly subsidiaryService: SubsidiaryService) {}
  @ApiOperation({ summary: 'Add Subsidiary By Company ID' })
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @Roles([UserRoles.CU])
  @Post(':id')
  async createSubsidiary(
    @CurrentUser() user: Users,
    @Body() reqBody: CreateSubsidiaryDTO,
    @Param() param: ParamDTO,
  ) {
    const data = await this.subsidiaryService.createSubsidiary(
      user,
      reqBody,
      param.id,
    );
    return {
      status: 'success',
      message: 'Subsidiary has been created successfully!',
      data,
    };
  }

  @ApiOperation({
    summary: 'Get All Subsidiaries By Company ID',
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @Roles([UserRoles.CU])
  @Get(':id')
  async getAllSubsidiariesByCompany(
    @CurrentUser() user: Users,
    @Param() param: ParamDTO,
  ) {
    const data = await this.subsidiaryService.getAllSubsidiariesByCompany(
      param.id,
      user,
    );
    return {
      data,
      status: 'success',
      message: 'Subsidiaries have been fetched successfully!',
    };
  }

  @ApiOperation({ summary: 'Edit Subsidiary By Subsidiary ID' })
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @Roles([UserRoles.CU])
  @Put(':id')
  async editSubsidiary(
    @CurrentUser() user: Users,
    @Body() reqBody: CreateSubsidiaryDTO,
    @Param() param: ParamDTO,
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

  @ApiOperation({ summary: 'Delete Subsidiary By Subsidiary ID' })
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  @Roles([UserRoles.CU])
  @Delete(':id')
  async deleteSubsidiary(@CurrentUser() user: Users, @Param() param: ParamDTO) {
    await this.subsidiaryService.deleteSubsidiary(user, param.id);
    return {
      status: 'success',
      message: 'Subsidiary has been deleted successfully!',
    };
  }
}
