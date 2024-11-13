<script lang="ts">
	export let data: any;
	import { goto } from '$app/navigation';
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { Square, Activity, Heart, Sword, Trophy, ChevronLeft } from 'lucide-svelte';

	let serverData: any = {};
	let numOfPlayers: number = 1;
	let mapData:
		| { mapData: string; height: number; width: number; tileSize: number; safeZoneBoundary: number }
		| undefined = undefined;
	let safeZoneBoundary: number = 159;
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

	let gameLoaded = false;
	let gameStarted = false;

	function emitKeyInput() {
		if (!ws) return;
		ws.emit('player_key_input', {
			socketId: connectionState.socketId,
			gameID: data.gameID,
			keyStates
		});
	}

	// TODO: use a better solution
	function updateKeyCodes(key: string, value: boolean) {
		let changed = false;
		if ((key === 'w' || key === 'W') && keyStates.up !== value) {
			keyStates.up = value;
			changed = true;
		} else if ((key === 's' || key === 'S') && keyStates.down !== value) {
			changed = true;
			keyStates.down = value;
		} else if ((key === 'a' || key === 'A') && keyStates.left !== value) {
			changed = true;
			keyStates.left = value;
		} else if ((key === 'd' || key === 'D') && keyStates.right !== value) {
			changed = true;
			keyStates.right = value;
		} else if (key === ' ' && keyStates.attack !== value) {
			changed = true;
			keyStates.attack = value;
		}
		return changed;
	}

	function handleKeydown(ws: Socket, e: KeyboardEvent) {
		const changed = updateKeyCodes(e.key, true);
		if (changed) {
			emitKeyInput();
		}
	}

	function handleKeyup(ws: Socket, e: KeyboardEvent) {
		const changed = updateKeyCodes(e.key, false);
		if (changed) emitKeyInput();
	}

	let startGameButton: HTMLButtonElement;
	const startGame = () => {
		if (!ws) return;
		if (data.host) {
			ws.emit('start_game', { gameID: data.gameID });
			gameStarted = true;
		}

		startGameButton.blur();
	};

	onMount(() => {
		ws = io(import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_SERVER_URL);

		ws.on('connect', () => {
			connectionState.socketId = ws!.id;
			connectionState.isConnected = true;
		});

		if (data.host) {
			ws.emit('create_room', {
				gameID: data.gameID,
				username: data.username
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

		ws.on('specific_room_updated', (dataFromServer) => {
			numOfPlayers = dataFromServer.players;
		});

		ws.on('player_updated', (dataFromServer) => {
			serverData = dataFromServer;
		});

		ws.on('map_generated', (dataFromServer) => {
			mapData = dataFromServer;
		});

		ws.on('safe_zone_updated', (dataFromServer) => {
			safeZoneBoundary = dataFromServer.safeZoneBoundary;
		});

		ws.on('kicked_from_room', (kicked) => {
			if (kicked) {
				goto('/');
			}
		});

		ws.on('game_started', (data) => {
			console.log(data, gameStarted);
			gameStarted = data.gameStarted;
		});

		window.addEventListener('keydown', (e) => handleKeydown(ws!, e));
		window.addEventListener('keyup', (e) => handleKeyup(ws!, e));

		return () => {
			window.removeEventListener('keydown', (e) => handleKeydown(ws!, e));
			window.removeEventListener('keyup', (e) => handleKeyup(ws!, e));
			ws?.disconnect();
		};
	});

	$: serverData, connectionState, mapData, safeZoneBoundary, numOfPlayers;

	$: clientPlayer =
		serverData.players && connectionState.isConnected && connectionState.socketId
			? serverData.players[connectionState.socketId]
			: undefined;
</script>

<!-- TODO: THE CODE LOOKS UGLY I NEED TO REFACTOR THIS 😭😭😭 -->
<!-- {JSON.stringify(serverData, null, 2)} -->
<!-- {#if mapData}
	{JSON.stringify(mapData, null, 2)}
{/if} -->
<!-- {JSON.stringify(connectionState, null, 2)} -->
<!-- {safeZoneBoundary} -->
<main class="relative h-screen w-screen select-none text-white">
	<div class="w-scree h-screenn absolute left-0 top-0 -z-10">
		{#if mapData && connectionState.isConnected && connectionState.socketId}
			<GameCanvas {safeZoneBoundary} {serverData} {mapData} socketId={connectionState.socketId} />
		{:else}
			<p>Connecting...</p>
		{/if}
	</div>

	<section>
		<div class="group absolute flex h-full w-16 items-center transition-all">
			<a href="/" class="group gap-2 opacity-0 group-hover:opacity-100">
				<p class=" flex items-center gap-2">
					<ChevronLeft />
					<span class="transition-opac opacity-0 group-hover:opacity-100"> back to home </span>
				</p>
			</a>
		</div>
		<div class="flex flex-col gap-1 text-sm">
			{#if data.host}
				<div>
					<h1 class="text-2xl">Host</h1>
				</div>
			{/if}
			<div class="flex flex-col gap-1">
				<div>
					<p>Game ID: {data.gameID}</p>
				</div>
				<div class="w-80">
					<p class="truncate">Username: {data.username}</p>
				</div>
				<div class="flex gap-2">
					<p>
						Players:
						{numOfPlayers}
					</p>
				</div>
			</div>
		</div>
		{#if clientPlayer}
			<div class="absolute bottom-0 left-0 mb-2 flex flex-col gap-2 text-sm opacity-65">
				<div class="flex gap-1">
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
						<p>- move</p>
					</div>
				</div>
				<div class="flex gap-1">
					<div class="flex justify-center">
						<div class="" class:opacity-65={keyStates.attack}>
							<span class="rounded-md border-4 px-6 py-1 text-xs">Space</span>
						</div>
					</div>
					<div>
						<p>- attack</p>
					</div>
				</div>
			</div>
		{/if}
		{#if clientPlayer}
			<div class="absolute bottom-0 flex w-full flex-col items-center gap-2">
				<div class="flex gap-4">
					<div class="flex gap-2 text-lg">
						<Heart />
						{clientPlayer.health}
					</div>
					<div class="flex gap-2 text-lg">
						<Sword />
						{clientPlayer.attack}
					</div>
					<div class="flex gap-2 text-lg">
						<Trophy />
						{clientPlayer.score}
					</div>
				</div>
				<div class="flex gap-4">
					<div>
						<p>x: {Math.floor(clientPlayer.x / 32) - 2}</p>
					</div>
					<div>
						<p>y: {Math.floor(clientPlayer.y / 32)}</p>
					</div>
				</div>
				<div class="flex gap-2">
					<Activity />
					{clientPlayer.action.replace('_', ' ').replace('grass', 'glass')}
				</div>
			</div>
		{/if}
		<!-- Add if !gameStarted here -->
		{#if !gameStarted && !gameLoaded && data.host}
			<div class="absolute bottom-28 flex w-full flex-col items-center gap-4">
				<div>
					<button
						class="group animate-pulse rounded-lg border-2 px-4 py-2 backdrop-blur-lg transition-all hover:animate-none hover:text-xl"
						on:click={startGame}
						bind:this={startGameButton}
					>
						<span class="inline group-hover:hidden">Start Game</span>
						<span class="hidden group-hover:inline">Start Game?</span>
					</button>
				</div>
			</div>
		{/if}
	</section>
</main>
