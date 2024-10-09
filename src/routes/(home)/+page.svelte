<script>
	import { Swords, SquarePlus, Fingerprint, Tag } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import HomeBackgorund from '$lib/components/home/HomeBackgorund.svelte';
</script>

<!-- Clean this page -->
<main class="relative flex h-screen w-screen flex-col items-center justify-center">
	<div class="absolute left-0 top-0">
		<HomeBackgorund />
	</div>
	<section
		class="relative rounded-xl border bg-slate-50 bg-opacity-75 px-16 py-24 shadow-md backdrop-blur-lg"
	>
		<div
			class="group absolute -left-8 top-2 -rotate-[20deg] rounded-md bg-red-900 px-4 py-2 hover:bg-red-800"
			title="our excuse if we fail the game physics"
		>
			<h2 class="text-xs text-white group-hover:text-slate-50">Physics engine not included!</h2>
		</div>
		<section class="flex flex-col gap-8">
			<div>
				<h1 class="text-9xl">deer</h1>
			</div>
			<div class="flex flex-col gap-2">
				<div class="mx-4 h-4">
					<Button text="Create Game" iconLeft={Swords} />
				</div>
				<div class="relative mx-4 flex items-center justify-center gap-4">
					<hr class="mb-4 mr-4 mt-8 h-0.5 flex-grow border-0 bg-slate-950" />
					<div class="absolute top-5 font-semibold">OR</div>
					<hr class="mb-4 mt-8 h-0.5 flex-grow border-0 bg-slate-950" />
				</div>
				<div class="mx-4 flex flex-col justify-between gap-4">
					<InputText placeholder="Game ID here." iconLeft={Fingerprint} />
					<InputText placeholder="Enter your name." iconLeft={Tag} />
					<Button text="Join Game" iconLeft={SquarePlus} />
				</div>
			</div>
		</section>
	</section>
</main>
