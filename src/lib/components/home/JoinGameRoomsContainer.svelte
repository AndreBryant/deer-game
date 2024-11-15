<script lang="ts">
	import JoinGameRoomItem from './JoinGameRoomItem.svelte';
	export let filteredRooms: ClientSideRooms = {};
	export let username: string = '';
</script>

<div class="custom-scrollbar flex h-56 flex-col overflow-y-auto border-y border-black py-1 pr-2">
	{#if Object.entries(filteredRooms).length > 0}
		{#each Object.entries(filteredRooms) as [gameID, room]}
			<JoinGameRoomItem {gameID} {room} {username} />
		{/each}
	{:else}
		<div class="text-sm">No rooms found...</div>
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 2px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: white;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.479);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: red;
	}
</style>
