<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	export let mapData:
		| { mapData: string; height: number; width: number; tileSize: number }
		| undefined;
	import P5 from '../P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import { drawPlayer } from '$lib/sprites/Sprite';
	import { drawMap, drawMapTiles, translateCoords } from '$lib/utils/render';

	$: serverData;
	$: sortedPlayers = serverData.players
		? Object.values(serverData.players).sort((a: any, b: any) => a.y - b.y)
		: [];
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

	function draw(p5: any) {
		p5.background(0);

		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			const player = serverData.players[socketId];

			drawMap(p5, mapImage, player);

			for (const p of sortedPlayers) {
				if (p.id === socketId) {
					drawPlayer(p5, spriteSheet, p5.width / 2, p5.height / 2, player);
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
				drawPlayer(p5, spriteSheet, pCoords.x, pCoords.y, p);
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
</script>

<P5 {preload} {setup} {draw} {windowResized} />
