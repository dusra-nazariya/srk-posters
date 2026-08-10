<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { years, years3, yearStats, rolling } from '$lib/data/colors.js';

	let svgEl = $state();

	onMount(() => {
		const W = 1160;
		const H = 340;
		const m = { t: 30, r: 80, b: 40, l: 50 };
		const w = W - m.l - m.r;
		const ht = H - m.t - m.b;

		const svg = d3.select(svgEl);
		const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

		const x = d3.scalePoint().domain(years).range([0, w]).padding(0.3);
		const yL = d3.scaleLinear().domain([0, 100]).range([ht, 0]);
		const yC = d3.scaleLinear().domain([0, 80]).range([ht, 0]);

		const lRolling = rolling(yearStats, 'lightness');
		const cRolling = rolling(yearStats, 'chroma');

		const lineL = d3.line().x((d) => x(d.year)).y((d) => yL(d.lightness)).curve(d3.curveBasis);
		const lineC = d3.line().x((d) => x(d.year)).y((d) => yC(d.chroma)).curve(d3.curveBasis);

		g.selectAll('.dot-l')
			.data(yearStats)
			.join('circle')
			.attr('class', 'dot-l')
			.attr('cx', (d) => x(d.year))
			.attr('cy', (d) => yL(d.lightness))
			.attr('r', 3)
			.attr('fill', '#87ceeb')
			.attr('opacity', 0.5);

		g.selectAll('.dot-c')
			.data(yearStats)
			.join('circle')
			.attr('class', 'dot-c')
			.attr('cx', (d) => x(d.year))
			.attr('cy', (d) => yC(d.chroma))
			.attr('r', 3)
			.attr('fill', '#ffa07a')
			.attr('opacity', 0.5);

		g.append('path')
			.datum(lRolling)
			.attr('fill', 'none')
			.attr('stroke', '#87ceeb')
			.attr('stroke-width', 2.5)
			.attr('d', lineL);

		g.append('path')
			.datum(cRolling)
			.attr('fill', 'none')
			.attr('stroke', '#ffa07a')
			.attr('stroke-width', 2.5)
			.attr('d', lineC);

		g.append('g')
			.attr('transform', `translate(0,${ht})`)
			.call(d3.axisBottom(x).tickValues(years3(years)))
			.selectAll('text')
			.style('fill', 'var(--color-faint)')
			.attr('font-size', '10px');

		g.append('g')
			.call(d3.axisLeft(yL).ticks(5))
			.selectAll('text')
			.attr('fill', '#87ceeb')
			.attr('font-size', '10px');

		g.append('g')
			.attr('transform', `translate(${w},0)`)
			.call(d3.axisRight(yC).ticks(5))
			.selectAll('text')
			.attr('fill', '#ffa07a')
			.attr('font-size', '10px');

		g.selectAll('.domain, .tick line').style('stroke', 'var(--color-line)');

		g.append('text').attr('x', -10).attr('y', -10).attr('fill', '#87ceeb').attr('font-size', '11px').text('L* (Lightness)');
		g.append('text')
			.attr('x', w + 10)
			.attr('y', -10)
			.attr('fill', '#ffa07a')
			.attr('font-size', '11px')
			.attr('text-anchor', 'end')
			.text('Chroma');
	});
</script>

<div class="rounded-xl border border-line bg-surface p-4">
	<svg bind:this={svgEl} viewBox="0 0 1160 340" width="100%" role="img" aria-label="Lightness and saturation trends"></svg>
	<div class="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
		<span class="flex items-center gap-1.5 text-xs text-muted">
			<span class="h-2.5 w-2.5 rounded-sm bg-[#87ceeb]"></span>
			Lightness (L*)
		</span>
		<span class="flex items-center gap-1.5 text-xs text-muted">
			<span class="h-2.5 w-2.5 rounded-sm bg-[#ffa07a]"></span>
			Chroma (Saturation)
		</span>
	</div>
</div>