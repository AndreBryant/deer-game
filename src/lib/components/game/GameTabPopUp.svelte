<script lang="ts">
	import { onMount } from 'svelte';
	export let participants: Record<any, any> = {};
	export let gameOngoing: boolean = false;
	import GameLeaderBoard from './GameLeaderBoard.svelte';
	import GameParticipants from './GameParticipants.svelte';

	let isShown: boolean = false;
	let tabPressed: boolean = false;
	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (!tabPressed && e.key === 'Tab') {
				e.preventDefault();
				isShown = !isShown;
				tabPressed = true;
			}
		});
		window.addEventListener('keyup', (e) => {
			if (e.key === 'Tab') {
				e.preventDefault();
				isShown = !isShown;
				tabPressed = false;
			}
		});
	});

	$: participants;
</script>

{#if isShown}
	<div
		class="absolute left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-slate-950 bg-opacity-80"
	>
		{#if !gameOngoing}
			<GameParticipants participants={Array.from({ length: 50 }).fill('dog')} />
		{:else}
			<GameLeaderBoard
				participants={Array.from({ length: 50 }).fill({ username: 'dog', score: 0 })}
			/>
		{/if}
	</div>
{/if}
