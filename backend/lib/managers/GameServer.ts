import { Server, Socket } from 'socket.io';
import { PlayerManager } from './PlayerManager';
import { RoomManager } from './RoomManager';
import { Player, PLAYER_HIT_RADIUS } from '../Player';
import { getRandomColor } from '../palette';
import { MAP_HEIGHT, MAP_WIDTH, TILESIZE } from '../map';

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
		socket.on('player_key_input', (data) => this.handleKeyInput(socket, data));
		socket.on('disconnect', () => console.log(socket.id + ' disconnected.'));
	}

	private handleCreateRoom(socket: Socket, data: { gameID: string }) {
		this.roomManager.createRoom(data.gameID);
		this.joinRoom(socket, data.gameID);
	}

	private handleJoinRoom(socket: Socket, data: { username?: string; gameID: string }) {
		if (!this.roomManager.roomExists(data.gameID)) {
			socket.emit('kicked_from_room', true);
			return;
		}
		this.joinRoom(socket, data.gameID, false, data.username);
	}

	private handleDisconnect(socket: Socket) {
		const player = this.playerManager.getPlayer(socket.id);
		if (!player) return;

		this.playerManager.removePlayer(socket.id);
		this.roomManager.removeRoom(player.room);

		if (this.roomManager.getRoom(player.room)?.players === 0) {
			this.roomManager.removeRoom(player.room);
		}

		this.io.emit('rooms_updated', this.roomManager.getRooms());
	}

	private handleKeyInput(
		socket: Socket,
		data: { gameID: string; keyStates: { [key: string]: boolean } }
	) {
		this.playerManager.updateKeyStates(socket.id, data.gameID, data.keyStates);
		this.playerManager.handleMovement(socket.id);
		this.playerManager.handleActions(socket.id);
		this.broadcastPlayerUpdates(data.gameID);
	}

	private broadcastPlayerUpdates(gameID: string) {
		this.playerManager.updatePlayers(gameID);
		const playersInRoom = this.playerManager.getPlayersInRoom(gameID);
		this.io.to(gameID).emit('player_updated', { players: playersInRoom });
	}

	private joinRoom(socket: Socket, gameID: string, isHost = false, username?: string) {
		const x = Math.floor(Math.random() * ((MAP_WIDTH - 2) * TILESIZE - PLAYER_HIT_RADIUS + 1));
		const y = Math.floor(Math.random() * ((MAP_HEIGHT - 2) * TILESIZE - PLAYER_HIT_RADIUS + 1));

		const player = new Player(
			socket.id,
			gameID,
			isHost,
			username || (!isHost ? 'Host' : '(>.~) andre cute<3'), //it should be the other way around but this works so idk if i should change this
			x,
			y,
			getRandomColor()
			// this.roomManager.getRoomData(gameID)?.mapData
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

		this.broadcastPlayerUpdates(gameID);
	}
}
