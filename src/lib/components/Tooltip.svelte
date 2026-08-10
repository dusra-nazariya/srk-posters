<script>
	import { tooltip, showTooltip, hideTooltip } from './tooltip.js';
	import { posterUrl } from '$lib/data/colors.js';
	import { afterNavigate } from '$app/navigation';

	afterNavigate(() => hideTooltip());
</script>

{#if $tooltip}
	<div
		class="fixed z-50 w-56 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
		style="left: {$tooltip.x}px; top: {$tooltip.y}px; pointer-events: none;"
		role="tooltip"
	>
		{#if $tooltip.poster}
			<img src={posterUrl($tooltip.poster)} alt={$tooltip.title} class="h-44 w-full bg-ink object-contain" />
		{/if}
		<div class="p-3">
			<div class="font-display text-sm font-semibold leading-tight text-fg">{$tooltip.title}</div>
			<div class="mt-0.5 mb-2 text-xs text-faint">
				{$tooltip.year}{#if $tooltip.hex} <span class="text-muted">· {$tooltip.hex}</span>{/if}
			</div>
			<div class="flex gap-1">
				{#each $tooltip.palette as color}
					<div
						class="h-5 flex-1 rounded-sm border border-fg/10"
						style="background: {color};"
					></div>
				{/each}
			</div>
		</div>
	</div>
{/if}