<script lang="ts">
	import { Heart, Sword, Trophy, Activity } from 'lucide-svelte';
	export let gameOngoing: boolean = false;
	export let attack: number = 0;
	export let score: number = 0;
	export let health: number = 0;
	export let action: string = '';
	export let takingDamage: boolean = true;
	export let attacking: boolean = false;
	export let isPoweredUp: boolean = false;
	export let x: number = 0;
	export let y: number = 0;
</script>

<div class="absolute bottom-0 flex w-full flex-col items-center gap-2">
	<div class="flex gap-4">
		<div class="flex gap-2 text-lg" class:animate-[pulse_1s_infinite]={takingDamage}>
			<Heart class={takingDamage ? 'fill-red-900 text-red-900' : ''} />
			{#if gameOngoing}
				{health}
			{:else}
				&infin;
			{/if}
		</div>
		<div class="flex gap-2 text-lg">
			<Sword
				class={(attacking ? 'animate-[ping_0.5s_infinite] fill-slate-500 text-slate-500' : '') +
					' ' +
					(isPoweredUp ? 'fill-yellow-500 text-yellow-500' : '')}
			/>
			<span
				class:animate-[pulse_1s_infinite]={attacking}
				class:text-xl={isPoweredUp}
				class:text-lg={!isPoweredUp}
			>
				{gameOngoing ? attack : 0}
			</span>
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
