export class Ball {
	dx: number;
	dy: number;
	constructor(
		public x: number,
		public y: number,
		public radius: number,
		public color: string,
		p5: any
	) {
		this.radius = radius;
		this.x = p5.constrain(x, radius, p5.width);
		this.y = p5.constrain(y, radius, p5.height);
		this.dx = p5.random(1, 5) * p5.random([-1, 1]);
		this.dy = p5.random(1, 5) * p5.random([-1, 1]);
		this.color = color;
	}

	public update(p5: any) {
		p5.ellipseMode(p5.CENTER);

		if (this.x + this.radius >= p5.width || this.x - this.radius < 0) {
			this.dx *= -1;
		}
		if (this.y + this.radius >= p5.height || this.y - this.radius < 0) {
			this.dy *= -1;
		}

		this.x += this.dx;
		if (this.x < 0) {
			this.x = 1;
		}
		if (this.x > p5.width - this.radius) {
			this.x = p5.width - this.radius;
		}
		this.y += this.dy;
		if (this.y < 0) {
			this.y = 1;
		}
		if (this.y > p5.height - this.radius) {
			this.y = p5.height - this.radius;
		}
	}

	public show(p5: any) {
		p5.fill(this.color);
		p5.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
	}
}
