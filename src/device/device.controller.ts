import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { DeviceService } from './device.service';
import { ApiExcludeEndpoint, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DeviceMacDTO } from 'src/users/dto/device-dto';
import { DeviceNotFoundResponseBody, ErrorResponseBody, NotFoundResponseBody } from 'src/utils/APIResponse';
import * as device from 'express-device';
import { GetDeviceByMacResponseDto } from './dto/response-dto';

@Controller('/admin/devices')
export class DeviceController {
  constructor(private AdminService: DeviceService) { }

  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Identify a device by MAC Address',
    description: 'Retrieves device information based on the specified MAC address. Accepts a "DeviceMacDTO" containing the MAC address for identification. Utilizes the "AdminService.checkDeviceByMac" method to validate and fetch device details. Responds with "data" representing the device information upon successful connection. "status" indicates the success of the operation, and "message" provides a confirmation. This endpoint is essential for querying and establishing connections with specific devices.',
  })
  @Get(':macAddress')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: GetDeviceByMacResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: DeviceNotFoundResponseBody
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async getDeviceByMac(@Param() macAddress: DeviceMacDTO) {
    const device = await this.AdminService.checkDeviceByMac(macAddress);
    return {
      data: device,
      status: 'success',
      message: 'Device has been fetched successfully!',
    };
  }
}
