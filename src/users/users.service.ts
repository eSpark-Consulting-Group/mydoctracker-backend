import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus, UserRoles, Users } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SigninDTO, SignupDTO } from './dto/users-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepositry: Repository<Users>,
    private jwtService: JwtService,
  ) {}
  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(5);
    const hashedPassowrd: string = bcrypt.hashSync(password, salt);
    return hashedPassowrd;
  }

  getActiveUserById(id: string) {
    return this.userRepositry.findOne({
      where: { id, status: UserStatus.ACTIVE },
    });
  }
  getActiveUserByUsername(username: string) {
    return this.userRepositry.findOne({
      where: { username, status: UserStatus.ACTIVE },
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
      if (newUser.rememberMe) {
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
    const foundUser = await this.getActiveUserByUsername(user.username);
    if (!foundUser) {
      throw new UnauthorizedException(`Username or password invalid`);
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
    if (user.rememberMe) {
      token = await this.jwtService.signAsync(payload);
    } else {
      token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    }
    return token;
  }

  async changePassword({
    username,
    newPassword,
    oldPassword,
  }: {
    username: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const foundUser = await this.getActiveUserByUsername(username);
    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }
    const isPassCorrect = await bcrypt.compare(
      oldPassword,
      foundUser.hashedPassword,
    );
    if (!isPassCorrect) {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }
    foundUser.hashedPassword = this.hashPassword(newPassword);
    await this.userRepositry.save(foundUser);
  }
}
