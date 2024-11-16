import { Server, Socket } from 'socket.io';
import { PlayerManager } from './PlayerManager.js';
import { RoomManager } from './RoomManager.js';
import { Player, PLAYER_HIT_RADIUS } from '../Player.js';
import { getRandomColor } from '../palette.js';
import { MAP_HEIGHT, MAP_WIDTH, TILESIZE } from '../Map.js';

export class GameServer {
	private io: Server;
	private playerManager = new PlayerManager();
	private roomManager = new RoomManager();

	constructor(io: Server) {
		this.io = io;
	}

	handleConnection(socket: Socket) {
		this.io.emit('rooms_updated', this.roomManager.getRooms());

		socket.on('create_room', (data) => this.handleCreateRoom(socket, data));
		socket.on('join_room', (data) => this.handleJoinRoom(socket, data));
		socket.on('disconnect', () => this.handleDisconnect(socket));

		// All throughout the game
		socket.on('player_key_input', (data) => this.handleKeyInput(socket, data));

		// Start Game
		socket.on('start_game', (data) => this.handleStartGame(socket, data));
	}

	broadcastAllUpdates() {
		const rooms = this.roomManager.getRooms();
		for (const room in rooms) {
			this.broadcastPlayerUpdates(room);

			if (this.roomManager.getRoom(room)!.isGameStarted) {
				this.roomManager.updateRoom(room, this.io);
			}
		}
	}

	private handleCreateRoom(socket: Socket, data: { gameID: string; username: string }) {
		this.roomManager.createRoom(data.gameID);
		this.joinRoom(socket, data.gameID, true, data.username);
	}

	private handleJoinRoom(socket: Socket, data: { username?: string; gameID: string }) {
		if (
			!this.roomManager.roomExists(data.gameID) ||
			this.roomManager.getRoom(data.gameID)?.isGameStarted
		) {
			socket.emit('kicked_from_room', true);
			return;
		}
		this.joinRoom(socket, data.gameID, false, data.username);
		this.io.to(data.gameID).emit('specific_room_updated', this.roomManager.getRoom(data.gameID));
	}

	private handleDisconnect(socket: Socket) {
		const player = this.playerManager.getPlayer(socket.id);
		if (!player) return;

		const gameID = player.room;

		if (player.isHost) {
			const players = this.playerManager.getPlayersInRoom(player.room);

			for (const pl in players) {
				this.playerManager.removePlayer(pl);
				this.roomManager.leaveRoom(gameID);
				this.io.to(players[pl].id).emit('kicked_from_room', true);
			}

			if (this.roomManager.isGameStarted(gameID)) {
				this.roomManager.endGame(gameID, this.io);
			}
		} else {
			this.playerManager.removePlayer(socket.id);
			this.roomManager.leaveRoom(gameID);
		}

		if (this.roomManager.getRoom(player.room)?.players === 0) {
			this.roomManager.removeRoom(player.room);
		}

		this.io.emit('rooms_updated', this.roomManager.getRooms());
		this.io.to(player.room).emit('specific_room_updated', this.roomManager.getRoom(player.room));
		console.log(socket.id + ' disconnected.');
	}

	private handleStartGame(socket: Socket, data: { gameID: string }) {
		if (this.roomManager.getRoom(data.gameID)!.players < 2) {
			this.io.to(data.gameID).emit('game_started', { gameStarted: false });
			this.io
				.to(data.gameID)
				.emit('toast_notification', { message: 'Must have at least 2 players to start game...' });
			return;
		} else {
			this.roomManager.startGame(data.gameID, this.io);
			this.playerManager.randomizePlayersPositions(
				this.roomManager.getSafeZoneBoundary(data.gameID)
			);
			this.io.emit('rooms_updated', this.roomManager.getRooms());
			this.io.to(data.gameID).emit('game_started', {
				gameStarted: true,
				gameStartTime: this.roomManager.getRoom(data.gameID)!.gameStartTime,
				gameDuration: this.roomManager.getGameDuration()
			});
		}
	}

	private handleKeyInput(
		socket: Socket,
		data: { gameID: string; keyStates: { [key: string]: boolean } }
	) {
		this.playerManager.updateKeyStates(socket.id, data.gameID, data.keyStates);
		this.playerManager.handleMovement(socket.id);
		this.playerManager.handleActions(
			this.io,
			socket.id,
			this.roomManager.isGameStarted(data.gameID),
			data.gameID
		);
	}

	private broadcastPlayerUpdates(gameID: string) {
		const room = this.roomManager.getRoom(gameID);
		const safeZoneBoundary = room!.mapData.safeZoneBoundary;
		this.playerManager.updatePlayers(
			this.io,
			gameID,
			this.roomManager.isGameStarted(gameID),
			safeZoneBoundary
		);
		const playersInRoom = this.playerManager.getPlayersInRoom(gameID);
		this.io.to(gameID).emit('player_updated', { players: playersInRoom, timestamp: Date.now() });
	}

	private joinRoom(socket: Socket, gameID: string, isHost = false, username?: string) {
		const maxX = (MAP_WIDTH - 8) * TILESIZE - PLAYER_HIT_RADIUS;
		const minX = 8 * TILESIZE + PLAYER_HIT_RADIUS;
		const x = Math.floor(Math.random() * (maxX - minX) + minX);

		const maxY = (MAP_HEIGHT - 8) * TILESIZE - PLAYER_HIT_RADIUS;
		const minY = 8 * TILESIZE + PLAYER_HIT_RADIUS;
		const y = Math.floor(Math.random() * (maxY - minY) + minY);

		const player = new Player(
			socket.id,
			gameID,
			isHost,
			username && username.trim() !== '' ? username : 'Andre cute >.<',
			x,
			y,
			getRandomColor()
		);

		this.playerManager.addPlayer(player);
		this.roomManager.joinRoom(gameID);
		socket.join(gameID);

		this.io.emit('rooms_updated', this.roomManager.getRooms());
		this.io.to(gameID).emit('player_connected', this.roomManager.getRoom(gameID));
		this.io.to(gameID).emit('map_generated', {
			mapData: this.roomManager.getRoom(gameID)?.mapData.tiles,
			height: this.roomManager.getRoom(gameID)?.mapData.height,
			width: this.roomManager.getRoom(gameID)?.mapData.width,
			tileSize: this.roomManager.getRoom(gameID)?.mapData.tileSize
		});

		const playersInRoom = this.playerManager.getPlayersInRoom(gameID);
		const playerIDs = Object.keys(playersInRoom);
		this.io.to(gameID).emit('player_joined', { playerIDs });
		this.broadcastPlayerUpdates(gameID);
	}
}
