<script lang="ts">
	export let participants: Record<any, any>;
	export let gameOngoing: boolean = false;
	import GameLeaderBoard from './GameLeaderBoard.svelte';
	import GameParticipants from './GameParticipants.svelte';

	let isCollapsed: boolean = true;
</script>

<div class="absolute right-0 top-0 flex h-screen w-64 flex-col opacity-80">
	<GameParticipants participants={['dog']} />
	{#if gameOngoing}
		<GameLeaderBoard participants={[{ username: 'dog', score: 3 }]} />
	{/if}
</div>
