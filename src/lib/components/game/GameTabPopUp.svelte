<script lang="ts">
	import { onMount } from 'svelte';
	export let participants: Record<any, any> = {};
	export let gameOngoing: boolean = false;
	export let roomId: string = '';
	import GameLeaderboard from './GameLeaderBoard.svelte';
	import GameParticipants from './GameParticipants.svelte';
	import GameTabInfo from './GameTabInfo.svelte';
	import Button from '../ui/Button.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { connectionState } from '$lib/stores/socketStore';

	let isShown: boolean = false;
	let tabPressed: boolean = false;
	let gameParticipants: { id: string; username: string }[] = [];
	let gameLeaderboard: { id: string; username: string; score: number }[] = [];
	let playerId: string = $connectionState.socketId || '';
	let playerName: string = '';
	let hostName: string = '';

	$: if (isShown) {
		if (participants && playerId) {
			gameParticipants = [];
			gameLeaderboard = [];
			for (const player in participants) {
				const p = participants[player];
				if (p.isHost) hostName = p.name;
				if (p.id === playerId) playerName = p.name;
				gameParticipants.push({ id: p.id, username: p.name });
				gameLeaderboard.push({
					id: p.id,
					username: p.name,
					score: p.score
				});
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (!tabPressed && e.key === 'Tab') {
				e.preventDefault();
				isShown = !isShown;
				// tabPressed = true;
			}
		});
	});

	$: participants, playerId, roomId;
</script>

<div
	class="absolute left-0 top-0 z-20 flex h-screen w-screen flex-col items-center justify-center bg-slate-950 bg-opacity-50 text-slate-300 backdrop-blur-sm"
	class:hidden={!isShown}
>
	<Button text="Exit to Main Menu" variant="link" iconLeft={ChevronLeft} href="/" />
	<div>
		<div
			class="items flex h-[560px] w-[650px] gap-4 rounded-lg border border-slate-50 border-opacity-30 bg-slate-950 bg-opacity-60 px-8 py-6"
		>
			<GameTabInfo {playerId} {playerName} {roomId} {hostName} />
			{#if !gameOngoing}
				<GameParticipants participants={gameParticipants} yourSocketID={playerId} />
			{:else}
				<GameLeaderboard participants={gameLeaderboard} yourSocketID={playerId} />
			{/if}
		</div>
		<span class="animate-pulse">press tab to close</span>
	</div>
</div>
