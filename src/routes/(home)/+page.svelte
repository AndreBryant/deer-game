<script lang="ts">
	import { Swords, SquarePlus, Fingerprint, Tag, Check, X } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import InputText from '$lib/components/ui/InputText.svelte';
	import HomeBackground3 from '$lib/components/home/HomeBackground3.svelte';
	import { io } from 'socket.io-client';
	import { onDestroy } from 'svelte';

	// const ws = io('ws://10.103.7.248:3000');
	const ws = io();

	let rooms: { [key: string]: { players: number; mapData: string } } = {};
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

	let validStatus: 'valid' | 'invalid' | 'none' = 'none';
	$: validStatus = checkRoom(gameID) ? 'valid' : 'invalid';
	$: validStatus = gameID.length <= 0 ? 'none' : checkRoom(gameID) ? 'valid' : 'invalid';

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
		class="relative rounded-xl border bg-slate-50 bg-opacity-55 px-16 py-24 shadow-md backdrop-blur-lg transition hover:bg-opacity-75"
	>
		<div
			class="custom-animation group absolute -left-8 top-2 -rotate-[20deg] rounded-md bg-red-900 px-4 py-2 hover:bg-red-800"
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
				<div class="mx-4 flex flex-col justify-between gap-6">
					<div>
						<InputText
							placeholder="Game ID here."
							iconLeft={Fingerprint}
							bind:value={gameID}
							bind:valid={validStatus}
							bind:numOfPlayers
						/>
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
