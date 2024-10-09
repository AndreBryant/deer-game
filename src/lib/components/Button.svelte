<script lang="ts">
	export let text: string;
	export let iconLeft: any = null;
	export let href: string = '';
	export let onclick = () => {};
</script>

<a class="group hover:font-semibold" {href} on:click={onclick}>
	{#if iconLeft}
		<svelte:component this={iconLeft} class="mr-1 inline-block" />
	{/if}
	{text}
	<span class="block h-0.5 max-w-0 bg-slate-950 transition-all duration-100 group-hover:max-w-full"
	></span>
</a>
