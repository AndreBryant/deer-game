/* eslint-disable @typescript-eslint/no-explicit-any */
import { palette } from './palette';
import { DEER_SPRITE_ANIMATION_DATA, FRAME_SIZE } from './sprite';

export function setupGalaxy(p5: any, starCount: number, treeCount: number) {
	const mapSize = 160 * 32;

	const stars = [];
	for (let i = 0; i < starCount; i++) {
		const x = randomArbitrary(-p5.width / 2, mapSize + p5.width / 2);
		const y = randomArbitrary(-p5.height / 2, p5.height / 2 + mapSize);
		const size = p5.random(1, 3);
		stars.push({ x, y, z: size });
	}
	const trees = [];
	for (let i = 0; i < treeCount; i++) {
		const x = randomArbitrary(-p5.width / 2, mapSize + p5.width / 2);
		const y = randomArbitrary(-p5.height / 2, p5.height / 2 + mapSize);
		const z = p5.random(1, 15);
		const angle = randomArbitrary(-Math.PI / 2, (3 * Math.PI) / 4);
		trees.push({ x, y, z, angle });
	}

	return { stars, trees };
}

export function setupBGGradientGraphics(p5: any) {
	const graphics = p5.createGraphics(p5.width, p5.height);
	drawBGGradient(graphics);
	return graphics.get();
}

export function setupMap(p5: any, mapData: any) {
	const graphics = p5.createGraphics(
		mapData?.width * mapData.tileSize,
		mapData?.height * mapData.tileSize
	);
	drawMapTiles(graphics, mapData);
	return graphics.get();
}

export function drawGalaxy(p5: any, starSet: any, treeSet: any, px: number, py: number) {
	for (const star of starSet) {
		drawStar(p5, star.x, star.y, star.z, px, py);
	}
	for (const tree of treeSet) {
		drawTree(p5, tree.x, tree.y, tree.z, tree.angle, px, py);
	}
}

export function drawMap(p5: any, mapImage: any, px: number, py: number) {
	p5.image(
		mapImage,
		0,
		0,
		p5.width,
		p5.height,
		px - p5.width / 2,
		py - p5.height / 2,
		p5.width,
		p5.height
	);
}

export function drawDangerZone(
	p5: any,
	safeZoneBoundary: number,
	playerX: number,
	playerY: number
) {
	const c1 = p5.color(120, 0, 0, 80);
	const c2 = p5.color(100, 0, 25, 50);
	const frames = 120;

	// We need sin for the lerp so that it oscillates from -1 to 1
	const lerpFactor = (1 + Math.sin(((p5.frameCount % frames) * (Math.PI * 2)) / frames)) / 2;
	const lerpColor = p5.lerpColor(c1, c2, lerpFactor);

	const { x: x0, y: y0 } = translateCoords({
		h: p5.height,
		w: p5.width,
		px: playerX,
		py: playerY,
		x: 0,
		y: 0
	});

	const s0 = 160 * 32;

	const x = ((160 - safeZoneBoundary) * 32) / 2;
	const y = ((160 - safeZoneBoundary) * 32) / 2;

	const { x: x1, y: y1 } = translateCoords({
		h: p5.height,
		w: p5.width,
		px: playerX,
		py: playerY,
		x,
		y
	});

	const s1 = safeZoneBoundary * 32;

	p5.push();
	p5.noStroke();
	p5.fill(lerpColor);
	p5.beginShape();

	// Outer Rectangle
	p5.vertex(x0, y0);
	p5.vertex(x0 + s0, y0);
	p5.vertex(x0 + s0, y0 + s0);
	p5.vertex(x0, y0 + s0);
	p5.vertex(x0, y0);

	// Inner Rectangle
	p5.vertex(x1, y1);
	p5.vertex(x1, y1 + s1);
	p5.vertex(x1 + s1, y1 + s1);
	p5.vertex(x1 + s1, y1);
	p5.vertex(x1, y1);

	p5.endShape(p5.CLOSE);

	p5.pop();
}

