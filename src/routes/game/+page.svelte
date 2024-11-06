<script lang="ts">
	export let data: any;
	import { goto } from '$app/navigation';
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { Square } from 'lucide-svelte';

	let serverData: any = {};
	let mapData: { mapData: string; height: number; width: number; tileSize: number } | undefined =
		undefined;
	let connectionState: { socketId: string | undefined; isConnected: boolean } = {
		socketId: undefined,
		isConnected: false
	};

	let keyStates: { [key: string]: boolean } = {
		up: false,
		down: false,
		left: false,
		right: false,
		attack: false
	};

	let ws: Socket | undefined;
	let isEmitting = false;

	let gameStarted = false;

	function emitKeyInput() {
		if (!ws) return;
		ws.emit('player_key_input', {
			socketId: connectionState.socketId,
			gameID: data.gameID,
			keyStates
		});
	}

	function updateKeyCodes(key: string, value: boolean) {
		if (key === 'w' || key === 'W') keyStates.up = value;
		else if (key === 's' || key === 'S') keyStates.down = value;
		else if (key === 'a' || key === 'A') keyStates.left = value;
		else if (key === 'd' || key === 'D') keyStates.right = value;
		if (key === ' ') keyStates.attack = value;
	}

	function handleKeydown(ws: Socket, e: KeyboardEvent) {
		updateKeyCodes(e.key, true);
		if (!isEmitting) {
			isEmitting = true;
			requestAnimationFrame(emissionLoop);
		}
		console.log('sent keydown input from', connectionState.socketId, isEmitting);
	}

	function handleKeyup(ws: Socket, e: KeyboardEvent) {
		updateKeyCodes(e.key, false);
		if (!Object.values(keyStates).some((state) => state)) {
			isEmitting = false;
		}
		console.log('sent keyup input from', connectionState.socketId, isEmitting);
	}

	function emissionLoop() {
		emitKeyInput();
		if (isEmitting) requestAnimationFrame(emissionLoop);
	}

	onMount(() => {
		ws = io();

		ws.on('connect', () => {
			connectionState.socketId = ws!.id;
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
			// console.log('received player update', dataFromServer);
		});

		ws.on('map_generated', (dataFromServer) => {
			mapData = dataFromServer;
		});

		ws.on('kicked_from_room', (kicked) => {
			if (kicked) {
				goto('/');
			}
		});

		window.addEventListener('keydown', (e) => handleKeydown(ws!, e));
		window.addEventListener('keyup', (e) => handleKeyup(ws!, e));

		return () => {
			window.removeEventListener('keydown', (e) => handleKeydown(ws!, e));
			window.removeEventListener('keyup', (e) => handleKeyup(ws!, e));
		};
	});

	$: serverData, connectionState, mapData;

	$: clientPlayer =
		serverData.players && connectionState.isConnected && connectionState.socketId
			? serverData.players[connectionState.socketId]
			: undefined;
</script>

<h1 class="text-2xl">CURRENTLY BROKEN IM STILL REFACTORING THE SERVER CODE</h1>
{JSON.stringify(serverData, null, 2)}
{JSON.stringify(mapData, null, 2)}
{JSON.stringify(connectionState, null, 2)}
<main class="XX--ADD-THIS-LATER--XX(select-none) relative h-screen w-screen text-white">
	<div class="w-scree h-screenn absolute left-0 top-0 -z-10">
		{#if mapData && connectionState.isConnected && connectionState.socketId}
			<GameCanvas {serverData} {mapData} socketId={connectionState.socketId} />
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
			{#if clientPlayer}
				<p class="text-lg">HP: {clientPlayer.health}</p>
			{/if}
		</div>
		{#if clientPlayer}
			<div class="absolute bottom-0 left-0 flex flex-col gap-2 opacity-65">
				<div class="flex">
					<div class="flex flex-col">
						<div class="flex justify-center">
							<div class="relative" class:opacity-65={keyStates.up}>
								<Square size="30" />
								<span class="absolute left-[10px] top-[3px]">W</span>
							</div>
						</div>
						<div class="flex">
							<div class="relative" class:opacity-65={keyStates.left}>
								<Square size="30" />
								<span class="absolute left-[10px] top-[3px]">A</span>
							</div>
							<div class="relative" class:opacity-65={keyStates.down}>
								<Square size="30" />
								<span class="absolute left-[10px] top-[3px]">S</span>
							</div>
							<div class="relative" class:opacity-65={keyStates.right}>
								<Square size="30" />
								<span class="absolute left-[10px] top-[3px]">D</span>
							</div>
						</div>
					</div>
					<div class="flex items-end">
						<p class="text-lg">- move</p>
					</div>
				</div>
				<div class="flex gap-4">
					<div class="flex justify-center">
						<div class="" class:opacity-65={keyStates.attack}>
							<span class="rounded-md border-4 px-2 py-1 text-xs">Space</span>
						</div>
					</div>
					<div>
						<p class="text-lg">- attack</p>
					</div>
				</div>
			</div>
			<div class="absolute right-0 top-0">
				<p>x: {clientPlayer.x.toFixed(0)}</p>
				<p>y: {clientPlayer.y.toFixed(0)}</p>
				<p>y: {clientPlayer.action}</p>
			</div>
		{/if}
		{#if !gameStarted && data.host}
			<div class="absolute bottom-0 flex w-full justify-center">
				<p>host</p>
			</div>
		{/if}
	</section>
</main>
