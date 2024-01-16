
import { Schema, model } from "mongoose";
const { Types } = Schema;

const Device_TelemetrySchema = new Schema({
    deviceId: {
        type: Types.String,
        required: true,
    },
    lat: {
        type: Types.String,
        required: true
    },
    lng: {
        type: Types.String,
        required: true
    },
    sentAt: {
        type: Types.Date,
        required: true,
        default: Date.now()
    },
});

const TelemetryModel = model("device_telemetry", Device_TelemetrySchema)

export default TelemetryModel