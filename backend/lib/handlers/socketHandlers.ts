import { Server, Socket } from 'socket.io';
import { Player, PLAYER_HIT_RADIUS } from '../Player.ts';
import { Map, MAP_HEIGHT, MAP_WIDTH, TILESIZE } from '../map';
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
		let isMoving = false;

		if (keyStates[roomID][player]['up']) {
			p.updateY(true);
			isMoving = true;
		}
		if (keyStates[roomID][player]['down']) {
			p.updateY(false);
			isMoving = true;
		}
		if (keyStates[roomID][player]['left']) {
			p.updateX(true);
			isMoving = true;
		}
		if (keyStates[roomID][player]['right']) {
			p.updateX(false);
			isMoving = true;
		}

		if (!isMoving) {
			if (p.action === 'eat_grass' && p.actionEndTime && p.actionEndTime > new Date().getTime()) {
				// DO nothing
			} else {
				if (Math.random() < 0.001) {
					p.action = 'eat_grass';
					p.actionEndTime = new Date().getTime() + 1000;
				} else {
					p.action = 'idle';
				}
			}
		} else {
			p.action = 'walk';
			p.actionEndTime = null;
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

function createPlayer(
	socketID: string,
	gameID: string,
	isHost = false,
	username = 'Host',
	roomID: string
) {
	const x = Math.floor(Math.random() * (MAP_WIDTH * TILESIZE - PLAYER_HIT_RADIUS + 1));
	const y = Math.floor(Math.random() * (MAP_HEIGHT * TILESIZE - PLAYER_HIT_RADIUS + 1));
	return new Player(
		socketID,
		gameID,
		isHost,
		username,
		x,
		y,
		getRandomColor(),
		rooms[roomID].mapData
	);
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
	players[socket.id] = createPlayer(socket.id, gameID, isHost, username, gameID);
	if (!isHost) {
		rooms[gameID].players++;
	}
	socket.join(gameID);
	io.emit('rooms_updated', rooms);

	initializeKeyState(gameID, socket.id);

	const roomplayers = filterPlayersByRoom(players, gameID);

	io.to(gameID).emit('player_connected', roomplayers);
	io.to(gameID).emit('map_generated', {
		mapData: rooms[gameID].mapData.tiles,
		height: rooms[gameID].mapData.height,
		width: rooms[gameID].mapData.width,
		tileSize: rooms[gameID].mapData.tileSize
	});
}
