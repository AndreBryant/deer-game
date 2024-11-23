<script lang="ts">
	import GameKey from './GameKey.svelte';
	export let keyStates: KeyStates;
</script>

<div
	class="space-r-4 absolute bottom-0 left-0 grid w-40 grid-cols-4 gap-2 rounded-lg border bg-slate-950 bg-opacity-60 p-1 text-sm opacity-65 backdrop-blur-sm"
>
	<div class="col-span-2 flex flex-col">
		<div class="flex justify-center">
			<GameKey isPressed={keyStates.up} char="W" />
		</div>
		<div class="flex justify-center">
			<GameKey isPressed={keyStates.left} char="A" />
			<GameKey isPressed={keyStates.down} char="S" />
			<GameKey isPressed={keyStates.right} char="D" />
		</div>
	</div>
	<div class="col-span-2 flex items-end">
		<p>- move</p>
	</div>
	<div class="col-span-2 flex w-full justify-center">
		<GameKey
			isPressed={keyStates.attack}
			char={keyStates.attack ? 'Release' : 'Space'}
			isSquare={false}
		/>
	</div>
	<div class="col-span-2">
		<p>- {keyStates.attack ? 'attack' : 'charge'}</p>
	</div>
	<div class="col-span-2 flex flex-col">
		<div class="flex justify-center">
			<GameKey isPressed={keyStates.attack} char="Tab" isSquare={false} />
		</div>
	</div>
	<div class="col-span-2 flex items-end">
		<p>- Info</p>
	</div>
</div>
