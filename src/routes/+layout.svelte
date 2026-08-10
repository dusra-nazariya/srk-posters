<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { page } from '$app/state';
	let { children } = $props();
</script>

<Navbar url={page.url} />
{@render children()}
<Footer />
<Tooltip />