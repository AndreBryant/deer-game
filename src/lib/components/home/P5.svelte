<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	let p5Sketch: import('p5');
	let canvas: HTMLElement | undefined;

	export let setup = (p5js: any) => {};
	export let draw = (p5js: any) => {};
	export let windowResized = (p5js: any) => {};

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const p5 = await import('p5');

			p5Sketch = new p5.default((p5js) => {
				p5js.setup = () => setup(p5js);
				p5js.draw = () => draw(p5js);
				p5js.windowResized = () => windowResized(p5js);
			}, canvas); // Attach p5 sketch to the canvas element
		}
	});

	onDestroy(() => {
		if (p5Sketch && p5Sketch.remove) {
			p5Sketch.remove();
		}
	});
</script>

<div bind:this={canvas}></div>
