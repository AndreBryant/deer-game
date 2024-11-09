import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import os from 'os';
import { webSocketServer } from './backend/socket';

function getLocalIPAddress() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		if (interfaces[name]) {
			for (const iface of interfaces[name]) {
				if (iface.family === 'IPv4' && !iface.internal) {
					return iface.address;
				}
			}
		}
	}
	return 'localhost';
}

const machineIP = getLocalIPAddress();
const port = process.env.PORT || 3000;
const serverUrl = `ws://${machineIP}:${port}`;

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	define: {
		'import.meta.env.VITE_SERVER_URL': JSON.stringify(serverUrl)
	}
});
