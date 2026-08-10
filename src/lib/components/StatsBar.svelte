<script>
	import { totalFilms, yearSpan, uniqueColors, allColors, avgStats } from '$lib/data/colors.js';

	const stats = [
		{ num: totalFilms, label: 'Films' },
		{ num: yearSpan, label: 'Span' },
		{ num: uniqueColors, label: 'Unique Colors' },
		{ num: allColors.length, label: 'Total Swatches' },
		{ num: `${avgStats.sat}%`, label: 'Avg Saturation' },
		{ num: `${avgStats.lit}%`, label: 'Avg Lightness' }
	];
</script>

<div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 px-4 py-12">
	{#each stats as s}
		<div class="text-center">
			<div class="font-display text-2xl text-fg sm:text-3xl">{s.num}</div>
			<div class="mt-1 text-[10px] uppercase tracking-[0.2em] text-faint">{s.label}</div>
		</div>
	{/each}
</div>