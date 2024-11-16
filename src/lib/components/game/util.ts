import { Socket } from 'socket.io-client';
import { get } from 'svelte/store';
import { keyStates, connectionState } from '$lib/stores/socketStore';

export function displayFormatTime(startTime: number, duration: number, now: number) {
	const elapsed = now - startTime;
	const remaining = duration - elapsed;
	const minutes = Math.floor(remaining / 60000);
	const seconds = Math.floor((remaining % 60000) / 1000);
	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const keyMapping: Record<string, string> = {
	W: 'up',
	S: 'down',
	A: 'left',
	D: 'right',
	' ': 'attack'
};

function updateKeyCodes(key: string, value: boolean) {
	const stateKey = keyMapping[key.toUpperCase()];
	if (stateKey && get(keyStates)[stateKey] !== value) {
		keyStates.set({ ...get(keyStates), [stateKey]: value });
		return true;
	}
	return false;
}

export function handleKeydown(ws: Socket, gameID: string, e: KeyboardEvent) {
	const changed = updateKeyCodes(e.key, true);
	if (changed) {
		emitKeyInput(ws, gameID);
	}
}

export function handleKeyup(ws: Socket, gameID: string, e: KeyboardEvent) {
	const changed = updateKeyCodes(e.key, false);
	if (changed) emitKeyInput(ws, gameID);
}

function emitKeyInput(ws: Socket, gameID: string) {
	if (!ws) return;
	ws.emit('player_key_input', {
		socketId: get(connectionState).socketId,
		keyStates: get(keyStates),
		gameID: gameID
	});
}
