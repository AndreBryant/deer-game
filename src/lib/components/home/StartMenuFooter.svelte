<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { CircleHelp, Copyright } from 'lucide-svelte';
</script>

<div class="flex flex-col gap-4">
	<div>
		<Button text="How to Play" variant={'link'} iconLeft={CircleHelp} href={`/how_to_play`} />
	</div>
	<div>
		<Button text="Credits" variant={'link'} iconLeft={Copyright} href={`/credits`} />
	</div>
</div>
