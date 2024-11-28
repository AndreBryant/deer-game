import { version } from './package.json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import os from 'os';
import { webSocketServer } from './backend/socket';

// I saw this on stack overflow
// https://stackoverflow.com/a/67522718/25684936

function getLocalIPAddress(): string {
	// VSCode said that `typeof interfaces` === `NodeJS.Dict<os.NetworkInterfaceInfo[]>`.
	// Pls remove if something goes wrong
	const interfaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
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

const machineIP: string = getLocalIPAddress();
const port: string = process.env.PORT || '3000';
const serverUrl: string = `ws://${machineIP}:${port}`;

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	define: {
		'import.meta.env.VITE_SERVER_URL': JSON.stringify(serverUrl),
		'import.meta.env.FPS': JSON.stringify(60),
		'import.meta.env.VERSION': JSON.stringify('Version ' + version)
	}
});
