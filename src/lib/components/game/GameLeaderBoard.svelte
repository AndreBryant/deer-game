<script lang="ts">
	import GameLeaderboardItem from './GameLeaderboardItem.svelte';

	export let participants: { id: string; username: string; score: number }[] = [];
	export let yourSocketID: string = '';

	$: participants.sort((a, b) => b.score - a.score);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex h-full min-h-0 w-full basis-7/12 flex-col">
	<div class="flex w-full flex-col gap-4">
		<h3 class="">Leaderboard</h3>
		<hr class="border border-slate-50 border-opacity-30" />
	</div>
	<div class="custom-scrollbar min-h-0 flex-shrink-0 flex-grow basis-9/12 overflow-y-auto">
		<ol class="flex list-inside flex-col">
			{#each participants as participant, i}
				{#if participant.id === yourSocketID}
					<GameLeaderboardItem
						username={participant.username}
						score={participant.score}
						rank={i + 1}
						you={true}
					/>
				{:else}
					<GameLeaderboardItem
						username={participant.username}
						score={participant.score}
						rank={i + 1}
					/>
				{/if}
			{/each}
		</ol>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.315);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.479);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: red;
	}
</style>
