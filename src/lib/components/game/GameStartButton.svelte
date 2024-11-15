<script lang="ts">
	export let startGame: () => void;
	export let startGameButton: HTMLButtonElement;
</script>

<div class="absolute bottom-28 flex w-full flex-col items-center gap-4">
	<div>
		<button
			class="group animate-pulse rounded-lg border-2 px-4 py-2 backdrop-blur-lg transition-all hover:animate-none hover:text-xl"
			on:click={startGame}
			bind:this={startGameButton}
		>
			<span class="inline group-hover:hidden">Start Game</span>
			<span class="hidden group-hover:inline">Start Game?</span>
		</button>
	</div>
</div>
