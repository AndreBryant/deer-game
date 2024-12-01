<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	export let mapData: ClientSideMapData | undefined;
	export let timestamp: number;
	export let gameOngoing: boolean;
	export let safeZoneBoundary: number;

	import P5 from '$lib/components/P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import fDeer from '$lib/sprites/fDeer.png';
	import { randomPlayerOffsets, gameState } from '$lib/stores/socketStore';
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
	let starCount = 1000;
	let treeCount = 80;
	let starSet: Star[] = [];
	let treeSet: Tree[] = [];

	let deerSpriteSheet: any;
	let hornDeerSpriteSheet: any;
	let redDeerSpriteSheet: any;
	let redHornDeerSpriteSheet: any;

	let fps = import.meta.env.FPS;
	let fpsDisplay = fps;

	function preload(p5: any) {
		deerSpriteSheet = p5.loadImage(fDeer);
		hornDeerSpriteSheet = p5.loadImage(mDeer);
	}

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.frameRate(fps);
		p5.pixelDensity(1);
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

			// Generate the on-screen non-player stuff
			drawGalaxy(p5, starSet, treeSet, player.x, player.y);
			drawMap(p5, mapImage, player.x, player.y);
			if (gameOngoing) {
				drawDangerZone(p5, safeZoneBoundary, player.x, player.y);
			}

			// Draw the on-screen players
			sortedPlayers.forEach((p: any) => {
				// Choose Correct the Sprite
				const spriteSheet = p.sex === 'm' ? hornDeerSpriteSheet : deerSpriteSheet;

				// Draw your player (the client) they should be at the center of the canvas.
				if (p.id === socketId) {
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
					if (!p.isDead) drawPlayerArrow(p5, player, p);
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
