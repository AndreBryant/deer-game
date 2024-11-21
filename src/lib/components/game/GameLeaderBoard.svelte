<script lang="ts">
	export let participants: { username: string; score: number }[];
	import { ChevronUp, ChevronDown } from 'lucide-svelte';

	let isCollapsed = true;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex w-full flex-col rounded-lg border border-slate-50 border-opacity-50 bg-slate-950 bg-opacity-60 py-4 transition-all hover:bg-opacity-50"
	class:h-12={isCollapsed}
	class:h-[50%]={!isCollapsed}
	class:justify-center={isCollapsed}
	on:click={() => (isCollapsed = !isCollapsed)}
>
	{#if !isCollapsed}
		<h3 class="text-md mb-2 pl-2"><ChevronDown class="mr-2 inline" />Leaderboard</h3>
		<hr class="opacity-50" />
		<div class="custom-scrollbar overflow-hidden overflow-y-auto pl-2">
			<ul class=" space-y-6 px-2 py-4">
				{#each participants as participant}
					<li class="flex items-center gap-2 text-white text-opacity-70 hover:text-opacity-90">
						<span class="block h-1 w-1 rounded-full bg-white bg-opacity-70"></span>
						{participant.username}: {participant.score}
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<h3 class="text-md pl-2"><ChevronUp class="mr-2 inline" />Leaderboard</h3>
	{/if}
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
