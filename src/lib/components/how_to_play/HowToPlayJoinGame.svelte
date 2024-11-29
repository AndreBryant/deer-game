<script lang="ts">
	import Title from './HowToPlayTitle.svelte';
	import Content from './HowToPlayContent.svelte';
	import join_game_1 from '$lib/components/how_to_play/images/create_game_1.png';
	import join_game_2 from '$lib/components/how_to_play/images/join_game_2.png';
	import join_game_3a from '$lib/components/how_to_play/images/join_game_3a.png';
	import join_game_3b from '$lib/components/how_to_play/images/join_game_3b.png';
	import join_game_4 from '$lib/components/how_to_play/images/join_game_4.png';
</script>

<div class="flex flex-col gap-4 overflow-hidden">
	<Title>Joining a Game</Title>
	<Content>
		<p class="opacity-80">Type your name in the input field.</p>
		<img src={join_game_1} alt="join_game_1" class="mx-auto block w-96" />
		<p class="opacity-80">Click the "Join Game" button.</p>
		<img src={join_game_2} alt="join_game_2" class="mx-auto block w-96" />
		<p class="opacity-80">
			You will be able to see all the opened rooms. You can only join a room if the game has not
			started yet.
		</p>
		<div class="flex w-full items-center justify-center gap-2">
			<img src={join_game_3a} alt="join_game_3a" class="w-64" />
			<img src={join_game_3b} alt="join_game_3b" class="w-64" />
		</div>
		<p class="opacity-80">Wait for the host to start the game.</p>
		<img src={join_game_4} alt="join_game_4" class="mx-auto block w-96" />
	</Content>
</div>
