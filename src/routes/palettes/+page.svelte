<script>
	import PosterGrid from '$lib/components/PosterGrid.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config.js';
	import { films, posterUrl } from '$lib/data/colors.js';
	import { filmSlug } from '$lib/data/slugs.js';

	const itemList = films.map((film) => ({
		'@type': 'ListItem',
		position: films.indexOf(film) + 1,
		name: `${film.title} (${film.year})`,
		url: `${SITE_URL}/films/${filmSlug(film)}`,
		image: `${SITE_URL}${posterUrl(film.poster)}`
	}));
</script>

<Seo
	title="All 69 Palettes — SRK: A Poster Palette"
	description="The extracted CIELAB K-Means palettes of all 69 Shah Rukh Khan films from 1992 to 2026. Click any poster for its palette, copy and share options."
	path="/palettes"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'All 69 Palettes',
		url: `${SITE_URL}/palettes`,
		description:
			'The extracted CIELAB K-Means palettes of all 69 Shah Rukh Khan films from 1992 to 2026. Click any poster for its palette, copy and share options.',
		isPartOf: { '@type': 'WebSite', name: 'SRK: A Poster Palette', url: SITE_URL },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: itemList
		}
	}}
/>

<header class="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
	<p class="text-xs uppercase tracking-widest text-faint">by Dusra Nazariya</p>
	<h1 class="text-gradient-hero mt-2 font-display text-4xl font-bold sm:text-5xl">All 69 Palettes</h1>
	<p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
		The extracted palette of every film. Hover a poster to preview its colors — click through to inspect, copy or share the palette.
	</p>
	<div class="mt-5 h-px w-full max-w-2xl bg-gradient-to-r from-sky/50 via-purple/50 to-pink/50"></div>
</header>

<main class="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
	<PosterGrid />
</main>