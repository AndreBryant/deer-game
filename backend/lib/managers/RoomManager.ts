import { Map } from '../map';

interface Room {
	players: number;
	mapData: Map;
}

export class RoomManager {
	private rooms: { [key: string]: Room } = {};
	createRoom(gameId: string) {
		this.rooms[gameId] = {
			players: 0,
			mapData: new Map()
		};
	}

	joinRoom(gameId: string) {
		if (this.rooms[gameId]) this.rooms[gameId].players++;
	}

	leaveRoom(gameId: string) {
		if (this.rooms[gameId]) this.rooms[gameId].players--;
	}

	removeRoom(gameId: string) {
		delete this.rooms[gameId];
	}

	getRoom(gameId: string): Room | undefined {
		return this.rooms[gameId];
	}

	roomExists(gameId: string): boolean {
		return !!this.rooms[gameId];
	}

	getRoomData(gameId: string): Room {
		return this.rooms[gameId];
	}

	getRooms(): { [key: string]: Room } {
		return this.rooms;
	}
}