export function drawPlayer(
	p5: any,
	spriteSheet: any,
	x: number,
	y: number,
	player: any,
	playerOffset: number
) {
	// Player username tag
	p5.textFont('monospace');
	p5.textSize(24);
	p5.textAlign(p5.CENTER, p5.CENTER);
	p5.fill(player.color);
	p5.text(
		(player.isHost ? '★ ' : '') +
			(player.name.length > 30 ? player.name.substring(0, 27) + '...' : player.name),
		x,
		y - player.radius * 1.5
	);
	// Add this to player class
	const isFacingLeft: boolean = player.isFacingLeft;
	const action: string = player.action;
	const actionData: { slowness_factor: number; positions: { x: number; y: number }[] } =
		DEER_SPRITE_ANIMATION_DATA[action];
	const slownessFactor: number = actionData.slowness_factor;
	let frame: number;

	if (player.actionStartTime && player.actionEndTime) {
		console.log(player.action);
		const actionEndTime = player.actionEndTime;
		const actionStartTime = player.actionStartTime;
		const elapsed = Date.now() - actionStartTime;
		const duration = actionEndTime - actionStartTime;
		frame = p5.floor(elapsed / duration / slownessFactor) % actionData.positions.length;
	} else {
		frame = p5.floor((p5.frameCount + playerOffset) / slownessFactor) % actionData.positions.length;
	}

	const blinking: boolean =
		player.dangerZoneDamageCooldown || player.invincible ? p5.frameCount % 20 < 10 : false;

	if (!blinking) {
		p5.push();
		if (player.invincible || player.dangerZoneDamageCooldown) {
			p5.tint(255, 150, 150, 180);

			// Draw Health bar visible to other players
			const healthHeight = p5.map(player.health, 0, 25, 0, player.radius * 2);
			const redColorHealth = p5.color(255, 0, 0, 80);
			const greenColorHealth = p5.color(0, 255, 0, 80);
			const currentColorHealth = p5.lerpColor(redColorHealth, greenColorHealth, player.health / 25);
			p5.push();
			p5.noStroke();
			p5.fill(30, 80);
			p5.rect(x - player.radius * 1.5, y - player.radius, 6, player.radius * 2);
			p5.fill(currentColorHealth);
			p5.rect(x - player.radius * 1.5, y + player.radius - healthHeight, 6, healthHeight);
			p5.pop();
		}
		p5.translate(x, y);
		if (isFacingLeft) {
			p5.scale(-1, 1);
		}

		p5.fill(0, 0, 0, 50);
		p5.noStroke();

		// Player Shadow
		p5.ellipse(0, 0 + 64, player.radius * 2, 16);
		p5.imageMode(p5.CENTER);
		p5.image(
			spriteSheet,
			0,
			0,
			player.radius * 2,
			player.radius * 2,
			actionData.positions[frame].x,
			actionData.positions[frame].y,
			FRAME_SIZE,
			FRAME_SIZE
		);

		p5.pop();
	}
}

export function drawPlayerArrow(p5: any, player: any, p: any) {
	const dir = p5.atan2(p.y - player.y, p.x - player.x);
	const decrease = p5.map(p5.dist(p.x, p.y, player.x, player.y), 0, 160 * 32, 0, 15);
	const radius = p5.min(p5.width * 0.75, p5.height * 0.75) / 2;

	p5.push();
	p5.translate(p5.width / 2, p5.height / 2);

	p5.rotate(dir + 1.5 * p5.PI);

	p5.stroke(255);
	p5.fill(p.color);
	p5.beginShape();
	p5.vertex(0, radius - decrease);
	p5.vertex(-8, radius - 25);
	p5.vertex(8, radius - 25);
	p5.endShape(p5.CLOSE);

	p5.pop();
}

