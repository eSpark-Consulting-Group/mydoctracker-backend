import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserStatus } from 'src/entities/User.entity';
import { UsersService } from 'src/users/users.service';
import { APIException } from 'src/utils/APIResponse';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userSerive: UsersService,
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
    // Attach the payload to the request's user property
    request.user = await this.userSerive.getUserById(payload.id);
    if (!request.user)
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
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
