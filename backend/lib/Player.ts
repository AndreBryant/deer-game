import { TILESIZE } from './map.js';

export const PLAYER_HIT_RADIUS = TILESIZE * 2;
const playerSpeedX = 12;
const playerSpeedXAttack = 4;
const playerSpeedY = 7;
const playerSpeedYAttack = 2;
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
	attack: number;
	health: number;
	sex: 'm' | 'f';
	hasNose: boolean;
	invincible: boolean;
	invincibilityEndTime: number | null;

	constructor(
		id: string,
		room: string,
		isHost: boolean,
		name: string,
		x: number,
		y: number,
		color: string
	) {
		this.id = id;
		this.room = room;
		this.isHost = isHost;
		this.name = name;
		this.x = x;
		this.y = y;
		this.radius = PLAYER_HIT_RADIUS;
		this.dx = playerSpeedX;
		this.dy = playerSpeedY;
		this.action = 'idle';
		this.actionEndTime = null;
		this.color = color;
		this.isFacingLeft = false;
		this.attack = 1;
		this.health = 15;
		// this should be false by default but for now, it's randomized
		this.hasNose = Math.random() < 0.5;
		this.sex = Math.random() < 0.5 ? 'f' : 'm';
		this.invincible = false;
		this.invincibilityEndTime = null;
	}

	update() {
		if (
			this.action === 'attack' &&
			this.actionEndTime &&
			this.actionEndTime > new Date().getTime()
		) {
			this.dx = playerSpeedXAttack;
			this.dy = playerSpeedYAttack;
		} else {
			this.dx = playerSpeedX;
			this.dy = playerSpeedY;
		}
		if (
			this.invincible &&
			this.invincibilityEndTime &&
			this.invincibilityEndTime <= new Date().getTime()
		) {
			this.invincible = false; // Remove invincibility
			this.invincibilityEndTime = null; // Reset end time
		}
	}
	updateX(left: boolean, w: number) {
		this.x += left ? -this.dx : this.dx;
		this.isFacingLeft = left;

		if (this.x + this.radius >= w * TILESIZE) {
			this.x = w * TILESIZE - this.radius;
		} else if (this.x - this.radius < 0) {
			this.x = this.radius;
		}

		// IMPORTANT DO NOT REMOVE
		// console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}

	updateY(up: boolean, h: number) {
		this.y += up ? -this.dy : this.dy;

		if (this.y + this.radius >= (h - 1) * TILESIZE) {
			this.y = (h - 1) * TILESIZE - this.radius;
		} else if (this.y - this.radius < -(TILESIZE * 2)) {
			this.y = this.radius - TILESIZE * 2;
		}
		// IMPORTANT DO NOT REMOVE
		// console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}

	takeDamage(damage: number) {
		if (!this.invincible) {
			this.health -= damage;
		}
	}
}
