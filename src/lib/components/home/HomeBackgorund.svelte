<script lang="ts">
	import P5 from '$lib/components/home/P5.svelte';
	import { palette } from './palette';
	import { Ball } from './ball';

	let qt = 100;
	let Balls: any[] = [];

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);

		for (let i = 0; i < qt; i++) {
			const radius = p5.random(10, 50);

			Balls.push(
				new Ball(
					p5.random(0, p5.windowWidth),
					p5.random(0, p5.windowHeight),
					radius,
					p5.random(Object.values(palette.primary))
				)
			);
		}
	}

	function draw(p5: any) {
		p5.background(255);
		p5.stroke(0);
		p5.fill(palette.primary.brown);
		p5.ellipse(p5.windowWidth / 2, p5.windowHeight / 2, 300, 300);
		console.log(Balls.length);
		for (let i = 0; i < qt; i++) {
			Balls[i].update(p5);
			Balls[i].show(p5);
		}
	}

	function windowResized(p5: any) {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

		for (let i = 0; i < qt; i++) {
			Balls[i].dx = 2;
			Balls[i].dy = 2;
		}
	}
</script>

<P5 {draw} {setup} {windowResized} />
