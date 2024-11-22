<script lang="ts">
	import { Heart, Sword, Trophy } from 'lucide-svelte';
	export let attack: number = 0;
	export let score: number = 0;
	export let health: number = 0;
	export let takingDamage: boolean = true;
	export let charging: boolean = false;
	export let x: number = 0;
	export let y: number = 0;
</script>

<div
	class="absolute left-0 top-0 bg-slate-950 bg-opacity-60 opacity-80 backdrop-blur-sm transition-all hover:opacity-100"
>
	<div class="flex flex-col gap-4 rounded-lg rounded-b-none border border-b-0 px-4 py-4">
		<div class="flex items-center gap-2 text-xl" class:animate-[pulse_1s_infinite]={takingDamage}>
			<Heart class="fill-red-500 text-red-800" />
			<progress
				class="[&::-moz-progress-bar]:bg-violet-40 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:bg-slate-700 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-red-700"
				value={health}
				max="25"
			></progress>
			<p class="absolute right-6 top-5 text-sm text-red-300">{((health / 25) * 100).toFixed(0)}%</p>
		</div>
		<div class="relative flex gap-2 text-xl">
			<Sword
				class={'fill-slate-300 text-slate-500' + (charging ? 'fill-slate-400 text-slate-600' : '')}
			/>
			<progress
				class="[&::-moz-progress-bar]:bg-violet-40 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:bg-slate-700 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-yellow-300"
				value={attack}
				max="8"
			/>
			<p class="absolute right-2 text-sm text-yellow-600">{((attack / 8) * 100).toFixed(0)}%</p>
		</div>
		<div class="flex w-full items-center gap-2 text-xl">
			<Trophy class="fill-slate-950 text-slate-50" />
			<p class="flex-grow truncate">{score}</p>
		</div>
	</div>
	<div class="flex w-full justify-center">
		<div class="flex w-full gap-8 rounded-lg rounded-t-none border px-4 py-2">
			<div>
				<p>x: {Math.floor(x / 32) - 2}</p>
			</div>
			<div>
				<p>y: {Math.floor(y / 32)}</p>
			</div>
		</div>
	</div>
</div>
