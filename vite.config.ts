import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './backend/socket';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
