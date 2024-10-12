export function drawPlayer(data: any, p5: any) {
	p5.fill(data.color);
	p5.ellipse(data.x, data.y, data.radius * 2, data.radius * 2);
}
