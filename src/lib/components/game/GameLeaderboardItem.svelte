<script lang="ts">
	export let username: string = '';
	export let score: number = 0;
	export let rank: number = 0;
	export let you: boolean = false;
	let ordinalIndicator = '';
	$: {
		if (rank % 10 === 1 && rank !== 11) ordinalIndicator = 'st';
		else if (rank % 10 === 2 && rank !== 12) ordinalIndicator = 'nd';
		else if (rank % 10 === 3 && rank !== 13) ordinalIndicator = 'rd';
		else ordinalIndicator = 'th';
	}

	$: you;
</script>

<li class="mb-2 flex w-full rounded-lg px-4 py-2 text-lg">
	<div class="flex flex-grow gap-4">
		<p
			class="flex font-semibold"
			class:text-green-400={rank === 1}
			class:text-yellow-500={rank === 2}
			class:text-yellow-800={rank === 3}
		>
			{rank}
			<span class="text-sm">
				{ordinalIndicator}
			</span>
		</p>
		<p>
			{username}
			<span class="text-xs opacity-80">
				{you ? ' (you)' : ''}
			</span>
		</p>
	</div>
	<div>
		{score} pt{score === 1 ? '' : 's'}
	</div>
</li>
