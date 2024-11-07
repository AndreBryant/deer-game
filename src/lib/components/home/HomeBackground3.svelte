<script lang="ts">
	import P5 from '$lib/components/P5.svelte';
	import mDeer from '$lib/sprites/mDeer.png';
	import fDeer from '$lib/sprites/fDeer.png';
	import { palette } from '$lib/utils/palette';

	let deerSpriteSheet: any;
	let hornDeerSpriteSheet: any;
	const lerpConstant = 0.1;

	// Sky
	let skyDay = palette.primary.sky_blue;
	let skyNight = palette.primary.night_sky;
	let currSky = skyDay;
	let currGoal = skyNight;

	// Mountains
	let mountainsA: { x: any; y: any }[] = [];
	let mADay = palette.primary.mountainA_day;
	let mANight = palette.primary.mountainA_night;
	let mACurrMountain = mADay;
	let mACurrGoal = mANight;

	let mountainsB: { x: any; y: any }[] = [];
	let mBDay = palette.primary.mountainB_day;
	let mBNight = palette.primary.mountainB_night;
	let mBCurrMountain = mBDay;
	let mBCurrGoal = mBNight;

	let mountainsC: { x: any; y: any }[] = [];
	let mCDay = palette.primary.mountainC_day;
	let mCNight = palette.primary.mountainC_night;
	let mCCurrMountain = mCDay;
	let mCCurrGoal = mCNight;

	// Heavenly bodies
	let sun: { x: number; y: number; r: number };
	let moon: { x: number; y: number; r: number };
	let deerHead: any;

	let moonTexture: { x: number; y: number; r: number }[] = [];
	let sunTexture: { x: number; y: number; r: number }[] = [];
	let planetaryParticles = 20;

	let angle: number = 0;

	let sunPathWidth: number;
	let sunPathHeight: number;
	let centerX: number;
	let centerY: number;

	let stars: { x: number; y: number; r: number }[] = [];
	let starColor = palette.primary.sky_blue;
	let starCount = 200;

	// Clouds
	let clouds: { x: number; y: number; dx: number; r1: number[]; r2: number[]; r3: number[] }[] = [];
	let cloudCount = 8;

	function preload(p5: any) {
		deerSpriteSheet = p5.loadImage(fDeer);
		hornDeerSpriteSheet = p5.loadImage(mDeer);
	}

	function setup(p5: any) {
		p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.noSmooth();

		setupValues(p5);
		sun = { x: p5.width * 0.3, y: p5.height * 0.1, r: 125 };
		moon = { x: p5.width - p5.width * 0.3, y: p5.height * 0.1, r: 100 };

		for (let i = 0; i < planetaryParticles; i++) {
			const angle = p5.random(0, p5.TWO_PI);
			const d1 = p5.sqrt(p5.random(0, 0.8)) * (moon.r / 2);
			const d2 = p5.sqrt(p5.random(0, 0.8)) * (sun.r / 2);

			const x1 = d1 * p5.cos(angle);
			const y1 = d1 * p5.sin(angle);
			const x2 = d2 * p5.cos(angle);
			const y2 = d2 * p5.sin(angle);

			moonTexture.push({
				x: x1,
				y: y1,
				r: p5.random(2, 10)
			});
			sunTexture.push({
				x: x2,
				y: y2,
				r: p5.random(2, 5)
			});
		}

		deerHead = deerSpriteSheet.get(16, 0, 16, 14);
		p5.imageMode(p5.CENTER);
	}

	function draw(p5: any) {
		currSky = p5.lerpColor(p5.color(currSky), p5.color(currGoal), lerpConstant);
		drawSky(p5, currSky);
		const moonAngle = (angle + 180) % 360;
		moon.x = centerX + sunPathWidth * p5.cos(p5.radians(moonAngle));
		moon.y = centerY + sunPathHeight * p5.sin(p5.radians(moonAngle));
		sun.x = centerX + sunPathWidth * p5.cos(p5.radians(angle));
		sun.y = centerY + sunPathHeight * p5.sin(p5.radians(angle));
		drawHeavenlyBodies(p5);

		if (angle >= 180) drawClouds(p5);

		mACurrMountain = p5.lerpColor(p5.color(mACurrMountain), p5.color(mACurrGoal), lerpConstant);
		mBCurrMountain = p5.lerpColor(p5.color(mBCurrMountain), p5.color(mBCurrGoal), lerpConstant);
		mCCurrMountain = p5.lerpColor(p5.color(mCCurrMountain), p5.color(mCCurrGoal), lerpConstant);

		p5.fill(mACurrMountain);
		drawMountains(p5, mountainsA);
		p5.fill(mBCurrMountain);
		drawMountains(p5, mountainsB);
		p5.fill(mCCurrMountain);
		drawMountains(p5, mountainsC);

		angle += 0.1;
		if (angle >= 360) angle = 0;

		if (angle < 180) {
			currGoal = skyNight; // Night
			mACurrGoal = mANight;
			mBCurrGoal = mBNight;
			mCCurrGoal = mCNight;
		} else {
			currGoal = skyDay; // Day
			mACurrGoal = mADay;
			mBCurrGoal = mBDay;
			mCCurrGoal = mCDay;
		}
	}

	function windowResized(p5: any) {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
		setupValues(p5);
	}

	function setupMountains(p5: any, mountainBaseHeight: number) {
		let mountains = [];
		const mountainHeight = p5.height / 3;
		const noiseScale = p5.random(0.007, 0.01);
		const r = p5.random(0, 10);

		let lastX;
		for (let x = 0; x <= p5.width; x += 10) {
			const noiseVal = p5.noise(r + x * noiseScale);
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

	function drawSky(p5: any, currSky: any) {
		p5.background(currSky);
		const c1 = p5.color(currSky);
		let c2;
		if (currGoal === skyDay) {
			c2 = p5.color(50);
		} else if (currGoal === skyNight) {
			c2 = p5.color(175);
		}
		p5.push();

		for (let i = 0; i < p5.height / 1.5; i++) {
			const n = p5.map(i, 0, p5.height, 0, 1);
			let newC = p5.lerpColor(c1, c2, n);
			p5.stroke(newC);
			p5.line(0, i, p5.width, i);
		}
		p5.pop();
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

	function drawHeavenlyBodies(p5: any) {
		p5.push();
		if (angle < 180) {
			// NIGHT
			p5.stroke(starColor);
			p5.strokeWeight(2);
			for (let i = 0; i < stars.length; i++) {
				const s = stars[i];
				p5.strokeWeight(s.r);
				p5.point(s.x, s.y);
			}
			const angleToCenter = p5.atan2(centerY - moon.y, centerX - moon.x);

			// Rotate and draw the deer head
			p5.push();
			p5.noStroke();
			p5.fill(200);
			p5.translate(moon.x, moon.y - moon.r / 4);
			p5.ellipse(0, 0, moon.r, moon.r);
			planetTexture(p5, moonTexture, '#96969677');
			p5.rotate(angleToCenter - p5.PI / 2);
			p5.tint(200, 200, 200, 180);
			p5.image(deerHead, 0, -moon.r / 5, moon.r * 1, moon.r * 1);
			p5.noTint();
			p5.pop();
		} else {
			// DAY
			p5.noStroke();
			p5.fill('#fdee00e9');
			p5.ellipse(sun.x, sun.y, sun.r, sun.r);
			p5.translate(sun.x, sun.y - sun.r / 4);
		}
		p5.pop();
	}

	function planetTexture(
		p5: any,
		txtpts: { x: number; y: number; r: number }[],
		textureColor: string
	) {
		p5.push();
		p5.fill(textureColor);
		for (let i = 0; i < txtpts.length; i++) {
			const txtpt = txtpts[i];
			p5.ellipse(txtpt.x, txtpt.y, txtpt.r, txtpt.r);
		}
		p5.pop();
	}

	function setupValues(p5: any) {
		mountainsA = setupMountains(p5, p5.height * 0.7);
		mountainsB = setupMountains(p5, p5.height * 0.78);
		mountainsC = setupMountains(p5, p5.height * 0.85);

		sunPathWidth = p5.width * 0.5;
		sunPathHeight = p5.height * 0.5;
		centerX = p5.width / 2;
		centerY = p5.height * 0.65;
		stars = [];
		for (let i = 0; i < starCount; i++) {
			stars.push({ x: p5.random(0, p5.width), y: p5.random(0, p5.height / 2), r: p5.random(1, 3) });
		}

		clouds = [];
		for (let i = 0; i < cloudCount; i++) {
			clouds.push({
				x: p5.random(0, p5.width),
				y: p5.random(0, p5.height / 2),
				dx: p5.random(0.1, 1),
				// dx: 100,
				r1: [p5.random(100, 200), p5.random(70, 80)],
				r2: [p5.random(8, 12), p5.random(8, 12), p5.random(100, 150), p5.random(40, 70)],
				r3: [p5.random(8, 12), p5.random(8, 12), p5.random(150, 250), p5.random(40, 70)]
			});
		}
	}

	function drawClouds(p5: any) {
		p5.push();
		for (let i = 0; i < cloudCount; i++) {
			let cloud = clouds[i];
			p5.fill(250, 250, 250, 160);
			p5.ellipse(cloud.x, cloud.y, cloud.r1[0], cloud.r1[1]);
			p5.ellipse(cloud.x + cloud.r2[0], cloud.y + cloud.r2[1], cloud.r2[2], cloud.r2[3]);
			p5.ellipse(cloud.x - cloud.r3[0], cloud.y + cloud.r3[1], cloud.r3[2], cloud.r3[3]);

			clouds[i].x += clouds[i].dx;
			if (clouds[i].x > p5.width + 100) clouds[i].x = -100;
		}
		p5.pop();
	}
</script>

<P5 {preload} {draw} {setup} {windowResized} />
