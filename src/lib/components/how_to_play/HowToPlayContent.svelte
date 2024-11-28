<div
	class="custom-scrollbar flex flex-col gap-16 overflow-y-auto font-thin text-slate-50 text-opacity-80"
>
	<slot />
	<div class="flex items-center gap-4 text-xs opacity-30">
		<div class="h-[1px] flex-grow bg-slate-50 bg-opacity-50"></div>
		<div>Nothing Follows</div>
		<div class="h-[1px] flex-grow bg-slate-50 bg-opacity-50"></div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.315);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.479);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.6);
	}
</style>
