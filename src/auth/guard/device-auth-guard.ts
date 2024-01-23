import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { MAC_ADDRESS_REGEX } from 'enum';
import { DeviceService } from 'src/device/device.service';
import { APIException } from 'src/utils/APIResponse';

@Injectable()
export class DeviceAuthGuard implements CanActivate {
  constructor(private deviceService: DeviceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const macAddress = request.headers.macaddress;
    if (!macAddress) {
      throw new APIException(
        {
          status: 'error',
          message:
            'No macAdress found! Please enter a valid macAdress to continue further.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!MAC_ADDRESS_REGEX.test(macAddress)) {
      throw new UnauthorizedException('Invalid macAddress');
    }
    const device = await this.deviceService.getDeviceByMac(macAddress);
    if (!device) {
      throw new UnauthorizedException('Invalid macAddress');
    }
    request.device = device;
    return true;
  }
}
