<script>
	import { onMount } from 'svelte';
	let { url } = $props();
	let isOpen = $state(false);
	let dark = $state(false);

	onMount(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch {
			/* localStorage unavailable */
		}
	}

	function isActive(path) {
		return url?.pathname === path;
	}

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/wheel', label: 'Color Wheel' },
		{ href: '/palettes', label: 'All Palettes' }
	];
</script>

<nav class="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
		<a
			href="/"
			class="font-display text-sm font-semibold tracking-wide text-fg transition-colors hover:text-soft"
		>
			SRK: A Poster Palette
		</a>
		<div class="hidden items-center gap-1 text-sm sm:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="{isActive(link.href)
						? 'bg-panel text-fg'
						: 'text-muted hover:bg-panel hover:text-fg'} rounded-full px-3 py-1.5 transition-colors"
				>
					{link.label}
				</a>
			{/each}
			<button
				class="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-panel hover:text-fg"
				onclick={toggleTheme}
				aria-label="Toggle theme"
				title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
			>
				{#if dark}
					<svg width="15" height="15" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M12.9 3.1l-1.4 1.4M4.5 11.5l-1.4 1.4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				{:else}
					<svg width="15" height="15" viewBox="0 0 16 16" fill="none">
						<path
							d="M13 9.5A5.5 5.5 0 0 1 6.5 3a.6.6 0 0 1 .77-.73A5.5 5.5 0 1 0 13.73 8.77A.6.6 0 0 1 13 9.5Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</button>
		</div>
		<div class="flex items-center gap-1 sm:hidden">
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted"
				onclick={toggleTheme}
				aria-label="Toggle theme"
			>
				{#if dark}
					<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5" />
						<path
							d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M12.9 3.1l-1.4 1.4M4.5 11.5l-1.4 1.4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				{:else}
					<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path
							d="M13 9.5A5.5 5.5 0 0 1 6.5 3a.6.6 0 0 1 .77-.73A5.5 5.5 0 1 0 13.73 8.77A.6.6 0 0 1 13 9.5Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</button>
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted"
				onclick={() => (isOpen = !isOpen)}
				aria-label="Toggle menu"
				aria-expanded={isOpen}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</button>
		</div>
	</div>
	{#if isOpen}
		<div class="flex flex-col gap-1 border-t border-line px-4 py-3 text-sm sm:hidden">
			{#each navLinks as link}
				<a
					href={link.href}
					class="{isActive(link.href) ? 'bg-panel text-fg' : 'text-muted hover:bg-panel hover:text-fg'} rounded-lg px-3 py-2 transition-colors"
				>
					{link.label}
				</a>
			{/each}
		</div>
	{/if}
</nav>