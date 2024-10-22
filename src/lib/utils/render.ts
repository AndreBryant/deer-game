function translateCoords({ h, w, px, py, x, y }: any) {
	return {
		x: w / 2 + (x - px),
		y: h / 2 + (y - py)
	};
}

export function drawMap(p5: any, mapImage: any, player: any) {
	const t = translateCoords({
		h: p5.height,
		w: p5.width,
		px: player.x,
		py: player.y,
		x: 0,
		y: 0
	});
	p5.image(mapImage, t.x, t.y);
}

export function drawMapTiles(
	graphics: any,
	mapData: { mapData: string; height: number; width: number; tileSize: number }
) {
	graphics.noStroke();
	graphics.noSmooth();
	for (let y = 0; y < mapData.height; y++) {
		for (let x = 0; x < mapData.width; x++) {
			const index = y * mapData.width + x;
			const char = mapData.mapData[index];

			switch (char) {
				case '=':
					// let grassNoise = graphics.noise(x * 0.1, y * 0.1);
					graphics.fill(10, graphics.random(85, 95), 10);
					break; // Grass
				case '#':
					graphics.fill(graphics.random(25, 35));
					break; // Wall
				case 'F':
					graphics.fill(100, 0, 0);
					break; // flag
				case '~':
					graphics.fill(20, 20, graphics.random(80, 120));
					break; // Water
				case '-':
					graphics.fill(25);
					break; // shore
				default:
					graphics.fill(255); // Default color
			}

			graphics.rect(x * mapData.tileSize, y * mapData.tileSize, mapData.tileSize, mapData.tileSize);
		}
	}
}
