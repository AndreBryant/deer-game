export const MAP_HEIGHT = 80;
export const MAP_WIDTH = 80;
export const TILESIZE = 32;

export enum MapTile {
	Walkable = '=',
	Wall = '#',
	Flag = 'F',
	Water = '~',
	Shore = '-'
}

export class Map {
	width: number;
	height: number;
	tiles: string;
	tileSize: number;

	constructor() {
		this.width = MAP_WIDTH;
		this.height = MAP_HEIGHT;
		this.tiles = '';
		this.tileSize = TILESIZE;
		this.generateMap();
	}

	private generateMap() {
		this.tiles = '';
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if (i == 0 || i == this.height - 1 || j == 0 || j == this.width - 1) {
					this.tiles += MapTile.Wall;
				} else {
					const rand = Math.random();
					if (rand < 0.00001) {
						this.tiles += MapTile.Wall;
					} else if (rand < 0.00003) {
						this.tiles += MapTile.Water;
					} else {
						this.tiles += MapTile.Walkable;
					}

					// if (rand < 0.01) {
					// 	this.tiles += MapTile.Flag; // 10% chance of a flag
					// } else if (rand < 0.05) {
					// 	this.tiles += MapTile.Water; // 20% chance of water
					// } else if (rand < 0.15) {
					// 	this.tiles += MapTile.Shore; // 20% chance of shore
					// } else if (rand < 0.25) {
					// 	this.tiles += MapTile.Wall; // 20% chance of shore
					// } else {
					// 	this.tiles += MapTile.Walkable; // Default to walkable
					// }
				}
			}
		}
	}

	getMap() {
		return this.tiles;
	}

	getTile(x: number, y: number) {
		if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
			return this.tiles[y * this.width + x];
		} else return null;
	}
}
