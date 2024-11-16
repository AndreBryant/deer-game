/* eslint-disable @typescript-eslint/no-explicit-any */
export const FRAME_SIZE: number = 32;
export const DEER_SPRITE_ANIMATION_DATA: {
	[key: string]: { slowness_factor: number; positions: { x: number; y: number }[] };
} = {
	idle: {
		slowness_factor: 20,
		// TopLeft Corners
		positions: [
			{ x: 0 * FRAME_SIZE, y: 0 * FRAME_SIZE },
			{ x: 1 * FRAME_SIZE, y: 0 * FRAME_SIZE },
			{ x: 2 * FRAME_SIZE, y: 0 * FRAME_SIZE },
			{ x: 3 * FRAME_SIZE, y: 0 * FRAME_SIZE },
			{ x: 4 * FRAME_SIZE, y: 0 * FRAME_SIZE }
		]
	},
	eat_grass: {
		slowness_factor: 12,
		positions: [
			{ x: 0 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 1 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 2 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 3 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 4 * FRAME_SIZE, y: 1 * FRAME_SIZE }
		]
	},
	walk: {
		slowness_factor: 4,
		positions: [
			{ x: 0 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 1 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 2 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 3 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 4 * FRAME_SIZE, y: 2 * FRAME_SIZE }
		]
	},
	attack: {
		slowness_factor: 4,
		positions: [
			{ x: 0 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 1 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 2 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 3 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 4 * FRAME_SIZE, y: 5 * FRAME_SIZE }
		]
	},
	die: {
		slowness_factor: 4,
		positions: []
	}
};

export function drawPlayer(
	p5: any,
	spriteSheet: any,
	x: number,
	y: number,
	player: any,
	playerOffset: number
) {
	// Player username tag
	p5.textFont('monospace');
	p5.textSize(24);
	p5.textAlign(p5.CENTER, p5.CENTER);
	p5.fill(player.color);
	p5.text(
		(player.isHost ? '★ ' : '') +
			(player.name.length > 30 ? player.name.substring(0, 27) + '...' : player.name),
		x,
		y - player.radius * 1.5
	);

	// Add this to player class
	const isFacingLeft: boolean = player.isFacingLeft;
	const action: string = player.action;
	const actionData: { slowness_factor: number; positions: { x: number; y: number }[] } =
		DEER_SPRITE_ANIMATION_DATA[action];
	const slownessFactor: number = actionData.slowness_factor;
	const frame: number =
		p5.floor((p5.frameCount + playerOffset) / slownessFactor) % actionData.positions.length;
	const blinking: boolean =
		player.dangerZoneDamageCooldown || player.invincible ? p5.frameCount % 20 < 10 : false;

	if (!blinking) {
		p5.push();
		if (player.invincible || player.dangerZoneDamageCooldown) {
			p5.tint(255, 150, 150, 180);
		}
		p5.translate(x, y);
		if (isFacingLeft) {
			p5.scale(-1, 1);
		}

		p5.fill(0, 0, 0, 50);
		p5.noStroke();

		// Player Shadow
		p5.ellipse(0, 0 + 64, player.radius * 2, 16);
		p5.imageMode(p5.CENTER);
		p5.image(
			spriteSheet,
			0,
			0,
			player.radius * 2,
			player.radius * 2,
			actionData.positions[frame].x,
			actionData.positions[frame].y,
			FRAME_SIZE,
			FRAME_SIZE
		);
		p5.pop();
	}
}
