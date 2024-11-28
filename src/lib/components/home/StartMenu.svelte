<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import InputText from '$lib/components/ui/InputText.svelte';
	import { Tag, Swords, SquarePlus } from 'lucide-svelte';

	export let username: string = '';
	export let toggleJoinPressed: () => void;

	// For Joining/Creating Game
	let isNameValid = false;
	const checkUsername = function (username: string): boolean {
		return username.length > 0;
	};

	$: isNameValid = checkUsername(username);
</script>

<div class="flex flex-col gap-8">
	<div class="h-8 w-full">
		<InputText placeholder="Enter your name." iconLeft={Tag} bind:value={username} />
	</div>
	<div class="flex h-12 w-80">
		<div class="flex flex-col justify-center">
			<Button
				text="Create Game"
				iconLeft={Swords}
				variant={isNameValid ? 'primary' : 'disabled'}
				href={`./game?host=true&username=${username}`}
			/>
		</div>
		<div class="ml-8 flex w-[1px] flex-col">
			<div class="w-full flex-grow bg-black"></div>
			<div class="-ml-[6px] text-xs">OR</div>
			<div class="w-full flex-grow bg-black"></div>
		</div>
		<div class="flex flex-grow items-center justify-center pl-4">
			<Button
				text="Join Game"
				variant={isNameValid ? 'primary' : 'disabled'}
				iconLeft={SquarePlus}
				onclick={toggleJoinPressed}
			/>
		</div>
	</div>
</div>
