<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	export let mapData: ClientSideMapData | undefined;
	export let timestamp: number;
	export let gameOngoing: boolean;
	export let safeZoneBoundary: number;

	import P5 from '$lib/components/P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import mDeerRed from '$lib/sprites/mDeerRed.png';
	import fDeer from '$lib/sprites/fDeer.png';
	import fDeerRed from '$lib/sprites/fDeerRed.png';
	import { randomPlayerOffsets } from '$lib/stores/socketStore';
	import GameFPS from './GameFPS.svelte';
	import {
		setupGalaxy,
		setupBGGradientGraphics,
		setupMap,
		drawGalaxy,
		drawMap,
		drawDangerZone,
		drawPlayer,
		drawPlayerArrow,
		drawDeathScreen,
		translateCoords
	} from '$lib/utils/render';

	$: serverData;
	$: mapData;
	$: sortedPlayers = serverData.players
		? Object.values(serverData.players).sort((a: any, b: any) => a.y - b.y)
		: [];

	let mapImage: any;
	let bgImage: any;
	// Parallax bg
	let starCount = 350;
	let treeCount = 100;
	let starSet: Star[] = [];
	let treeSet: Tree[] = [];

	let deerSpriteSheet: any;
	let hornDeerSpriteSheet: any;
	let redDeerSpriteSheet: any;
	let redHornDeerSpriteSheet: any;

	let fps = 60;
	let fpsDisplay = fps;
	let previousX = 0;
	let previousY = 0;

	function preload(p5: any) {
		// Preload these images.
		deerSpriteSheet = p5.loadImage(fDeer);
		hornDeerSpriteSheet = p5.loadImage(mDeer);
		redDeerSpriteSheet = p5.loadImage(fDeerRed);
		redHornDeerSpriteSheet = p5.loadImage(mDeerRed);
	}

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.frameRate(fps);
		p5.noSmooth();

		// Setup Galaxy
		let { stars, trees } = setupGalaxy(p5, starCount, treeCount);
		starSet = stars;
		treeSet = trees;

		// Setup Background
		bgImage = setupBGGradientGraphics(p5);

		// Setup Map
		mapImage = setupMap(p5, mapData);
	}

	function draw(p5: any) {
		fpsDisplay = p5.frameRate();
		p5.background(0);
		p5.background(bgImage);

		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			const player = serverData.players[socketId];

			// Sacrilegious but i think this works
			if (player.isDead) {
				// Death Screen Should stay where the player died
				player.x = previousX;
				player.y = previousY;
			} else {
				// Store "soon to be" previous position
				previousX = player.x;
				previousY = player.y;
			}

			// Generate the on-screen non-player stuff
			// TODO: verify these function if they really render on-screen objects
			drawGalaxy(p5, starSet, treeSet, player.x, player.y);
			drawMap(p5, mapImage, player.x, player.y);
			if (gameOngoing) {
				drawDangerZone(p5, safeZoneBoundary, player.x, player.y);
			}

			// Draw the on-screen players
			sortedPlayers.forEach((p: any) => {
				// If player is dead, don't draw (still playing the death screen)
				if (p.isDead) return;

				// Choose Correct the Sprite
				const spriteSheet = p.isPoweredUp
					? p.sex === 'm'
						? redHornDeerSpriteSheet
						: redDeerSpriteSheet
					: p.sex === 'm'
						? hornDeerSpriteSheet
						: deerSpriteSheet;

				// Draw your player (the client) they should be at the center of the canvas.
				if (p.id === socketId && !p.isDead) {
					drawPlayer(
						p5,
						spriteSheet,
						p5.width / 2,
						p5.height / 2,
						p,
						$randomPlayerOffsets[socketId]
					);
					return;
				}

				// Check the other player's distance to the player.
				const xDistance = p5.abs(p.x - player.x) - 100;
				const yDistance = p5.abs(p.y - player.y) - 100;

				// off screen players are only drawn as arrows
				if (xDistance <= p5.width / 2 && yDistance <= p5.height / 2) {
					const pCoords = translateCoords({
						h: p5.height,
						w: p5.width,
						px: player.x,
						py: player.y,
						x: p.x,
						y: p.y
					});
					// they are visible on-screen
					drawPlayer(p5, spriteSheet, pCoords.x, pCoords.y, p, $randomPlayerOffsets[p.id]);
				} else {
					// they are off-screen
					drawPlayerArrow(p5, player, p);
				}
			});
			if (player.isDead) {
				drawDeathScreen(p5, player.respawnTime, timestamp);
			}
		} else {
			// If game is loading, do these:
			p5.push();
			p5.fill(255);
			p5.textSize(25);
			p5.text('loading', p5.width / 2, p5.height / 2);
			p5.pop();
		}
	}

	function windowResized(p5: any) {
		// on window resized, re-setup everything.
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

		mapImage = setupMap(p5, mapData);
		bgImage = setupBGGradientGraphics(p5);

		let { stars, trees } = setupGalaxy(p5, starCount, treeCount);
		starSet = stars;
		treeSet = trees;
	}
</script>

<div>
	<P5 {preload} {setup} {draw} {windowResized} />
	<GameFPS fps={fpsDisplay.toFixed(0)} />
</div>
