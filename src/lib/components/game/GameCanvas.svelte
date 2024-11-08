<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	export let mapData:
		| { mapData: string; height: number; width: number; tileSize: number }
		| undefined;
	import P5 from '../P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import mDeerRed from '$lib/sprites/mDeerRed.png';
	import fDeer from '$lib/sprites/fDeer.png';
	import fDeerRed from '$lib/sprites/fDeerRed.png';
	import { drawPlayer } from '$lib/sprites/Sprite';
	import { drawMap, drawMapTiles, drawBGGradient, translateCoords } from '$lib/utils/render';

	$: serverData;
	$: sortedPlayers = serverData.players
		? Object.values(serverData.players).sort((a: any, b: any) => a.y - b.y)
		: [];
	let mapImage: any;
	let bgImage: any;
	let deerSpriteSheet: any;
	let hornDeerSpriteSheet: any;
	let redDeerSpriteSheet: any;
	let redHornDeerSpriteSheet: any;

	let fps = 60;
	let fpsDisplay = fps;

	function preload(p5: any) {
		deerSpriteSheet = p5.loadImage(fDeer);
		hornDeerSpriteSheet = p5.loadImage(mDeer);
		redDeerSpriteSheet = p5.loadImage(fDeerRed);
		redHornDeerSpriteSheet = p5.loadImage(mDeerRed);
	}

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.frameRate(fps);
		p5.noSmooth();

		setupMap(p5);
		setupBGGradientGraphics(p5);
	}

	function setupBGGradientGraphics(p5: any) {
		let graphics = p5.createGraphics(p5.width, p5.height);
		drawBGGradient(graphics);
		bgImage = graphics.get();
	}

	function setupMap(p5: any) {
		if (mapData) {
			let graphics = p5.createGraphics(
				mapData?.width * mapData.tileSize,
				mapData?.height * mapData.tileSize
			);
			drawMapTiles(graphics, mapData);
			mapImage = graphics.get();
		}
	}

	function draw(p5: any) {
		// const frame = p5.frameCount % fps;
		// if (frame === 0) console.time('draw ' + p5.frameCount);
		fpsDisplay = p5.frameRate();

		p5.background(bgImage);

		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			const player = serverData.players[socketId];
			drawMap(p5, mapImage, player.x, player.y);

			sortedPlayers.forEach((p: any) => {
				const spriteSheet = p.hasNose
					? p.sex === 'm'
						? redHornDeerSpriteSheet
						: redDeerSpriteSheet
					: p.sex === 'm'
						? hornDeerSpriteSheet
						: deerSpriteSheet;

				if (p.id === socketId) {
					drawPlayer(p5, spriteSheet, p5.width / 2, p5.height / 2, p);
					return;
				}

				const xDistance = p5.abs(p.x - player.x) - 100;
				const yDistance = p5.abs(p.y - player.y) - 100;

				if (xDistance <= p5.width / 2 && yDistance <= p5.height / 2) {
					const pCoords = translateCoords({
						h: p5.height,
						w: p5.width,
						px: player.x,
						py: player.y,
						x: p.x,
						y: p.y
					});
					drawPlayer(p5, spriteSheet, pCoords.x, pCoords.y, p);
				}
			});
			// if (frame === 0) console.timeEnd('draw ' + p5.frameCount);
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

		setupMap(p5);
		setupBGGradientGraphics(p5);
	}
</script>

<div class="absolute flex h-full w-full justify-center">
	<p class="text-red-300">
		Frame Rate {fpsDisplay.toFixed(0)}
	</p>
</div>
<div>
	<P5 {preload} {setup} {draw} {windowResized} />
</div>
