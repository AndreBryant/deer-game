<script lang="ts">
	import { Swords, SquarePlus, Fingerprint, Tag } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import HomeBackgorund from '$lib/components/home/HomeBackground.svelte';

	let gameID = '';
	let username = '';
	let valid = false;
	$: valid = checkValidity(gameID, username);

	function checkValidity(gameID: string, username: string) {
		return gameID.length > 0 && username.length > 0;
	}
</script>

<!-- Clean this page -->
<main class="relative flex h-screen w-screen select-none flex-col items-center justify-center">
	<div class="absolute left-0 top-0">
		<HomeBackgorund />
	</div>
	<section
		class="relative rounded-xl border bg-slate-50 bg-opacity-65 px-16 py-24 shadow-md backdrop-blur-lg"
	>
		<div
			class="group absolute -left-8 top-2 -rotate-[20deg] rounded-md bg-red-900 px-4 py-2 hover:bg-red-800"
			title="our excuse if we fail the game physics"
		>
			<h2 class="text-xs text-white group-hover:text-slate-50">Physics engine not included!</h2>
		</div>
		<section class="flex flex-col gap-8">
			<div>
				<h1 class="text-9xl">cat/deer</h1>
			</div>
			<div class="mx-32 flex flex-col gap-2">
				<div class="mx-4 h-4">
					<Button text="Create Game" iconLeft={Swords} href="./game?host=true" />
				</div>
				<div class="relative mx-4 flex items-center justify-center gap-4">
					<hr class="mb-4 mr-4 mt-8 h-0.5 flex-grow border-0 bg-slate-950" />
					<div class="absolute top-5 font-semibold">OR</div>
					<hr class="mb-4 mt-8 h-0.5 flex-grow border-0 bg-slate-950" />
				</div>
				<div class="mx-4 flex flex-col justify-between gap-4">
					<InputText placeholder="Game ID here." iconLeft={Fingerprint} bind:value={gameID} />
					<InputText placeholder="Enter your name." iconLeft={Tag} bind:value={username} />
					<Button
						text="Join Game"
						variant={valid ? 'primary' : 'disabled'}
						iconLeft={SquarePlus}
						href={`./game?host=false&gameID=${gameID}&username=${username}`}
					/>
				</div>
			</div>
		</section>
	</section>
</main>
