<script lang="ts">
	export let participants: string[];

	let isCollapsed = true;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex h-[650px] w-[650px] flex-col gap-4 rounded-lg border bg-slate-950 bg-opacity-80 px-8 py-4"
>
	<div class="flex flex-col gap-2">
		<h3 class="text-xl font-semibold">Players: {participants.length}</h3>
		<hr />
	</div>
	<div class="custom-scrollbar flex-grow overflow-hidden overflow-y-auto">
		<ol class="list-inside list-decimal">
			{#each participants as participant}
				<li class="mb-2 text-lg text-white text-opacity-80">
					<span class="text-sm">
						{participant}
					</span>
				</li>
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
