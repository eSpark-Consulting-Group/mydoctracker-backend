import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRoles, Users } from 'src/entities/User.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import {
  AddEmployeeDTO,
  EditEmployeeDTO,
  ResetPasswordDTO,
} from './dto/employee-dto';
import { UsersService } from 'src/users/users.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { S3_ENUMS } from 'enum';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { OTPService } from 'src/otp/otp.service';
import { OtpPurpose } from 'src/entities/otp.entity';
import { EmailService } from 'src/utils/helpers/email';

@Injectable()
export class EmployeeService {
  constructor(
    private subsidiaryService: SubsidiaryService,
    private userService: UsersService,
    private fileUploadService: CloudStorageService,
    private otpService: OTPService,
    private emailService: EmailService,
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
  async generateOTPForPassword(currentUser: Users, userId: string) {
    const createdBy = currentUser.id;
    const user = await this.userService.getEmployeeByCU({
      createdBy,
      userId,
    });
    if (!user) {
      throw new NotFoundException('Employee not found!');
    }
    const expiresAt = new Date(Date.now() + 60000);
    const otp = await this.otpService.generatOTP(
      user,
      OtpPurpose.change_password,
      expiresAt,
    );
    await this.emailService.sendOtpEmail(currentUser.email, otp.otp);
  }
  async resetEmployeePassword(
    currentUser: Users,
    data: ResetPasswordDTO,
    employeeId: string,
  ) {
    const createdBy = currentUser.id;
    const userId = employeeId;
    const employee = await this.userService.getEmployeeByCU({
      createdBy,
      userId,
    });
    if (!employee) {
      throw new NotFoundException('Employee not found!');
    }
    const otpID = await this.otpService.verifyOTP(
      employee,
      OtpPurpose.change_password,
      data.otp,
    );
    employee.hashedPassword = this.userService.hashPassword(data.password);
    await this.userService.save(employee);
    await this.otpService.deleteOtp(otpID);
  }
}
