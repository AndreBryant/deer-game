/* eslint-disable @typescript-eslint/no-explicit-any */
export const FRAME_SIZE = 32;
export const DEER_SPRITE_ANIMATION_DATA = {
	idle: {
		slowness_factor: 15,
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
		slowness_factor: 10,
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
	}
};

export function drawPlayer(p5: any, spriteSheet: any, x: number, y: number, player: any) {
	// username
	p5.textFont('monospace');
	p5.textSize(24);
	p5.textAlign(p5.CENTER, p5.CENTER);
	p5.fill(player.color);
	p5.text(player.name, x, y - player.radius * 1.5);

	// Add this to player class
	const isFacingLeft = player.isFacingLeft;
	const action = player.action;
	const slownessFactor = DEER_SPRITE_ANIMATION_DATA[action].slowness_factor;
	const frame =
		p5.floor(p5.frameCount / slownessFactor) % DEER_SPRITE_ANIMATION_DATA[action].positions.length;
	p5.push();
	if (isFacingLeft) {
		p5.scale(-1, 1);
		p5.translate(-p5.width, 0);
	}
	p5.fill(0, 0, 0, 50);
	p5.noStroke();
	p5.ellipse(p5.width / 2, p5.height / 2 + 64, 128, 16);
	p5.imageMode(p5.CENTER);
	p5.image(
		spriteSheet,
		x,
		y,
		player.radius * 2,
		player.radius * 2,
		DEER_SPRITE_ANIMATION_DATA[action].positions[frame].x,
		DEER_SPRITE_ANIMATION_DATA[action].positions[frame].y,
		FRAME_SIZE,
		FRAME_SIZE
	);
	p5.pop();
}
