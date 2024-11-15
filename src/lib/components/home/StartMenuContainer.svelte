<script lang="ts">
	import SplashText from './SplashText.svelte';
	import StartMenu from './StartMenu.svelte';
	import StartMenuFooter from './StartMenuFooter.svelte';
	import JoinGameMenu from './JoinGameMenu.svelte';
	import GameTitle from './GameTitle.svelte';

	export let rooms: ClientSideRooms = {};

	let username: string = '';

	// For Joining Game
	let joinRoomPressed = false;
	const toggleJoinPressed = function () {
		joinRoomPressed = !joinRoomPressed;
	};
</script>

<div
	class="relative flex flex-col gap-8 rounded-xl border bg-slate-50 bg-opacity-55 px-16 py-16 shadow-md backdrop-blur-lg transition hover:bg-opacity-75"
>
	<SplashText />
	<section class="mx-4 flex flex-col gap-8">
		<GameTitle />
		{#if !joinRoomPressed}
			<StartMenu bind:username {toggleJoinPressed} />
			<StartMenuFooter />
		{:else}
			<JoinGameMenu {rooms} {username} {toggleJoinPressed} />
		{/if}
	</section>
</div>
