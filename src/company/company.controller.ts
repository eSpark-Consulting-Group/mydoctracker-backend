import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { UserRoles, Users } from 'src/entities/User.entity';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-decorator';
import { CompanyService } from './company.service';
import { CreateCompanyDTO } from './dto/company-dto';

@ApiTags('Company')
@UseGuards(JwtGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @ApiOperation({ summary: 'Add Company For Corporate User' })
  @ApiBearerAuth()
  @HttpCode(200)
  @Roles([UserRoles.CU])
  @Post('')
  async createCompany(
    @CurrentUser() user: Users,
    @Body() reqData: CreateCompanyDTO,
  ) {
    const data = await this.companyService.createCompany(user, reqData);
    return {
      status: 'success',
      message: 'Company has been created successfully!',
      data,
    };
  }
  @ApiOperation({ summary: `Get current user's company` })
  @ApiBearerAuth()
  @HttpCode(200)
  @Roles([UserRoles.CU])
  @Get('')
  async getCompany(@CurrentUser() user: Users) {
    const data = await this.companyService.getCurrentUserCompany(user);
    return {
      status: 'success',
      message: 'Company has been fetched successfully!',
      data,
    };
  }
}
