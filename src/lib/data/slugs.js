import DATA from './palettes.json';

export const slugOf = (title) =>
	String(title)
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const filmSlug = (film) => slugOf(film.title);

export const filmBySlug = (slug) => DATA.find((f) => slugOf(f.title) === slug);

export const paletteText = (film) =>
	`${film.title} (${film.year})\n${film.palette.join('\n')}\n`;

export const shareText = (film) => `${film.title} (${film.year}) \u00b7 poster color palette`;