export function load({ url }) {
	const host = url.searchParams.get('host') === 'true';

	const username = url.searchParams.get('username') || 'Host';

	const gameID = url.searchParams.get('gameID') || generateRandomGameId();
	if (!host) {
		// handle joining player to a game room
		// handle inexistent gameID, redirect them to homepage (jsut in case, they manipulated a link or used an old link)
	} else {
		// TODO: handle creation of a valid room
	}

	return { host, gameID, username };
}

function generateRandomGameId() {
	// thanks to codeium
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
