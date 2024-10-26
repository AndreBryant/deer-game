import { type Map, MapTile, TILESIZE } from './map';

export const PLAYER_HIT_RADIUS = TILESIZE * 2;
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
	isFacingLeft: boolean;
	action: string;
	actionEndTime: number | null;
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
		this.radius = PLAYER_HIT_RADIUS;
		this.dx = 15;
		this.dy = 15;
		this.action = 'idle';
		this.actionEndTime = null;
		this.color = color;
		this.isFacingLeft = false;
		this.map = map;
	}

	// TODO FIX nextX so that it does not use this.radius
	updateX(left: boolean) {
		this.x += left ? -this.dx : this.dx;
		this.isFacingLeft = left;

		// const tileSize = this.map.tileSize;
		// const nextX = left ? this.x - this.dx : this.x + this.dx;
		// const floorX = Math.floor(nextX / tileSize);
		// const floorY = Math.floor(this.y / tileSize);
		// const nextTile = this.map.getTile(Math.floor(nextX / tileSize), floorY);

		// if (nextTile && nextTile !== MapTile.Wall) {
		// 	this.x = nextX;
		// } else {
		// if (left) {
		// 	this.x = (floorX + 1) * tileSize + this.radius;
		// } else {
		// 	this.x = floorX * tileSize - this.radius;
		// }
		// }
		console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}

	updateY(up: boolean) {
		this.y += up ? -this.dy : this.dy;
		// const tileSize = this.map.tileSize;
		// const nextY = up ? this.y - this.dy - this.radius : this.y + this.dy + this.radius;
		// const floorY = Math.floor(nextY / tileSize);
		// const floorX = Math.floor(this.x / tileSize);
		// const nextTile = this.map.getTile(floorX, Math.floor(nextY / tileSize));

		// if (nextTile && nextTile !== MapTile.Wall) {
		// 	this.y = nextY;
		// } else {
		// 	if (up) {
		// 		this.y = (floorY + 1) * tileSize + this.radius;
		// 	} else {
		// 		this.y = floorY * tileSize - this.radius;
		// 	}
		// }
		console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}
}
