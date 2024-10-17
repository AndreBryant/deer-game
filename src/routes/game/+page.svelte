<script lang="ts">
	export let data: any;
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	const ws = io();

	let serverData: any = {};
	let socketId: string | undefined = '';
	let isConnected = false;

	ws.on('connect', () => {
		socketId = ws.id;
		isConnected = true;
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

	let keyStates: { [key: string]: boolean } = { up: false, down: false, left: false, right: false };

	function updateKeyCodes(key: string, value: boolean) {
		if (key === 'w') keyStates.up = value;
		else if (key === 's') keyStates.down = value;
		else if (key === 'a') keyStates.left = value;
		else if (key === 'd') keyStates.right = value;
	}

	function handleKeydown(e: KeyboardEvent) {
		updateKeyCodes(e.key, true);
		ws.emit('player_key_input', {
			socketId,
			gameID: data.gameID,
			keyStates
		});
	}

	function handleKeyup(e: KeyboardEvent) {
		updateKeyCodes(e.key, false);
		ws.emit('player_key_input', {
			socketId,
			gameID: data.gameID,
			keyStates
		});
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('keyup', handleKeyup);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('keyup', handleKeyup);
		};
	});
	$: serverData, socketId;
</script>

<main class="XX--ADD-THIS-LATER--XX(select-none) relative h-screen w-screen text-white">
	<div class="w-scree h-screenn absolute left-0 top-0 -z-10">
		{#if isConnected && socketId}
			<GameCanvas {serverData} {socketId} />
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
	</section>
</main>
