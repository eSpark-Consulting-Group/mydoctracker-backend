import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import {
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  DeviceNotFoundResponseBody,
  ErrorResponseBody,
} from 'src/utils/APIResponse';
import { AddTelemetryResponseDto } from './dto/response-dto';
import { AddTelemetryDTO, DeviceMacDTO } from './dto/device-dto';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}
  @ApiSecurity('key')
  @ApiOperation({
    summary: 'Send device telemetry',
  })
  @UseGuards(ApiKeyAuthGuard)
  @Post('telemetry/:macAddress')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successful response',
    type: AddTelemetryResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: DeviceNotFoundResponseBody,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseBody,
  })
  async addTelemetry(
    @Param() macAddress: DeviceMacDTO,
    @Body() reqData: AddTelemetryDTO,
  ) {
    await this.deviceService.addTelemetry(reqData, macAddress.macAddress);
    return {
      status: 'success',
      message: 'Telemetry has been added!',
    };
  }
  // @ApiOperation({
  //   summary: 'Identify a device by MAC Address',
  //   description:
  //     'Retrieves device information based on the specified MAC address. Accepts a "DeviceMacDTO" containing the MAC address for identification. Utilizes the "AdminService.checkDeviceByMac" method to validate and fetch device details. Responds with "data" representing the device information upon successful connection. "status" indicates the success of the operation, and "message" provides a confirmation. This endpoint is essential for querying and establishing connections with specific devices.',
  // })
  // @Get(':macAddress')
  // @HttpCode(200)
  // @ApiOkResponse({
  //   description: 'Successful response',
  //   type: GetDeviceByMacResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'Not found',
  //   type: DeviceNotFoundResponseBody,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: 'Internal server error',
  //   type: ErrorResponseBody,
  // })
  // async getDeviceByMac(@Param() macAddress: DeviceMacDTO) {
  //   const device = await this.deviceService.checkDeviceByMac(macAddress);
  //   return {
  //     data: device,
  //     status: 'success',
  //     message: 'Device has been fetched successfully!',
  //   };
  // }
}
