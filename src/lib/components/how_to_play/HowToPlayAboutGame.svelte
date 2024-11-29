<script lang="ts">
	import Title from './HowToPlayTitle.svelte';
	import Content from './HowToPlayContent.svelte';
	import about_game_1 from '$lib/components/how_to_play/images/about_game_1.png';
</script>

<div class="flex flex-col gap-4 overflow-hidden">
	<Title>About Deer Game</Title>
	<Content>
		<p class="opacity-60">
			Deer game is a semestral project for our course, CMSC 135 Computer Networking. In order to
			show the networking concepts, we made use of Websockets with the help of Socket.io library.
		</p>

		<p class="opacity-60">
			This game is inspired by the "You Deer" scene on the opening of the anime "My Dear Friend
			Nokotan."
		</p>
		<img src={about_game_1} alt="about_game_1" class="mx-auto block h-64" />

		<div>
			<p class="mb-2">Developers:</p>
			<ul class="ml-4 list-inside list-decimal space-y-2">
				<li class="opacity-60">Andre Bryant N. Bagalso</li>
				<li class="opacity-60">
					Please add your name here (If you worked on this project) via git commit & push
				</li>
			</ul>
		</div>
		<div>
			<p class="mb-2">Build Date: <span class="opacity-60">December 2024</span></p>
		</div>
	</Content>
</div>
