<script lang="ts">
	import Title from './HowToPlayTitle.svelte';
	import Content from './HowToPlayContent.svelte';
	import game_mechanics_1 from '$lib/components/how_to_play/images/game_mechanics_1.png';
	import game_mechanics_2 from '$lib/components/how_to_play/images/game_mechanics_2.png';
</script>

<div class="flex flex-col gap-4 overflow-hidden">
	<Title>Game Mechanics</Title>
	<Content>
		<p class="opacity-80">
			After the game has started, players start at randomized positions on the map. They can attack
			by charging up and releasing the spacebar. If a player kills another player, they get +1000
			pts.If a player is killed, their score is halved.
		</p>
		<img src={game_mechanics_1} alt="game_mechanics_1" class="mx-auto block w-96" />
		<p class="opacity-80">
			The safe zone decreases every 30 seconds. Going outside the safezone deals damage to the
			player.
		</p>
		<img src={game_mechanics_2} alt="game_mechanics_2" class="mx-auto block w-96" />
		<p class="opacity-20">sorry for the illustration</p>
	</Content>
</div>
