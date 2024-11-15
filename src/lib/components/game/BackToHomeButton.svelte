<script lang="ts">
	import { ChevronLeft } from 'lucide-svelte';
</script>

<div class="group absolute flex h-full w-16 items-center transition-all">
	<!-- Change this to span -->
	<a href="/" class="group gap-2 opacity-0 group-hover:opacity-100">
		<p class=" flex items-center gap-2">
			<ChevronLeft />
			<span class="transition-opac opacity-0 group-hover:opacity-100"> back to home </span>
		</p>
	</a>
</div>
