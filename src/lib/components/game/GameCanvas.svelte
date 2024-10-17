<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	import P5 from '../P5.svelte';
	import { drawPlayer } from '$lib/utils/render';

	$: serverData;
	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(255);
		p5.stroke(0);
	}

	function draw(p5: any) {
		p5.background(0);

		const player = serverData.players[socketId];
		console.log(player.x, player.y);

		// FOR TESTING PLAYER CENTERED CAMERA
		const t = translateCoords({
			h: p5.height,
			w: p5.width,
			px: player.x,
			py: player.y,
			x: 10,
			y: 10
		});
		p5.noFill();
		p5.stroke('white');
		p5.strokeWeight(5);
		p5.rect(t.x, t.y, 600, 600);

		p5.stroke(0);
		p5.strokeWeight(1);
		for (const data in serverData.players) {
			const p = serverData.players[data];
			if (data === socketId) {
				p5.fill(player.color);
				p5.ellipse(p5.width / 2, p5.height / 2, player.radius * 2, player.radius * 2);
				continue;
			}

			const pCoords = translateCoords({
				h: p5.height,
				w: p5.width,
				px: player.x,
				py: player.y,
				x: p.x,
				y: p.y
			});

			p5.fill(p.color);
			p5.ellipse(pCoords.x, pCoords.y, player.radius * 2, player.radius * 2);
		}
	}

	function windowResized(p5: any) {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
	}

	function translateCoords({ h, w, px, py, x, y }: any) {
		return {
			x: w / 2 + (x - px),
			y: h / 2 + (y - py)
		};
	}
</script>

<P5 {setup} {draw} {windowResized} />
