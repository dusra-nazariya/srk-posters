<script>
	import { spring } from 'svelte/motion';

	/** @type {{
	 *   id: string,
	 *   index: string,
	 *   title: string,
	 *   desc: string,
	 *   children: import('svelte').Snippet
	 * }} */
	let { id, index, title, desc, children } = $props();

	let root = $state();
	let header = $state();
	let active = $state(false);

	let raw = $state(0);
	let progress = spring(0, { stiffness: 60, damping: 22 });

	$effect(() => {
		const el = header;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						active = true;
						io.disconnect();
					}
				}
			},
			{ threshold: 0.2 }
		);
		io.observe(el);
		return () => io.disconnect();
	});

	$effect(() => {
		const el = root;
		if (!el) return;
		const onScroll = () => {
			const rect = el.getBoundingClientRect();
			const total = rect.height + window.innerHeight;
			raw = Math.min(1, Math.max(0, 1 - rect.bottom / total));
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	$effect(() => {
		progress.set(raw);
	});
</script>

<svelte:window />

<section bind:this={root} id={id} class="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
	<header bind:this={header} class="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
		<div class="hidden flex-col items-center gap-4 sm:flex" aria-hidden="true">
			<span class="font-display text-4xl leading-none text-fg/10">{index}</span>
			<div class="relative h-36 w-[3px] overflow-hidden rounded-full bg-fg/10">
				<div
					class="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-sky via-purple to-pink"
					style="height: {progress}%;"
				></div>
			</div>
		</div>

		<div
			class="transition-all delay-75 duration-700 ease-out {active
				? 'translate-y-0 opacity-100 blur-0'
				: 'translate-y-8 opacity-0 blur-[3px]'}"
		>
			<h2 class="font-display text-2xl font-semibold text-fg sm:text-3xl">{title}</h2>
			<p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{desc}</p>
			<div class="mt-5 h-px w-full bg-gradient-to-r from-sky/50 via-purple/50 to-pink/50"></div>
		</div>
	</header>

	<div
		class="mt-10 transition-all delay-200 duration-700 ease-out {active
			? 'translate-y-0 opacity-100'
			: 'translate-y-10 opacity-0'}"
	>
		{@render children()}
	</div>
</section>