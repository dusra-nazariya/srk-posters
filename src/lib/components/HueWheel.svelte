<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { films, parseHex, rgbToHsl } from '$lib/data/colors.js';
	import { showTooltip, hideTooltip } from './tooltip.js';

	let svgEl = $state();

	onMount(() => {
		const W = 560;
		const H = 560;
		const cx = W / 2;
		const cy = H / 2;
		const R = 220;

		const svg = d3.select(svgEl);

		svg
			.append('circle')
			.attr('cx', cx)
			.attr('cy', cy)
			.attr('r', R + 20)
			.style('fill', 'var(--color-panel)')
			.style('stroke', 'var(--color-line)');

		const hueRes = 360;
		for (let i = 0; i < hueRes; i++) {
			const arc = d3
				.arc()
				.innerRadius(R - 15)
				.outerRadius(R)
				.startAngle((i / hueRes) * Math.PI * 2)
				.endAngle(((i + 1.5) / hueRes) * Math.PI * 2);
			svg
				.append('path')
				.attr('d', arc())
				.attr('transform', `translate(${cx},${cy})`)
				.attr('fill', `hsl(${i}, 80%, 60%)`)
				.attr('opacity', 0.3);
		}

		const dots = [];
		films.forEach((d) =>
			d.palette.forEach((hex) => {
				const [r, g, b] = parseHex(hex);
				const [h, s, l] = rgbToHsl(r, g, b);
				dots.push({ h, s, l, hex, title: d.title, year: d.year, poster: d.poster });
			})
		);

		const rScale = d3.scaleLinear().domain([0, 100]).range([0, R - 30]);

		svg
			.selectAll('circle.dot')
			.data(dots)
			.join('circle')
			.attr('class', 'dot')
			.attr('cx', (d) => cx + rScale(d.s) * Math.cos(((d.h - 90) * Math.PI) / 180))
			.attr('cy', (d) => cy + rScale(d.s) * Math.sin(((d.h - 90) * Math.PI) / 180))
			.attr('r', (d) => 2 + d.l / 40)
			.attr('fill', (d) => d.hex)
			.style('stroke', 'var(--color-ink)')
			.attr('stroke-width', 0.5)
			.attr('opacity', 0.75)
			.on('mouseenter', (event, d) =>
				showTooltip({
					title: d.title,
					year: d.year,
					hex: d.hex,
					poster: d.poster,
					palette: [d.hex],
					x: event.clientX + 14,
					y: event.clientY + 12
				})
			)
			.on('mousemove', (event, d) =>
				showTooltip({
					title: d.title,
					year: d.year,
					hex: d.hex,
					poster: d.poster,
					palette: [d.hex],
					x: event.clientX + 14,
					y: event.clientY + 12
				})
			)
			.on('mouseleave', hideTooltip);

		svg
			.append('text')
			.attr('x', cx)
			.attr('y', cy - 6)
			.attr('text-anchor', 'middle')
			.style('fill', 'var(--color-faint)')
			.attr('font-size', '11px')
			.attr('font-family', 'Fira Sans, sans-serif')
			.text('SATURATION \u2192');
		svg
			.append('text')
			.attr('x', cx)
			.attr('y', cy + 10)
			.attr('text-anchor', 'middle')
			.style('fill', 'var(--color-faint)')
			.attr('font-size', '11px')
			.attr('font-family', 'Fira Sans, sans-serif')
			.text('\u2190 HUE ANGLE \u2192');
	});
</script>

<div class="mx-auto w-full max-w-[720px] overflow-hidden rounded-xl border border-line bg-surface p-4">
	<svg bind:this={svgEl} viewBox="0 0 560 560" class="block h-auto w-full" role="img" aria-label="Color wheel heatmap"></svg>
</div>