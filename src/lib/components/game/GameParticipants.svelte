<script lang="ts">
	export let participants: string[];

	let isCollapsed = true;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="h-[650px] w-[650px] rounded-lg border bg-slate-950 bg-opacity-80 px-8 py-4">
	<h3 class="text-2xl">Players: {participants.length}</h3>
	<hr />
	<div class="custom-scrollbar"></div>
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
