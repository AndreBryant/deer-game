<script lang="ts">
	export let data: any;
	import { goto } from '$app/navigation';
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import { Square, Activity, Heart, Sword, User, Trophy } from 'lucide-svelte';

	let serverData: any = {};
	let numOfPlayers: number = 1;
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
		ws.emit('start_game', {
			gameID: data.gameID
		});
		gameStarted = true;
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
			ws?.disconnect();
		};
	});

	$: serverData, connectionState, mapData, numOfPlayers;

	$: clientPlayer =
		serverData.players && connectionState.isConnected && connectionState.socketId
			? serverData.players[connectionState.socketId]
			: undefined;
</script>

<!-- TODO: THE CODE LOOKS UGLY I NEED TO REFACTOR THIS 😭😭😭 -->
<!--{JSON.stringify(serverData, null, 2)}
{JSON.stringify(mapData, null, 2)}
{JSON.stringify(connectionState, null, 2)} -->
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
		<div class="w-80">
			<p class="truncate">Player: {data.username}</p>
		</div>
		{#if clientPlayer}
			<div class="absolute bottom-0 left-0 flex flex-col gap-2 opacity-65">
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
						<p class="text-lg">- move</p>
					</div>
				</div>
				<div class="flex gap-1">
					<div class="flex justify-center">
						<div class="" class:opacity-65={keyStates.attack}>
							<span class="rounded-md border-4 px-6 py-1 text-xs">Space</span>
						</div>
					</div>
					<div>
						<p class="text-lg">- attack</p>
					</div>
				</div>
			</div>
			<div class="absolute right-0 top-0 flex flex-col gap-2">
				<p>x: {Math.floor(clientPlayer.x / 32) - 2}</p>
				<p>y: {Math.floor(clientPlayer.y / 32)}</p>
				<div class="flex gap-2">
					<User />
					{numOfPlayers}
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
				<div class="flex gap-2">
					<Activity />
					{clientPlayer.action.replace('_', ' ').replace('grass', 'glass')}
				</div>
			</div>
		{/if}
		<!-- Add if !gameStarted here -->
		{#if !gameLoaded && data.host}
			<div class="absolute bottom-24 flex w-full flex-col items-center gap-4">
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
