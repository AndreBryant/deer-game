<script lang="ts">
	export let text: string;
	export let iconLeft: any = null;
	export let href: string = '';
	export let variant: 'primary' | 'disabled' | 'link' = 'primary';
	export let onclick = (event: Event) => {};

	function handleClick(event: Event) {
		if (variant === 'disabled') return;
		if (href) {
			window.location.href = href;
		} else {
			onclick(event);
		}
	}
</script>

<span
	role="button"
	tabindex={variant === 'disabled' ? undefined : 0}
	class={`group inline hover:font-semibold ${variant === 'disabled' ? 'pointer-events-none cursor-not-allowed opacity-40' : ''}`}
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && handleClick(e)}
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
</span>
