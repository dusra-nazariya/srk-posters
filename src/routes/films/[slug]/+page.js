import { error } from '@sveltejs/kit';
import DATA from '$lib/data/palettes.json';
import { slugOf } from '$lib/data/slugs.js';

export const prerender = true;

export const entries = () => DATA.map((f) => ({ slug: slugOf(f.title) }));

export const load = ({ params }) => {
	const film = DATA.find((f) => slugOf(f.title) === params.slug);
	if (!film) throw error(404, 'Film not found');
	return { film };
};