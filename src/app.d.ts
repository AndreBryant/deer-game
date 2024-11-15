// See https://kit.svelte.dev/docs/types#app

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Home/+page.svelte
	type ClientSideRoom = { players: number; isGameStarted: boolean };
	type ClientSideRooms = { [key: string]: room };

	// Home Background Object Types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type LineP5BG = { line: number[][]; currentColor: any; targetColor: any };
	type CloudP5BG = { x: number; y: number; dx: number; r1: number[]; r2: number[]; r3: number[] };
	type HeavenlyBodyP5BG = { x: number; y: number; r: number };
}

export {};
