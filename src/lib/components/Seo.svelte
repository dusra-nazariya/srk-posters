<script>
	import { SITE_URL, SITE_IMAGE } from '$lib/config.js';

	/** @type {{
	 *   title: string,
	 *   description: string,
	 *   path?: string,
	 *   image?: string,
	 *   type?: string,
	 *   jsonLd?: object
	 * }} */
	let { title, description, path = '/', image = SITE_IMAGE, type = 'website', jsonLd } = $props();

	const url = `${SITE_URL}${path}`;
	const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
	const ld = JSON.stringify(jsonLd ?? {});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="SRK: A Poster Palette" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={fullImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImage} />
</svelte:head>

{#if ld.length > 2}
	{@html `<script type="application/ld+json">${ld}</script>`}
{/if}