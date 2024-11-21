<script lang="ts">
	import { displayFormatTime } from '$lib/components/game/util';
	export let gameStartTime: number = 0;
	export let gameDuration: number = 0;
	export let timestamp: number = 0;
	let shouldBeRed = false;
	let timeLeftString = '';
	$: {
		const timeElapsed = timestamp - gameStartTime;
		const timeLeft = gameDuration - timeElapsed;
		shouldBeRed = timeLeft <= 30000;
		timeLeftString = displayFormatTime(gameStartTime, gameDuration, timestamp);
	}
</script>

<div class="absolute top-0 flex w-full justify-center">
	<div
		class="rounded-lg border bg-slate-950 bg-opacity-60 px-4 py-2 opacity-90 backdrop-blur-sm hover:opacity-100"
	>
		<p class="text-2xl" class:text-red-500={shouldBeRed}>{timeLeftString}</p>
	</div>
</div>
