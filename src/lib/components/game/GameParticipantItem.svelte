<script lang="ts">
	export let username: string = '';
	export let you: boolean = false;
</script>

<li class="mb-2 flex items-center gap-2 rounded-lg py-2 text-lg text-opacity-80">
	<div class="h-6 w-1 rounded-full border-l border-slate-50 border-opacity-50"></div>
	<div>
		{username}
		<span class="text-xs opacity-80">
			{you ? ' (you)' : ''}
		</span>
	</div>
</li>
