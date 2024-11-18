<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { User } from 'lucide-svelte';

	export let gameID: string = '';
	export let room: ClientSideRoom;
	export let username: string = '';
</script>

<div
	class="flex w-full justify-between border-t border-black border-opacity-20 px-2 py-4 transition-all duration-75 hover:bg-[#f5f5f5] hover:bg-opacity-20"
>
	<div class="flex flex-col gap-2">
		<div class="">
			<span class="text-sm font-semibold">GameID: </span>
			<span class="text-sm">
				{gameID}
			</span>
		</div>
		<div class="w-24 text-sm">
			<Button
				text="> join game"
				variant={room.isGameStarted ? 'disabled' : 'primary'}
				href={`./game?host=false&gameID=${gameID}&username=${username}`}
			/>
		</div>
	</div>
	<div class="flex flex-col justify-between">
		<div class="flex justify-end gap-2 text-sm">
			{room.players}<User size="16" />
		</div>
		{#if room.isGameStarted}
			<div>
				<span class="text-sm font-semibold text-green-700">Game Started</span>
			</div>
		{:else if room.isShowingResults}
			<div>
				<span class="text-sm font-semibold text-green-700">Showing Results</span>
			</div>
		{/if}
	</div>
</div>
