import { type ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { GameServer } from './lib/managers/GameServer.js';

// Vite plugin web socket server.
// Only used in development, but express server will be used in production as shown in ./server.js
export const webSocketServer = {
	name: 'websocket',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);
		const gameServer = new GameServer(io);

		// Socket Connection (Entry point to everything else, except the setinterval below haha)
		io.on('connection', (socket) => {
			console.log(socket.id + ' connected.');
			gameServer.handleConnection(socket);
		});

		// Main Update Loop in the Server.
		setInterval(() => {
			gameServer.broadcastAllUpdates();
		}, 1000 / 60);
	}
};
