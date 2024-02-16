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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubsidiaryService } from './subsidiary.service';
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
  @ApiOperation({ summary: 'Add Subsidiary' })
  @ApiBearerAuth()
  @HttpCode(200)
  @Roles([UserRoles.CU])
  @Post('')
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

  @ApiOperation({
    summary: 'Get All Subsidiaries',
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @Roles([UserRoles.CU])
  @Get('')
  async getAllSubsidiaries(@CurrentUser() user: Users) {
    const data = await this.subsidiaryService.getAllSubsidiaries(user);
    return {
      data,
      status: 'success',
      message: 'Subsidiaries have been fetched successfully!',
    };
  }

  @ApiOperation({ summary: 'Edit Subsidiary By Subsidiary ID' })
  @ApiBearerAuth()
  @HttpCode(200)
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
