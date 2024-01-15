import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { APIException } from 'src/utils/APIResponse';

@Injectable()
export class ApiKeyAuthGuard extends AuthGuard('api-key') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new APIException(
        {
          status: 'error',
          message: 'Please insert a valid api-key to proceed further.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  }
}
