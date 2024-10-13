<script lang="ts">
	import { Swords, SquarePlus, Fingerprint, Tag, Check, X } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import InputText from '$lib/components/ui/InputText.svelte';
	import HomeBackground from '$lib/components/home/HomeBackground.svelte';
	import HomeBackground2 from '$lib/components/home/HomeBackground2.svelte';

	import { io } from 'socket.io-client';
	const ws = io();

	let rooms: { [key: string]: number } = {};
	ws.on('rooms_updated', (data) => {
		rooms = data;
	});

	ws.on('connection', (data) => {
		rooms = data;
	});

	let gameID = '';
	let username = '';
	let valid = false;
	$: valid = checkRoom(gameID) && checkUsername(username);

	function checkUsername(username: string) {
		return username.length > 0;
	}

	function checkRoom(gameID: string) {
		return Boolean(rooms[gameID]);
	}

	$: rooms;

	let r = Math.random();
</script>

<!-- {JSON.stringify(rooms, null, 2)} -->
<!-- Clean this page -->
<main class="relative flex h-screen w-screen select-none flex-col items-center justify-center">
	<div class="absolute left-0 top-0">
		{#if r < 0.5}
			<HomeBackground />
		{:else}
			<HomeBackground2 />
		{/if}
	</div>
	<section
		class="relative rounded-xl border bg-slate-50 bg-opacity-{r < 0.5
			? '65'
			: '100'} px-16 py-24 shadow-md backdrop-blur-lg"
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
			<div class="mx-full flex flex-col gap-2">
				<div class="mx-4 h-4">
					<Button text="Create Game" iconLeft={Swords} href="./game?host=true" />
				</div>
				<div class="relative mx-4 flex items-center justify-center gap-4">
					<hr class="mb-4 mr-4 mt-8 h-0.5 flex-grow border-0 bg-slate-950" />
					<div class="absolute top-5 font-semibold">OR</div>
					<hr class="mb-4 mt-8 h-0.5 flex-grow border-0 bg-slate-950" />
				</div>
				<div class="mx-4 flex flex-col justify-between gap-4">
					<div>
						<InputText placeholder="Game ID here." iconLeft={Fingerprint} bind:value={gameID} />
						<div class="flex h-2 gap-1 pl-7 text-sm">
							{#if gameID.length > 0}
								{#if checkRoom(gameID)}
									<Check color="green" size="18" /><span class="text-green-700"
										>Available({rooms[gameID]})
									</span>
								{:else}
									<X color="red" size="18" />
									<span class="text-red-600">Not available</span>
								{/if}
							{/if}
						</div>
					</div>
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
