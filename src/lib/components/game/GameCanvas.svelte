<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	import P5 from '../P5.svelte';

	$: serverData;

	// TODO: namespace this if possible (typescirpt namespace) in another file sketch.ts
	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
	}

	function draw(p5: any) {
		p5.background(0);
		if (serverData && serverData.players && serverData.players[socketId]) {
			const player = serverData.players[socketId];

			// FOR TESTING PLAYER CENTERED CAMERA
			const t = translateCoords({
				h: p5.height,
				w: p5.width,
				px: player.x,
				py: player.y,
				x: 0,
				y: 0
			});
			p5.fill(25, 120, 13);
			p5.stroke('white');
			p5.strokeWeight(5);
			p5.rect(t.x, t.y, 1000, 600);

			p5.stroke(0);
			p5.strokeWeight(1);
			for (const data in serverData.players) {
				const p = serverData.players[data];
				if (data === socketId) {
					p5.fill(player.color);
					// fix name later
					p5.text(player.name, p5.width / 2 - player.radius, p5.height / 2 - player.radius * 1.5);
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
				p5.text(p.name, pCoords.x - p.radius, pCoords.y - p.radius * 1.5);
				p5.ellipse(pCoords.x, pCoords.y, player.radius * 2, player.radius * 2);
			}
		} else {
			p5.push();
			p5.fill(255);
			p5.textSize(25);

			p5.text('loading', p5.width / 2, p5.height / 2);
			p5.pop();
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
