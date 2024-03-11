import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { STRINGS } from 'enum';
import { Request } from 'express';
import { UserStatus } from 'src/entities/User.entity';
import { UsersService } from 'src/users/users.service';
import { APIException } from 'src/utils/APIResponse';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles-decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userSerive: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const changePassPath = `/${STRINGS.USERS_ROUTE}/${STRINGS.CHANGE_PASSWORD_ROUTE}`;
      if (request.path === changePassPath && request.query?.token) {
        return true;
      }
      if (!token) {
        throw new APIException(
          {
            status: 'error',
            message:
              'No token found! Please enter a valid token to continue further.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userSerive.getUserDetails(payload.id);
      request.user = user;
      if (!user)
        throw new APIException(
          {
            status: 'error',
            message: 'Invalid sign in! Please use a valid token to continue.',
          },
          HttpStatus.UNAUTHORIZED,
        );

      if (request.user.status !== UserStatus.ACTIVE)
        throw new APIException(
          {
            status: 'error',
            message: 'Your account has been deactivated! ',
          },
          HttpStatus.UNAUTHORIZED,
        );
      const roles = this.reflector.get(Roles, context.getHandler()) || [];
      if (roles.length === 0 || roles.includes(user.role)) {
        return true;
      }
      throw new UnauthorizedException(
        "You're not allowed to use this resource",
      );
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has been expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new APIException(
          {
            status: 'error',
            message: 'Invalid sign in! Please use a valid token to continue.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw error;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
