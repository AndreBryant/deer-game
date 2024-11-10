<script lang="ts">
	import { Swords, SquarePlus, Fingerprint, Tag, CircleHelp, Copyright } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import InputText from '$lib/components/ui/InputText.svelte';
	import HomeBackground3 from '$lib/components/home/HomeBackground3.svelte';
	import { io } from 'socket.io-client';
	import { onDestroy } from 'svelte';

	const ws = io(import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_SERVER_URL);

	let rooms: { [key: string]: { players: number; mapData: string } } = {};
	ws.on('rooms_updated', (data) => {
		rooms = data;
	});

	ws.on('connection', (data) => {
		rooms = data;
	});

	let gameID = '';
	let username = '';

	let joinValid = false;
	$: joinValid = checkRoom(gameID) && checkUsername(username);

	let createValid = false;
	$: createValid = checkUsername(username);

	let joinValidStatus: 'valid' | 'invalid' | 'none' = 'none';
	$: joinValidStatus = checkRoom(gameID) ? 'valid' : 'invalid';
	$: joinValidStatus = gameID.length <= 0 ? 'none' : checkRoom(gameID) ? 'valid' : 'invalid';

	function checkUsername(username: string) {
		return username.length > 0;
	}

	function checkRoom(gameID: string) {
		return Boolean(rooms[gameID]);
	}

	$: rooms;

	let numOfPlayers = '';
	$: if (rooms[gameID]) {
		numOfPlayers = rooms[gameID].players.toString();
	} else {
		numOfPlayers = '';
	}

	onDestroy(() => ws?.disconnect());
</script>

<main class="relative flex h-screen w-screen select-none flex-col items-center justify-center">
	<div class="absolute left-0 top-0">
		<HomeBackground3 />
	</div>
	<section
		class="relative flex flex-col gap-8 rounded-xl border bg-slate-50 bg-opacity-55 px-16 py-16 shadow-md backdrop-blur-lg transition hover:bg-opacity-75"
	>
		<div
			class="custom-animation group absolute -left-8 top-2 -rotate-[20deg] rounded-md bg-red-900 px-4 py-2 hover:bg-red-800"
			title="our excuse if we fail the game physics"
		>
			<h2 class="text-xs text-white group-hover:text-slate-50">Physics engine not included!</h2>
		</div>
		<section class="mx-4 flex flex-col gap-8">
			<div>
				<h1 class="mb-4 mt-8 text-center text-9xl">deer</h1>
			</div>
			<div class="mx-full flex flex-col gap-8">
				<div class="h-4">
					<InputText placeholder="Enter your name." iconLeft={Tag} bind:value={username} />
				</div>
				<div class="flex h-24">
					<div class="mr-8 flex flex-grow basis-1/2 flex-col justify-center gap-4">
						<InputText
							placeholder="Game ID here."
							iconLeft={Fingerprint}
							bind:value={gameID}
							bind:valid={joinValidStatus}
							bind:numOfPlayers
						/>
						<Button
							text="Join Game"
							variant={joinValid ? 'primary' : 'disabled'}
							iconLeft={SquarePlus}
							href={`./game?host=false&gameID=${gameID}&username=${username}`}
						/>
					</div>
					<div class="mr-4 flex w-[1px] flex-col">
						<div class="w-full flex-grow bg-black"></div>
						<div class="-ml-2">OR</div>
						<div class="w-full flex-grow bg-black"></div>
					</div>
					<div class="ml-4 flex flex-grow basis-1/2 items-center">
						<Button
							text="Create Game"
							iconLeft={Swords}
							variant={createValid ? 'primary' : 'disabled'}
							href={`./game?host=true&username=${username}`}
						/>
					</div>
				</div>
			</div>
		</section>
		<section class="mx-4 flex flex-col gap-4">
			<Button text="How to Play" variant={'link'} iconLeft={CircleHelp} href={`./`} />

			<Button text="Credits" variant={'link'} iconLeft={Copyright} href={`./`} />
		</section>
	</section>
</main>

<style>
	.custom-animation {
		animation: float 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
		backface-visibility: hidden;
	}

	@keyframes float {
		0% {
			scale: 1;
		}

		50% {
			scale: 1.03;
		}

		100% {
			scale: 1;
		}
	}
</style>
