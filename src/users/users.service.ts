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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepositry: Repository<Users>,
    private jwtService: JwtService,
    private fileUploadService: CloudStorageService,
  ) { }
  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(5);
    const hashedPassowrd: string = bcrypt.hashSync(password, salt);
    return hashedPassowrd;
  }
  getUserById(id: string) {
    return this.userRepositry.findOne({
      where: { id },
    });
  }
  async signupSingleUser(newUser: SignupDTO) {
    try {
      const createdUser = this.userRepositry.create({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        contact: newUser.contact,
        username: newUser.username,
        email: newUser.email,
        hashedPassword: this.hashPassword(newUser.password),
        role: UserRoles.SU,
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
      delete user.hashedPassword;
      delete user.employeePassword;
      return { ...user, token };
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

  async signin(user: SigninDTO) {
    const foundUser = await this.userRepositry.findOne({
      where: { username: user.username },
    });
    if (!foundUser) {
      throw new UnauthorizedException(`Username or password invalid`);
    }
    if (foundUser.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(`Your account has been deactivated!`);
    }
    const isPassCorrect = await bcrypt.compare(
      user.password,
      foundUser.hashedPassword,
    );
    if (!isPassCorrect) {
      throw new UnauthorizedException(`Username or password invalid`);
    }
    const payload = { id: foundUser.id, email: foundUser.email };
    let token;
    if (user?.rememberMe) {
      token = await this.jwtService.signAsync(payload);
    } else {
      token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    }
    return token;
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
    const user = await this.userRepositry.findOne({
      where: { id: currentUser.id },
    });
    if (!user) {
      throw new NotFoundException('User not Found!');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(`Your account has been deactivated!`);
    }
    let payload;
    if (token) {
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        throw new UnauthorizedException(error.message);
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

  async forgotPassword(email: string, ip: string, device: any) {
    const deviceInfo = `${device.type}, ${device.parser.useragent.os.family}, ${device.parser.useragent.family}`
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
    await this.userRepositry.save(user);
  }

  async updateProfile(
    userData: UpdateProfileDTO,
    file: any,
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
      if (file && file.length) {
        const response = await this.fileUploadService.uploadFileInS3(
          file[0],
          user,
          process.env.PROFILES_FOLDER_NAME,
        );
        user.fileId = response.fileId;
        user.profilePicture = `${process.env.S3_URL}${response.fileName}`;
      }
      user.firstName = userData.firstName || user.firstName;
      user.lastName = userData.lastName || user.lastName;
      user.email = userData.email || user.email;
      user.contact = userData.contact || user.contact;
      await this.userRepositry.save(user);
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
}
