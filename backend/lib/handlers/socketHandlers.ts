import { Server, Socket, type DefaultEventsMap } from 'socket.io';
import { Player } from '../player';
import { getRandomColor } from '../palette';

// TODO: make this a class or make a types.ts file idk
interface Room {
	players: number;
	mapData: string;
}

const players: { [key: string]: Player } = {};
export const rooms: { [key: string]: Room } = {};
const keyStates: { [key: string]: { [key: string]: { [key: string]: boolean } } } = {};

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

	// create keystates for player
	initializeKeyState(data.gameID, socket.id);

	const roomPlayers = Object.values(players)
		.filter((p) => p.room === data.gameID)
		.reduce((acc, player) => {
			acc[player.id] = player;
			return acc;
		}, {});
	io.to(data.gameID).emit('player_connected', roomPlayers);
}

export function handleJoinRoom(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	data: {
		username: string | undefined;
		gameID: string;
	}
) {
	players[socket.id] = createPlayer(socket.id, data.gameID, false, data.username);
	rooms[data.gameID].players++;

	socket.join(data.gameID);
	io.emit('rooms_updated', rooms);

	initializeKeyState(data.gameID, socket.id);

	const roomPlayers = Object.values(players)
		.filter((p) => p.room === data.gameID)
		.reduce((acc, player) => {
			acc[player.id] = player;
			return acc;
		}, {});
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
			const playersInRoom = Object.values(players)
				.filter((p) => p.room === player.room)
				.reduce((acc, player) => {
					acc[player.id] = player;
					return acc;
				}, {});

			if (Object.values(playersInRoom).length === 1) {
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

export function handleKeyInput(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	socket: Socket,
	data: { gameID: string; keyStates: { [key: string]: boolean } }
) {
	keyStates[data.gameID][socket.id] = data.keyStates;

	const ps = Object.values(players)
		.filter((p) => p.room === data.gameID)
		.reduce((acc, player) => {
			acc[player.id] = player;
			return acc;
		}, {});
	io.to(data.gameID).emit('player_updated', { players: ps, timestamp: new Date().getTime() });
}

export function broadcastPlayerUpdates(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
	for (const player in players) {
		const p = players[player];
		const roomID = p.room;
		if (keyStates[roomID][player]['up']) {
			p.updateY(600, true);
		}
		if (keyStates[roomID][player]['down']) {
			p.updateY(600, false);
		}
		if (keyStates[roomID][player]['left']) {
			p.updateX(600, true);
		}
		if (keyStates[roomID][player]['right']) {
			p.updateX(600, false);
		}

		for (const room in rooms) {
			// TODO: turn all to this
			const ps = Object.values(players)
				.filter((p) => p.room === room)
				.reduce((acc, player) => {
					acc[player.id] = player;
					return acc;
				}, {});
			io.to(room).emit('player_updated', { players: ps, timestamp: new Date().getTime() });
		}
	}
}

function createPlayer(socketID: string, gameID: string, isHost = false, username = 'Host') {
	const x = Math.floor(Math.random() * (600 - 20 + 1)) + 20;
	const y = Math.floor(Math.random() * (600 - 20 + 1)) + 20;

	return new Player(socketID, gameID, isHost, username, x, y, getRandomColor());
}

function initializeKeyState(room: string, player: string) {
	keyStates[room] = { ...keyStates[room] };
	keyStates[room][player] = {
		up: false,
		down: false,
		left: false,
		right: false
	};
}
