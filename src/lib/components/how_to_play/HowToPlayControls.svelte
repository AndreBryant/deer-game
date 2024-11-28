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
		space: false
	};
	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowUp') {
				e.preventDefault();
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
			}
			if (e.key === 'ArrowDown') {
				e.preventDefault();
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
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
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700">&nbsp;W&nbsp;</span> or
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700"
					><ChevronUp class="inline" /></span
				>
				to move up, <br />
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700">&nbsp;A&nbsp;</span> or
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700"
					><ChevronLeft class="inline" /></span
				>
				to move left, <br />
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700">&nbsp;S&nbsp;</span> or
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700"
					><ChevronDown class="inline" /></span
				>
				to move down, and <br />
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700">&nbsp;D&nbsp;</span> or
				<span class="rounded-lg border bg-opacity-40 hover:bg-slate-700"
					><ChevronRight class="inline" /></span
				>
				to move right.
			</p>
		</div>
		<div class="flex flex-col gap-4">
			<h3 class="">Player Attack</h3>
			<p class="opacity-60">
				Press <span class="rounded-lg border bg-opacity-40 hover:bg-slate-700"
					>&nbsp;Space&nbsp;</span
				> to charge, then release to attack.
			</p>
		</div>
		<div class="flex flex-col gap-4">
			<h3 class="">Game Information</h3>
			<p class="opacity-60">
				Press <span class="rounded-lg border bg-opacity-40 hover:bg-slate-700">&nbsp;Tab&nbsp;</span
				> to toggle, game details and participant list/ leaderboards.
			</p>
		</div>
	</Content>
</div>
