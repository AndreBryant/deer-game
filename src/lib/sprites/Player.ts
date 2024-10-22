import { DEER_SPRITE_ANIMATION_DATA } from './Sprite';

export class Player {
	spriteData: typeof DEER_SPRITE_ANIMATION_DATA;
	currentFrame: number;
	currentAction: string;
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.spriteData = DEER_SPRITE_ANIMATION_DATA;
		this.currentFrame = 0;
		this.currentAction = 'idle';
		this.x = x;
		this.y = y;
	}

	show(p5: any) {
		switch (this.currentAction) {
			case 'idle':
				p5.image(
					this.spriteData.idle.positions[this.currentFrame % this.spriteData.idle.positions.length],
					this.x,
					this.y
				);
				break;
			case 'walk':
				p5.image(
					this.spriteData.walk.positions[this.currentFrame % this.spriteData.walk.positions.length],
					this.x,
					this.y
				);
				break;
		}
		this.currentFrame++;
	}
}
