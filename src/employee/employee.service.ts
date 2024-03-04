import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRoles, Users } from 'src/entities/User.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { AddEmployeeDTO, EditEmployeeDTO } from './dto/employee-dto';
import { UsersService } from 'src/users/users.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { S3_ENUMS } from 'enum';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DocumentService } from '../document/document.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTPService } from 'src/otp/otp.service';
import { OTP, OtpPurpose } from 'src/entities/otp.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Users)
    private userRepositry: Repository<Users>,
    private subsidiaryService: SubsidiaryService,
    private userService: UsersService,
    private fileUploadService: CloudStorageService,
    private documentService: DocumentService,
    private otpService: OTPService,
  ) {}
  async addEmployee(user: Users, data: AddEmployeeDTO) {
    try {
      const {
        contact,
        email,
        firstName,
        lastName,
        password,
        role,
        subsidiary,
        username,
        address,
        accessibility,
      } = data;
      const foundSubsidiary = await this.subsidiaryService.getSubsidiaryByOwner(
        user,
        subsidiary,
      );
      if (!foundSubsidiary) {
        throw new NotFoundException('Subsidiary not found!');
      }
      const employee = this.userService.create({
        contact,
        email,
        employeePassword: password,
        firstName,
        lastName,
        subsidiary: foundSubsidiary,
        hashedPassword: this.userService.hashPassword(password),
        username,
        role,
        address,
      });
      if (role === UserRoles.BCU) {
        employee.accessibility = {
          doc: accessibility.doc ?? false,
          share: accessibility.share ?? false,
        };
      }
      const newEmployee = await this.userService.save(employee);
      if (role === UserRoles.ACU) {
        if (foundSubsidiary.admin) {
          throw new ConflictException(
            "There's already an admin for this subsidiary",
          );
        }
        foundSubsidiary.admin = newEmployee;
        await this.subsidiaryService.save(foundSubsidiary);
      }
      return newEmployee;
    } catch (error) {
      if (error.errno === 1062) {
        this.userService.duplicateErrorHandler(error);
      } else {
        throw error;
      }
    }
  }
  async editEmployeeDetails(
    data: EditEmployeeDTO,
    userId: string,
    createdBy: string,
  ) {
    try {
      const user = await this.userService.getEmployeeByCU({
        createdBy,
        userId,
      });
      if (!user) {
        throw new NotFoundException('Employee not found!');
      }
      const { contact, email, firstName, lastName, profilePicture } = data;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.contact = contact || user.contact;
      user.email = email || user.email;
      if (profilePicture) {
        const response = await this.fileUploadService.uploadFileInS3(
          profilePicture,
          user,
          S3_ENUMS.profile_pictures,
        );
        user.fileId = response.fileId;
        user.profilePicture = `${S3_ENUMS.URL}/${response.fileName}`;
      }
      return this.userService.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        const match = error?.sqlMessage?.match(/for key '(.*?)'/);
        const keyName = match ? match[1] : 'unknown';
        if (keyName === 'users.IDX_97672ac88f789774dd47f7c8be') {
          throw new ConflictException('Email already exists.');
        } else if (keyName === 'users.IDX_6c71f479b6fd0e0f7e1b8d855e') {
          throw new ConflictException('Contact number already exists.');
        } else {
          throw new ConflictException(
            'Duplicate entry for a unique constraint.',
          );
        }
      } else {
        throw error;
      }
    }
  }
  async deleteEmployee(data: { userId: string; createdBy: string }) {
    const user = await this.userService.getEmployeeByCU({
      createdBy: data.createdBy,
      userId: data.userId,
    });
    if (!user) {
      throw new NotFoundException('Employee not found!');
    }
    const deletionResult = await this.userService.delete(user.id);
    if (deletionResult.affected === 0) {
      throw new NotFoundException('Employee not found!');
    }
  }
  async generateOTPForResetPassword(employeeId: string, user: Users) {
    const employee = await this.userService.getEmployeeById(employeeId);
    if (user.subsidiary.admin != user) {
      throw new ForbiddenException('User does not exist in your subsidiary');
    }
    const otp = await this.documentService.generateOTPForAddDoc(employee);
    console.log(otp.otp);
    return otp;
  }

  async changeEmployeePassword(
    employeeId: string,
    otp: number,
    employeeNewPassword: string,
  ) {
    const employee = await this.userService.getEmployeeById(employeeId);
    const otpID = await this.otpService.verifyOTP(
      employee,
      OtpPurpose.reset_employee_password,
      otp,
    );

    employee.employeePassword =
      this.userService.hashPassword(employeeNewPassword);
    await this.userRepositry.save(employee);
    await this.otpService.deleteOtp(otpID);
  }

  async getAllEmployeesBySubsidiary(
    user: Users,
    subsidiaryId: string,
    options: IPaginationOptions,
  ) {
    return this.userService.getAllEmployeesBySubsidiary(
      subsidiaryId,
      user,
      options,
    );
  }
  async getAllEmployees(
    user: Users,
    options: IPaginationOptions,
    search: string,
  ) {
    return this.userService.getAllEmployees(user, options, search);
  }
}
