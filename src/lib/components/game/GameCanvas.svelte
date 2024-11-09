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
	import { drawPlayer } from '$lib/utils/Sprite';
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
	let starCount = 300;
	let treeCount = 150;
	let starSet: { x: number; y: number; z: number }[] = [];
	let treeSet: { x: number; y: number; z: number; angle: number }[] = [];

	let deerSpriteSheet: any;
	let hornDeerSpriteSheet: any;
	let redDeerSpriteSheet: any;
	let redHornDeerSpriteSheet: any;

	let fps = 60;
	let fpsDisplay = fps;
	let previousX = 0;
	let previousY = 0;

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
	}

	function draw(p5: any) {
		fpsDisplay = p5.frameRate();
		p5.background(bgImage);
		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			let player = serverData.players[socketId];
			// Sacrilegious but i think this works
			if (player.isDead) {
				player.x = previousX;
				player.y = previousY;
			} else {
				previousX = player.x;
				previousY = player.y;
			}

			drawGalaxy(p5, starSet, treeSet, player.x, player.y);
			drawMap(p5, mapImage, player.x, player.y);
			sortedPlayers.forEach((p: any) => {
				if (p.isDead) return;
				const spriteSheet = p.hasNose
					? p.sex === 'm'
						? redHornDeerSpriteSheet
						: redDeerSpriteSheet
					: p.sex === 'm'
						? hornDeerSpriteSheet
						: deerSpriteSheet;

				if (p.id === socketId && !p.isDead) {
					drawPlayer(p5, spriteSheet, p5.width / 2, p5.height / 2, p);
					return;
				}

				const xDistance = p5.abs(p.x - player.x) - 100;
				const yDistance = p5.abs(p.y - player.y) - 100;

				// if player is visible on screen, draw the player sprite, else draw an arrow pointing to their direction
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
				} else {
					drawPlayerArrow(p5, player, p);
				}
			});
			if (player.isDead) {
				drawDeadScreen(p5, player.respawnTime);
			}
		} else {
			p5.push();
			p5.fill(255);
			p5.textSize(25);
			p5.text('loading', p5.width / 2, p5.height / 2);
			p5.pop();
		}
	}

	function drawDeadScreen(p5: any, time: number) {
		const goalColor = p5.color(80, 0, 0, 100);
		const startColor = p5.color(0, 0, 0, 10);

		const timeDiff = time - Date.now();
		const progress = p5.constrain(1 - timeDiff / 4500, 0, 1);
		const currentColor = p5.lerpColor(startColor, goalColor, progress);

		const timeLeft = Math.ceil((time - Date.now()) / 1000);

		p5.push();
		p5.fill(currentColor);
		p5.noStroke();
		p5.rect(0, 0, p5.width, p5.height);

		const txtOpacity = p5.map(progress, 0, 1, 0, 255);
		p5.textAlign(p5.CENTER);
		p5.fill(180, 0, 0, txtOpacity);
		p5.textSize(64);
		p5.text('You DEER...', p5.width / 2, p5.height / 2);
		p5.textSize(32);
		p5.text('Respawn in ' + timeLeft, p5.width / 2, p5.height / 2 + 64);
		p5.pop();
	}

	function drawPlayerArrow(p5: any, player: any, p: any) {
		const factor = 6;
		const dir = p5.atan2(p.y - player.y, p.x - player.x);

		p5.push();
		p5.translate(p5.width / 2, p5.height / 2);

		p5.rotate(dir + 1.5 * p5.PI);

		p5.stroke(255);
		p5.fill(p.color);
		p5.beginShape();
		p5.vertex(0, player.radius * factor);
		p5.vertex(-8, player.radius * factor - 25);
		p5.vertex(8, player.radius * factor - 25);
		p5.endShape(p5.CLOSE);

		p5.pop();
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
