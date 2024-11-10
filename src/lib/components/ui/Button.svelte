<script lang="ts">
	export let text: string;
	export let iconLeft: any = null;
	export let href: string = '';
	export let variant: 'primary' | 'disabled' | 'link' = 'primary';
	export let onclick = () => {};
</script>

<a
	class={`group hover:font-semibold ${variant === 'disabled' ? 'pointer-events-none cursor-not-allowed opacity-40' : ''}`}
	{href}
	on:click={onclick}
>
	{#if iconLeft}
		<svelte:component
			this={iconLeft}
			class={`inline-block transition-all ${variant === 'link' ? 'stroke-1 opacity-90 group-hover:stroke-2 group-hover:opacity-100' : ''}`}
			size={variant === 'link' ? 18 : 20}
		/>
	{/if}
	{text}
	{#if variant !== 'link'}
		<span
			class="block h-0.5 max-w-0 bg-slate-950 transition-all duration-100 group-hover:max-w-full"
		></span>
	{/if}
</a>
