// import express from 'express';
// import { Server } from 'socket.io';
// import http from 'http';
// import { GameServer } from './build/managers/GameServer.js';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
// 	cors: {
// 		origin: '*', // for now, all reqs are allowed
// 		methods: ['GET', 'POST']
// 	}
// });

// const gameServer = new GameServer(io);

// io.on('connection', (socket) => {
// 	console.log(socket.id + ' connected.');
// 	gameServer.handleConnection(socket);
// });

// setInterval(() => {
// 	gameServer.broadcastAllPlayerUpdates();
// }, 1000 / 60);

// const HOST = '10.103.7.248';
// const PORT = process.env.PORT || 3000;

// server.listen(PORT, HOST, () => {
// 	console.log(`Server is running on http://${HOST}:${PORT}`);
// });
