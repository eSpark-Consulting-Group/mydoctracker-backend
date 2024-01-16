import axios from "axios";
import { Response, Request } from "express";
import deviceService from "../../services/device.service";

class DeviceController {
    async updateTelemetry(req: Request, res: Response) {

        try {
            const { macAddress } = req.params;
            const { state, lng, lat } = req.body
            let response: any;
            try {
                response = await axios.get(`${process.env.APP_URL}/admin/devices/${macAddress}`)
            } catch (error: any) {
                if (error.response) {
                    return res.status(400).json(error.response.data)
                } else {
                    res.status(500).json({ messsage: "Internal server error!" })
                }
            }
            await deviceService.addDevice({ deviceId: response.data.data.id, state, lng, lat });
            res.json({ message: "Telemetry updated!" })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }

    }
}
const deviceController = new DeviceController();
export default deviceController