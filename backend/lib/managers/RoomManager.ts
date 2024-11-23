import { Server } from 'socket.io';
import { Map } from '../map.js';

interface Room {
	players: number;
	mapData: Map;
	isGameStarted: boolean;
	gameStartTime: number;
	isShowingResults: boolean;
}

export class RoomManager {
	private rooms: { [key: string]: Room } = {};
	private intervals: { [key: string]: NodeJS.Timeout } = {};
	private safeZoneDecreaseTime: number = 30000;
	private minMapSize: number = 40;
	private gameDuration: number = 300000;
	private showingResultsDuration: number = 10000;

	createRoom(gameID: string) {
		this.rooms[gameID] = {
			players: 0,
			mapData: new Map(),
			isGameStarted: false,
			gameStartTime: 0,
			isShowingResults: false
		};
	}

	startGame(gameID: string, io: Server) {
		if (this.rooms[gameID]) {
			// initial decrease in safezone so that players wont take damage before game starts
			this.rooms[gameID].mapData.decreaseSafeZone();

			this.rooms[gameID].gameStartTime = Date.now();
			this.rooms[gameID].isGameStarted = true;

			if (io) {
				io.to(gameID).emit('toast_notification', { type: 'info', message: 'Game Started!' });
			}
		}
		console.log('Room Manager: Game Started', gameID);

		const gameIntervalFn = () => {
			const safeZoneBoundary = this.decreaseSafeZone(gameID);
			if (safeZoneBoundary <= this.minMapSize) {
				this.stopInterval(this.intervals[gameID]);
			}

			if (io) {
				io.to(gameID).emit('safe_zone_updated', { safeZoneBoundary });
				io.to(gameID).emit('toast_notification', {
					type: 'warning',
					message: 'Safe Zone Boundary Decreased!'
				});
			}
		};
		this.startInterval(gameID, io, gameIntervalFn, this.safeZoneDecreaseTime);
	}

	endGame(gameID: string, io: Server) {
		const room = this.rooms[gameID];
		if (room) {
			room.isGameStarted = false;
		}

		if (io) {
			io.to(gameID).emit('game_ended', { gameStarted: false, gameFinished: true });

			io.to(gameID).emit('toast_notification', { type: 'info', message: 'Game Ended!' });

			room.mapData.resetSafeZone();
			io.to(gameID).emit('safe_zone_updated', { safeZoneBoundary: room.mapData.safeZoneBoundary });
		}

		if (this.intervals[gameID]) {
			this.stopInterval(this.intervals[gameID]);
		}

		console.log('Room Manager: Game Ended', gameID);
		// Show Results
		this.startShowResults(gameID, io);
	}

	startShowResults(gameID: string, io: Server) {
		const room = this.rooms[gameID];
		if (room) {
			room.isShowingResults = true;
		}

		if (io) {
			console.log('Room: ', gameID, ' showing results');

			io.to(gameID).emit('start_show_results', {
				gameShowingResults: true
			});
			io.emit('rooms_updated', this.getRooms());
			io.to(gameID).emit('toast_notification', { type: 'info', message: 'Showing Results!' });

			// No need for a set Interval as we are not sending more data into the client
			// Just delay the end_show_results event
			setTimeout(() => {
				io.to(gameID).emit('end_show_results', {
					gameShowingResults: false
				});
				if (room) {
					room.isShowingResults = false;
				}
				console.log('Room: ', gameID, ' finished showing results');
			}, this.showingResultsDuration);
		}
	}

	updateRoom(gameID: string, io: Server) {
		if (this.rooms[gameID]) {
			const now = Date.now();
			if (now - this.rooms[gameID].gameStartTime > this.gameDuration) {
				this.endGame(gameID, io);
			}
		}
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

	private startInterval(gameID: string, io: Server, fn: () => void, timeInterval: number) {
		this.intervals[gameID] = setInterval(fn, timeInterval);
	}

	private stopInterval(interval: NodeJS.Timeout) {
		clearInterval(interval);
	}
}
