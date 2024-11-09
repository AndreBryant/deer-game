/* eslint-disable @typescript-eslint/no-explicit-any */
import { palette } from './palette';

export function translateCoords({ h, w, px, py, x, y }: any) {
	return {
		x: w / 2 + (x - px),
		y: h / 2 + (y - py)
	};
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

export function drawMapTiles(
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
						graphics.fill(min * 0.7, min * 0.8, value + min, 40);
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
export function drawBGGradient(graphics: any) {
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
		const z = p5.random(1, 20);
		const angle = randomArbitrary(0, 2 * Math.PI);
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

function drawStar(p5: any, x: number, y: number, z: number, px: number, py: number) {
	// compute parallax effect here
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
	const zprime = p5.map(z, 1, 20, 1, 3);
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

function randomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
