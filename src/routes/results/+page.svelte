<script>
	export let data;
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { serverData } from '$lib/stores/socketStore';
	import HomeBackground2 from '$lib/components/home/backgrounds/HomeBackground3.svelte';
	import GameLeaderboard from '$lib/components/game/GameLeaderBoard.svelte';
	import GameTabInfo from '$lib/components/game/GameTabInfo.svelte';

	const ranking = $serverData.players ?? {};
	const participants = (() => {
		const gameLeaderboard = [];
		for (const player in ranking) {
			const p = ranking[player];
			gameLeaderboard.push({
				id: p.id,
				username: p.name,
				score: p.score
			});
		}
		return gameLeaderboard;
	})();
	const playerId = data.socketID || '';
	const roomId = data.gameID || '';
	const player = Object.values(ranking).filter((p) => p.id === playerId)[0];
	const host = Object.values(ranking).filter((p) => p.isHost)[0];
	onMount(() => {
		if (!$serverData || !$serverData.players || !data.gameID || !data.socketID) goto('/');
	});
</script>

<svelte:head>
	<title>Results</title>
</svelte:head>

{#if ranking}
	<div class="absolute -z-10">
		<HomeBackground2 />
	</div>
	<main
		class="absolute left-0 top-0 z-20 flex h-screen w-screen flex-col items-center justify-center bg-slate-950 bg-opacity-50 text-slate-300 backdrop-blur-sm"
	>
		<Button text="Exit to Main Menu" variant="link" iconLeft={ChevronLeft} href="/" />
		<div>
			<div
				class="items flex h-[560px] w-[650px] gap-4 rounded-lg border border-slate-50 border-opacity-30 bg-slate-950 bg-opacity-60 px-8 py-6"
			>
				<GameTabInfo
					{playerId}
					playerName={player?.name || ''}
					{roomId}
					hostName={host?.name || ''}
				/>
				<GameLeaderboard {participants} yourSocketID={playerId} />
			</div>
		</div>
	</main>
{/if}
