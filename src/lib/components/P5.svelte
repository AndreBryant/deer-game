<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	let p5Sketch: import('p5');
	let canvas: HTMLElement | undefined;

	export let preload = (p5js: any) => {};
	export let setup = (p5js: any) => {};
	export let draw = (p5js: any) => {};
	export let windowResized = (p5js: any) => {};
	export let mouseMoved = (p5js: any) => {};

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const p5 = await import('p5');
			p5.disableFriendlyErrors = true;

			p5Sketch = new p5.default((p5js) => {
				p5js.preload = () => preload(p5js);
				p5js.setup = () => setup(p5js);
				p5js.draw = () => draw(p5js);
				p5js.windowResized = () => windowResized(p5js);
				p5js.mouseMoved = () => mouseMoved(p5js);
			}, canvas);
			// console.log(p5Sketch, p5);
		}
	});

	onDestroy(() => {
		if (p5Sketch && p5Sketch.remove) {
			p5Sketch.remove();
		}
	});
</script>

<div bind:this={canvas}></div>
