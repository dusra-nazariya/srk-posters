import { writable } from 'svelte/store';

export const tooltip = writable(null);

export function showTooltip(payload) {
	tooltip.set(payload);
}

export function hideTooltip() {
	tooltip.set(null);
}