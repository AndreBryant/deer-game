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
	attack: number;
	health: number;
	sex: 'm' | 'f';
	hasNose: boolean;

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
		this.attack = 1;
		this.health = 15;
		// this should be false by default but for now, it's randomized
		this.hasNose = Math.random() < 0.5;
		this.sex = Math.random() < 0.5 ? 'f' : 'm';
	}

	updateX(left: boolean) {
		this.x += left ? -this.dx : this.dx;
		this.isFacingLeft = left;

		if (this.x + this.radius >= this.map.width * TILESIZE) {
			this.x = this.map.width * TILESIZE - this.radius;
		} else if (this.x - this.radius < 0) {
			this.x = this.radius;
		}

		// IMPORTANT DO NOT REMOVE
		// console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}

	updateY(up: boolean) {
		this.y += up ? -this.dy : this.dy;

		if (this.y + this.radius >= (this.map.height - 1) * TILESIZE) {
			this.y = (this.map.height - 1) * TILESIZE - this.radius;
		} else if (this.y - this.radius < -(TILESIZE * 2)) {
			this.y = this.radius - TILESIZE * 2;
		}
		// IMPORTANT DO NOT REMOVE
		// console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}
}
