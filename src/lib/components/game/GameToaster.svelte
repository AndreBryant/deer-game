<script lang="ts">
	import { toasts } from '$lib/stores/toastStore';
	import { Swords, TriangleAlert, Info, Skull } from 'lucide-svelte';
	import { afterUpdate } from 'svelte';

	let toaster: HTMLDivElement;

	// Scroll to the bottom when new toasts are added
	afterUpdate(() => {
		if (toaster) {
			toaster.scrollTop = toaster.scrollHeight;
		}
	});
</script>

<div
	bind:this={toaster}
	class="toaster fixed right-0 top-0 flex h-56 w-96 flex-col overflow-y-auto opacity-80 transition-all"
>
	{#each $toasts as toast}
		<div
			class="toast flex w-full animate-[fadeIn_0.3s_ease-out] items-center gap-4 rounded-lg border border-slate-50 border-opacity-50 bg-slate-950 bg-opacity-60 px-4 py-4 text-slate-50 backdrop-blur-lg transition-all"
		>
			<div class="">
				{#if toast.type === 'info'}
					<Info />
				{:else if toast.type === 'warning'}
					<TriangleAlert />
				{:else if toast.type === 'danger'}
					<Skull />
				{:else if toast.type === 'pvp'}
					<Swords />
				{/if}
			</div>
			<div>
				<p class="text-wrap text-sm">
					{toast.message}
				</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.toaster::-webkit-scrollbar {
		display: none;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
