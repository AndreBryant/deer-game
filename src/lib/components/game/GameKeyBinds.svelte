<script lang="ts">
	import { Square } from 'lucide-svelte';
	export let keyStates: KeyStates;
</script>

<div class="absolute bottom-0 left-0 mb-2 flex flex-col gap-2 text-sm opacity-65">
	<div class="flex gap-1">
		<div class="flex flex-col">
			<div class="flex justify-center">
				<div class="relative" class:opacity-65={keyStates.up}>
					<Square size="30" />
					<span class="absolute left-[10px] top-[3px]">W</span>
				</div>
			</div>
			<div class="flex">
				<div class="relative" class:opacity-65={keyStates.left}>
					<Square size="30" />
					<span class="absolute left-[10px] top-[3px]">A</span>
				</div>
				<div class="relative" class:opacity-65={keyStates.down}>
					<Square size="30" />
					<span class="absolute left-[10px] top-[3px]">S</span>
				</div>
				<div class="relative" class:opacity-65={keyStates.right}>
					<Square size="30" />
					<span class="absolute left-[10px] top-[3px]">D</span>
				</div>
			</div>
		</div>
		<div class="flex items-end">
			<p>- move</p>
		</div>
	</div>
	<div class="flex gap-1">
		<div class="flex justify-center">
			<div class="" class:opacity-65={keyStates.attack}>
				<span class="rounded-md border-4 px-6 py-1 text-xs">Space</span>
			</div>
		</div>
		<div>
			<p>- attack</p>
		</div>
	</div>
</div>
