<script lang="ts">
	import Title from './HowToPlayTitle.svelte';
	import Content from './HowToPlayContent.svelte';
	import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	const keyStates = {
		up: false,
		down: false,
		left: false,
		right: false,
		space: false,
		tab: false
	};
	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowUp' || e.key === 'w') {
				e.preventDefault();
				keyStates.up = true;
			}
			if (e.key === 'ArrowLeft' || e.key === 'a') {
				e.preventDefault();
				keyStates.left = true;
			}
			if (e.key === 'ArrowDown' || e.key === 's') {
				e.preventDefault();
				keyStates.down = true;
			}
			if (e.key === 'ArrowRight' || e.key === 'd') {
				e.preventDefault();
				keyStates.right = true;
			}
			if (e.key === ' ') {
				e.preventDefault();
				keyStates.space = true;
			}
			if (e.key === 'Tab') {
				e.preventDefault();
				keyStates.tab = true;
			}
		});

		window.addEventListener('keyup', (e) => {
			if (e.key === 'ArrowUp' || e.key === 'w') {
				e.preventDefault();
				keyStates.up = false;
			}
			if (e.key === 'ArrowLeft' || e.key === 'a') {
				e.preventDefault();
				keyStates.left = false;
			}
			if (e.key === 'ArrowDown' || e.key === 's') {
				e.preventDefault();
				keyStates.down = false;
			}
			if (e.key === 'ArrowRight' || e.key === 'd') {
				e.preventDefault();
				keyStates.right = false;
			}
			if (e.key === ' ') {
				e.preventDefault();
				keyStates.space = false;
			}
			if (e.key === 'Tab') {
				e.preventDefault();
				keyStates.tab = false;
			}
		});
	});
</script>

<div class="flex flex-col gap-4 overflow-hidden">
	<Title>Key Bindings</Title>
	<Content>
		<div class="flex flex-col gap-4">
			<h3 class="">Player Movement</h3>
			<p class="opacity-60">Control your deer by pressing the following keys:</p>
			<p class="ml-8 opacity-60">
				<span
					class="rounded-lg border bg-opacity-60 hover:bg-slate-700"
					class:bg-slate-700={keyStates.up}>&nbsp;W&nbsp;</span
				>
				or
				<span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.up}><ChevronUp class="inline" /></span
				>
				to move up, <br />
				<span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.left}>&nbsp;A&nbsp;</span
				>
				or
				<span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.left}><ChevronLeft class="inline" /></span
				>
				to move left, <br />
				<span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.down}>&nbsp;S&nbsp;</span
				>
				or
				<span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.down}><ChevronDown class="inline" /></span
				>
				to move down, and <br />
				<span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.right}>&nbsp;D&nbsp;</span
				>
				or
				<span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.right}><ChevronRight class="inline" /></span
				>
				to move right.
			</p>
		</div>
		<div class="flex flex-col gap-4">
			<h3 class="">Player Attack</h3>
			<p class="opacity-60">
				Press <span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.space}>&nbsp;Space&nbsp;</span
				> to charge, then release to attack.
			</p>
		</div>
		<div class="flex flex-col gap-4">
			<h3 class="">Game Information</h3>
			<p class="opacity-60">
				Press <span
					class="rounded-lg border bg-opacity-70 hover:bg-slate-700"
					class:bg-slate-700={keyStates.tab}>&nbsp;Tab&nbsp;</span
				> to toggle, game details and participant list/ leaderboards.
			</p>
		</div>
	</Content>
</div>
