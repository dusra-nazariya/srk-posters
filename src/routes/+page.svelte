<script>
	import Section from '$lib/components/Section.svelte';
	import StatsBar from '$lib/components/StatsBar.svelte';
	import TimelineStrip from '$lib/components/TimelineStrip.svelte';
	import EraPalettes from '$lib/components/EraPalettes.svelte';
	import HueStacked from '$lib/components/HueStacked.svelte';
	import LSTrends from '$lib/components/LSTrends.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR, SITE_IMAGE } from '$lib/config.js';
</script>

<Seo
	title={SITE_NAME}
	description={SITE_DESCRIPTION}
	path="/"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		image: SITE_IMAGE,
		inLanguage: 'en',
		author: { '@type': 'Organization', name: AUTHOR }
	}}
/>

<!-- Hero -->
<section class="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center">
	<img
		src="/images/SRK_Posters.png"
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
	/>
	<div class="relative z-10 flex flex-col items-center">
		<div
			class="mt-8 rounded-2xl border border-fg/10 bg-ink/40 px-6 py-4 backdrop-blur-sm sm:px-10 sm:py-6"
		>
			<h1 class="max-w-4xl font-display text-4xl font-bold text-brand sm:text-6xl">
				SRK: A Poster Palette
			</h1>
		</div>
		<p class="mt-4 max-w-xl text-sm font-light text-muted sm:text-base">
			69 films &middot; 1992–2026 &middot; CIELAB K-Means palette extraction
		</p>
		<p class="mt-2 text-xs text-faint">
			by <span class="text-muted">Dusra Nazariya</span>
		</p>
		<a
			href="#timeline"
			class="mt-10 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-xs text-muted transition-colors hover:border-fg/25 hover:text-fg"
		>
			Scroll to explore
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
				<path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</a>
	</div>
</section>

<StatsBar />

<Section id="timeline" index="01" title="Timeline" desc="Each block is a film's top 5 palette colors, ordered by year.">
	<TimelineStrip />
</Section>

<Section
	id="eras"
	index="02"
	title="Average Palette by Era"
	desc="Colors averaged across all films in each era."
>
	<EraPalettes />
</Section>

<Section
	id="hue-distribution"
	index="03"
	title="Hue Distribution Over Time"
	desc="How each hue family's share of the palette shifts across the years."
>
	<HueStacked />
</Section>

<Section
	id="lightness-saturation"
	index="04"
	title="Lightness & Saturation Trends"
	desc="The drift in lightness and chroma across the decades, film by film."
>
	<LSTrends />
</Section>
