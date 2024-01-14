import axios from "axios";
import express, { Express, NextFunction, } from "express";
import { Socket } from "socket.io";
const dotenv = require('dotenv');
var cors = require('cors');

dotenv.config();
const { Server } = require("socket.io");
const http = require('http');
const app: Express = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5500', // Update with your React app's URL
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const port = process.env.PORT || 24214;



app.use(cors({
    origin: 'http://127.0.0.1:5500', // Update with your React app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


io.use(async (socket: Socket, next: NextFunction) => {
    const macAddress = socket.handshake.auth.macAddress;
    let err;
    if (!macAddress) {
        err = new Error("Please provide macAdrress");
        next(err);
        return;
    } else {
        try {
            const response = await axios.get(`${process.env.APP_URL}/api/admin/devices/${macAddress}`)
            next();
        } catch (error) {
            err = new Error("Authentication failed")
            console.log(error)
            next(err)
        }
    }
});

io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

server.listen(port, () => {
    console.log(`TrackerHub service listening on port ${port}`)
})
