import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { APIException } from 'src/utils/APIResponse';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private authService: AuthService) {
    const headerKeyApiKey = 'key';

    super(
      { header: headerKeyApiKey, prefix: '' },
      true,
      async (apiKey, done) => {
        if (this.authService.validateApiKey(apiKey)) {
          done(null, true);
        }
        done(
          new APIException(
            {
              status: 'error',
              message:
                'Invalid API KEY! Please use a different API Key to proceed further!',
            },
            HttpStatus.UNAUTHORIZED,
          ),
          null,
        );
      },
    );
  }
}
