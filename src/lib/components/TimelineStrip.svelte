<script>
	import { films } from '$lib/data/colors.js';
	import { scaleBand } from 'd3';
	import { showTooltip, hideTooltip } from './tooltip.js';

	let container = $state();
	let width = $state(1200);

	const H = 90;
	const pad = 26;

	const x = $derived(
		scaleBand()
			.domain(films.map((_, i) => i))
			.range([pad, width - pad])
			.padding(0.15)
	);

	const yearLabels = $derived.by(() => {
		const idc = new Map();
		films.forEach((f, i) => {
			const arr = idc.get(f.year) ?? [];
			arr.push(i);
			idc.set(f.year, arr);
		});
		const out = [];
		for (const [year, arr] of idc) {
			const mid = arr[Math.floor((arr.length - 1) / 2)];
			out.push({ year, x: x(mid) + x.bandwidth() / 2 });
		}
		return out;
	});

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
<div
	bind:this={container}
	bind:clientWidth={width}
	class="overflow-x-auto rounded-xl border border-line bg-surface p-3"
	onmouseleave={hideTooltip}
>
	<svg viewBox="0 0 {width} {H}" width="100%" height={H} role="img" aria-label="Color timeline of all films">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		{#each films as d, i}
			<g
				class="cursor-pointer"
				transform="translate({x(i)}, 0)"
				onmouseenter={(e) => hover(e, d)}
				onmousemove={(e) => hover(e, d)}
			>
				{#each d.palette as hex, j}
					<rect
						x="0"
						y={j * ((H - 10) / d.palette.length) + 2}
						width={x.bandwidth()}
						height={(H - 10) / d.palette.length - 1}
						rx="1"
						fill={hex}
					/>
				{/each}
			</g>
		{/each}
		{#each yearLabels as yl}
			<text
				x={yl.x}
				y={H - 4}
				text-anchor="middle"
				font-size="10"
				class="fill-[var(--color-faint)]"
				font-family="Fira Sans, sans-serif"
			>
				{yl.year}
			</text>
		{/each}
	</svg>
</div>