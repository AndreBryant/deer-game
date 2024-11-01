<script lang="ts">
	export let serverData: any;
	export let socketId: string;
	export let mapData:
		| { mapData: string; height: number; width: number; tileSize: number }
		| undefined;
	import P5 from '../P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import fDeer from '$lib/sprites/fDeer.png';
	import { drawPlayer } from '$lib/sprites/Sprite';
	import { drawMap, drawMapTiles, translateCoords } from '$lib/utils/render';

	$: serverData;
	$: sortedPlayers = serverData.players
		? Object.values(serverData.players).sort((a: any, b: any) => a.y - b.y)
		: [];
	let mapImage: any;
	let deerSpriteSheet: any;
	let hornDeerSpriteSheet: any;

	function preload(p5: any) {
		deerSpriteSheet = p5.loadImage(fDeer);
		hornDeerSpriteSheet = p5.loadImage(mDeer);
	}

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

	function draw(p5: any) {
		p5.background(21);

		if (serverData && mapData && serverData.players && serverData.players[socketId]) {
			// TODO: only render if player is visible
			const player = serverData.players[socketId];

			drawMap(p5, mapImage, player);

			for (let i = 0; i < sortedPlayers.length; i++) {
				const p: any = sortedPlayers[i];
				if (p.id === socketId) {
					drawPlayer(
						p5,
						player.hasHorn ? hornDeerSpriteSheet : deerSpriteSheet,
						p5.width / 2,
						p5.height / 2,
						player
					);
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
				drawPlayer(p5, p.hasHorn ? hornDeerSpriteSheet : deerSpriteSheet, pCoords.x, pCoords.y, p);
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
