import { writable } from 'svelte/store';

export const toasts = writable<{ message: string; type: string }[]>([]);

export function addToast(message: string, type: string, duration: number = 3000) {
	toasts.update((toasts) => [...toasts, { type, message }]);
	setTimeout(() => toasts.update((toasts) => toasts.slice(1)), duration);
}
