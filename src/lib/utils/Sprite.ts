const fps = import.meta.env.FPS || 30;

export const FRAME_SIZE: number = 32;
export const DEER_SPRITE_ANIMATION_DATA: {
	[key: string]: { slowness_factor: number; positions: { x: number; y: number }[] };
} = {
	idle: {
		slowness_factor: fps === 30 ? 10 : 20,
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
		slowness_factor: fps === 30 ? 6 : 12,
		positions: [
			{ x: 0 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 1 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 2 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 3 * FRAME_SIZE, y: 1 * FRAME_SIZE },
			{ x: 4 * FRAME_SIZE, y: 1 * FRAME_SIZE }
		]
	},
	walk: {
		slowness_factor: fps === 30 ? 2 : 4,
		positions: [
			{ x: 0 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 1 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 2 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 3 * FRAME_SIZE, y: 2 * FRAME_SIZE },
			{ x: 4 * FRAME_SIZE, y: 2 * FRAME_SIZE }
		]
	},
	attack: {
		slowness_factor: fps === 30 ? 3 : 6,
		positions: [
			{ x: 0 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 1 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 2 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 3 * FRAME_SIZE, y: 5 * FRAME_SIZE },
			{ x: 4 * FRAME_SIZE, y: 5 * FRAME_SIZE }
		]
	},
	charge: {
		slowness_factor: fps === 30 ? 1 : 2,
		positions: [{ x: 1 * FRAME_SIZE, y: 5 * FRAME_SIZE }]
	},
	die: {
		slowness_factor: fps === 30 ? 2 : 4,
		positions: []
	}
};
