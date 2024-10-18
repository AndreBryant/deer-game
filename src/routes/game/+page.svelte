<script lang="ts">
	export let data: any;
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import type { DefaultEventsMap } from '@socket.io/component-emitter';
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	let serverData: any = {};
	let connectionState: { socketId: string | undefined; isConnected: boolean } = {
		socketId: undefined,
		isConnected: false
	};

	let keyStates: { [key: string]: boolean } = { up: false, down: false, left: false, right: false };

	function updateKeyCodes(key: string, value: boolean) {
		if (key === 'w' || key === 'W') keyStates.up = value;
		else if (key === 's' || key === 'S') keyStates.down = value;
		else if (key === 'a' || key === 'A') keyStates.left = value;
		else if (key === 'd' || key === 'D') keyStates.right = value;
	}

	function handleKeydown(ws: Socket<DefaultEventsMap, DefaultEventsMap>, e: KeyboardEvent) {
		updateKeyCodes(e.key, true);
		ws.emit('player_key_input', {
			socketId: connectionState.socketId,
			gameID: data.gameID,
			keyStates
		});
	}

	function handleKeyup(ws: Socket<DefaultEventsMap, DefaultEventsMap>, e: KeyboardEvent) {
		updateKeyCodes(e.key, false);
		ws.emit('player_key_input', {
			socketId: connectionState.socketId,
			gameID: data.gameID,
			keyStates
		});
	}

	onMount(() => {
		const ws = io();

		ws.on('connect', () => {
			connectionState.socketId = ws.id;
			connectionState.isConnected = true;
		});

		if (data.host) {
			ws.emit('create_room', {
				gameID: data.gameID
			});
		} else {
			ws.emit('join_room', {
				gameID: data.gameID,
				username: data.username
			});
		}

		ws.on('player_connected', (dataFromServer) => {
			serverData = dataFromServer;
		});

		ws.on('player_updated', (dataFromServer) => {
			serverData = dataFromServer;
		});

		window.addEventListener('keydown', (e) => handleKeydown(ws, e));
		window.addEventListener('keyup', (e) => handleKeyup(ws, e));

		return () => {
			window.removeEventListener('keydown', (e) => handleKeydown(ws, e));
			window.removeEventListener('keyup', (e) => handleKeyup(ws, e));
		};
	});

	$: serverData, connectionState;

	$: clientPlayer =
		serverData.players && connectionState.isConnected && connectionState.socketId
			? serverData.players[connectionState.socketId]
			: undefined;
</script>

<main class="XX--ADD-THIS-LATER--XX(select-none) relative h-screen w-screen text-white">
	<div class="w-scree h-screenn absolute left-0 top-0 -z-10">
		{#if connectionState.isConnected && connectionState.socketId}
			<GameCanvas {serverData} socketId={connectionState.socketId} />
		{:else}
			<p>Connecting...</p>
		{/if}
	</div>

	<section>
		<div>
			{#if data.host}
				<h1 class="text-3xl">host</h1>
			{/if}
		</div>
		<div>
			<p>Game ID: {data.gameID}</p>
		</div>
		<div>
			<p>Player: {data.username}</p>
		</div>
		{#if clientPlayer}
			<div>
				<p>x: {clientPlayer.x}</p>
				<p>y: {clientPlayer.y}</p>
			</div>
		{/if}
	</section>
</main>
