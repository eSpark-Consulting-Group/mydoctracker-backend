import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  AddTelemetryDTO,
  DeviceMacDTO,
  AddGeofenceDTO,
  EditGeofenceDTO,
  FakeDeviceDTO,
} from './dto/device-dto';
import { ApiKeyAuthGuard } from 'src/auth/guard/apikey-auth.guard';
import { JwtGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/User.entity';
import { DeviceAuthGuard } from 'src/auth/guard/device-auth-guard';
import { CurrentDevice } from 'src/utils/decorators/current-device';
import { DeviceInventory } from 'src/entities/DeviceInventory.entity';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}
  @ApiOperation({
    summary: 'Get All Firwares List',
  })
  @Get('firmware/list')
  @HttpCode(200)
  async getFirmwaresList() {
    const data = await this.deviceService.getFirmwaresList();
    return {
      data,
      status: 'success',
      message: 'Latest firmware has been fetched!',
    };
  }

  @ApiSecurity('key')
  @ApiOperation({
    summary: 'Get Latest Firware Version',
  })
  @UseGuards(ApiKeyAuthGuard, DeviceAuthGuard)
  @Get('firmware/latest')
  @HttpCode(200)
  async getLatestFirmware(@Headers() headers: DeviceMacDTO) {
    const data = await this.deviceService.getLatestFirmware();
    return {
      data,
      status: 'success',
      message: 'Latest firmware has been fetched!',
    };
  }

  @ApiSecurity('key')
  @ApiOperation({
    summary: 'Send device telemetry',
  })
  @UseGuards(ApiKeyAuthGuard, DeviceAuthGuard)
  @Post('telemetry')
  @HttpCode(200)
  async addTelemetry(
    @Body() reqData: AddTelemetryDTO,
    @CurrentDevice() device: DeviceInventory,
    @Headers() headers: DeviceMacDTO,
  ) {
    await this.deviceService.addTelemetry(reqData, device);
    return {
      status: 'success',
      message: 'Telemetry has been added!',
    };
  }

  @ApiSecurity('key')
  @ApiOperation({
    summary: 'Get device info using macAdress',
  })
  @UseGuards(ApiKeyAuthGuard, DeviceAuthGuard)
  @Post('info')
  @HttpCode(200)
  async getDeviceInfo(
    @Headers() headers: DeviceMacDTO,
    @CurrentDevice() device: DeviceInventory,
  ) {
    const data = await this.deviceService.getDeviceInfo(device);
    return {
      data,
      status: 'success',
      message: 'Device has been fetched!',
    };
  }

  @ApiSecurity('key')
  @ApiOperation({
    summary: 'Create a fake device',
  })
  @UseGuards(ApiKeyAuthGuard)
  @Post('fake/:macaddress')
  @HttpCode(200)
  async addFakeDevice(
    @Param() param: DeviceMacDTO,
    @Body() reqData: FakeDeviceDTO,
  ) {
    const data = await this.deviceService.addFakeDevice(
      param.macaddress,
      reqData,
    );
    return {
      data,
      status: 'success',
      message: 'Fake Device has been added!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create geofence for device using Document ID',
  })
  @UseGuards(JwtGuard)
  @Post('geofence/:documentId')
  @HttpCode(200)
  @ApiParam({
    name: 'documentId',
    example: '',
  })
  async createGeofence(
    @Param() params: { documentId: string },
    @CurrentUser() user: Users,
    @Body() reqData: AddGeofenceDTO,
  ) {
    const data = await this.deviceService.createGeofence(
      user,
      params.documentId,
      reqData,
    );
    return {
      data,
      status: 'success',
      message: 'Geofence has been created!',
    };
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit geofence using Document ID and Geofence ID',
  })
  @UseGuards(JwtGuard)
  @Put('geofence/:documentId')
  @HttpCode(200)
  @ApiParam({
    name: 'documentId',
    example: '',
  })
  async editGeofence(
    @Param() params: { documentId: string },
    @CurrentUser() user: Users,
    @Body() reqData: EditGeofenceDTO,
  ) {
    const data = await this.deviceService.editGeofence(
      user,
      { documentId: params.documentId, geofenceId: reqData.geofenceId },
      reqData,
    );
    return {
      data,
      status: 'success',
      message: 'Geofence has been edited!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all geofences using Document ID',
  })
  @UseGuards(JwtGuard)
  @Get('geofence/:documentId')
  @HttpCode(200)
  @ApiParam({
    name: 'documentId',
    example: '',
  })
  async getAllGeofences(
    @Param() params: { documentId: string },
    @CurrentUser() user: Users,
  ) {
    const data = await this.deviceService.getAllGeofences(
      user,
      params.documentId,
    );
    return {
      data,
      status: 'success',
      message: 'Geofences have been fetched!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete geofence using Document ID and Geofence ID',
  })
  @UseGuards(JwtGuard)
  @Delete('geofence/:documentId/:geofenceId')
  @HttpCode(200)
  @ApiParam({
    name: 'documentId',
    example: '',
  })
  @ApiParam({
    name: 'geofenceId',
    example: '',
  })
  async deleteGeofence(
    @Param() params: { documentId: string; geofenceId: string },
    @CurrentUser() user: Users,
  ) {
    await this.deviceService.deleteGeofence(user, params);
    return {
      status: 'success',
      message: 'Geofence has been deleted!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get single geofence using Document ID and Geofence ID',
  })
  @UseGuards(JwtGuard)
  @Get('geofence/:documentId/:geofenceId')
  @HttpCode(200)
  @ApiParam({
    name: 'documentId',
    example: '',
  })
  @ApiParam({
    name: 'geofenceId',
    example: '',
  })
  async getGeofenceById(
    @Param() params: { documentId: string; geofenceId: string },
    @CurrentUser() user: Users,
  ) {
    const data = await this.deviceService.getGeofenceByID(user, params);
    return {
      data,
      status: 'success',
      message: 'Geofence has been fetched!',
    };
  }
}
