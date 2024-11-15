<script lang="ts">
	export let username: string = '';
</script>

<div class="max-h-4 w-full overflow-hidden text-xs font-normal">
	<p class="truncate">
		Joining as <span class="text-ellipsis font-semibold">
			{username.trim().length <= 0 ? '_blank' : username}
		</span>
	</p>
</div>
