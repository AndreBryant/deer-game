<script lang="ts">
	import { browser } from '$app/environment';
	import { Maximize, Minimize } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let fullscreen = false;
	let fullScreenButton: HTMLButtonElement;

	function toggleFullscreen() {
		if (!browser) return;

		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch((err) => {
				console.error('Error attempting to enable fullscreen:', err.message);
			});
		} else {
			document.exitFullscreen().catch((err) => {
				console.error('Error attempting to exit fullscreen:', err.message);
			});
		}

		fullScreenButton.blur();
	}

	function updateFullscreenState() {
		fullscreen = !!document.fullscreenElement || window.innerHeight === screen.height;
	}

	$: if (browser) {
		fullscreen = !!document.fullscreenElement || window.innerHeight === screen.height;
	}

	onMount(() => {
		if (browser) {
			fullscreen = !!document.fullscreenElement || window.innerHeight === screen.height;
			fullScreenButton = document.querySelector('#fullscreen-button') as HTMLButtonElement;
			document.addEventListener('fullscreenchange', updateFullscreenState);

			window.addEventListener('resize', updateFullscreenState);
		}

		return () => {
			if (browser) {
				document.removeEventListener('fullscreenchange', updateFullscreenState);
				window.removeEventListener('resize', updateFullscreenState);
			}
		};
	});
</script>

<button
	on:click={toggleFullscreen}
	class="absolute bottom-32 z-10 flex w-40 items-center gap-2 rounded-lg border bg-slate-950 bg-opacity-60 p-2 opacity-70 backdrop-blur-sm hover:opacity-90"
	id="fullscreen-button"
>
	{#if fullscreen}
		<Minimize />
		<span class="text-sm">- windowed</span>
	{:else}
		<Maximize />
		<span class="text-sm">- fullscreen</span>
	{/if}
</button>
