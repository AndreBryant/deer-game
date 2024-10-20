import { Server, Socket } from 'socket.io';
import { Player } from '../player';
import { Map, MAP_HEIGHT, MAP_WIDTH } from '../map';
import { getRandomColor } from '../palette';

// TODO: make this a class or make a types.ts file idk
interface Room {
	players: number;
	mapData: Map;
}

const players: { [key: string]: Player } = {};
export const rooms: { [key: string]: Room } = {};
const keyStates: { [key: string]: { [key: string]: { [key: string]: boolean } } } = {};

export function handleCreateRoom(io: Server, socket: Socket, data: { gameID: string }) {
	console.log('room created', data.gameID);

	rooms[data.gameID] = { players: 1, mapData: new Map() };

	joinRoom(io, socket, data.gameID, true);
}

export function handleJoinRoom(
	io: Server,
	socket: Socket,
	data: {
		username: string | undefined;
		gameID: string;
	}
) {
	joinRoom(io, socket, data.gameID, false, data.username);
}

export function handleDisconnect(io: Server, socket: Socket) {
	console.log(`${socket.id} disconnected.`);

	const player = players[socket.id];

	if (player) {
		if (player.isHost) {
			const playersInRoom = filterPlayersByRoom(players, player.room);

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
	io: Server,
	socket: Socket,
	data: { gameID: string; keyStates: { [key: string]: boolean } }
) {
	keyStates[data.gameID][socket.id] = data.keyStates;
}

export function broadcastPlayerUpdates(io: Server) {
	for (const player in players) {
		const p = players[player];
		const roomID = p.room;
		const map = rooms[roomID].mapData;
		if (keyStates[roomID][player]['up']) {
			p.updateY(map.height, true);
		}
		if (keyStates[roomID][player]['down']) {
			p.updateY(map.height, false);
		}
		if (keyStates[roomID][player]['left']) {
			p.updateX(map.width, true);
		}
		if (keyStates[roomID][player]['right']) {
			p.updateX(map.width, false);
		}

		for (const room in rooms) {
			const ps = filterPlayersByRoom(players, room);
			io.to(room).emit('player_updated', {
				players: ps,
				timestamp: new Date().getTime()
			});
		}
	}
}

function createPlayer(socketID: string, gameID: string, isHost = false, username = 'Host') {
	const x = Math.floor(Math.random() * (MAP_WIDTH - 20 + 1));
	const y = Math.floor(Math.random() * (MAP_HEIGHT - 20 + 1));
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

function filterPlayersByRoom(players: { [key: string]: Player }, room: string) {
	return Object.values(players)
		.filter((p) => p.room === room)
		.reduce((acc: { [key: string]: Player }, player) => {
			acc[player.id] = player;
			return acc;
		}, {});
}

function joinRoom(io: Server, socket: Socket, gameID: string, isHost: boolean, username?: string) {
	players[socket.id] = createPlayer(socket.id, gameID, isHost, username);
	if (!isHost) {
		rooms[gameID].players++;
	}
	socket.join(gameID);
	io.emit('rooms_updated', rooms);

	initializeKeyState(gameID, socket.id);

	const roomplayers = filterPlayersByRoom(players, gameID);

	io.to(gameID).emit('player_connected', roomplayers);
	io.to(gameID).emit('map_generated', {
		mapData: rooms[gameID].mapData.tiles
	});
}
