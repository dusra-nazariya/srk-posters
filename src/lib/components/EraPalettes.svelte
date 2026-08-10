<script>
	import { eras } from '$lib/data/colors.js';
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
	{#each eras as era}
		<div class="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-fg/20">
			<div class="flex items-baseline justify-between gap-4">
				<span class="font-display text-lg font-semibold text-fg">{era.label}</span>
				<span class="text-xs text-faint">{era.count} films</span>
			</div>
			<div class="mt-4 flex h-16 overflow-hidden rounded-lg border border-fg/10">
				{#each era.colors as color}
					<div style="background: {color}" class="min-w-0 flex-1 transition-all hover:flex-[2]"></div>
				{/each}
			</div>
			<div class="mt-3 flex justify-between text-[10px] uppercase tracking-widest text-faint">
				<span>Aggregated palette</span>
				<span>{era.colors.length} dominant hues</span>
			</div>
		</div>
	{/each}
</div>