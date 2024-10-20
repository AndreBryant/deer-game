import type { Map } from './map';
import { MapTile } from './map';
export class Player {
	id: string;
	room: string;
	isHost: boolean;
	name: string;
	color: string;
	radius: number;
	x: number;
	y: number;
	dy: number;
	dx: number;
	map: Map;
	constructor(
		id: string,
		room: string,
		isHost: boolean,
		name: string,
		x: number,
		y: number,
		color: string,
		map: Map
	) {
		this.id = id;
		this.room = room;
		this.isHost = isHost;
		this.name = name;
		this.x = x;
		this.y = y;
		this.dx = 20;
		this.dy = 20;
		this.radius = 20;
		this.color = color;
		this.map = map;
	}

	updateX(left: boolean) {
		const nextX = left ? this.x - this.dx : this.x + this.dx;
		const nextTile = this.map.getTile(nextX, this.y, this.radius);

		if (nextTile === MapTile.Walkable) {
			this.x = nextX;
		} else {
			let remainingTiles;
			const currentIndex = this.y * this.map.width + this.x; //current index sa map

			if (left) {
				remainingTiles = this.map.tiles.substring(this.y * this.map.width, currentIndex);
				const nearestWall = remainingTiles.lastIndexOf(MapTile.Wall);

				if (nearestWall !== -1) {
					this.x = nearestWall + this.radius;
				} else {
					this.x = this.radius;
				}
			} else {
				remainingTiles = this.map.tiles.substring(currentIndex, (this.y + 1) * this.map.width);
				const nearestWall = remainingTiles.indexOf(MapTile.Wall);

				if (nearestWall !== -1) {
					this.x = this.x + nearestWall - this.radius;
				} else {
					this.x = this.map.width - this.radius;
				}
			}
		}
	}

	updateY(up: boolean) {
		const nextY = up ? this.y - this.dy : this.y + this.dy;
		const nextTile = this.map.getTile(this.x, nextY, this.radius);

		if (nextTile === MapTile.Walkable) {
			this.y = nextY;
		} else {
			let remainingTiles;

			if (up) {
				remainingTiles = this.map.tiles
					.split('')
					.filter((_, index) => index % this.map.width === this.x)
					.slice(0, this.y);

				const nearestWall = remainingTiles.lastIndexOf(MapTile.Wall);

				if (nearestWall !== -1) {
					this.y = nearestWall + this.radius;
				} else {
					this.y = this.radius;
				}
			} else {
				remainingTiles = this.map.tiles
					.split('')
					.filter((_, index) => index % this.map.width === this.x)
					.slice(this.y + 1);

				const nearestWall = remainingTiles.indexOf(MapTile.Wall);

				if (nearestWall !== -1) {
					this.y = this.y + nearestWall - this.radius;
				} else {
					this.y = this.map.height - this.radius;
				}
			}
		}
	}
}
