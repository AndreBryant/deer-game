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
	import {
		drawMap,
		translateCoords,
		setupMap,
		setupGalaxy,
		setupBGGradientGraphics,
		drawGalaxy
	} from '$lib/utils/render';

	$: serverData;
	$: sortedPlayers = serverData.players
		? Object.values(serverData.players).sort((a: any, b: any) => a.y - b.y)
		: [];
	let mapImage: any;
	let bgImage: any;
	// Parallax bg
	let starCount = 250;
	let treeCount = 200;
	let starSet: { x: number; y: number; z: number }[] = [];
	let treeSet: { x: number; y: number; z: number; angle: number }[] = [];

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

		mapImage = setupMap(p5, mapData);
		bgImage = setupBGGradientGraphics(p5);

		let { stars, trees } = setupGalaxy(p5, starCount, treeCount);
		starSet = stars;
		treeSet = trees;
		console.log(starSet);
	}

	function draw(p5: any) {
		fpsDisplay = p5.frameRate();

		p5.background(bgImage);
		// Draw the parallaxed objects here

		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			const player = serverData.players[socketId];
			drawGalaxy(p5, starSet, treeSet, player.x, player.y);
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

		mapImage = setupMap(p5, mapData);
		bgImage = setupBGGradientGraphics(p5);

		let { stars, trees } = setupGalaxy(p5, starCount, treeCount);
		starSet = stars;
		treeSet = trees;
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
