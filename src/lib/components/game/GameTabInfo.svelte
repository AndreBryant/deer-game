<script lang="ts">
	export let playerId: string = '';
	export let playerName: string = '';
	export let roomId: string = '';
	export let hostName: string = '';

	import { Fingerprint, Tag } from 'lucide-svelte';
</script>

<div class="flex basis-5/12 flex-col gap-4 border-r border-slate-50 border-opacity-30">
	<div>
		<h3 class="text-lg font-semibold">Game Info</h3>
	</div>
	<div class="flex flex-grow flex-col gap-4 opacity-60">
		<div class="flex gap-2">
			<Fingerprint />:
			<p title="Your player ID">
				{playerId.substring(0, 5)}...{playerId.substring(playerId.length - 3, playerId.length)}
			</p>
		</div>
		<div class="flex gap-2">
			<Tag class="scale-x-[-1]" />:
			<p>
				{playerName.length > 12 ? playerName.substring(0, 12) + '...' : playerName}
			</p>
		</div>
	</div>
	<div>
		<p>Room ID: {roomId}</p>
		<p>Host: {hostName.length > 12 ? hostName.substring(0, 12) + '...' : hostName}</p>
	</div>
	<div>
		<p class="text-sm opacity-50">{import.meta.env.VERSION}</p>
	</div>
</div>
