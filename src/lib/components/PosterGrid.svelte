<script>
	import { films, posterUrl } from '$lib/data/colors.js';
	import { filmSlug } from '$lib/data/slugs.js';
	import { showTooltip, hideTooltip } from './tooltip.js';

	function hover(e, d) {
		showTooltip({
			title: d.title,
			year: d.year,
			poster: d.poster,
			palette: d.palette,
			x: e.clientX + 14,
			y: e.clientY + 12
		});
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" onmouseleave={hideTooltip}>
	{#each films as d}
		<a
			href={`/films/${filmSlug(d)}`}
			class="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-fg/25"
			onmouseenter={(e) => hover(e, d)}
			onmousemove={(e) => hover(e, d)}
		>
			<div class="aspect-[2/3] overflow-hidden bg-ink">
				<img
					src={posterUrl(d.poster)}
					alt={d.title}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
			<div class="flex h-6 border-t border-fg/10">
				{#each d.palette as color}
					<div style="background: {color}" class="min-w-0 flex-1"></div>
				{/each}
			</div>
			<div class="flex-1 px-2.5 py-2">
				<div class="text-[10px] text-faint">{d.year}</div>
				<div class="truncate font-display text-xs text-soft group-hover:text-fg">{d.title}</div>
			</div>
		</a>
	{/each}
</div>