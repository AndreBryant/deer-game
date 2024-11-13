<script lang="ts">
	import {
		Swords,
		SquarePlus,
		Tag,
		CircleHelp,
		Copyright,
		ChevronLeft,
		Search,
		User
	} from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import InputText from '$lib/components/ui/InputText.svelte';
	import HomeBackground3 from '$lib/components/home/HomeBackground3.svelte';
	import { io } from 'socket.io-client';
	import { onDestroy } from 'svelte';

	const ws = io(import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_SERVER_URL);

	let rooms: { [key: string]: { players: number; isGameStarted: boolean } } = {};
	ws.on('rooms_updated', (data) => {
		rooms = data;
	});

	ws.on('connection', (data) => {
		rooms = data;
	});

	let username = '';

	let createValid = false;
	$: createValid = checkUsername(username);

	let joinValid = false;
	$: joinValid = checkUsername(username);

	let joinRoomPressed = false;
	function toggleJoinPressed() {
		joinRoomPressed = !joinRoomPressed;
	}

	function checkUsername(username: string) {
		return username.length > 0;
	}

	let searchTerm = '';

	$: rooms;

	let numOfPlayers = '';
	let filteredRooms = {};

	$: {
		const filtered = Object.entries(rooms).filter(
			([gameID]) =>
				gameID.toLowerCase().includes(searchTerm.toLowerCase()) && !rooms[gameID].isGameStarted
		);
		filteredRooms = Object.fromEntries(filtered);
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
			{#if !joinRoomPressed}
				<div class="flex flex-col gap-8">
					<div class="h-8 w-full">
						<InputText placeholder="Enter your name." iconLeft={Tag} bind:value={username} />
					</div>
					<div class="flex h-12 w-80">
						<div class="flex flex-col justify-center">
							<Button
								text="Create Game"
								iconLeft={Swords}
								variant={createValid ? 'primary' : 'disabled'}
								href={`./game?host=true&username=${username}`}
							/>
						</div>
						<div class="ml-12 flex w-[1px] flex-col">
							<div class="w-full flex-grow bg-black"></div>
							<div class="-ml-[6px] text-xs">OR</div>
							<div class="w-full flex-grow bg-black"></div>
						</div>
						<div class="flex flex-grow items-center justify-center pl-4">
							<Button
								text="Join Game"
								variant={joinValid ? 'primary' : 'disabled'}
								iconLeft={SquarePlus}
								onclick={toggleJoinPressed}
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<Button text="How to Play" variant={'link'} iconLeft={CircleHelp} href={`./`} />
					<Button text="Credits" variant={'link'} iconLeft={Copyright} href={`./`} />
				</div>
			{:else}
				<div class="flex w-80 flex-col gap-4">
					<div class="w-full">
						<InputText
							placeholder="Search Game ID..."
							iconLeft={Search}
							bind:value={searchTerm}
							bind:numOfPlayers
						/>
					</div>
					<div class="max-h-4 w-full overflow-hidden text-xs font-normal">
						<p class="truncate">
							Joining as <span class="text-ellipsis font-semibold">
								{username.trim().length <= 0 ? '_blank' : username}
							</span>
						</p>
					</div>
					<div
						class="custom-scrollbar flex h-56 flex-col overflow-y-auto border-y border-black py-1 pr-2"
					>
						{#if Object.entries(filteredRooms).length > 0}
							{#each Object.entries(filteredRooms) as [gameID, { players }]}
								<div
									class="flex w-full justify-between border-t border-black border-opacity-20 px-2 py-4 transition-all duration-75 hover:bg-[#f5f5f5] hover:bg-opacity-20"
								>
									<div class="flex flex-col gap-2">
										<div class="">
											<span class="text-sm font-semibold">GameID: </span>
											<span class="text-sm">
												{gameID}
											</span>
										</div>
										<div class="w-24 text-sm">
											<Button
												text="> join game"
												variant={'primary'}
												href={`./game?host=false&gameID=${gameID}&username=${username}`}
											/>
										</div>
									</div>
									<div class="flex flex-col">
										<div class="flex justify-end gap-2 text-sm">
											{players}<User size="16" />
										</div>
									</div>
								</div>
							{/each}
						{:else}
							<div class="text-sm">No rooms found...</div>
						{/if}
					</div>
					<div>
						<Button text="Back" variant="link" iconLeft={ChevronLeft} onclick={toggleJoinPressed} />
					</div>
				</div>
			{/if}
		</section>
	</section>
</main>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 2px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: white;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.479);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: red;
	}

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
