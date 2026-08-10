import DATA from './palettes.json';

export const parseHex = (hex) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return [r, g, b];
};

export const rgbToHsl = (r, g, b) => {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h;
	let s;
	const l = (max + min) / 2;
	if (max === min) {
		h = 0;
		s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			default:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}
	return [h * 360, s * 100, l * 100];
};

export const rgbToLab = (r, g, b) => {
	const [rl, gl, bl] = [r, g, b].map((c) => {
		c /= 255;
		return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
	});
	const x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047;
	const y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175;
	const z = (rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041) / 1.08883;
	const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
	return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};

export const hueFamily = (h) => {
	if (h < 15 || h >= 345) return 'Red';
	if (h < 45) return 'Orange';
	if (h < 75) return 'Yellow';
	if (h < 150) return 'Green';
	if (h < 195) return 'Cyan';
	if (h < 255) return 'Blue';
	if (h < 285) return 'Purple';
	if (h < 345) return 'Pink';
	return 'Red';
};

export const HUE_FAMILIES = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'Pink'];
export const HUE_COLORS = [
	'#e74c3c',
	'#e67e22',
	'#f1c40f',
	'#2ecc71',
	'#1abc9c',
	'#3498db',
	'#9b59b6',
	'#e91e63'
];

export const posterUrl = (name) => `/images/SRK_Posters/${name}`;

export const films = DATA;

export const years = [...new Set(DATA.map((d) => d.year))].sort();
export const totalFilms = DATA.length;
export const yearSpan = `${years[0]}\u2013${years[years.length - 1]}`;
export const allColors = DATA.flatMap((d) => d.palette);
export const uniqueColors = new Set(allColors).size;

export const avgStats = (() => {
	let totalS = 0;
	let totalL = 0;
	let count = 0;
	DATA.forEach((d) =>
		d.palette.forEach((hex) => {
			const [r, g, b] = parseHex(hex);
			const [, s, l] = rgbToHsl(r, g, b);
			totalS += s;
			totalL += l;
			count++;
		})
	);
	return { sat: (totalS / count).toFixed(1), lit: (totalL / count).toFixed(1) };
})();

export const yearData = years.map((year) => {
	const movies = DATA.filter((d) => d.year === year);
	const counts = {};
	HUE_FAMILIES.forEach((f) => (counts[f] = 0));
	movies.forEach((d) =>
		d.palette.forEach((hex) => {
			const [r, g, b] = parseHex(hex);
			const [h] = rgbToHsl(r, g, b);
			counts[hueFamily(h)]++;
		})
	);
	const total = Object.values(counts).reduce((a, b) => a + b, 0);
	const obj = { year };
	HUE_FAMILIES.forEach((f) => (obj[f] = (counts[f] / total) * 100));
	return obj;
});

export const yearStats = years.map((year) => {
	const movies = DATA.filter((d) => d.year === year);
	let totalL = 0;
	let totalC = 0;
	let count = 0;
	movies.forEach((d) =>
		d.palette.forEach((hex) => {
			const [r, gb, b] = parseHex(hex);
			const lab = rgbToLab(r, gb, b);
			totalL += lab[0];
			totalC += Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
			count++;
		})
	);
	return { year, lightness: totalL / count, chroma: totalC / count };
});

export const rolling = (arr, key, windowSize = 3) => {
	const result = [];
	arr.forEach((d, i) => {
		const start = Math.max(0, i - Math.floor(windowSize / 2));
		const end = Math.min(arr.length, i + Math.ceil(windowSize / 2));
		const slice = arr.slice(start, end);
		result.push({ year: d.year, [key]: slice.reduce((a, s) => a + s[key], 0) / slice.length });
	});
	return result;
};

export const years3 = (arr) => arr.filter((_, i) => i % 3 === 0);

export const eras = [
	{ label: '1992\u201399', lo: 1992, hi: 1999 },
	{ label: '2000\u201305', lo: 2000, hi: 2005 },
	{ label: '2006\u201310', lo: 2006, hi: 2010 },
	{ label: '2011\u201317', lo: 2011, hi: 2017 },
	{ label: '2018\u201326', lo: 2018, hi: 2026 }
].map((era) => {
	const movies = DATA.filter((d) => +d.year >= era.lo && +d.year <= era.hi);
	const rgbs = movies.flatMap((d) => d.palette).map(parseHex);
	const hsls = rgbs.map(([r, g, b]) => rgbToHsl(r, g, b));
	const hueCounts = {};
	HUE_FAMILIES.forEach((f) => (hueCounts[f] = { count: 0, sumR: 0, sumG: 0, sumB: 0 }));
	hsls.forEach(([h], i) => {
		const family = hueFamily(h);
		hueCounts[family].count++;
		hueCounts[family].sumR += rgbs[i][0];
		hueCounts[family].sumG += rgbs[i][1];
		hueCounts[family].sumB += rgbs[i][2];
	});
	const top = Object.entries(hueCounts)
		.filter(([, v]) => v.count > 0)
		.sort((a, b) => b[1].count - a[1].count)
		.slice(0, 5);
	const colors = top.map(
		([, v]) => `rgb(${Math.round(v.sumR / v.count)},${Math.round(v.sumG / v.count)},${Math.round(v.sumB / v.count)})`
	);
	while (colors.length < 5) colors.push('rgb(30,30,40)');
	return { label: era.label, count: movies.length, colors };
});