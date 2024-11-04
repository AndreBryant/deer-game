import { type ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { GameServer } from './lib/managers/GameServer';

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
	}
};
