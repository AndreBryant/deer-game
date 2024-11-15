export function displayFormatTime(startTime: number, duration: number, now: number) {
	const elapsed = now - startTime;
	const remaining = duration - elapsed;
	const minutes = Math.floor(remaining / 60000);
	const seconds = Math.floor((remaining % 60000) / 1000);
	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
