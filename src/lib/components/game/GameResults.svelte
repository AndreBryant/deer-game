<script lang="ts">
	export let rank: number;
	export let numOfPlayers: number;
	export let score: number;

	const ones = rank % 10;
</script>

<div
	class="absolute right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 bg-slate-950 bg-opacity-10 text-slate-200 backdrop-blur-sm transition-opacity"
>
	<div class="w-full text-center">
		<h2 class=" mb-2 bg-slate-800 bg-opacity-25 text-4xl">
			<span class="text-8xl">{rank}</span>{ones === 1 && rank !== 11
				? 'st'
				: ones === 2 && rank !== 12
					? 'nd'
					: ones === 3 && rank !== 13
						? 'rd'
						: 'th'}
			/ {numOfPlayers}
		</h2>
	</div>
	<div class="flex flex-col gap-2 text-center">
		<h3>Good Job! You scored {score} pts</h3>
		<h4>Please claim your prize kay maam</h4>
	</div>
</div>
