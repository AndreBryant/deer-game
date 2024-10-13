import { type ViteDevServer } from 'vite';
import { Server } from 'socket.io';
import { Player } from './lib/player';
import { getRandomColor } from './lib/palette';

export const webSocketServer = {
	name: 'websocket',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;
		const io = new Server(server.httpServer);

		const players: { [key: string]: Player } = {};
		const rooms: { [key: string]: number } = {};

		io.on('connection', (socket) => {
			console.log(socket.id + ' connected.');

			io.emit('rooms_updated', rooms);

			// Host creates a room
			socket.on('create_room', (data) => {
				console.log('room created', data.gameID);

				players[socket.id] = createPlayer(socket.id, data.gameID, true);
				rooms[data.gameID] = 1;
				socket.join(data.gameID);
				io.emit('rooms_updated', rooms);
				// io.emit('player_connected', players);
			});

			// Some other player joins a room
			socket.on('join_room', (data) => {
				players[socket.id] = createPlayer(socket.id, data.gameID, false);
				rooms[data.gameID]++;
				socket.join(data.gameID);
				io.emit('rooms_updated', rooms);
				// io.emit('player_connected', players);
			});

			socket.on('disconnect', () => {
				console.log(`${socket.id} disconnected.`);

				const player = players[socket.id];

				if (player) {
					if (player.isHost) {
						const playersInRoom = Object.values(players).filter((p) => p.room === player.room);

						if (playersInRoom.length === 1) {
							console.log(`Host disconnected, deleting room: ${player.room}`);
							delete rooms[player.room];
						} else {
							// TODO kick everyone in the room and notify everyone that the host has disconnected
							console.log(`Host disconnected, but other players are still in the room.`);
							delete rooms[player.room];
							io.emit('rooms_updated', rooms);
						}
					} else {
						if (rooms[player.room]) {
							rooms[player.room]--;
						}
					}
					io.emit('rooms_updated', rooms);

					delete players[socket.id];
				}
			});

			socket.on('join_room', (data) => {
				socket.join(data.room);
				socket.to(data.room).emit('player_joined', players[socket.id]);
			});
		});

		// const updateInterval = 1000 / 60;
		// setInterval(() => {
		// 	for (const id in players) {
		// 		players[id].update(600, 600);
		// 	}
		// 	// Add Timestamp then get the time difference
		// 	io.emit('player_updated', players);
		// }, updateInterval);
	}
};

function createPlayer(socketID: string, gameID: string, isHost = false, username = 'Host') {
	const x = Math.floor(Math.random() * (600 - 20 + 1)) + 20;
	const y = Math.floor(Math.random() * (600 - 20 + 1)) + 20;

	return new Player(socketID, gameID, isHost, username, x, y, getRandomColor());
}
