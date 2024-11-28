<script lang="ts">
	export let icon: any;
	export let active: boolean = false;
	export let text: string;
	export let onclick = () => {};
	export let tl: boolean = false;
	export let bl: boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
	class="relative flex items-center justify-center gap-4 rounded-r-none border border-slate-50 border-opacity-50 bg-opacity-5 px-2 py-2 transition-all sm:justify-start"
	class:opacity-50={!active}
	class:opacity-100={active}
	class:bg-slate-50={active}
	class:hover:opacity-80={!active}
	class:border-r-0={active}
	class:rounded-tl-lg={tl}
	class:rounded-bl-lg={bl}
	on:click={onclick}
>
	<svelte:component this={icon} />
	<span class="hidden text-sm sm:block">
		{text}
	</span>
	{#if active}
		<div class="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-slate-50 bg-opacity-40"></div>
	{/if}
</li>
