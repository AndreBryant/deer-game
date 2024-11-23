<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { serverData } from '$lib/stores/socketStore';
	import HomeBackground2 from '$lib/components/home/backgrounds/HomeBackground3.svelte';
	const data = $serverData.players ?? {
		a: { name: 'joea', score: 3 },
		b: { name: 'joeb', score: 5 },
		c: { name: 'joec', score: 1 }
	};

	const ranking = Object.values(data).sort((a: any, b: any) => b.score - a.score);

	onMount(() => {
		if (!data) goto('/');
	});
</script>

<svelte:head>
	<title>Results</title>
</svelte:head>

{#if data}
	<div class="absolute -z-10">
		<HomeBackground2 />
	</div>
	<main class="flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
		<div class="text-slate-50">
			<Button text="Back" variant="link" iconLeft={ChevronLeft} onclick={() => goto('/')} />
		</div>
		<div
			class="flex flex-col gap-4 rounded-lg border border-slate-50 border-opacity-50 bg-slate-950 bg-opacity-50 px-4 py-2 text-slate-50 backdrop-blur-sm"
		>
			<div>
				<h3 class="text-3xl">Final Results</h3>
				<hr class="border border-slate-50 border-opacity-50" />
			</div>
			<ul class="">
				{#each ranking as rank, i}
					<div>
						{i + 1}: {rank.name} - {rank.score}
					</div>
				{/each}
			</ul>
		</div>
	</main>
{/if}
