import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRoles } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  LoginUserDto,
  SignupCorporateUserDto,
  SignupSingleUserDto,
} from './dto/user-dto';
import * as bcrypt from 'bcrypt';
import { Company } from 'src/entities/Company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepositry: Repository<User>,
    @InjectRepository(Company)
    private companyRepositry: Repository<Company>,
    private jwtService: JwtService,
  ) {}
  private hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(5);
    const hashedPassowrd: string = bcrypt.hashSync(password, salt);
    return hashedPassowrd;
  }
  async signupSingleUser(newUser: SignupSingleUserDto) {
    try {
      const createdUser = this.userRepositry.create(newUser);
      return await this.userRepositry.save({
        ...createdUser,
        role: UserRoles.USER,
        password: this.hashPassword(newUser.password),
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'User with this email already exists!',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
  async signupCorporateUser(newUser: SignupCorporateUserDto) {
    try {
      const createdUser = this.userRepositry.create(newUser);
      const company = this.companyRepositry.create({
        name: newUser.companyName,
        address: newUser.companyAddress,
        contact: newUser.companyContact,
        email: newUser.companyEmail,
      });
      createdUser.company = company;
      const user = await this.userRepositry.save({
        ...createdUser,
        role: UserRoles.COPORATE,
        password: this.hashPassword(newUser.password),
      });
      return { ...user, ...company };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'User with this email already exists!',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
  async loginUser(user: LoginUserDto) {
    const foundUser = await this.userRepositry.findOne({
      where: { email: user.email },
    });
    if (!foundUser) {
      throw new HttpException(
        `Email or password invalid`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isMatched = await bcrypt.compare(user.password, foundUser.password);
    if (!isMatched) {
      throw new HttpException(
        `Email or password invalid`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { id: foundUser.id, email: foundUser.email };
    const jwt = await this.jwtService.signAsync(payload);
    return jwt;
  }
}
