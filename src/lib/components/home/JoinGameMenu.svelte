<script lang="ts">
	import { ChevronLeft } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import JoinGameSearchBar from './JoinGameSearchBar.svelte';
	import JoinGameRoomsContainer from './JoinGameRoomsContainer.svelte';
	import JoinGameUsername from './JoinGameUsername.svelte';

	export let rooms: ClientSideRooms = {};
	export let username: string = '';
	export let toggleJoinPressed: () => void;

	let searchTerm: string = '';

	let filteredRooms: Record<string, ClientSideRoom> = {};
	$: {
		const filtered = Object.entries(rooms).filter(([gameID]) =>
			gameID.toLowerCase().includes(searchTerm.toLowerCase())
		);
		filteredRooms = Object.fromEntries(filtered);
	}
</script>

<div class="flex w-80 flex-col gap-4">
	<JoinGameSearchBar bind:searchTerm />
	<JoinGameUsername {username} />
	<JoinGameRoomsContainer {filteredRooms} {username} />
	<!-- pls do not remove the div, because the Button takes whole width, hte div contrains it to just the size needed -->
	<div>
		<Button text="Back" variant="link" iconLeft={ChevronLeft} onclick={toggleJoinPressed} />
	</div>
</div>
