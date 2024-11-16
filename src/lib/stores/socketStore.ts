import { writable, get } from 'svelte/store';
import { io, Socket } from 'socket.io-client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverData = writable<any>({});

export const connectionState = writable<ConnectionState>({
	socketId: undefined,
	isConnected: false,
	kickedOut: false
});

export const gameData = writable<GameData>({
	numOfPlayers: 0,
	mapData: undefined,
	safeZoneBoundary: 160
});

export const gameState = writable<GameState>({
	gameLoaded: false,
	gameOngoing: false,
	gameFinished: false,
	gameStartTime: 0,
	gameDuration: 0,
	timestamp: 0
});

export const keyStates = writable<KeyStates>({
	up: false,
	down: false,
	left: false,
	right: false
});

export const randomPlayerOffsets = writable<RandomPlayerOffsets>({});

export const initSocket = (url: string, gameID: string, username: string, host: boolean) => {
	const socket: Socket = io(url);

	socket.on('connect', () => {
		connectionState.set({ socketId: socket.id, isConnected: true, kickedOut: false });
	});

	socket.on('player_connected', (data) => {
		serverData.set(data);
	});

	socket.on('player_joined', (data) => {
		for (const player of data.playerIDs) {
			if (!get(randomPlayerOffsets)[player]) {
				randomPlayerOffsets.set({
					...get(randomPlayerOffsets),
					[player]: Math.floor(Math.random() * 100)
				});
			}
		}
	});

	socket.on('player_updated', (data) => {
		serverData.set(data);
	});

	socket.on('specific_room_updated', (data) => {
		gameData.set({ ...get(gameData), numOfPlayers: data.players });
	});

	socket.on('map_generated', (data) => {
		gameData.set({ ...get(gameData), mapData: data });
	});

	socket.on('safe_zone_updated', (data) => {
		gameData.set({ ...get(gameData), safeZoneBoundary: data.safeZoneBoundary });
	});

	socket.on('kicked_from_room', (kicked) => {
		connectionState.set({ ...get(connectionState), kickedOut: kicked });
	});

	socket.on('game_started', (data) => {
		gameState.set({
			...get(gameState),
			gameOngoing: data.gameStarted,
			gameStartTime: data.gameStartTime,
			gameDuration: data.gameDuration
		});
	});

	socket.on('game_ended', (data) => {
		gameState.set({
			...get(gameState),
			gameFinished: data.gameFinished,
			gameOngoing: data.gameStarted
		});
	});

	socket.on('toast_notification', (data) => {
		console.log('Game:', data);
	});

	if (host) socket.emit('create_room', { gameID, username });
	else socket.emit('join_room', { gameID, username });

	return socket;
};
