export async function load({ url }) {
	const host = url.searchParams.get('host') === 'true';
	const username = url.searchParams.get('username') || 'Host';
	const gameID = url.searchParams.get('gameID') || generateRandomGameId();

	return { host, gameID, username };
}

function generateRandomGameId() {
	// return Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
	// return 'debug';
	return Math.random().toString().substring(2, 6);
}
