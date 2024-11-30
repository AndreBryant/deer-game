<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		const handleFullscreen = (e) => {
			if (browser) {
				if (e.key === 'f' && e.altKey) {
					e.preventDefault();
					if (!document.fullscreenElement) {
						document.documentElement.requestFullscreen().catch((err) => {
							console.error('Error attempting to enable fullscreen:', err.message);
						});
					} else {
						document.exitFullscreen().catch((err) => {
							console.error('Error attempting to exit fullscreen:', err.message);
						});
					}
				}
			}
		};
		window.addEventListener('keydown', handleFullscreen);

		return () => {
			window.removeEventListener('keydown', handleFullscreen);
		};
	});
</script>

<slot />
