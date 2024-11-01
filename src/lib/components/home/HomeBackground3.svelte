<script lang="ts">
	import { DEER_SPRITE_ANIMATION_DATA, FRAME_SIZE } from '$lib/sprites/Sprite';
	import P5 from '$lib/components/P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import fDeer from '$lib/sprites/fDeer.png';
	import { palette } from '$lib/utils/palette';

	let deerSpriteSheet: any;
	let hornDeerSpriteSheet: any;

	// Mountains
	let mountainsA: { x: any; y: any }[] = [];
	let mountainsB: { x: any; y: any }[] = [];
	let mountainsC: { x: any; y: any }[] = [];

	// Sun
	let sun: { x: number; y: number; r: number };
	let angle: number = 180;
	let sunPathWidth: number;
	let sunPathHeight: number;
	let centerX: number;
	let centerY: number;

	// Values
	let scaleFactor: number = 1;
	let scaleDirection: number = 0.001;

	let rows: number;
	let cols: number;

	const frameSize = FRAME_SIZE * 4;

	function preload(p5: any) {
		deerSpriteSheet = p5.loadImage(fDeer);
		hornDeerSpriteSheet = p5.loadImage(mDeer);
	}

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.noSmooth();

		rows = p5.ceil(p5.height / frameSize);
		cols = p5.ceil(p5.width / frameSize);
		mountainsA = setupMountains(p5, p5.height * 0.4);
		mountainsB = setupMountains(p5, p5.height * 0.6);
		mountainsC = setupMountains(p5, p5.height * 0.75);

		sunPathWidth = p5.width * 0.6;
		sunPathHeight = p5.height * 0.1;
		centerX = p5.width / 2;
		centerY = p5.height * 0.2;
		sun = { x: p5.width * 0.3, y: p5.height * 0.1, r: 200 };
	}

	function draw(p5: any) {
		p5.background('#87cefa');
		p5.fill('#fdee00');

		sun.x = centerX + sunPathWidth * p5.cos(p5.radians(angle));
		sun.y = centerY + sunPathHeight * p5.sin(p5.radians(angle));
		p5.noStroke();
		p5.ellipse(sun.x, sun.y, sun.r, sun.r);
		angle += angle < 180 && angle > 0 ? 180 : 0.1;
		if (angle >= 360) angle = 0;

		p5.fill(palette.primary.darkBrown);
		drawMountains(p5, mountainsA);
		p5.fill(palette.primary.brown);
		drawMountains(p5, mountainsB);
		p5.fill(palette.primary.yellow);
		drawMountains(p5, mountainsC);
	}

	function setupMountains(p5: any, mountainBaseHeight: number) {
		let mountains = [];
		const mountainHeight = p5.height / 3;
		const noiseScale = p5.random(0.001, 0.005);

		let lastX;
		for (let x = 0; x <= p5.width; x += 10) {
			const noiseVal = p5.noise(x * noiseScale);
			const y = mountainBaseHeight - noiseVal * mountainHeight;
			lastX = x;
			mountains.push({ x, y });
		}

		mountains.push({
			x: p5.width,
			y: mountainBaseHeight - p5.noise(lastX! * noiseScale) * mountainHeight
		});
		mountains.push({ x: p5.width, y: p5.height });
		mountains.push({ x: 0, y: p5.height });
		return mountains;
	}

	function drawMountains(p5: any, mountains: typeof mountainsA) {
		p5.beginShape();
		p5.noStroke();

		for (let i = 0; i < mountains.length; i++) {
			const m = mountains[i];
			p5.vertex(m.x, m.y);
		}
		p5.endShape(p5.CLOSE);
	}

	function windowResized(p5: any) {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
		rows = p5.ceil(p5.height / frameSize);
		cols = p5.ceil(p5.width / frameSize);
		mountainsA = setupMountains(p5, p5.height * 0.4);
		mountainsB = setupMountains(p5, p5.height * 0.6);
		mountainsC = setupMountains(p5, p5.height * 0.75);
	}
</script>

<P5 {preload} {draw} {setup} {windowResized} />
