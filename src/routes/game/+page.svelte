<script lang="ts">
	export let data: any;

	import { goto } from '$app/navigation';
	import { Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import GameKeyBinds from '$lib/components/game/GameKeyBinds.svelte';
	import GameDetails from '$lib/components/game/GameDetails.svelte';
	import GamePlayerStats from '$lib/components/game/GamePlayerStats.svelte';
	import GameTimer from '$lib/components/game/GameTimer.svelte';
	import GameStartButton from '$lib/components/game/GameStartButton.svelte';
	import BackToHomeButton from '$lib/components/game/BackToHomeButton.svelte';
	import {
		serverData,
		gameData,
		gameState,
		connectionState,
		keyStates,
		initSocket
	} from '$lib/stores/socketStore';
	import { handleKeyup, handleKeydown } from '$lib/components/game/util';

	// Socket Connection Stuff
	let ws: Socket | undefined;
	onMount(() => {
		const dev = import.meta.env.MODE === 'development';
		const url = dev ? '' : import.meta.env.VITE_SERVER_URL;
		ws = initSocket(url, data.gameID, data.username, data.host);

		window.addEventListener('keydown', (e) => handleKeydown(ws!, data.gameID, e));
		window.addEventListener('keyup', (e) => handleKeyup(ws!, data.gameID, e));

		return () => {
			window.removeEventListener('keydown', (e) => handleKeydown(ws!, data.gameID, e));
			window.removeEventListener('keyup', (e) => handleKeyup(ws!, data.gameID, e));
			ws?.disconnect();
		};
	});

	$: if ($connectionState.kickedOut) {
		goto('/');
	}

	$: $gameState.timestamp = $serverData.timestamp;

	$: clientPlayer =
		$serverData.players && $connectionState.isConnected && $connectionState.socketId
			? $serverData.players[$connectionState.socketId]
			: undefined;
</script>

<main class="relative h-screen w-screen select-none overflow-hidden text-white">
	<div class="w-screem h-screenn absolute left-0 top-0 -z-10">
		{#if $gameData.mapData && $connectionState.isConnected && $connectionState.socketId}
			<GameCanvas
				safeZoneBoundary={$gameData.safeZoneBoundary}
				socketId={$connectionState.socketId}
				mapData={$gameData.mapData}
				serverData={$serverData}
				gameOngoing={$gameState.gameOngoing}
				timestamp={$gameState.timestamp}
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
			<GameStartButton {ws} host={data.host} gameID={data.gameID} />
		{/if}
	</section>
</main>
