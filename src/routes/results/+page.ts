export async function load({ url }) {
	const gameID = url.searchParams.get('gameID') || null;
	const socketID = url.searchParams.get('socketId') || null;

	return { gameID, socketID };
}
