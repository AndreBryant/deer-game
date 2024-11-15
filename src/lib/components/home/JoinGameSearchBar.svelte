<script lang="ts">
	import InputText from '$lib/components/ui/InputText.svelte';
	import { Search } from 'lucide-svelte';
	export let searchTerm: string = '';
</script>

<div class="w-full">
	<InputText placeholder="Search Game ID..." iconLeft={Search} bind:value={searchTerm} />
</div>
