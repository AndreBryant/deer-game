import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import {
	handleCreateRoom,
	handleJoinRoom,
	handleDisconnect,
	handleKeyInput,
	rooms
} from './build/lib/handlers/socketHandlers.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*', // for now, all reqs are allowed
		methods: ['GET', 'POST']
	}
});

io.on('connection', (socket) => {
	console.log(`${socket.id} connected.`);

	io.emit('rooms_updated', rooms);

	socket.on('create_room', (data) => handleCreateRoom(io, socket, data));
	socket.on('join_room', (data) => handleJoinRoom(io, socket, data));
	socket.on('disconnect', () => handleDisconnect(io, socket));

	socket.on('player_key_input', (data) => handleKeyInput(io, socket, data));
});

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;

server.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
