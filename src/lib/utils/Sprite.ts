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
