<script lang="ts">
	export let serverData: any;
	import P5 from '../P5.svelte';
	import { drawPlayer } from '$lib/classes/render';

	$: serverData;
	function setup(p5: any) {
		p5.createCanvas(600, 600);
		p5.background(255);
		p5.stroke(0);
	}

	function draw(p5: any) {
		p5.background(0);
		p5.stroke(0);

		for (const data in serverData) {
			const player = serverData[data];
			drawPlayer(player, p5);
		}
	}

	function windowResized(p5: any) {
		// p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
	}
</script>

<P5 {setup} {draw} {windowResized} />
