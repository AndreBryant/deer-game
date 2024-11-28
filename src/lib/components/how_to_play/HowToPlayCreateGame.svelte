<script lang="ts">
	import Title from './HowToPlayTitle.svelte';
	import Content from './HowToPlayContent.svelte';
</script>

<div class="flex flex-col gap-4 overflow-hidden">
	<Title>Creating a Game</Title>
	<Content>
		<ul class="list-inside list-decimal space-y-8 opacity-80">
			<li>Type your name in the input field.</li>
			<li>Click the "Create Game" button.</li>
			<li>Wait for other players to join.</li>
			<li>You can start the game if at least 2 players have joined.</li>
		</ul>
	</Content>
</div>
