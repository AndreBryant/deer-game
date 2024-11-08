/* eslint-disable @typescript-eslint/no-explicit-any */
import { palette } from './palette';

export function translateCoords({ h, w, px, py, x, y }: any) {
	return {
		x: w / 2 + (x - px),
		y: h / 2 + (y - py)
	};
}

export function drawMap(p5: any, mapImage: any, px: number, py: number) {
	const t = translateCoords({
		h: p5.height,
		w: p5.width,
		x: 0,
		y: 0,
		px,
		py
	});
	p5.image(mapImage, t.x, t.y);
}

export function drawMapTiles(
	graphics: any,
	mapData: { mapData: string; height: number; width: number; tileSize: number }
) {
	graphics.noStroke();
	graphics.noSmooth();

	const noiseVal = 0.015;

	for (let y = 0; y < mapData.height; y++) {
		for (let x = 0; x < mapData.width; x++) {
			const index = y * mapData.width + x;
			const char = mapData.mapData[index];
			const value = graphics.noise(x * noiseVal, y * noiseVal) * 100;

			switch (char) {
				case '=':
					{
						const min = 45;
						graphics.fill(min * 0.8, value + min, min * 0.6);
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

	// Transfer this outside createGraphics, I want them to have parallax effect
	for (let i = 0; i < graphics.height; i++) {
		const n = graphics.map(i, 0, graphics.height, 0, 1);
		const newC = graphics.lerpColor(c1, c2, n);
		graphics.stroke(newC);
		graphics.line(0, i, graphics.width, i);
	}
	const starColor = palette.primary.sky_blue;

	for (let i = 0; i < 100; i++) {
		const x = getRandomArbitrary(0, graphics.width);
		const y = getRandomArbitrary(0, graphics.height);
		const r = getRandomArbitrary(1, 3);
		graphics.fill(starColor);
		graphics.ellipse(x, y, r);
	}

	drawForest(graphics);
}
function drawTriangleTree(graphics: any, x: number, y: number, size: number) {
	graphics.push();

	graphics.translate(x, y);
	const rotationAngle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
	graphics.rotate(rotationAngle);

	graphics.fill(palette.primary.darkBrown);
	graphics.rect(-size / 8, 0, size / 4, size / 2);

	graphics.fill(25, 100, 25);
	graphics.triangle(-size / 2, 0, size / 2, 0, 0, -size / 2);
	graphics.triangle(-size / 3, -size / 4, size / 3, -size / 4, 0, -size * 0.75);
	graphics.triangle(-size / 4, -size / 2, size / 4, -size / 2, 0, -size);

	graphics.pop();
}

function drawForest(graphics: any) {
	for (let i = 0; i < 20; i++) {
		const x = graphics.random(graphics.width);
		const y = graphics.random(graphics.height);
		const size = graphics.random(1, 20);
		drawTriangleTree(graphics, x, y, size);
	}
}
function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
