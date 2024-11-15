import { writable } from 'svelte/store';
import { io, Socket } from 'socket.io-client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverData = writable<any>({});

export const ws = writable<Socket | undefined>(undefined);

export const connectionState = writable<ConnectionState>({
	socketId: undefined,
	isConnected: false
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

export const initSocket = (url: string, gameID: string, username: string, host: boolean) => {
	const socket: Socket = io(url);

	ws.set(socket);

	socket.on('connect', () => {
		connectionState.set({ socketId: socket.id, isConnected: true });
	});

	socket.on('player_connected', (data) => {
		serverData.set(data);
	});

	socket.on('player_updated', (data) => {
		serverData.set(data);
	});

	socket.on('toast_notification', (data) => {
		console.log('Game:', data);
	});

	if (host) socket.emit('create_room', { gameID, username });
	else socket.emit('join_room', { gameID, username });

	return socket;
};
