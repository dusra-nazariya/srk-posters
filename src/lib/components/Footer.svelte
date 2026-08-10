<script>
	import { SITE_NAME, AUTHOR } from '$lib/config.js';

	const year = new Date().getFullYear();
	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/wheel', label: 'Color Wheel' },
		{ href: '/palettes', label: 'All Palettes' }
	];
	const socials = [
		{ href: 'https://www.instagram.com/dusra.nazariya/', label: 'Instagram', icon: 'instagram' },
		{ href: 'https://www.youtube.com/@Dusra_Nazariya1', label: 'YouTube', icon: 'youtube' },
		{ href: 'https://x.com/dusra_nazariya', label: 'X (Twitter)', icon: 'x' }
	];
</script>

<footer class="mt-16 border-t border-line">
	<div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6">
		<div>
			<div class="font-display text-lg font-semibold text-fg">{SITE_NAME}</div>
			<p class="mt-2 max-w-sm text-sm leading-relaxed text-muted">
				CIELAB K-Means palettes from 69 Shah Rukh Khan posters &middot; 1992–2026 &middot; by {AUTHOR}.
			</p>
		</div>
		<div class="sm:text-right">
			<div class="text-[10px] uppercase tracking-[0.25em] text-faint">Explore</div>
			<ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
				{#each links as link}
					<li>
						<a href={link.href} class="text-sm text-muted transition-colors hover:text-fg">{link.label}</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="border-t border-line">
		<div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between sm:px-6">
			<div class="flex items-center gap-4">
				{#each socials as s}
					<a
						href={s.href}
						aria-label={s.label}
						target="_blank"
						rel="noopener noreferrer"
						class="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg/30 hover:text-fg"
					>
						{#if s.icon === 'instagram'}
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
								<rect x="3" y="3" width="18" height="18" rx="5" />
								<circle cx="12" cy="12" r="4" />
								<circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
							</svg>
						{:else if s.icon === 'youtube'}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 3.9 12 3.9 12 3.9s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2c.5-1.8.5-5.6.5-5.6ZM9.8 15.2V8.8l6 3.2-6 3.2Z"
								/>
							</svg>
						{:else}
							<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.5 22H3.3l7.3-8.3L2.7 2h6.4l4.4 5.9L18.9 2Zm-1.1 18.1h1.7L8 3.9H6.1l11.7 16.2Z"
								/>
							</svg>
						{/if}
					</a>
				{/each}
			</div>
			<div class="text-center text-xs text-faint sm:text-right">
				&copy; {year} {AUTHOR} &middot; {SITE_NAME}
			</div>
		</div>
	</div>
</footer>