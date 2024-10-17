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
		this.dx = 20;
		this.dy = 20;
		this.radius = 20;
		this.color = color;
	}

	updateX(width: number, left: boolean) {
		if (left) {
			this.x -= this.dx;
		} else {
			this.x += this.dx;
		}
	}

	updateY(width: number, up: boolean) {
		if (up) {
			this.y -= this.dy;
		} else {
			this.y += this.dy;
		}
	}
}
