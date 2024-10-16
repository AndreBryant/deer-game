import { type ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import {
	handleCreateRoom,
	handleJoinRoom,
	handleDisconnect,
	broadcastPlayerUpdates,
	rooms
} from './lib/handlers/socketHandlers';

export const webSocketServer = {
	name: 'websocket',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;
		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			console.log(socket.id + ' connected.');

			io.emit('rooms_updated', rooms);
			socket.on('create_room', (data) => handleCreateRoom(io, socket, data));
			socket.on('join_room', (data) => handleJoinRoom(io, socket, data));
			socket.on('disconnect', () => handleDisconnect(io, socket));
		});

		setInterval(() => broadcastPlayerUpdates(io), 1000 / 60);
	}
};
