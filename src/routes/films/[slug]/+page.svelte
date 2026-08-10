<script>
	import { onMount } from 'svelte';
	import { posterUrl } from '$lib/data/colors.js';
	import { paletteText, shareText, filmSlug } from '$lib/data/slugs.js';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL, AUTHOR } from '$lib/config.js';

	let { data } = $props();
	const film = data.film;
	const pagePath = `/films/${filmSlug(film)}`;
	const filmUrl = `${SITE_URL}${pagePath}`;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Movie',
		name: film.title,
		alternateName: `${film.title} (${film.year})`,
		url: filmUrl,
		image: `${SITE_URL}${posterUrl(film.poster)}`,
		datePublished: film.year,
		description: `Poster color palette for ${film.title} (${film.year}), extracted via CIELAB K-Means clustering.`,
		author: { '@type': 'Organization', name: AUTHOR },
		mainEntityOfPage: { '@type': 'WebPage', '@id': filmUrl }
	};

	let ready = $state(false);
	let status = $state('');
	let flashTimer;

	onMount(() => {
		ready = true;
		return () => clearTimeout(flashTimer);
	});

	const flash = (msg) => {
		status = msg;
		clearTimeout(flashTimer);
		flashTimer = setTimeout(() => (status = ''), 2200);
	};

	const pageUrl = () => window.location.href;

	const shareHref = (network) => {
		const url = pageUrl();
		const text = shareText(film);
		const map = {
			x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
			whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
			telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
			email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
		};
		return map[network];
	};

	async function copyText(text) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(text);
			return;
		}
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		document.execCommand('copy');
		ta.remove();
	}

	const copyPalette = async () => {
		await copyText(paletteText(film));
		flash('Palette copied to clipboard');
	};

	const copyLink = async () => {
		await copyText(pageUrl());
		flash('Link copied to clipboard');
	};

	const copyHex = async (hex) => {
		await copyText(hex);
		flash(`${hex.toUpperCase()} copied to clipboard`);
	};

	const downloadText = () => {
		const blob = new Blob([paletteText(film)], { type: 'text/plain;charset=utf-8' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `${film.title}.txt`;
		a.click();
		URL.revokeObjectURL(a.href);
		flash('Palette downloaded as .txt');
	};

	const openShare = (network) => window.open(shareHref(network), '_blank', 'noopener,noreferrer');

	const nativeShare = async () => {
		if (!navigator.share) {
			await copyLink();
			return;
		}
		try {
			await navigator.share({ title: film.title, text: shareText(film), url: pageUrl() });
		} catch {
			/* user cancelled */
		}
	};

	const shareButtons = [
		{ key: 'x', label: 'X' },
		{ key: 'whatsapp', label: 'WhatsApp' },
		{ key: 'telegram', label: 'Telegram' },
		{ key: 'email', label: 'Email' }
	];
</script>

<Seo
	title="{film.title} ({film.year}) &mdash; SRK: A Poster Palette"
	description="Poster color palette for {film.title} ({film.year}) — extracted via CIELAB K-Means. Copy the palette, download it, or share the film route."
	path={pagePath}
	image={posterUrl(film.poster)}
	jsonLd={jsonLd}
/>

<header class="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
	<a href="/palettes" class="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
		<svg width="14" height="14" viewBox="0 0 12 12" fill="none" class="transition-transform group-hover:-translate-x-0.5">
			<path d="M8 2L4 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		All palettes
	</a>
	<span class="text-xs text-faint">by <span class="text-muted">Dusra Nazariya</span></span>
</header>

<main class="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-4 text-center sm:px-6">
	<img
		src={posterUrl(film.poster)}
		alt={`${film.title} (${film.year}) poster`}
		class="w-full max-w-sm rounded-xl border border-line bg-surface shadow-2xl transition-all duration-700 ease-out {ready
			? 'translate-y-0 opacity-100'
			: 'translate-y-6 opacity-0'}"
	/>

	<h1 class="mt-8 font-display text-3xl font-semibold text-fg sm:text-5xl">{film.title}</h1>
	<p class="mt-2 text-sm tracking-wide text-muted">{film.year}</p>

	<div class="mt-8 flex w-full flex-wrap items-stretch justify-center gap-2">
		{#each film.palette as hex}
			<button
				class="group flex w-24 flex-col items-center gap-1.5 rounded-lg border border-line bg-surface pb-2 pt-3 transition-colors hover:border-fg/25"
				onclick={() => copyHex(hex)}
				title="Copy {hex.toUpperCase()}"
			>
				<span class="h-10 w-10 rounded-md border border-fg/10" style="background: {hex}"></span>
				<span class="text-[10px] uppercase tracking-wide text-faint group-hover:text-muted">{hex}</span>
			</button>
		{/each}
	</div>

	<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
		<button
			class="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-[#0a0a0f] transition-transform hover:scale-[1.03]"
			onclick={copyPalette}
		>
			Copy palette
		</button>
		<button
			class="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-fg/25 hover:text-fg"
			onclick={downloadText}
		>
			Download as text
		</button>
		<button
			class="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-fg/25 hover:text-fg"
			onclick={copyLink}
		>
			Copy link
		</button>
	</div>

	<div class="mt-12 w-full max-w-md">
		<p class="text-[10px] uppercase tracking-[0.25em] text-faint">Share this palette</p>
		<div class="mt-4 flex flex-wrap items-center justify-center gap-2.5">
			<button
				class="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-xs font-medium text-[#0a0a0f] transition-transform hover:scale-[1.03]"
				onclick={nativeShare}
			>
				Share
			</button>
			{#each shareButtons as b}
				<button
					class="rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted transition-colors hover:border-fg/25 hover:text-fg"
					onclick={() => openShare(b.key)}
				>
					{b.label}
				</button>
			{/each}
		</div>
	</div>

	<p class="mt-8 h-5 text-xs text-sky" aria-live="polite">{status}</p>
</main>