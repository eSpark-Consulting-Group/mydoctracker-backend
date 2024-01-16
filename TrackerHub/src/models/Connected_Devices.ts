import { Schema, model } from "mongoose";
const { Types } = Schema;

const ConnectDevicesScehma = new Schema({
    deviceId: {
        type: Types.String,
        unique: true,
        required: true,
    },
    state: {
        type: Types.String,
        required: true,
        enum: ["moving", "idle"]
    },
    status: {
        type: Types.Boolean,
        default: true
    }
});

const DeviceModel = model("connected_device", ConnectDevicesScehma)

export default DeviceModel