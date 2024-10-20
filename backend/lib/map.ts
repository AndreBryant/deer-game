export const MAP_HEIGHT = 600;
export const MAP_WIDTH = 1000;

export class Map {
	width: number;
	height: number;
	scale: number;
	tiles: string;

	constructor() {
		this.width = MAP_WIDTH;
		this.height = MAP_HEIGHT;
		this.scale = 1;
		this.tiles = '';
		this.generateMap();
	}

	private generateMap() {
		this.tiles = '';
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if (i == 0 || i == this.height - 1 || j == 0 || j == this.width - 1) {
					this.tiles += MapTile.Wall;
				} else {
					this.tiles += MapTile.Walkable;
				}
			}
		}
	}

	getMap() {
		return this.tiles;
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
