export const palette = {
	primary: {
		white: '#FEFEFC',
		brown: '#E6C182',
		darkBrown: '#7D6D68',
		yellow: '#F9CF80',
		skinTone: '#f6D8BE',
		sky_blue: '#87cefa',
		night_sky: '#06141c',
		mountainA_day: '#7D6D68',
		mountainB_day: '#E6C182',
		mountainC_day: '#F9CF80',
		mountainA_night: '#524744',
		mountainB_night: '#877049',
		mountainC_night: '#997e4d'
	}
};

export function getRandomColor() {
	const colors = Object.values(palette.primary);
	const randomIndex = Math.floor(Math.random() * colors.length);
	return colors[randomIndex];
}
