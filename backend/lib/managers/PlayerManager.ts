import { Server } from 'socket.io';
import { Player } from '../Player.js';
import { MAP_HEIGHT as mh, MAP_WIDTH as mw, TILESIZE as tsize } from '../map.js';

export class PlayerManager {
	private players: { [key: string]: Player } = {};
	private keyStates: { [key: string]: { [key: string]: { [key: string]: boolean } } } = {};

	addPlayer(player: Player) {
		this.players[player.id] = player;
		this.initializeKeyState(player.room, player.id);
	}

	getPlayer(playerId: string) {
		return this.players[playerId];
	}

	removePlayer(playerId: string) {
		delete this.players[playerId];
		delete this.keyStates[playerId];
	}

	updatePlayers(io: Server, roomID: string, gameStarted: boolean, safeZoneBoundary: number) {
		const playersInRoom = this.getPlayersInRoom(roomID);

		for (const player in playersInRoom) {
			const p = this.players[player];
			p.update(safeZoneBoundary);
			this.handleMovement(player);
			this.handleActions(io, player, gameStarted, roomID);
			if (!p.isDead && !p.invincible && !this.isInSafeZone(p.x!, p.y!, safeZoneBoundary)) {
				const health = p.takeDamage(1, gameStarted);
				if (health <= 0) {
					p.die();
					io.to(roomID).emit('toast_notification', {
						message: p.name + ' stayed too long outside the safe zone.'
					});
				}

				p.invincible = true;
				p.invincibilityEndTime = Date.now() + 1000;
			}
		}
	}

	private isInSafeZone(px: number, py: number, safeZoneBoundary: number) {
		const mapWidth = mw * tsize;
		const mapHeight = mh * tsize;
		const safeZone = safeZoneBoundary * tsize;
		const xRemaining = mapWidth - safeZone;
		const yRemaining = mapHeight - safeZone;
		const { x, y } = {
			x: xRemaining / 2,
			y: yRemaining / 2
		};
		return px > x && py > y && px < x + safeZone && py < y + safeZone;
	}

	randomizePlayersPositions(safeZoneBoundary: number) {
		for (const player in this.players) {
			this.players[player].randomizePosition(safeZoneBoundary);
		}
	}

	handleMovement(playerId: string) {
		const player = this.players[playerId];
		if (player.isDead) return;

		if (player && this.keyStates[player.room] && this.keyStates[player.room][playerId]) {
			const keys = this.keyStates[player.room][playerId];
			if (keys.up) {
				player.updateY(true, mh);
			}
			if (keys.down) {
				player.updateY(false, mh);
			}
			if (keys.left) {
				player.updateX(true, mw);
			}
			if (keys.right) {
				player.updateX(false, mw);
			}
		}
	}

	updateKeyStates(playerId: string, roomID: string, keyStates: { [key: string]: boolean }) {
		if (this.keyStates[roomID] && this.keyStates[roomID][playerId]) {
			this.keyStates[roomID][playerId] = keyStates;
		}
	}

	handleActions(io: Server, playerId: string, gameStarted: boolean, gameID: string) {
		const player = this.players[playerId];
		if (player.isDead) return;

		if (player && this.keyStates[player.room] && this.keyStates[player.room][playerId]) {
			const keys = this.keyStates[player.room][playerId];
			const isMoving = Object.values(keys).some((state) => state);

			// If stationary, has a chance to eat grass (afk animation)
			if (!isMoving) {
				if (
					player.action !== 'eat_grass' ||
					!player.actionEndTime ||
					player.actionEndTime <= Date.now()
				) {
					if (Math.random() < 0.001) {
						player.action = 'eat_grass';
						player.actionEndTime = Date.now() + 1000;
					} else {
						player.action = 'idle';
					}
				}
			} else {
				player.action = 'walk';
				player.actionEndTime = null;
			}

			if (keys['attack']) this.performAttack(io, player, gameStarted, gameID);
		}
	}

	getPlayersInRoom(room: string): { [key: string]: Player } {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return Object.fromEntries(Object.entries(this.players).filter(([_, p]) => p.room === room));
	}

	private initializeKeyState(room: string, playerId: string) {
		this.keyStates[room] = { ...this.keyStates[room] };
		this.keyStates[room][playerId] = {
			up: false,
			down: false,
			left: false,
			right: false,
			attack: false
		};
	}

	private performAttack(io: Server, player: Player, gameStarted: boolean, gameID: string) {
		if (player.isDead) return;

		player.action = 'attack';
		player.actionEndTime = Date.now() + 5000;
		const targets = this.getPlayersInRoom(player.room);
		for (const target of Object.values(targets)) {
			if (target.isDead) continue;

			if (target.id !== player.id && isInAttackRange(player, target) && !target.invincible) {
				const health = target.takeDamage(player.attack, gameStarted);

				if (health <= 0) {
					target.die();
					player.addScore();
					io.to(gameID).emit('toast_notification', {
						message: target.name + ' was killed by ' + player.name + '.'
					});
				}

				target.invincible = true;
				target.invincibilityEndTime = Date.now() + 1000;
			}
		}
	}

	private broadcastToastNotification(io: Server, gameID: string, message: string) {
		io.to(gameID).emit('toast_notification', {
			message
		});
	}
}

function isInAttackRange(attacker: Player, target: Player) {
	if (attacker.isDead || target.isDead) return false;

	const attackRange = attacker.radius * 1.5;
	const distance = Math.sqrt(
		Math.pow(attacker.x! - target.x!, 2) + Math.pow(attacker.y! - target.y!, 2)
	);

	if (distance > attackRange) {
		return false;
	}
	const isFacingLeft = attacker.isFacingLeft;
	const inFront = isFacingLeft ? target.x! < attacker.x! : target.x! > attacker.x!;

	return inFront;
}
