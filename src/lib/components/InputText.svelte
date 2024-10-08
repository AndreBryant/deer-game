<script lang="ts">
	export let placeholder = '';
	export let iconLeft: any = null;
</script>

<div class="group flex">
	{#if iconLeft}
		<svelte:component
			this={iconLeft}
			class="mr-1 inline-block opacity-35 transition-opacity group-focus-within:opacity-100"
		/>
	{/if}
	<div>
		<input
			class="border-b border-slate-950 border-opacity-35 bg-transparent px-2 placeholder:text-slate-950 placeholder:opacity-60 focus:outline-none focus:placeholder:text-opacity-80"
			type="text"
			{placeholder}
		/>
		<span
			class="block h-0.5 max-w-0 bg-slate-950 transition-all duration-100 group-focus-within:max-w-full"
		></span>
	</div>
</div>
