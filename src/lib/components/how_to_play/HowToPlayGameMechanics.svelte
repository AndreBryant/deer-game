<script lang="ts">
	import Title from './HowToPlayTitle.svelte';
	import Content from './HowToPlayContent.svelte';
</script>

<div class="flex flex-col gap-4 overflow-hidden">
	<Title>Game Mechanics</Title>
	<Content>
		<p class="opacity-80">
			After the game has started, players start at randomized positions on the map.
		</p>
		<img src="" alt="game_mechanics_1" class="mx-auto block" />
		<p class="opacity-80">They can attack by charging up and releasing the spacebar.</p>
		<img src="" alt="game_mechanics_2" class="mx-auto block" />
		<p class="opacity-80">The safe zone decreases every 30 seconds.</p>
		<img src="" alt="game_mechanics_3" class="mx-auto block" />
		<p class="opacity-80">Going outside the safezone deals damage to the player.</p>
		<img src="" alt="game_mechanics_4" class="mx-auto block" />
		<p class="opacity-80">If a player kills another player, they get +1000 pts.</p>
		<img src="" alt="game_mechanics_5" class="mx-auto block" />
		<p class="opacity-80">If a player is killed, their score is halved.</p>
		<img src="" alt="game_mechanics_6" class="mx-auto block" />
	</Content>
</div>
