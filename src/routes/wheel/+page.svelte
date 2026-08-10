<script>
	import HueWheel from '$lib/components/HueWheel.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config.js';
</script>

<Seo
	title="Color Wheel Heatmap — SRK: A Poster Palette"
	description="Every extracted palette color from 69 SRK films mapped onto a hue wheel, colored by hue and positioned by saturation."
	path="/wheel"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Color Wheel Heatmap',
		url: `${SITE_URL}/wheel`,
		description:
			'Every extracted palette color from 69 SRK films mapped onto a hue wheel, colored by hue and positioned by saturation.',
		isPartOf: { '@type': 'WebSite', name: 'SRK: A Poster Palette', url: SITE_URL }
	}}
/>

<header class="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
	<p class="text-xs uppercase tracking-widest text-faint">by Dusra Nazariya</p>
	<h1 class="text-gradient-hero mt-2 font-display text-4xl font-bold sm:text-5xl">Color Wheel Heatmap</h1>
	<p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
		Every extracted color from all 69 films mapped onto a hue wheel — distance from centre is saturation, dot size is lightness.
		Hover any dot to see the film it came from.
	</p>
	<div class="mt-5 h-px w-full max-w-2xl bg-gradient-to-r from-sky/50 via-purple/50 to-pink/50"></div>
</header>

<main class="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
	<HueWheel />
</main>
