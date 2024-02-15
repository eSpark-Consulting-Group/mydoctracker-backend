import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus, UserRoles, Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SigninDTO, SignupDTO, UpdateProfileDTO } from './dto/users-dto';
import { CloudStorageService } from 'src/utils/helpers/cloud-storage';
import { EmailService } from 'src/utils/helpers/email';
import { S3_ENUMS } from 'enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepositry: Repository<Users>,
    private jwtService: JwtService,
    private fileUploadService: CloudStorageService,
    private readonly sendGridClient: EmailService,
  ) {}
  hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(5);
    const hashedPassowrd: string = bcrypt.hashSync(password, salt);
    return hashedPassowrd;
  }
  duplicateErrorHandler(error) {
    const match = error?.sqlMessage?.match(/for key '(.*?)'/);
    const keyName = match ? match[1] : 'unknown';
    if (keyName === 'users.IDX_fe0bb3f6520ee0469504521e71') {
      throw new ConflictException('Username already exists.');
    } else if (keyName === 'users.IDX_97672ac88f789774dd47f7c8be') {
      throw new ConflictException('Email already exists.');
    } else if (keyName === 'users.IDX_6c71f479b6fd0e0f7e1b8d855e') {
      throw new ConflictException('Contact number already exists.');
    } else {
      throw new ConflictException('Duplicate entry for a unique constraint.');
    }
  }
  getUserDetails(id: string) {
    return this.userRepositry.findOne({
      where: { id },
      relations: ['subsidiary'],
    });
  }
  async signupUser(newUser: SignupDTO) {
    try {
      const createdUser = this.userRepositry.create({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        contact: newUser.contact,
        username: newUser.username,
        email: newUser.email,
        hashedPassword: this.hashPassword(newUser.password),
        role: UserRoles[newUser.role],
      });
      const user = await this.userRepositry.save(createdUser);
      const payload = { id: user.id, email: user.email };
      let token;
      if (newUser?.rememberMe) {
        token = await this.jwtService.signAsync(payload);
      } else {
        token = await this.jwtService.signAsync(payload, {
          expiresIn: process.env.JWT_EXPIRE,
        });
      }
      return { user, token };
    } catch (error) {
      if (error.errno === 1062) {
        this.duplicateErrorHandler(error);
      } else {
        throw error;
      }
    }
  }

  async signin(userCreds: SigninDTO) {
    const user = await this.userRepositry.findOne({
      where: { username: userCreds.username },
    });
    if (!user) {
      throw new UnauthorizedException(`Username or password invalid`);
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(`Your account has been deactivated!`);
    }
    const isPassCorrect = await bcrypt.compare(
      userCreds.password,
      user.hashedPassword,
    );
    if (!isPassCorrect) {
      throw new UnauthorizedException(`Username or password invalid`);
    }
    const payload = { id: user.id, email: user.email };
    let token;
    if (userCreds?.rememberMe) {
      token = await this.jwtService.signAsync(payload);
    } else {
      token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    }
    return { user, token };
  }

  async changePassword(
    data: {
      oldPassword?: string;
      newPassword: string;
      token?: string;
    },
    currentUser: Users,
  ) {
    const { newPassword, oldPassword, token } = data;
    let user: Users;
    let payload;
    if (token) {
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        throw new UnauthorizedException(error.message);
      }
      user = await this.userRepositry.findOne({
        where: { email: payload.email },
      });
      if (!user) {
        throw new NotFoundException('User not Found!');
      }
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException(`Your account has been deactivated!`);
      }
      const isPassCorrect = payload.oldPasswordHash === user.hashedPassword;
      if (!isPassCorrect) {
        throw new ForbiddenException('Request is malformed, Please try again!');
      }
      const iat = payload.iat;
      const exp = payload.exp;
      const tokenData = {
        ip: payload.ip,
        generated_at: new Date(iat * 1000),
        expires_at: new Date(exp * 1000),
        password_updated_at: new Date(),
        device: payload.device,
        oldPasswordHash: payload.oldPasswordHash,
      };
      if (user.meta) {
        user.meta.reset_history.push(tokenData);
      } else {
        user.meta = { reset_history: [tokenData] };
      }
    } else if (oldPassword) {
      user = await this.userRepositry.findOne({
        where: { id: currentUser.id },
      });
      if (!user) {
        throw new NotFoundException('User not Found!');
      }
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException(`Your account has been deactivated!`);
      }
      const isPassCorrect = await bcrypt.compare(
        oldPassword,
        user.hashedPassword,
      );
      if (!isPassCorrect) {
        throw new ForbiddenException('Old password is wrong');
      }
    } else {
      throw new BadRequestException('Please provide old password');
    }
    user.hashedPassword = this.hashPassword(newPassword);
    await this.userRepositry.save(user);
  }

  async forgotPassword(email: string, ip: string, device: any, host: string) {
    const deviceInfo = `${device.type}, ${device.parser.useragent.os.family}, ${device.parser.useragent.family}`;
    const user = await this.userRepositry.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not Found!');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(`Your account has been deactivated!`);
    }

    const date = Date.now();
    const payload = {
      ip: ip,
      email: user.email,
      date: date,
      oldPasswordHash: user.hashedPassword,
      device: deviceInfo,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 30 * 60,
    });

    user.reset_token = token;
    const reset_link = `${host}?token=${token}`;
    await this.sendGridClient.sendForgotPasswordEmail(
      user.email,
      user.username,
      reset_link,
    );
    await this.userRepositry.save(user);
  }

  async updateProfile(
    userData: UpdateProfileDTO,
    file: Express.Multer.File,
    currentUser: Users,
  ) {
    try {
      const user = await this.userRepositry.findOne({
        where: { id: currentUser.id },
      });
      if (!user) {
        throw new NotFoundException('User not Found!');
      }
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException(`Your account has been deactivated!`);
      }
      if (file) {
        const response = await this.fileUploadService.uploadFileInS3(
          file,
          user,
          S3_ENUMS.profile_pictures,
        );
        user.fileId = response.fileId;
        user.profilePicture = `${S3_ENUMS.URL}/${response.fileName}`;
      }
      user.firstName = userData.firstName || user.firstName;
      user.lastName = userData.lastName || user.lastName;
      user.email = userData.email || user.email;
      user.contact = userData.contact || user.contact;
      const updatedUser = await this.userRepositry.save(user);
      return updatedUser;
    } catch (error) {
      if (error.errno === 1062) {
        this.duplicateErrorHandler(error);
      } else {
        throw error;
      }
    }
  }

  async getEmployeeByCU({
    userId,
    createdBy,
  }: {
    userId: string;
    createdBy: string;
  }) {
    return this.userRepositry
      .createQueryBuilder('user')
      .innerJoin('user.subsidiary', 'subsidiary')
      .where('user.id = :id', { id: userId })
      .andWhere('subsidiary.createdBy = :createdBy', {
        createdBy,
      })
      .getOne();
  }
  async getAllEmployeesBySubsidiary(
    subsidiaryId: string,
    createdByOrAdmin: string,
  ) {
    return this.userRepositry
      .createQueryBuilder('user')
      .innerJoin('user.subsidiary', 'subsidiary')
      .where('subsidiary.id = :subsidiaryId', { subsidiaryId })
      .andWhere(
        '(subsidiary.createdBy = :createdByOrAdmin OR subsidiary.admin = :createdByOrAdmin)',
        {
          createdByOrAdmin,
        },
      )
      .getMany();
  }

  async getEmployeeByCUandACU(employeeId: string, createdByOrAdmin: string) {
    return this.userRepositry
      .createQueryBuilder('user')
      .innerJoin('user.subsidiary', 'subsidiary')
      .where('user.id = :userId', { userId: employeeId })
      .andWhere(
        '(subsidiary.createdBy = :createdByOrAdmin OR subsidiary.admin = :createdByOrAdmin)',
        {
          createdByOrAdmin,
        },
      )
      .getOne();
  }

  save(user: Users) {
    return this.userRepositry.save(user);
  }

  create(user: Object) {
    return this.userRepositry.create(user);
  }

  async delete(id: string) {
    return this.userRepositry.delete(id);
  }
}
