<script lang="ts">
	import HomeBackground3 from '$lib/components/home/backgrounds/HomeBackground3.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
  
	import DeerGif from '$lib/sprites/idle.gif';
  
	let scrollPosition = 0;
	const creditsText = `
	  Game Director: LeBron James
	  Lead Programmer: LeBron James
	  Art: LeBron James
  
	  Special Thanks to:
	  LeBron James
	`;
  
	function handleScroll(event: WheelEvent) {
	  scrollPosition += event.deltaY;
	  scrollPosition = Math.max(0, Math.min(scrollPosition, creditsText.length));
	}
  </script>
  
  <main class="relative flex h-screen w-screen select-none flex-col items-center justify-center">
	<div class="absolute left-0 top-0">
	  <HomeBackground3 />
	</div>
  
	<img src={DeerGif} alt="Deer Animation" class="deer-animation" />
  
	<div class="absolute top-1/2 transform -translate-y-1/2 w-full px-8 text-black text-sm">
	  <div class="credits-container overflow-y-scroll h-1/2">
		<h1 class="mb-4 mt-8 text-center text-5xl">Credits</h1>
		<pre class="whitespace-pre-wrap text-center" style={`transform: translateY(-${scrollPosition}px)`}>
		  {creditsText}
		</pre>
	  </div>
  
	  <div class="back-button flex justify-center">
		<Button text="Back" variant="link" iconLeft={ChevronLeft} onclick={() => goto('/')} />
	  </div>
	</div>
  
  </main>
  
  <style>
	.overflow-y-scroll::-webkit-scrollbar {
	  display: none;
	}
  
	.overflow-y-scroll {
	  -ms-overflow-style: none; /* IE and Edge */
	  scrollbar-width: none; /* Firefox */
	}
  
	.credits-container {
	  background-color: rgba(248, 248, 248, 0.7); /* Light gray with transparency */
	  border-radius: 10px;
	  padding: 20px;
	  max-width: 500px;
	  margin: 0 auto;
	  text-align: center;
	  transition: background-color 0.3s ease-in-out;
	}
  
	.credits-container:hover {
	  background-color: rgba(248, 248, 248, 1); /* Full opacity on hover */
	}
  
	pre {
	  text-align: center;
	  font-size: 20px;
	  line-height: 1.5;
	}
  
	pre * {
	  font-size: 20px;
	}
  
	pre :is(strong, b) {
	  font-size: 24px;
	  font-weight: bold;
	}
  
	.back-button button {
	  font-size: 36px;
	}
  
	.deer-animation {
	  position: absolute;
	  left: 20px;
	  bottom: 20px;
	  width: 400px;
	  height: auto;
	  animation: loop 18s infinite;
	}
  
	@keyframes loop {
	  0% {
		transform: translateY(0);
	  }
	  50% {
		transform: translateY(10px);
	  }
	  100% {
		transform: translateY(0);
	  }
	}
  </style>