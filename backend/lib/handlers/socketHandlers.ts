import { Server, Socket, type DefaultEventsMap } from 'socket.io';
import { Player } from '../player';
import { getRandomColor } from '../palette';

interface Room {
	players: number;
	mapData: string;
}

const players: { [key: string]: Player } = {};
export const rooms: { [key: string]: Room } = {};

export function handleCreateRoom(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	data: { gameID: string }
) {
	console.log('room created', data.gameID);

	players[socket.id] = createPlayer(socket.id, data.gameID, true);
	rooms[data.gameID] = { players: 1, mapData: '' };

	socket.join(data.gameID);
	io.emit('rooms_updated', rooms);

	const roomPlayers = Object.values(players).filter((p) => p.room === data.gameID);
	io.to(data.gameID).emit('player_connected', roomPlayers);
}

export function handleJoinRoom(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	data: { gameID: string }
) {
	players[socket.id] = createPlayer(socket.id, data.gameID, false);
	rooms[data.gameID].players++;

	socket.join(data.gameID);
	io.emit('rooms_updated', rooms);

	const roomPlayers = Object.values(players).filter((p) => p.room === data.gameID);
	io.to(data.gameID).emit('player_connected', roomPlayers);
}

export function handleDisconnect(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket
) {
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
				rooms[player.room].players--;
			}
		}
		io.emit('rooms_updated', rooms);

		delete players[socket.id];
	}
}

export function broadcastPlayerUpdates(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
	for (const {} in players) {
		// players[id].update(600, 600);
	}
	io.emit('player_updated', { players, timestamp: new Date().getTime() });
}

function createPlayer(socketID: string, gameID: string, isHost = false, username = 'Host') {
	const x = Math.floor(Math.random() * (600 - 20 + 1)) + 20;
	const y = Math.floor(Math.random() * (600 - 20 + 1)) + 20;

	return new Player(socketID, gameID, isHost, username, x, y, getRandomColor());
}
