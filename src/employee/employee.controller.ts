import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
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
import { AddEmployeeDTO, EditEmployeeDTO } from './dto/employee-dto';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParamDTO } from 'src/subsidiary/dto/subsidiary-dto';

@ApiTags('Employee')
@Controller('employee')
@UseGuards(JwtGuard)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @ApiBearerAuth()
  @Roles([UserRoles.CU, UserRoles.ACU])
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
  @Roles([UserRoles.CU, UserRoles.ACU])
  @Put(':id')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async editEmployeeDetails(
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
}
