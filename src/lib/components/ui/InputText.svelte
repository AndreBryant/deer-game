<script lang="ts">
	import { Check, X } from 'lucide-svelte';
	export let placeholder = '';
	export let iconLeft: any = null;
	export let value = '';
	export let valid: 'invalid' | 'valid' | 'none' = 'none';
	export let numOfPlayers: string = '';
</script>

<div class="group flex">
	{#if iconLeft}
		{#if valid === 'none'}
			<svelte:component
				this={iconLeft}
				class="mr-1 inline-block opacity-35 transition-opacity group-focus-within:opacity-100"
			/>
		{:else if valid === 'valid'}
			<svelte:component
				this={Check}
				class="mr-1 inline-block text-green-700 opacity-35 transition-opacity group-focus-within:opacity-100"
			/>
		{:else if valid === 'invalid'}
			<svelte:component
				this={X}
				class="mr-1 inline-block text-red-900 opacity-35 transition-opacity group-focus-within:opacity-100"
			/>
		{/if}
	{/if}
	<div class="w-full">
		<input
			class="w-full border-b border-opacity-35 bg-transparent px-1 text-opacity-75 placeholder:opacity-60 focus:text-opacity-100 focus:outline-none focus:placeholder:text-opacity-80 {valid ===
			'none'
				? 'border-slate-950 text-slate-950 placeholder:text-slate-950  '
				: valid === 'valid'
					? 'border-green-700  text-green-700 placeholder:text-green-700  '
					: 'border-red-900 text-red-900 placeholder:text-red-900  '}"
			type="text"
			{placeholder}
			bind:value
		/>
		<span
			class="block h-0.5 max-w-0 text-xs text-opacity-0 transition-all duration-100 group-focus-within:max-w-full group-focus-within:text-opacity-85 {valid ===
			'none'
				? 'bg-slate-950'
				: valid === 'valid'
					? 'bg-green-700 text-green-700'
					: 'bg-red-900 text-red-900'}"
			>{valid === 'none'
				? ''
				: valid +
					' room ' +
					(!numOfPlayers.length
						? ''
						: numOfPlayers === '1'
							? '(1 player)'
							: '(' + numOfPlayers + ' players)')}</span
		>
	</div>
</div>
