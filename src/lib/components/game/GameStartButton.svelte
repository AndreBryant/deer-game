<script lang="ts">
	import { Socket } from 'socket.io-client';
	import { gameState } from '$lib/stores/socketStore';
	export let ws: Socket | undefined = undefined;
	export let host: boolean;
	export let gameID: string;

	let startGameButton: HTMLButtonElement;
	const startGame = () => {
		if (!ws) return;
		if (host) {
			ws.emit('start_game', { gameID });
			$gameState.gameOngoing = true;
		}

		startGameButton.blur();
	};

	$: ws;
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
