<script lang="ts">
	import HomeBackground3 from '$lib/components/home/backgrounds/HomeBackground3.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import HowToPlayTab from '$lib/components/how_to_play/HowToPlayTab.svelte';
</script>

<svelte:head>
	<title>Deer Game | How to Play</title>
</svelte:head>

<main class="relative left-0 top-0 flex h-screen w-screen select-none overflow-hidden">
	<div class="absolute left-0 top-0">
		<HomeBackground3 />
	</div>
	<div
		class="z-10 flex h-full w-full flex-col items-center justify-center gap-4 bg-black bg-opacity-70 backdrop-blur-sm"
	>
		<div class="text-slate-50">
			<Button text="Back to Main Menu" variant="link" iconLeft={ChevronLeft} href="/" />
		</div>
		<HowToPlayTab />
	</div>
</main>
