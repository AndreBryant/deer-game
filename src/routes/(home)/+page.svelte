<script>
	import { Swords, SquarePlus, Fingerprint } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import HomeBackgorund from '$lib/components/home/HomeBackgorund.svelte';
</script>

<main class="relative flex h-screen w-screen flex-col items-center justify-center">
	<div class="absolute left-0 top-0">
		<HomeBackgorund />
	</div>
	<section class="rounded-xl border bg-slate-50 bg-opacity-75 px-16 py-24 backdrop-blur-lg">
		<section class="flex flex-col gap-8">
			<div>
				<h1 class="text-9xl">deer</h1>
			</div>
			<div class="flex flex-col gap-4">
				<div class="mx-4">
					<Button text="Create Game" iconLeft={Swords} />
				</div>
				<div class="mx-4 flex flex-col justify-between gap-4">
					<Button text="Join Game" iconLeft={SquarePlus} />
					<InputText placeholder="Game ID here." iconLeft={Fingerprint} />
				</div>
			</div>
		</section>
	</section>
</main>
