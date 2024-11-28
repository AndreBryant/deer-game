<script lang="ts">
	import HomeBackground3 from '$lib/components/home/backgrounds/HomeBackground3.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import DeerGif from '$lib/sprites/idle.gif';
</script>

<main class="relative left-0 top-0 flex h-screen w-screen select-none overflow-hidden">
	<div class="absolute left-0 top-0">
		<HomeBackground3 />
	</div>
	<div
		class="z-10 flex h-full w-full flex-col items-center justify-center gap-4 bg-black bg-opacity-70 backdrop-blur-sm"
	>
		<div class="text-slate-50">
			<Button text="Exit to Main Menu" variant="link" iconLeft={ChevronLeft} href="/" />
		</div>
		<div
			class="flex w-[560px] flex-col gap-4 rounded-lg border border-slate-50 border-opacity-50 bg-slate-950 bg-opacity-60 px-4 py-4 text-white"
		>
			<div>
				<h2 class="text-xl text-slate-50">Credits</h2>
			</div>
			<hr class="opacity-50" />
			<div class="space-y-2 text-slate-50 text-opacity-60 hover:text-opacity-100">
				<p>This project includes assets and resources from Calciumtrice.</p>
				<p>We gratefully acknowledge their contributions:</p>
			</div>
			<div>
				<h3 class="text-xl text-slate-50">Sprites</h3>
			</div>
			<hr class="opacity-50" />
			<div class="space-y-4 text-slate-50 text-opacity-60 hover:text-opacity-100">
				<p class="font-semibold">Deer Spritesheets</p>
				<ul class="flex flex-col gap-2">
					<li class="ml-4"><span class="font-semibold">Source:</span> OpenGameArt.org</li>
					<li class="ml-4">
						<span class="font-semibold">License:</span> Creative Commons Attribution 3.0 (CC BY 3.0)
					</li>
					<li class="ml-4"><span class="font-semibold">Creator:</span> Calciumtrice</li>
				</ul>
				<p>The sprite was modified/adapted for this project.</p>
			</div>
			<div>
				<h3 class="text-xl text-slate-50">License Notes</h3>
			</div>
			<hr class="opacity-50" />
			<div class="space-y-4 text-slate-50 text-opacity-60 hover:text-opacity-100">
				<p>
					Assets under the Creative Commons Attribution 3.0 license can be shared and adapted,
					provided proper credit is given to the creator.
				</p>
				<p>
					For more information about the CC BY 3.0 license, visit
					https://creativecommons.org/licenses/by/3.0/.
				</p>
			</div>
		</div>
	</div>
</main>
