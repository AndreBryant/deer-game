<script lang="ts">
	export let data: any;

	import { goto } from '$app/navigation';
	import { Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import GameCanvas from '$lib/components/game/GameCanvas.svelte';
	import GameKeyBinds from '$lib/components/game/GameKeyBinds.svelte';
	import GamePlayerStats from '$lib/components/game/GamePlayerStats.svelte';
	import GameTimer from '$lib/components/game/GameTimer.svelte';
	import GameStartButton from '$lib/components/game/GameStartButton.svelte';
	import GameResults from '$lib/components/game/GameResults.svelte';
	import GameTabPopUp from '$lib/components/game/GameTabPopUp.svelte';
	import RequestFullScreenButton from '$lib/components/RequestFullScreenButton.svelte';
	import GameToaster from '$lib/components/game/GameToaster.svelte';
	import {
		serverData,
		gameData,
		gameState,
		connectionState,
		keyStates,
		initSocket
	} from '$lib/stores/socketStore';
	import { handleKeyup, handleKeydown, getRank } from '$lib/components/game/util';

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

	$: if ($connectionState.kickedOut) goto('/');

	$: if ($gameState.gameShowingResultsFinished)
		goto(`/results?gameID=${data.gameID}&socketId=${$connectionState.socketId}`);

	$: $gameState.timestamp = $serverData.timestamp;

	$: clientPlayer =
		$serverData.players && $connectionState.isConnected && $connectionState.socketId
			? $serverData.players[$connectionState.socketId]
			: undefined;
</script>

<svelte:head>
	<title>
		{data.gameID} | {$gameData.numOfPlayers} player{$gameData.numOfPlayers === 1 ? '' : 's'}
		{$gameState.gameOngoing ? '(started)' : ''}
	</title>
</svelte:head>

<main class="relative h-screen w-screen select-none overflow-hidden text-white">
	<div class="absolute left-0 top-0 -z-10 h-screen w-screen">
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
	{#if $gameData.mapData && $connectionState.isConnected && $connectionState.socketId}
		<GameToaster />
		<GameTabPopUp
			gameOngoing={$gameState.gameOngoing}
			participants={$serverData.players}
			roomId={data.gameID}
		/>
	{/if}

	<section>
		{#if clientPlayer}
			<RequestFullScreenButton />
			<GameKeyBinds keyStates={$keyStates} />
			<GamePlayerStats
				attack={clientPlayer.attack}
				score={clientPlayer.score}
				health={clientPlayer.health}
				takingDamage={!clientPlayer.isDead &&
					(clientPlayer.invincible || clientPlayer.dangerZoneDamageCooldown)}
				charging={clientPlayer.isCharging}
				x={clientPlayer.x}
				y={clientPlayer.y}
			/>
			{#if data.host && !$gameState.gameFinished && !$gameState.gameOngoing && !$gameState.gameLoaded}
				<GameStartButton {ws} host={data.host} gameID={data.gameID} />
			{:else if !data.host && !$gameState.gameFinished && !$gameState.gameOngoing && !$gameState.gameLoaded}
				<div class="absolute bottom-0 flex w-full animate-pulse justify-center">
					<p>Waiting for host to start the game...</p>
				</div>
			{/if}
		{/if}
		{#if clientPlayer && $gameState.gameOngoing && !$gameState.gameFinished}
			<GameTimer
				gameStartTime={$gameState.gameStartTime}
				gameDuration={$gameState.gameDuration}
				timestamp={$gameState.timestamp}
			/>
		{/if}
		{#if $gameState.gameShowingResults && $gameState.gameFinished}
			<GameResults
				rank={getRank($serverData)}
				numOfPlayers={$gameData.numOfPlayers}
				score={clientPlayer.score}
			/>
		{/if}
	</section>
</main>
