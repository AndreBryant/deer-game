<script lang="ts">
	import { displayFormatTime } from '$lib/components/game/util';
	export let gameStartTime: number = 0;
	export let gameDuration: number = 0;
	export let timestamp: number = 0;

	$: timeLeftString = displayFormatTime(gameStartTime, gameDuration, timestamp);
</script>

<div class="absolute top-2 flex w-full justify-center text-2xl text-red-500">
	<p>{timeLeftString}</p>
</div>
