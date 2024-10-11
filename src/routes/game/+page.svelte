<script lang="ts">
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { io } from 'socket.io-client';
	const ws = io();

	let serverData = {};
	ws.on('player_connected', (data) => {
		serverData = data;
	});

	ws.on('player_updated', (data) => {
		serverData = data;
	});

	$: serverData;
</script>

<main class="h-screen w-screen select-none">
	<section>
		<GameCanvas {serverData} />
	</section>
</main>
