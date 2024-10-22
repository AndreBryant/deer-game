<!-- Transfer other functions to render.ts -->

<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	export let mapData:
		| { mapData: string; height: number; width: number; tileSize: number }
		| undefined;
	import P5 from '../P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import { DEER_SPRITE_ANIMATION_DATA } from '$lib/sprites/Sprite';

	$: serverData;
	let mapImage: any;
	let spriteSheet: any;

	function preload(p5: any) {
		spriteSheet = p5.loadImage(mDeer);
	}

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);

		// For the Background (TEMPORARY)
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

	let spriteTick = 0;
	function draw(p5: any) {
		p5.background(0);

		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			const player = serverData.players[socketId];
			drawMap(p5, mapData, player);
			for (const data in serverData.players) {
				const p = serverData.players[data];
				if (data === socketId) {
					p5.fill(player.color);
					p5.text(player.name, p5.width / 2 - player.radius, p5.height / 2 - player.radius * 1.5);

					// Add this to player class
					const isFacingLeft = player.isFacingLeft;
					const action = player.action;
					const slownessFactor = DEER_SPRITE_ANIMATION_DATA[action].slowness_factor;
					const frame =
						p5.floor(p5.frameCount / slownessFactor) %
						DEER_SPRITE_ANIMATION_DATA[action].positions.length;
					p5.push();
					if (isFacingLeft) {
						p5.scale(-1, 1);
						p5.translate(-p5.width, 0);
					}
					p5.fill(0, 0, 0, 50);
					p5.noStroke();
					p5.ellipse(p5.width / 2, p5.height / 2 + 64, 128, 16);
					p5.imageMode(p5.CENTER);
					p5.image(
						spriteSheet,
						p5.width / 2,
						p5.height / 2,
						128,
						128,
						DEER_SPRITE_ANIMATION_DATA[action].positions[frame].x,
						DEER_SPRITE_ANIMATION_DATA[action].positions[frame].y,
						32,
						32
					);
					p5.pop();
					continue;
				}
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
						graphics.fill(10, graphics.random(75, 85), 10);
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

<P5 {preload} {setup} {draw} {windowResized} />
