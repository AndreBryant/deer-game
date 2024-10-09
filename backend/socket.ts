import { type ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { Player } from './player';

export const webSocketServer = {
	name: 'websocket',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;
		const io = new Server(server.httpServer);

		const players: { [key: string]: Player } = {};

		io.on('connection', (socket) => {
			console.log(socket.id + ' connected.');
			players[socket.id] = { id: socket.id };
			console.log(players);

			socket.on('disconnect', () => {
				console.log(socket.id + ' disconnected.');
				delete players[socket.id];
				console.log(players);
			});

			socket.on('join_room', (data) => {
				socket.join(data.room);
				socket.to(data.room).emit('player_joined', players[socket.id]);
			});
		});
	}
};
