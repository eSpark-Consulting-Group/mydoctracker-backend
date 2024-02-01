import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRoles } from 'src/entities/User.entity';
import { UsersService } from 'src/users/users.service';
import { APIException } from 'src/utils/APIResponse';

@Injectable()
export class CorporateUserJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
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
    const user = await this.userService.getUserById(payload.id);
    if (!user)
      throw new APIException(
        {
          status: 'error',
          message: 'Invalid sign in! Please use a valid token to continue.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    if (user.role !== UserRoles.CU)
      throw new APIException(
        {
          status: 'error',
          message: 'You are not allowed to use this resuource.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
