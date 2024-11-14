import { Server } from 'socket.io';
import { Map } from '../map.js';

interface Room {
	players: number;
	mapData: Map;
	isGameStarted: boolean;
	gameStartTime: number;
}

export class RoomManager {
	private rooms: { [key: string]: Room } = {};
	private intervals: { [key: string]: NodeJS.Timeout } = {};
	private safeZoneDecreaseTime: number = 30000;
	private minMapSize: number = 40;
	private gameDuration: number = 300000;

	createRoom(gameID: string) {
		this.rooms[gameID] = {
			players: 0,
			mapData: new Map(),
			isGameStarted: false,
			gameStartTime: 0
		};
	}

	startGame(gameID: string, io: Server) {
		if (this.rooms[gameID]) {
			this.rooms[gameID].gameStartTime = Date.now();
			this.rooms[gameID].isGameStarted = true;
			// initial decrease in safezone so that players wont take damage before game starts
			this.rooms[gameID].mapData.decreaseSafeZone();
		}
		console.log('Room Manager: Game Started', gameID);
		this.startInterval(gameID, io);
	}

	endGame(gameID: string) {
		const room = this.rooms[gameID];
		if (room) {
			room.isGameStarted = false;
		}

		if (this.intervals[gameID]) this.stopInterval(this.intervals[gameID]);
	}

	private startInterval(gameID: string, io: Server) {
		this.intervals[gameID] = setInterval(() => {
			const safeZoneBoundary = this.decreaseSafeZone(gameID);
			if (safeZoneBoundary <= this.minMapSize) {
				this.stopInterval(this.intervals[gameID]);
			}
			if (io) io.to(gameID).emit('safe_zone_updated', { safeZoneBoundary });
		}, this.safeZoneDecreaseTime);
	}

	private stopInterval(interval: NodeJS.Timeout) {
		clearInterval(interval);
	}

	isGameStarted(gameID: string): boolean {
		return this.rooms[gameID].isGameStarted;
	}

	joinRoom(gameID: string) {
		if (this.rooms[gameID]) this.rooms[gameID].players++;
	}

	leaveRoom(gameID: string) {
		if (this.rooms[gameID]) this.rooms[gameID].players--;
	}

	removeRoom(gameID: string) {
		delete this.rooms[gameID];
	}

	getRoom(gameID: string): Room | undefined {
		return this.rooms[gameID];
	}

	roomExists(gameID: string): boolean {
		return !!this.rooms[gameID];
	}

	getRoomData(gameID: string): Room {
		return this.rooms[gameID];
	}

	getRooms(): { [key: string]: Room } {
		return this.rooms;
	}

	getSafeZoneBoundary(gameID: string) {
		return this.rooms[gameID].mapData.safeZoneBoundary;
	}

	decreaseSafeZone(gameID: string) {
		console.log('game map safezone decreased', gameID);
		return this.rooms[gameID].mapData.decreaseSafeZone();
	}

	getGameDuration() {
		return this.gameDuration;
	}

	private broadcastToastNotification(io: Server) {
		// TODO
		// Example: x was slain by y
		// or x stayed too long in the danger zone
		// you can add random messages here if you want
	}
}
