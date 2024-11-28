<script lang="ts">
	import GameParticipantItem from './GameParticipantItem.svelte';

	export let participants: { id: string; username: string }[];
	export let yourSocketID: string = '';
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex h-full min-h-0 w-full basis-7/12 flex-col">
	<div class="flex w-full flex-col gap-4">
		<div class="flex justify-between">
			<div>Participants:</div>
			<div class="opacity-70">
				{participants.length} player{participants.length === 1 ? '' : 's'}
			</div>
		</div>
		<hr class="border border-slate-50 border-opacity-30" />
	</div>
	<div class="custom-scrollbar min-h-0 flex-shrink-0 flex-grow basis-9/12 overflow-y-auto">
		<ul class="flex list-inside flex-col">
			{#each participants as participant}
				{#if participant.id === yourSocketID}
					<GameParticipantItem username={participant.username} you={true} />
				{:else}
					<GameParticipantItem username={participant.username} />
				{/if}
			{/each}
		</ul>
		<div class="flex items-center gap-4 text-xs opacity-30">
			<div class="h-[1px] flex-grow bg-slate-50 bg-opacity-50"></div>
			<div>Nothing Follows</div>
			<div class="h-[1px] flex-grow bg-slate-50 bg-opacity-50"></div>
		</div>
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
		background: rgba(0, 0, 0, 0.6);
	}
</style>
