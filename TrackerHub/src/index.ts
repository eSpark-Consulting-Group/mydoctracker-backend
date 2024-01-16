import axios from 'axios';
import express, { Express, NextFunction } from 'express';
import { Socket } from 'socket.io';
import connectDB from './db';
import router from './router';
import backgroundService from './services/background.service';
const dotenv = require('dotenv');
var cors = require('cors');

dotenv.config();

connectDB();

const { Server } = require('socket.io');
const http = require('http');
const app: Express = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// const io = new Server(server);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500', // Update with your React app's URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const port = process.env.PORT || 24214;

// app.use(
//   cors({
//     origin: 'http://127.0.0.1:5500', // Update with your React app's URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   }),
// );

interface SocketData extends Socket {
  device: {} | undefined;
}

// io.use(async (socket: SocketData, next: NextFunction) => {
//   const macAddress = socket.handshake.auth.macAddress;
//   let err;
//   if (!macAddress) {
//     err = new Error('Please provide macAdrress');
//     next(err);
//     return;
//   }
//   const macAddRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
//   if (!macAddRegex.test(macAddress)) {
//     err = new Error('Inavalid macAdrress format');
//     next(err);
//     return;
//   }
//   try {
//     const response = await axios.get(
//       `${process.env.APP_URL}/admin/devices/${macAddress}`,
//     );
//     socket.device = response.data;
//     console.log(response.data)
//     next();
//   } catch (error: any) {
//     err = new Error('Authentication failed!');
//     if (error.response) {
//       console.log(error.response);
//     }
//     else {
//       console.log(error.request)
//     }
//     next(err);
//   }

// });

// io.on('connection', (socket: Socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('a user disconnected');
//   });
// });




app.use("/api", router);

server.listen(port, () => {
  console.log(`⚡ TrackerHub service listening on port ${port} ⚡`);
  backgroundService.run()
});
