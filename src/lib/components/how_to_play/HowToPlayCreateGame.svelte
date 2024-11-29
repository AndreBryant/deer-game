<script lang="ts">
	import Title from './HowToPlayTitle.svelte';
	import Content from './HowToPlayContent.svelte';
	import create_game_1 from '$lib/components/how_to_play/images/create_game_1.png';
	import create_game_2 from '$lib/components/how_to_play/images/create_game_2.png';
	import create_game_3 from '$lib/components/how_to_play/images/create_game_3.png';
</script>

<div class="flex flex-col gap-4 overflow-hidden">
	<Title>Creating a Game</Title>
	<Content>
		<p class="opacity-80">Type your name in the input field.</p>
		<img src={create_game_1} alt="create_game_1" class="mx-auto block w-96" />
		<p class="opacity-80">Click the "Create Game" button.</p>
		<img src={create_game_2} alt="create_game_2" class="mx-auto block w-96" />
		<p class="opacity-80">
			Wait for other players to join. You can start the game if at least 2 players have joined by
			pressing the "Start Game" Button.
		</p>
		<img src={create_game_3} alt="create_game_3" class=" mx-auto block w-96" />
	</Content>
</div>
