import { type ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { Player } from './player';
import { getRandomColor } from './palette';

export const webSocketServer = {
	name: 'websocket',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;
		const io = new Server(server.httpServer);

		const players: { [key: string]: Player } = {};

		io.on('connection', (socket) => {
			console.log(socket.id + ' connected.');
			const x = Math.floor(Math.random() * (600 - 20 + 1)) + 20;
			const y = Math.floor(Math.random() * (600 - 20 + 1)) + 20;

			players[socket.id] = new Player(socket.id, socket.id, x, y, getRandomColor());

			io.emit('player_connected', players);

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

		const updateInterval = 1000 / 60;
		setInterval(() => {
			for (const id in players) {
				players[id].update(600, 600);
			}
			// Add Timestamp then get the time difference
			io.emit('player_updated', players);
		}, updateInterval);
	}
};
