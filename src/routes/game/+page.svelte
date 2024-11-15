<script lang="ts">
	export let data: any;

	import { goto } from '$app/navigation';
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import GameKeyBinds from '$lib/components/game/GameKeyBinds.svelte';
	import GameDetails from '$lib/components/game/GameDetails.svelte';
	import GamePlayerStats from '$lib/components/game/GamePlayerStats.svelte';
	import GameTimer from '$lib/components/game/GameTimer.svelte';
	import GameStartButton from '$lib/components/game/GameStartButton.svelte';
	import BackToHomeButton from '$lib/components/game/BackToHomeButton.svelte';
	import { gameData, gameState, connectionState, keyStates } from '$lib/stores/socketStore';

	let serverData: any = {};

	// Socket Connection Stuff
	let ws: Socket | undefined;

	// Keybinds and Player Key States
	const keyMapping: Record<string, string> = {
		W: 'up',
		S: 'down',
		A: 'left',
		D: 'right',
		' ': 'attack'
	};

	// Game Start Trigger Button
	let startGameButton: HTMLButtonElement;
	const startGame = () => {
		if (!ws) return;
		if (data.host) {
			ws.emit('start_game', { gameID: data.gameID });
			$gameState.gameOngoing = true;
		}

		startGameButton.blur();
	};

	function emitKeyInput(ws: Socket) {
		if (!ws) return;
		ws.emit('player_key_input', {
			socketId: $connectionState.socketId,
			gameID: data.gameID,
			keyStates: $keyStates
		});
	}

	function updateKeyCodes(key: string, value: boolean) {
		const stateKey = keyMapping[key.toUpperCase()];
		if (stateKey && $keyStates[stateKey] !== value) {
			$keyStates[stateKey] = value;
			return true;
		}
		return false;
	}

	function handleKeydown(ws: Socket, e: KeyboardEvent) {
		const changed = updateKeyCodes(e.key, true);
		if (changed) {
			emitKeyInput(ws);
		}
	}

	function handleKeyup(ws: Socket, e: KeyboardEvent) {
		const changed = updateKeyCodes(e.key, false);
		if (changed) emitKeyInput(ws);
	}

	function toast(message: string) {
		console.log('Game: ', message);
	}

	onMount(() => {
		const dev = import.meta.env.MODE === 'development';
		const url = dev ? '' : import.meta.env.VITE_SERVER_URL;
		ws = io(url);

		ws.on('connect', () => {
			$connectionState.socketId = ws!.id;
			$connectionState.isConnected = true;
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
			$gameData.numOfPlayers = dataFromServer.players;
		});

		ws.on('player_updated', (dataFromServer) => {
			serverData = dataFromServer;
		});

		ws.on('map_generated', (dataFromServer) => {
			$gameData.mapData = dataFromServer;
		});

		ws.on('safe_zone_updated', (data) => {
			$gameData.safeZoneBoundary = data.safeZoneBoundary;
		});

		ws.on('kicked_from_room', (kicked) => {
			if (kicked) {
				goto('/');
			}
		});

		ws.on('game_started', (dataFromServer) => {
			$gameState.gameOngoing = dataFromServer.gameStarted;
			$gameState.gameStartTime = dataFromServer.gameStartTime;
			$gameState.gameDuration = dataFromServer.gameDuration;
		});

		ws.on('game_ended', (dataFromServer) => {
			$gameState.gameOngoing = dataFromServer.gameStarted;
			$gameState.gameFinished = dataFromServer.gameFinished;
		});

		ws.on('toast_notification', (dataFromServer) => {
			toast(dataFromServer.message);
		});

		window.addEventListener('keydown', (e) => handleKeydown(ws!, e));
		window.addEventListener('keyup', (e) => handleKeyup(ws!, e));

		return () => {
			window.removeEventListener('keydown', (e) => handleKeydown(ws!, e));
			window.removeEventListener('keyup', (e) => handleKeyup(ws!, e));
			ws?.disconnect();
		};
	});

	$: serverData;
	$: $gameState.timestamp = serverData.timestamp;

	$: clientPlayer =
		serverData.players && $connectionState.isConnected && $connectionState.socketId
			? serverData.players[$connectionState.socketId]
			: undefined;
</script>

<main class="relative h-screen w-screen select-none overflow-hidden text-white">
	<div class="w-scree h-screenn absolute left-0 top-0 -z-10">
		{#if $gameData.mapData && $connectionState.isConnected && $connectionState.socketId}
			<GameCanvas
				safeZoneBoundary={$gameData.safeZoneBoundary}
				socketId={$connectionState.socketId}
				mapData={$gameData.mapData}
				{serverData}
			/>
		{:else}
			<p>Connecting...</p>
		{/if}
	</div>

	<section>
		<BackToHomeButton />
		<GameDetails
			host={data.host}
			gameID={data.gameID}
			username={data.username}
			numOfPlayers={$gameData.numOfPlayers}
		/>
		{#if clientPlayer}
			<GameKeyBinds keyStates={$keyStates} />
			<GamePlayerStats
				gameOngoing={$gameState.gameOngoing}
				attack={clientPlayer.attack}
				score={clientPlayer.score}
				health={clientPlayer.health}
				action={clientPlayer.action}
				x={clientPlayer.x}
				y={clientPlayer.y}
			/>
		{/if}
		{#if clientPlayer && $gameState.gameOngoing && !$gameState.gameFinished}
			<GameTimer
				gameStartTime={$gameState.gameStartTime}
				gameDuration={$gameState.gameDuration}
				timestamp={$gameState.timestamp}
			/>
		{/if}
		{#if !$gameState.gameFinished && !$gameState.gameOngoing && !$gameState.gameLoaded && data.host}
			<GameStartButton {startGame} {startGameButton} />
		{/if}
	</section>
</main>
