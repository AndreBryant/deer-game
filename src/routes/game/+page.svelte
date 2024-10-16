<script lang="ts">
	export let data: any;
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { io } from 'socket.io-client';
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
