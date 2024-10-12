<script lang="ts">
	export let data: any;
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { io } from 'socket.io-client';
	const ws = io();

	let serverData = {};

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

	ws.on('player_connected', (data) => {
		serverData = data;
	});

	ws.on('player_updated', (data) => {
		serverData = data;
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
</main>
