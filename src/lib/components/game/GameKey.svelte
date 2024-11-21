<script lang="ts">
	export let isPressed: boolean = false;
	export let char: string;
	export let isSquare: boolean = false;
</script>

<div
	class="relative flex h-6 items-center rounded border bg-slate-950 bg-opacity-60 p-2"
	class:opacity-65={isPressed}
	class:w-6={isSquare}
>
	{char}
</div>
