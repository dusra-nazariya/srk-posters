<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { years, years3, HUE_FAMILIES, HUE_COLORS, yearData } from '$lib/data/colors.js';

	let svgEl = $state();

	onMount(() => {
		const W = 1160;
		const H = 340;
		const m = { t: 30, r: 30, b: 40, l: 50 };
		const w = W - m.l - m.r;
		const ht = H - m.t - m.b;

		const svg = d3.select(svgEl);
		const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

		const x = d3.scalePoint().domain(years).range([0, w]).padding(0.3);
		const y = d3.scaleLinear().domain([0, 100]).range([ht, 0]);

		const series = d3.stack().keys(HUE_FAMILIES)(yearData);

		const area = d3
			.area()
			.x((d) => x(d.data.year))
			.y0((d) => y(d[0]))
			.y1((d) => y(d[1]))
			.curve(d3.curveBasis);

		g.selectAll('path.area')
			.data(series)
			.join('path')
			.attr('class', 'area')
			.attr('d', area)
			.attr('fill', (d, i) => HUE_COLORS[i])
			.attr('opacity', 0.75);

		g.append('g')
			.attr('transform', `translate(0,${ht})`)
			.call(d3.axisBottom(x).tickValues(years3(years)))
			.selectAll('text')
			.style('fill', 'var(--color-faint)')
			.attr('font-size', '10px');

		g.append('g')
			.call(d3.axisLeft(y).ticks(5).tickFormat((d) => d + '%'))
			.selectAll('text')
			.style('fill', 'var(--color-faint)')
			.attr('font-size', '10px');

		g.selectAll('.domain, .tick line').style('stroke', 'var(--color-line)');
	});
</script>

<div class="rounded-xl border border-line bg-surface p-4">
	<svg bind:this={svgEl} viewBox="0 0 1160 340" width="100%" role="img" aria-label="Hue distribution over time"></svg>
	<div class="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
		{#each HUE_FAMILIES as f, i}
			<span class="flex items-center gap-1.5 text-xs text-muted">
				<span class="h-2.5 w-2.5 rounded-sm" style="background: {HUE_COLORS[i]}"></span>
				{f}
			</span>
		{/each}
	</div>
</div>