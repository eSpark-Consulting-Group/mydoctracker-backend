import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum DeviceStates {
  moving = 'moving',
  idle = 'idle',
}

export type DeviceTelemetryDocument = DeviceTelemtry & Document;

@Schema({ collection: 'device_telemetry' })
export class DeviceTelemtry {
  @Prop({ required: true })
  deviceId: string;
  @Prop({ required: true, max: 90, min: -90 })
  lat: number;
  @Prop({ required: true, max: 180, min: -180 })
  lng: number;
  @Prop({ required: true, default: Date.now() })
  sentAt: Date;
  @Prop({ required: true, enum: DeviceStates })
  state: string;
  @Prop({ required: true })
  nextUpdateAt: number;
}
export const DeviceTelemetrySchema =
  SchemaFactory.createForClass(DeviceTelemtry);
