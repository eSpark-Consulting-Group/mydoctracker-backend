import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users } from 'src/entities/User.entity';
import { SubsidiaryService } from 'src/subsidiary/subsidiary.service';
import { AddEmployeeDTO, EditEmployeeDTO } from './dto/employee-dto';
import { UsersService } from 'src/users/users.service';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { S3_ENUMS } from 'enum';

@Injectable()
export class EmployeeService {
  constructor(
    private subsidiaryService: SubsidiaryService,
    private userService: UsersService,
    private fileUploadService: CloudStorageService,
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
      } = data;
      const foundSubsidiary = await this.subsidiaryService.getSubsidiaryById(
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
      });
      return this.userService.save(employee);
    } catch (error) {
      if (error.errno === 1062) {
        const match = error?.sqlMessage?.match(/for key '(.*?)'/);
        const keyName = match ? match[1] : 'unknown';
        if (keyName === 'users.IDX_fe0bb3f6520ee0469504521e71') {
          throw new ConflictException('Username already exists.');
        } else if (keyName === 'users.IDX_97672ac88f789774dd47f7c8be') {
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
}
