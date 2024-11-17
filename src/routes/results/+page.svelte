<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { serverData } from '$lib/stores/socketStore';

	export let data: { gameID: string | null };
	onMount(() => {
		// Check if room is not avaliable or if null
		if (!data.gameID) {
			goto('/');
		}
	});

	// connect to io so that io can discard the room on disconnect
</script>

<svelte:head>
	<title>
		{data.gameID} | Results
	</title>
</svelte:head>

<p>TODO: RESULTS PAGE haha {data.gameID}</p>
<div>
	<Button text="Back" variant="link" iconLeft={ChevronLeft} onclick={() => goto('/')} />
</div>
<pre>
{JSON.stringify($serverData, null, 2)}
</pre>
