import express, { Request, Response } from 'express';
import deviceController from './device.controller';

const router = express.Router();

router.post("/:macAddress", deviceController.updateTelemetry);

module.exports = router;