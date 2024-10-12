export const palette = {
	primary: {
		white: '#FEFEFC',
		brown: '#E6C182',
		darkBrown: '#7D6D68',
		yellow: '#F9CF80',
		skinTone: '#f6D8BE'
	}
};

export function getRandomColor() {
	const colors = Object.values(palette.primary);
	const randomIndex = Math.floor(Math.random() * colors.length);
	return colors[randomIndex];
}
