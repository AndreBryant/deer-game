export class Map {
	width: number;
	height: number;
	scale: number;
	tiles: string;

	constructor() {
		this.width = 1000;
		this.height = 600;
		this.scale = 1;
		this.tiles = '';
	}

	generateMap() {
		this.tiles = '';
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				this.tiles += MapTile.Walkable;
			}
		}
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
