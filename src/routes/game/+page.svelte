<script lang="ts">
	import { io } from 'socket.io-client';
	const ws = io();

	ws.on('eventFromServer', (message) => {
		console.log(message);
	});

	let currentMessage: string = '';
	$: currentMessage, ws.emit('eventFromClient', currentMessage);
</script>

<main class="h-screen w-screen select-none">
	<section>
		<h1 class="text-9xl">Game Page</h1>
	</section>
	<input bind:value={currentMessage} class="border" />
</main>
