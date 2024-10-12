export class Player {
	id: string;
	room: string;
	isHost: boolean;
	dy: number;
	y: number;
	dx: number;
	radius: number;
	name: string;
	x: number;
	color: string;
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
		this.dx = 27;
		this.dy = 27;
		this.radius = 20;
		this.color = color;
	}

	update(width: number, height: number) {
		if (this.x + this.radius >= width || this.x - this.radius < 0) {
			this.dx *= -1;
		}
		if (this.y + this.radius >= height || this.y - this.radius < 0) {
			this.dy *= -1;
		}
		this.x += this.dx;
		if (this.x < 0) {
			this.x = 1;
		}
		if (this.x > width - this.radius) {
			this.x = width - this.radius;
		}
		this.y += this.dy;
		if (this.y < 0) {
			this.y = 1;
		}
		if (this.y > height - this.radius) {
			this.y = height - this.radius;
		}
	}
}
