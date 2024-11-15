<div
	class="custom-animation group absolute -left-8 top-2 -rotate-[20deg] rounded-md bg-red-900 px-4 py-2 hover:bg-red-800"
	title="our excuse if we fail the game physics"
>
	<h2 class="text-xs text-white group-hover:text-slate-50">Physics engine not included!</h2>
</div>

<style>
	.custom-animation {
		animation: float 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
		backface-visibility: hidden;
	}

	@keyframes float {
		0% {
			scale: 1;
		}

		50% {
			scale: 1.03;
		}

		100% {
			scale: 1;
		}
	}
</style>
