<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { onDestroy } from 'svelte';
	import HomeBackground3 from '$lib/components/home/backgrounds/HomeBackground3.svelte';
	import StartMenuContainer from '$lib/components/home/StartMenuContainer.svelte';

	const dev: boolean = import.meta.env.MODE === 'development';
	const url: string = dev ? '' : import.meta.env.VITE_SERVER_URL;
	const ws: Socket = io(url);

	let rooms: ClientSideRooms = {};

	ws.on('rooms_updated', (dataFromServer) => {
		rooms = dataFromServer;
	});
	ws.on('connection', (dataFromServer) => {
		rooms = dataFromServer;
	});
	$: rooms;

	// Disconnect on destroy of the component
	onDestroy(() => ws?.disconnect());
</script>

<svelte:head>
	<title>Deer Game</title>
</svelte:head>

<main class="relative flex h-screen w-screen select-none flex-col items-center justify-center">
	<div class="absolute left-0 top-0">
		<HomeBackground3 />
	</div>
	<section>
		<StartMenuContainer bind:rooms />
	</section>
</main>
