export class Ball {
	dx: number;
	dy: number;
	constructor(
		public x: number,
		public y: number,
		public radius: number,
		public color: string
	) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.dx = 2;
		this.dy = 2;
		this.color = color;
	}

	public update(p5: any) {
		if (this.x + this.radius > p5.width || this.x - this.radius < 0) {
			this.dx *= -1;
		}
		if (this.y + this.radius > p5.height || this.y - this.radius < 0) {
			this.dy *= -1;
		}

		this.x += this.dx;
		if (this.x < 0) {
			this.x = 1;
		}
		this.y += this.dy;
		if (this.y < 0) {
			this.y = 1;
		}
	}

	public show(p5: any) {
		p5.fill(this.color);
		p5.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
	}
}
