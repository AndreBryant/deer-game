import { TILESIZE as T_SIZE, MAP_WIDTH as MW, MAP_HEIGHT as MH } from './Map.js';

export const PLAYER_HIT_RADIUS: number = T_SIZE * 2;

// Constant Variables
const PLAYER_SPEED_X: number = 12;
const PLAYER_SPEED_X_ATTACK: number = 6;
const PLAYER_SPEED_Y: number = 12;
const PLAYER_SPEED_Y_ATTACK: number = 6;
const STARTING_HEALTH: number = 25;
const STARTING_ATTACK: number = 5;

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
	dangerZoneDamageCooldown: number | null;

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
		this.dx = PLAYER_SPEED_X;
		this.dy = PLAYER_SPEED_Y;
		this.radius = PLAYER_HIT_RADIUS;

		// Player actions
		this.action = 'idle';
		this.actionEndTime = null;
		this.invincible = false;
		this.invincibilityEndTime = null;
		this.respawnTime = null;
		this.dangerZoneDamageCooldown = null;

		// player states
		this.isPoweredUp = false;
		this.powerUpTime = null;
		this.isFacingLeft = false;
		this.isDead = false;

		// player diversity
		this.color = color;
		this.sex = Math.random() < 0.5 ? 'f' : 'm';

		// player traits
		this.attack = STARTING_ATTACK;
		this.health = STARTING_HEALTH;
		this.score = 0;
	}

	update(safeZoneBoundary: number) {
		// Mainly checks for player actionEndTimes and any other states such as respawn, attack action, etc.
		if (this.isDead && this.respawnTime) {
			if (this.respawnTime <= new Date().getTime()) {
				this.isDead = false;
				this.respawnTime = null;
				this.health = STARTING_HEALTH;

				this.randomizePosition(safeZoneBoundary);
			}
		} else {
			if (
				this.action === 'attack' &&
				this.actionEndTime &&
				this.actionEndTime > new Date().getTime()
			) {
				// Slows down player speed while attacking
				this.dx = PLAYER_SPEED_X_ATTACK;
				this.dy = PLAYER_SPEED_Y_ATTACK;
			} else {
				// Normal Player speed
				this.dx = PLAYER_SPEED_X;
				this.dy = PLAYER_SPEED_Y;
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
			if (this.dangerZoneDamageCooldown && this.dangerZoneDamageCooldown <= new Date().getTime()) {
				this.dangerZoneDamageCooldown = null;
			}
		}
	}
	updateX(left: boolean, w: number) {
		// Make sure that player does not go beyong the map X.
		if (this.isDead && !this.x && !this.y) return;

		this.x! += left ? -this.dx : this.dx;
		this.isFacingLeft = left;

		if (this.x! + this.radius >= w * T_SIZE) {
			this.x = w * T_SIZE - this.radius;
		} else if (this.x! - this.radius < 0) {
			this.x = this.radius;
		}
	}

	updateY(up: boolean, h: number) {
		// Make sure that player does not go beyong the map Y.
		if (this.isDead && !this.x && !this.y) return;

		this.y! += up ? -this.dy : this.dy;

		if (this.y! + this.radius >= (h - 1) * T_SIZE) {
			this.y = (h - 1) * T_SIZE - this.radius;
		} else if (this.y! - this.radius < -(T_SIZE * 2)) {
			this.y = this.radius - T_SIZE * 2;
		}
	}

	takeDamage(damage: number, gameStarted: boolean): number {
		// Method for taking damage
		if (gameStarted && !this.invincible) {
			this.health -= damage;
		}
		return this.health;
	}

	die() {
		// Method for player death
		this.isDead = true;
		this.respawnTime = new Date().getTime() + 5000;
		this.action = 'die';

		// Reduce player score but make sure it is rounded to at most 3 decimal places
		this.score /= 2;
		this.score = Math.round(this.score * 1000) / 1000;

		this.x = null;
		this.y = null;
	}

	addScore() {
		// Add Score
		this.score += 1000;
	}

	randomizePosition(safeZoneBoundary: number) {
		// Randomizes player position within the safe zone boundaries
		const { minX, maxX, minY, maxY }: { [key: string]: number } = {
			minX: ((MW - safeZoneBoundary) * T_SIZE) / 2,
			maxX: ((MW - safeZoneBoundary) * T_SIZE) / 2 + safeZoneBoundary * T_SIZE,
			minY: ((MH - safeZoneBoundary) * T_SIZE) / 2,
			maxY: ((MH - safeZoneBoundary) * T_SIZE) / 2 + safeZoneBoundary * T_SIZE
		};

		this.x = Math.floor(Math.random() * (maxX - minX) + minX);
		this.y = Math.floor(Math.random() * (maxY - minY) + minY);
	}
}
