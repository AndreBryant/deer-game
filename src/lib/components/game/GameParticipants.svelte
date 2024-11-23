<script lang="ts">
	import GameParticipantItem from './GameParticipantItem.svelte';

	export let participants: { id: string; username: string }[];
	export let yourSocketID: string = '';
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex h-full min-h-0 w-full basis-7/12 flex-col">
	<div class="flex w-full flex-col gap-4">
		<h3 class="">Participants</h3>
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
