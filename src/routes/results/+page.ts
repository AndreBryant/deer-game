export async function load({ url }) {
	const gameID = url.searchParams.get('gameID') || null;

	return { gameID };
}
