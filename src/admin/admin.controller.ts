import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiExcludeEndpoint, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetDeviceByMacDto } from 'src/users/dto/response-dto';
import { DeviceMacDTO } from 'src/users/dto/device-dto';
import { DeviceNotFoundResponseBody, ErrorResponseBody, NotFoundResponseBody } from 'src/utils/APIResponse';

@Controller('admin')
export class AdminController {
  constructor(private AdminService: AdminService) {}

//   @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Identify a device by MAC Address',
    description: 'lorem ipsum',
  })
  @Get('/devices/:macAddress')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: GetDeviceByMacDto,
  })
  @ApiNotFoundResponse({
    description:'Not found',
    type: DeviceNotFoundResponseBody
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async getDeviceByMac(@Param() macAddress: DeviceMacDTO) {
    const checkDevice = await this.AdminService.checkDeviceByMac(macAddress);
    return {
        status: 'success',
        message: 'You have successfully connected to the device',
      };
  }
}
