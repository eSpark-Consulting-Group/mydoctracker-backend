import DeviceModel from "../models/Connected_Devices";
import TelemetryModel from "../models/Device_Telemetry";

class BackgroundService {
    async run() {
        try {
            const devices = await DeviceModel.find({ status: true });

            for (let i = 0; i < devices.length; i++) {
                const device = devices[i]
                const currentTime = new Date();
                const telemetry = await TelemetryModel.findOne({ deviceId: device.deviceId }, {}, { sort: { sentAt: -1 } });
                if (telemetry) {
                    const sentAt = telemetry.sentAt;
                    const timeDifference = +currentTime - +sentAt;
                    const twentyfourHours = 24 * 60 * 60 * 1000;
                    const fortyFiveMinutes = 45 * 60 * 1000
                    if (device.state === "moving" && timeDifference > fortyFiveMinutes) {
                        device.status = false;
                        await device.save()
                    } else if (device.state === "idle" && timeDifference >= twentyfourHours) {
                        device.status = false;
                        await device.save()
                    }
                }
            }
        } catch (error) {
            console.log("ERROR IN BACKGROUND SERVICE ==>>", error)
        }
        // this.run()
    }
}
const backgroundService = new BackgroundService()
export default backgroundService
