<script lang="ts">
	import P5 from '$lib/components/P5.svelte';
	import { palette, getRandomColor } from '$lib/utils/palette';

	let dim = 70;
	let row: number, col: number;
	let lines: { line: number[][]; currentColor: any; targetColor: any }[] = [];
	const colors = [
		palette.primary.darkBrown,
		palette.primary.brown,
		palette.primary.yellow,
		palette.primary.skinTone
	];

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		row = p5.ceil(p5.height / dim);
		col = p5.ceil(p5.width / dim);
		p5.strokeWeight(1.5);
		generateLines(p5);
	}

	function draw(p5: any) {
		p5.clear();
		p5.background(30);
		for (const [index, line] of lines.entries()) {
			let currentColor = p5.color(line.currentColor);
			let targetColor = p5.color(line.targetColor);
			line.currentColor = p5.lerpColor(currentColor, targetColor, 0.1).toString();

			p5.stroke(line.currentColor);
			p5.line(line.line[0][0], line.line[0][1], line.line[1][0], line.line[1][1]);

			if (p5.frameCount % 120 < 90 && p5.random(1) < 0.75) {
				line.targetColor = p5.random(colors);
			}
		}
	}

	function windowResized(p5: any) {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
		row = p5.ceil(p5.height / dim);
		col = p5.ceil(p5.width / dim);
		generateLines(p5);
	}

	function generateLines(p5: any) {
		lines = [];
		for (let i = 0; i < row; i++) {
			for (let j = 0; j < col; j++) {
				const initialColor = p5.random(colors);
				const targetColor = p5.random(colors);
				let line;

				if (p5.random(1) > 0.5) {
					line = [
						[j * dim, i * dim],
						[(j + 1) * dim, (i + 1) * dim]
					];
				} else {
					line = [
						[(j + 1) * dim, i * dim],
						[j * dim, (i + 1) * dim]
					];
				}
				lines.push({ line, currentColor: initialColor, targetColor });
			}
		}
	}
</script>

<P5 {draw} {setup} {windowResized} />
