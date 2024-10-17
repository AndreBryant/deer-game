<script lang="ts">
	import { updated } from '$app/stores';
	export let data: any;
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	const ws = io();

	let serverData: any = {};
	let socketId: string | undefined = '';

	ws.on('connect', () => {
		socketId = ws.id;
		console.log('Socket ID:', socketId);
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
	$: serverData;
</script>

{data.host}
{data.gameID}
{data.username}

<main class="h-screen w-screen select-none">
	<section>
		<GameCanvas {serverData} />
	</section>
	<pre>
		{JSON.stringify({ socketId, serverData }, null, 2)}
	</pre>
</main>
