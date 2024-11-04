import { Server, Socket } from 'socket.io';
import { Player, PLAYER_HIT_RADIUS } from '../Player';
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
				delete rooms[player.room];
				io.emit('rooms_updated', rooms);
				for (const p in playersInRoom) {
					io.to(playersInRoom[p].id).emit('kicked_from_room', true);
				}
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
	// console.log('received key input from', socket.id, data.keyStates);
	if (!keyStates[data.gameID]) {
		return;
	}
	keyStates[data.gameID][socket.id] = data.keyStates;
	broadcastPlayerUpdates(io, data.gameID);
}

export function broadcastPlayerUpdates(io: Server, roomID: string) {
	updatePlayers(roomID);
	for (const playerId in players) {
		const player = players[playerId];
		if (player.room !== roomID) continue;

		handleMovement(player);
		handleActions(player);
	}

	const ps = filterPlayersByRoom(players, roomID);
	io.to(roomID).emit('player_updated', {
		players: ps,
		timestamp: new Date().getTime()
	});
}

function updatePlayers(roomID: string) {
	const ps = filterPlayersByRoom(players, roomID);
	for (const player in ps) {
		players[player].update();
	}
}

function handleMovement(player: Player) {
	const keys = keyStates[player.room][player.id];

	if (keys.up) {
		player.updateY(true);
	}
	if (keys.down) {
		player.updateY(false);
	}
	if (keys.left) {
		player.updateX(true);
	}
	if (keys.right) {
		player.updateX(false);
	}
}

function handleActions(player: Player) {
	const keys = keyStates[player.room][player.id];
	const isMoving = Object.values(keys).some((state) => state === true);
	if (!isMoving) {
		if (
			player.action !== 'eat_grass' ||
			!player.actionEndTime ||
			player.actionEndTime <= Date.now()
		) {
			if (Math.random() < 0.001) {
				player.action = 'eat_grass';
				player.actionEndTime = Date.now() + 1000;
			} else {
				player.action = 'idle';
			}
		}
	} else {
		player.action = 'walk';
		player.actionEndTime = null;
	}

	if (keys['attack']) {
		performAttack(player);
	}
}

function performAttack(attacker: Player) {
	attacker.action = 'attack';
	attacker.actionEndTime = Date.now() + 5000;
	console.log(attacker.name, 'attacking');
	const ps = filterPlayersByRoom(players, attacker.room);
	for (const otherPlayerId in ps) {
		const target = ps[otherPlayerId];
		if (target.id !== attacker.id && isInAttackRange(attacker, target) && !target.invincible) {
			console.log('beofre', target.health);
			target.takeDamage(attacker.attack);
			console.log('after', target.health);
			target.invincible = true;
			target.invincibilityEndTime = Date.now() + 2000;
		}
	}
}

function isInAttackRange(attacker: Player, target: Player) {
	const attackRange = attacker.radius * 1.5;
	const distance = Math.sqrt(
		Math.pow(attacker.x - target.x, 2) + Math.pow(attacker.y - target.y, 2)
	);

	if (distance > attackRange) {
		return false;
	}
	const isFacingLeft = attacker.isFacingLeft;
	const inFront = isFacingLeft ? target.x < attacker.x : target.x > attacker.x;

	return inFront;
}

function createPlayer(
	socketID: string,
	gameID: string,
	isHost = false,
	username = 'Host',
	roomID: string
) {
	const x = Math.floor(Math.random() * ((MAP_WIDTH - 2) * TILESIZE - PLAYER_HIT_RADIUS + 1));
	const y = Math.floor(Math.random() * ((MAP_HEIGHT - 2) * TILESIZE - PLAYER_HIT_RADIUS + 1));

	if (username === 'Host' && !isHost) {
		username = '(>.~) andre cute<3';
	}

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
		right: false,
		attack: false
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
	if (!rooms[gameID]) {
		io.to(socket.id).emit('kicked_from_room', true);
		return;
	}
	players[socket.id] = createPlayer(socket.id, gameID, isHost, username, gameID);
	if (!isHost) {
		rooms[gameID].players++;
	}
	socket.join(gameID);
	io.emit('rooms_updated', rooms);

	initializeKeyState(gameID, socket.id);

	const roomplayers = filterPlayersByRoom(players, gameID);

	// done
	io.to(gameID).emit('player_connected', roomplayers);
	// done
	io.to(gameID).emit('map_generated', {
		mapData: rooms[gameID].mapData.tiles,
		height: rooms[gameID].mapData.height,
		width: rooms[gameID].mapData.width,
		tileSize: rooms[gameID].mapData.tileSize
	});
	broadcastPlayerUpdates(io, gameID);
}
