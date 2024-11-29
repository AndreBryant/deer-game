<script lang="ts">
	import { Swords, SquarePlus, Gamepad2, Info, ServerCog } from 'lucide-svelte';
	import HowToPlayTabButton from './HowToPlayTabButton.svelte';
	import HowToPlayAboutGame from './HowToPlayAboutGame.svelte';
	import HowToPlayCreateGame from './HowToPlayCreateGame.svelte';
	import HowToPlayJoinGame from './HowToPlayJoinGame.svelte';
	import HowToPlayGameMechanics from './HowToPlayGameMechanics.svelte';
	import HowToPlayKeyBindings from './HowToPlayKeyBindings.svelte';

	let currentActive = 0;
	const tabs = [
		{
			icon: Info,
			active: false,
			text: 'About Game'
		},
		{
			icon: Swords,
			active: false,
			text: 'Create Game'
		},
		{
			icon: SquarePlus,
			active: false,
			text: 'Join Game'
		},
		{
			icon: ServerCog,
			active: false,
			text: 'Game Mechanics'
		},
		{
			icon: Gamepad2,
			active: false,
			text: 'Key Bindings'
		}
	];
</script>

<div
	class="flex h-[75vh] w-[100vw] rounded-lg border border-slate-50 border-opacity-50 bg-slate-950 bg-opacity-60 text-white md:w-[85vw] lg:w-[70vw]"
>
	<div class="flex basis-3/12 flex-col border-r border-r-slate-50 border-opacity-40 p-4 pr-0">
		<div>
			<h2 class="mb-2 hidden pr-4 text-lg sm:block">How to Play</h2>
			<h2 class="mb-2 block pr-4 text-lg sm:hidden">How2Pl-A</h2>
			<hr class="opacity-40" />
		</div>
		<div class="flex flex-grow justify-end">
			<div class="w-full">
				<ul class="flex w-full flex-grow flex-col py-4">
					{#each tabs as tab, i}
						<HowToPlayTabButton
							icon={tab.icon}
							active={i === currentActive}
							text={tab.text}
							onclick={() => (currentActive = i)}
							tl={i === currentActive || i === 0 || i === currentActive + 1}
							bl={i === currentActive || i === tabs.length - 1 || i === currentActive - 1}
						/>
					{/each}
				</ul>
			</div>
		</div>
		<div>
			<p class="text-slate-100">Deer Game</p>
			<p class="text-slate-50 text-opacity-50">{import.meta.env.VERSION}</p>
		</div>
	</div>
	<div
		class="flex basis-9/12 flex-col gap-4 overflow-hidden rounded-lg rounded-l-none bg-slate-950 bg-opacity-30 p-4"
	>
		{#if currentActive === 0}
			<HowToPlayAboutGame />
		{:else if currentActive === 1}
			<HowToPlayCreateGame />
		{:else if currentActive === 2}
			<HowToPlayJoinGame />
		{:else if currentActive === 3}
			<HowToPlayGameMechanics />
		{:else if currentActive === 4}
			<HowToPlayKeyBindings />
		{/if}
	</div>
</div>
