import DeviceModel from "../models/Connected_Devices";
import TelemetryModel from "../models/Device_Telemetry";

class DeviceService {
    getDevice(deviceId: string) {
        return DeviceModel.findOne({ deviceId });
    }
    async addDevice({ deviceId, state, lat, lng }: { deviceId: string; state: string; lat: string; lng: string }) {
        const device = await this.getDevice(deviceId);
        if (!device) {
            const newDevice = new DeviceModel({ deviceId, state })
            await newDevice.save()
        } else {
            device.status = true;
            await device.save()
        }
        const telemetry = new TelemetryModel({ deviceId, lat, lng });
        await telemetry.save()
    }
}
const deviceService = new DeviceService()
export default deviceService