export function drawDeathScreen(p5: any, time: number, timestamp: number) {
	const goalColor = p5.color(80, 0, 0, 80);
	const startColor = p5.color(0, 0, 0, 10);

	const timeDiff = time - timestamp;
	const progress = p5.constrain(1 - timeDiff / 4900, 0, 1);
	const currentColor = p5.lerpColor(startColor, goalColor, progress);

	const timeLeft = Math.ceil((time - timestamp) / 1000);

	p5.push();
	p5.fill(currentColor);
	p5.noStroke();
	p5.rect(0, 0, p5.width, p5.height);

	const txtOpacity = p5.map(progress, 0, 1, 0, 255);
	p5.textAlign(p5.CENTER);
	p5.fill(180, 0, 0, txtOpacity);
	p5.textSize(64);
	p5.text('You DEER', p5.width / 2, p5.height / 2);
	p5.textSize(32);
	p5.text('respawning in ' + timeLeft, p5.width / 2, p5.height / 2 + 64);
	p5.pop();
}

// Utilities
export function translateCoords({ h, w, px, py, x, y }: any) {
	return {
		x: w / 2 + (x - px),
		y: h / 2 + (y - py)
	};
}

function drawStar(p5: any, x: number, y: number, z: number, px: number, py: number) {
	const parallaxX = x - px / z;
	const parallaxY = y - py / z;

	if (parallaxX > p5.width || parallaxX < 0 || parallaxY > p5.height || parallaxY < 0) {
		return;
	}

	p5.push();
	p5.stroke(palette.primary.sky_blue);
	p5.strokeWeight(z);
	p5.point(parallaxX, parallaxY);
	p5.pop();
}

function drawTree(p5: any, x: number, y: number, z: number, angle: number, px: number, py: number) {
	const zprime = p5.map(z, 1, 15, 1, 3);
	const parallaxX = x - px / zprime;
	const parallaxY = y - py / zprime;

	if (parallaxX > p5.width || parallaxX < 0 || parallaxY > p5.height || parallaxY < 0) {
		return;
	}

	p5.push();

	p5.translate(parallaxX, parallaxY);
	p5.rotate(angle);

	p5.fill(palette.primary.darkBrown);
	p5.rect(-z / 8, 0, z / 4, z / 2);

	p5.fill(25, 100, 25);
	p5.triangle(-z / 2, 0, z / 2, 0, 0, -z / 2);
	p5.triangle(-z / 3, -z / 4, z / 3, -z / 4, 0, -z * 0.75);
	p5.triangle(-z / 4, -z / 2, z / 4, -z / 2, 0, -z);

	p5.pop();
}

function drawBGGradient(graphics: any) {
	const color = palette.primary.night_sky;
	const r = graphics.red(color);
	const g = graphics.green(color);
	const b = graphics.blue(color);

	const c1 = graphics.color(r, g, b);
	const c2 = graphics.color(20);

	for (let i = 0; i < graphics.height; i++) {
		const n = graphics.map(i, 0, graphics.height, 0, 1);
		const newC = graphics.lerpColor(c1, c2, n);
		graphics.stroke(newC);
		graphics.line(0, i, graphics.width, i);
	}
}

function drawMapTiles(
	graphics: any,
	mapData: { mapData: string; height: number; width: number; tileSize: number }
) {
	graphics.noStroke();
	graphics.noSmooth();

	const noiseVal = 0.1;

	for (let y = 0; y < mapData.height; y++) {
		for (let x = 0; x < mapData.width; x++) {
			const index = y * mapData.width + x;
			const char = mapData.mapData[index];
			const value = graphics.noise(x * noiseVal, y * noiseVal) * 100;

			switch (char) {
				case '=':
					{
						const min = 100;
						graphics.fill(min * 0.7, min * 0.8, value + min, 80);
						graphics.rect(
							x * mapData.tileSize,
							y * mapData.tileSize,
							mapData.tileSize,
							mapData.tileSize
						);
					}
					break;
				case '#':
					graphics.fill(20 + value * 0.1, value, 20 + value * 0.1);
					graphics.stroke(15, 20, 15);
					graphics.rect(
						x * mapData.tileSize,
						y * mapData.tileSize,
						mapData.tileSize,
						mapData.tileSize,
						6
					);
					graphics.noStroke();
					break; // Wall
				default:
					graphics.fill(255); // Default color
			}
		}
	}
}

function randomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
