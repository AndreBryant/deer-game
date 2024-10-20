<!-- Transfer other functions to render.ts -->

<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	export let mapData:
		| { mapData: string; height: number; width: number; tileSize: number }
		| undefined;
	import P5 from '../P5.svelte';

	$: serverData;
	let mapImage: any;
	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		if (mapData) {
			let graphics = p5.createGraphics(
				mapData?.width * mapData.tileSize,
				mapData?.height * mapData.tileSize
			);
			drawMapTiles(graphics, mapData);
			mapImage = graphics.get();
		}
		p5.noSmooth();
	}

	// Clean code here and try to draw the real map
	function draw(p5: any) {
		p5.background(0);
		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			const player = serverData.players[socketId];

			drawMap(p5, mapData, player);
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

	function drawMap(
		p5: any,
		mapData: { mapData: string; height: number; width: number; tileSize: number },
		player: any
	) {
		const t = translateCoords({
			h: p5.height,
			w: p5.width,
			px: player.x,
			py: player.y,
			x: 0,
			y: 0
		});
		p5.image(mapImage, t.x, t.y);
	}

	function drawMapTiles(
		graphics: any,
		mapData: { mapData: string; height: number; width: number; tileSize: number }
	) {
		graphics.noStroke();
		graphics.noSmooth();
		for (let y = 0; y < mapData.height; y++) {
			for (let x = 0; x < mapData.width; x++) {
				const index = y * mapData.width + x;
				const char = mapData.mapData[index];

				switch (char) {
					case '=':
						// let grassNoise = graphics.noise(x * 0.1, y * 0.1);
						graphics.fill(10, graphics.random(75, 95), 10);
						break; // Grass
					case '#':
						graphics.fill(graphics.random(25, 35));
						break; // Wall
					case 'F':
						graphics.fill(100, 0, 0);
						break; // flag
					case '~':
						graphics.fill(20, 20, graphics.random(80, 120));
						break; // Water
					case '-':
						graphics.fill(25);
						break; // shore
					default:
						graphics.fill(255); // Default color
				}

				graphics.rect(
					x * mapData.tileSize,
					y * mapData.tileSize,
					mapData.tileSize,
					mapData.tileSize
				);
			}
		}
	}
</script>

<P5 {setup} {draw} {windowResized} />
