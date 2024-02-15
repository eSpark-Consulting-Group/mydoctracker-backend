import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-decorator';
import { UserRoles, Users } from 'src/entities/User.entity';
import {
  AddEmployeeDTO,
  EditEmployeeDTO,
  SubsdiaryIdDTO,
} from './dto/employee-dto';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParamDTO } from 'src/subsidiary/dto/subsidiary-dto';
import { fileValidator } from 'src/utils/helpers/file.validation';

@ApiTags('Employee')
@Controller('employee')
@UseGuards(JwtGuard)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @ApiBearerAuth()
  @Roles([UserRoles.CU])
  @Post('')
  @HttpCode(200)
  async addEmployee(
    @Body() reqData: AddEmployeeDTO,
    @CurrentUser() user: Users,
  ) {
    const data = await this.employeeService.addEmployee(user, reqData);
    return {
      data,
      message: 'Employee has been added successfully!',
      status: 'success',
    };
  }

  @ApiBearerAuth()
  @Roles([UserRoles.CU])
  @Put(':id')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async editEmployeeDetails(
    @UploadedFile(
      fileValidator({
        fileIsRequired: false,
        fileType: /^image\/(jpeg|jpg|png)$/,
      }),
    )
    file: Express.Multer.File,
    @Body() reqData: EditEmployeeDTO,
    @CurrentUser() user: Users,
    @Param() param: ParamDTO,
  ) {
    const data = await this.employeeService.editEmployeeDetails(
      {
        ...reqData,
        profilePicture: file,
      },
      param.id,
      user.id,
    );
    return {
      data,
      message: 'Employee has been added successfully!',
      status: 'success',
    };
  }

  @ApiBearerAuth()
  @Roles([UserRoles.CU])
  @Delete(':id')
  @HttpCode(200)
  async deleteEmployee(@CurrentUser() user: Users, @Param() param: ParamDTO) {
    await this.employeeService.deleteEmployee({
      createdBy: user.id,
      userId: param.id,
    });
    return {
      message: 'Employee has been deleted successfully!',
      status: 'success',
    };
  }
  @ApiBearerAuth()
  @Roles([UserRoles.CU, UserRoles.ACU])
  @Get(':subsidiary')
  @HttpCode(200)
  async getAllEmployeesBySubsidiary(
    @CurrentUser() user: Users,
    @Param() param: SubsdiaryIdDTO,
  ) {
    const data = await this.employeeService.getAllEmployeesBySubsidiary(
      user,
      param.subsidiary,
    );
    return {
      data,
      message: 'Employees have been fetched successfully!',
      status: 'success',
    };
  }
}
