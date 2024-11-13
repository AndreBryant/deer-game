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

	createRoom(gameID: string) {
		this.rooms[gameID] = {
			players: 0,
			mapData: new Map(),
			isGameStarted: false,
			gameStartTime: 0
		};
	}

	startGame(gameID: string) {
		if (this.rooms[gameID]) this.rooms[gameID].isGameStarted = true;
		console.log('Room Manager: Game Started', gameID);

		this.intervals[gameID] = setInterval(() => console.log('update_Map'), 5000);
	}

	endGame(gameID: string) {
		if (this.rooms[gameID]) this.rooms[gameID].isGameStarted = false;
		clearInterval(this.intervals[gameID]);
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

	decreaseSafeZone(gameID: string) {
		console.log('game map safezone decreased', gameID);
		// TODO
		// get map safeBoundary
		// decrease
		// client handles red zone textures
	}
}
