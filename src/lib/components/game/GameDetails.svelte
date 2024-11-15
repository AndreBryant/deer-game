<script lang="ts">
	export let host: boolean = false;
	export let gameID: string = '';
	export let username: string = '';
	export let numOfPlayers: number = 0;
</script>

<div class="flex flex-col gap-1 text-sm">
	{#if host}
		<div>
			<h1 class="text-2xl">Host</h1>
		</div>
	{/if}
	<div class="flex flex-col gap-1">
		<div>
			<p>Game ID: {gameID}</p>
		</div>
		<div class="w-80">
			<p class="truncate">Username: {username}</p>
		</div>
		<div class="flex gap-2">
			<p>
				Players:
				{numOfPlayers}
			</p>
		</div>
	</div>
</div>
