export class Map {
	width: number;
	height: number;
	scale: number;
	tiles: string;

	constructor(tiles: string) {
		this.width = 1000;
		this.height = 600;
		this.scale = 1;
		this.tiles = tiles;
	}

	getTile(x: number, y: number) {
		if ((x < 0 || x >= this.width) && (y < 0 || y >= this.height)) {
			return this.tiles[y * this.width + x];
		} else return null;
	}
}

export enum MapTile {
	Walkable = '=',
	Wall = '#',
	Flag = 'F',
	Water = '~',
	Shore = '-'
}
