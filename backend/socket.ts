import { type ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { GameServer } from './lib/managers/GameServer.js';

export const webSocketServer = {
	name: 'websocket',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);
		const gameServer = new GameServer(io);

		io.on('connection', (socket) => {
			console.log(socket.id + ' connected.');
			gameServer.handleConnection(socket);
		});

		setInterval(() => {
			gameServer.broadcastAllUpdates();
		}, 1000 / 60);
	}
};
