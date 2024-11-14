import { TILESIZE, MAP_WIDTH, MAP_HEIGHT } from './map.js';

export const PLAYER_HIT_RADIUS = TILESIZE * 2;

const playerSpeedX = 12;
const playerSpeedXAttack = 6;
const playerSpeedY = 12;
const playerSpeedYAttack = 6;
const startingHealth = 25;
const startingAttack = 5;

export class Player {
	id: string;
	room: string;
	isHost: boolean;
	name: string;
	color: string;
	radius: number;
	x: number | null;
	y: number | null;
	dy: number;
	dx: number;
	isFacingLeft: boolean;
	action: string;
	actionEndTime: number | null;
	attack: number;
	health: number;
	sex: 'm' | 'f';
	invincible: boolean;
	invincibilityEndTime: number | null;
	isDead: boolean;
	respawnTime: number | null;
	score: number;
	isPoweredUp: boolean;
	powerUpTime: number | null;

	constructor(
		id: string,
		room: string,
		isHost: boolean,
		name: string,
		x: number,
		y: number,
		color: string
	) {
		// Player identification
		this.id = id;
		this.room = room;
		this.isHost = isHost;
		this.name = name;

		// Player positioning and hitbox (yung radius haha)
		this.x = x;
		this.y = y;
		this.dx = playerSpeedX;
		this.dy = playerSpeedY;
		this.radius = PLAYER_HIT_RADIUS;

		// Player actions
		this.action = 'idle';
		this.actionEndTime = null;
		this.invincible = false;
		this.invincibilityEndTime = null;
		this.respawnTime = null;
		this.powerUpTime = null;

		// player states
		this.isPoweredUp = false;
		this.isFacingLeft = false;
		this.isDead = false;

		// player diversity
		this.color = color;
		this.sex = Math.random() < 0.5 ? 'f' : 'm';

		// player traits
		this.attack = startingAttack;
		this.health = startingHealth;
		this.score = 0;
	}

	update() {
		if (this.isDead && this.respawnTime) {
			if (this.respawnTime <= new Date().getTime()) {
				this.isDead = false;
				this.respawnTime = null;
				this.health = startingHealth;

				const maxX = (MAP_WIDTH - 8) * TILESIZE - PLAYER_HIT_RADIUS;
				const minX = 8 * TILESIZE + PLAYER_HIT_RADIUS;
				const maxY = (MAP_HEIGHT - 8) * TILESIZE - PLAYER_HIT_RADIUS;
				const minY = 8 * TILESIZE + PLAYER_HIT_RADIUS;

				this.x = Math.floor(Math.random() * (maxX - minX) + minX);
				this.y = Math.floor(Math.random() * (maxY - minY) + minY);
			}
		} else {
			if (
				this.action === 'attack' &&
				this.actionEndTime &&
				this.actionEndTime > new Date().getTime()
			) {
				// Slows down player speed while attacking
				this.dx = playerSpeedXAttack;
				this.dy = playerSpeedYAttack;
			} else {
				// Normal Player speed
				this.dx = playerSpeedX;
				this.dy = playerSpeedY;
			}
			if (
				this.invincible &&
				this.invincibilityEndTime &&
				this.invincibilityEndTime <= new Date().getTime()
			) {
				// Remove Invincibility
				this.invincible = false;
				this.invincibilityEndTime = null;
			}
		}
	}
	updateX(left: boolean, w: number) {
		if (this.isDead && !this.x && !this.y) return;

		this.x! += left ? -this.dx : this.dx;
		this.isFacingLeft = left;

		if (this.x! + this.radius >= w * TILESIZE) {
			this.x = w * TILESIZE - this.radius;
		} else if (this.x! - this.radius < 0) {
			this.x = this.radius;
		}

		// IMPORTANT DO NOT REMOVE (I might use this later)
		// console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}

	updateY(up: boolean, h: number) {
		if (this.isDead && !this.x && !this.y) return;

		this.y! += up ? -this.dy : this.dy;

		if (this.y! + this.radius >= (h - 1) * TILESIZE) {
			this.y = (h - 1) * TILESIZE - this.radius;
		} else if (this.y! - this.radius < -(TILESIZE * 2)) {
			this.y = this.radius - TILESIZE * 2;
		}
		// IMPORTANT DO NOT REMOVE (I might use this later)
		// console.log(Math.floor(this.x / TILESIZE), Math.floor(this.y / TILESIZE));
	}

	takeDamage(damage: number, gameStarted: boolean): number {
		if (gameStarted && !this.invincible) {
			this.health -= damage;
			this.invincible = true;
			this.invincibilityEndTime = Date.now() + 1000;
		}
		if (this.health <= 0) this.die();
		return this.health;
	}

	die() {
		this.isDead = true;
		this.score /= 2;
		this.score = Math.round(this.score * 1000) / 1000;
		this.respawnTime = new Date().getTime() + 5000;
		this.x = null;
		this.y = null;
		this.action = 'die';
		console.log(this);
	}

	addScore() {
		this.score += 1000;
	}
}
