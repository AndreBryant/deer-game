<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { CircleHelp, Copyright } from 'lucide-svelte';
</script>

<div class="flex flex-col gap-4">
	<Button text="How to Play" variant={'link'} iconLeft={CircleHelp} href={`/how_to_play`} />
	<Button text="Credits" variant={'link'} iconLeft={Copyright} href={`/credits`} />
</div>
