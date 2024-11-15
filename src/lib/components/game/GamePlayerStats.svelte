<script lang="ts">
	import { Heart, Sword, Trophy, Activity } from 'lucide-svelte';
	export let gameOngoing: boolean = false;
	export let attack: number = 0;
	export let score: number = 0;
	export let health: number = 0;
	export let action: string = '';
	export let x: number = 0;
	export let y: number = 0;
</script>

<div class="absolute bottom-0 flex w-full flex-col items-center gap-2">
	<div class="flex gap-4">
		<div class="flex gap-2 text-lg">
			<Heart />

			{#if gameOngoing}
				{health}
			{:else}
				&infin;
			{/if}
		</div>
		<div class="flex gap-2 text-lg">
			<Sword />
			{gameOngoing ? attack : 0}
		</div>
		<div class="flex gap-2 text-lg">
			<Trophy />
			{score}
		</div>
	</div>
	<div class="flex gap-4">
		<div>
			<p>x: {Math.floor(x / 32) - 2}</p>
		</div>
		<div>
			<p>y: {Math.floor(y / 32)}</p>
		</div>
	</div>
	<div class="flex gap-2">
		<Activity />
		{action.replace('_', ' ').replace('grass', 'glass')}
	</div>
</div>
