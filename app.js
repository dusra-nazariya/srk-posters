
// ─── Data ──────────────────────────────────────────────
d3.json('data/palettes.json').then(DATA => {
// ─── Helpers ───────────────────────────────────────────
const parseHex = hex => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
};

const rgbToLab = (r, g, b) => {
  let [rl, gl, bl] = [r, g, b].map(c => {
    c /= 255;
    return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  });
  let x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047;
  let y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750;
  let z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / 1.08883;
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};

const hueFamily = h => {
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

const HUE_FAMILIES = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'Pink'];
const HUE_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#e91e63'];

const tooltip = d3.select('#tooltip');

// ─── Stats Bar ─────────────────────────────────────────
const years = [...new Set(DATA.map(d => d.year))].sort();
const totalFilms = DATA.length;
const yearSpan = `${years[0]}–${years[years.length - 1]}`;
const allColors = DATA.flatMap(d => d.palette);
const uniqueColors = new Set(allColors).size;

// Average saturation & lightness
const avgStats = (() => {
  let totalS = 0, totalL = 0, count = 0;
  DATA.forEach(d => d.palette.forEach(hex => {
    const [r, g, b] = parseHex(hex);
    const [, s, l] = rgbToHsl(r, g, b);
    totalS += s; totalL += l; count++;
  }));
  return { sat: (totalS / count).toFixed(1), lit: (totalL / count).toFixed(1) };
})();

d3.select('#stats-bar').html(`
  <div class="stat"><div class="num">${totalFilms}</div><div class="label">Films</div></div>
  <div class="stat"><div class="num">${yearSpan}</div><div class="label">Span</div></div>
  <div class="stat"><div class="num">${uniqueColors}</div><div class="label">Unique Colors</div></div>
  <div class="stat"><div class="num">${allColors.length}</div><div class="label">Total Swatches</div></div>
  <div class="stat"><div class="num">${avgStats.sat}%</div><div class="label">Avg Saturation</div></div>
  <div class="stat"><div class="num">${avgStats.lit}%</div><div class="label">Avg Lightness</div></div>
`);

// ─── Timeline Strip ────────────────────────────────────
{
  const W = 1200, H = 80, pad = 20;
  const svg = d3.select('#timeline-strip').append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%');

  const x = d3.scaleBand()
    .domain(DATA.map((_, i) => i))
    .range([pad, W - pad])
    .padding(0.15);

  const blocks = svg.selectAll('g')
    .data(DATA)
    .join('g')
    .attr('transform', (d, i) => `translate(${x(i)}, 0)`);

  blocks.each(function(d, i) {
    const g = d3.select(this);
    const blockH = (H - 10) / d.palette.length;
    d.palette.forEach((hex, j) => {
      g.append('rect')
        .attr('x', 0)
        .attr('y', j * blockH + 2)
        .attr('width', x.bandwidth())
        .attr('height', blockH - 1)
        .attr('rx', 1)
        .attr('fill', hex);
    });
  });

  blocks.on('mouseover', (event, d) => {
    tooltip.style('opacity', 1);
    tooltip.select('.tt-poster').attr('src', `images/SRK_Posters/${d.poster}`).attr('alt', d.title);
    tooltip.select('.tt-title').text(d.title);
    tooltip.select('.tt-year').text(d.year);
    tooltip.select('.tt-palette').html(
      d.palette.map(c => `<div class="tt-swatch" style="background:${c}"></div>`).join('')
    );
  })
  .on('mousemove', event => {
    tooltip
      .style('left', (event.clientX + 12) + 'px')
      .style('top', (event.clientY - 10) + 'px');
  })
  .on('mouseout', () => tooltip.style('opacity', 0));

  // Year labels
  const yearGroups = d3.group(DATA, d => d.year);
  let yearPositions = [];
  yearGroups.forEach((films, year) => {
    const indices = films.map(f => DATA.indexOf(f));
    const mid = d3.mean(indices);
    yearPositions.push({ year, x: x(mid) + x.bandwidth() / 2 });
  });

  svg.selectAll('.year-label')
    .data(yearPositions)
    .join('text')
    .attr('class', 'year-label')
    .attr('x', d => d.x)
    .attr('y', H - 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '7px')
    .attr('fill', '#444')
    .attr('font-family', 'Fira Sans')
    .text(d => d.year);
}

// ─── Era Comparison ────────────────────────────────────
{
  const eras = [
    { label: '1992–99', filter: d => +d.year >= 1992 && +d.year <= 1999 },
    { label: '2000–05', filter: d => +d.year >= 2000 && +d.year <= 2005 },
    { label: '2006–10', filter: d => +d.year >= 2006 && +d.year <= 2010 },
    { label: '2011–17', filter: d => +d.year >= 2011 && +d.year <= 2017 },
    { label: '2018–26', filter: d => +d.year >= 2018 && +d.year <= 2026 },
  ];

  const container = d3.select('#era-comparison');

  eras.forEach(era => {
    const films = DATA.filter(era.filter);
    const allHex = films.flatMap(d => d.palette);
    const rgbs = allHex.map(parseHex);

    // Simple averaging in RGB space
    const avgR = Math.round(d3.mean(rgbs, c => c[0]));
    const avgG = Math.round(d3.mean(rgbs, c => c[1]));
    const avgB = Math.round(d3.mean(rgbs, c => c[2]));

    // Get top 5 representative colors via k-means-like approach
    // Use the most frequent hue families instead
    const hsls = rgbs.map(([r, g, b]) => rgbToHsl(r, g, b));
    const hueCounts = {};
    HUE_FAMILIES.forEach(f => hueCounts[f] = { count: 0, sumH: 0, sumS: 0, sumL: 0, sumR: 0, sumG: 0, sumB: 0 });
    hsls.forEach(([h, s, l], i) => {
      const family = hueFamily(h);
      hueCounts[family].count++;
      hueCounts[family].sumH += h;
      hueCounts[family].sumS += s;
      hueCounts[family].sumL += l;
      hueCounts[family].sumR += rgbs[i][0];
      hueCounts[family].sumG += rgbs[i][1];
      hueCounts[family].sumB += rgbs[i][2];
    });

    const topFamilies = Object.entries(hueCounts)
      .filter(([, v]) => v.count > 0)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);

    const eraColors = topFamilies.map(([, v]) =>
      `rgb(${Math.round(v.sumR / v.count)},${Math.round(v.sumG / v.count)},${Math.round(v.sumB / v.count)})`
    );

    // Fill remaining if less than 5
    while (eraColors.length < 5) eraColors.push('rgb(30,30,40)');

    const row = container.append('div').attr('class', 'era-row');
    row.append('div').attr('class', 'era-label').text(era.label);

    const palette = row.append('div').attr('class', 'era-palette');
    eraColors.forEach(c => palette.append('div').style('background', c));

    row.append('div').attr('class', 'era-count').text(`${films.length} films`);
  });
}

// ─── Hue Stacked Area ──────────────────────────────────
{
  const W = 1160, H = 340, m = { t: 30, r: 30, b: 40, l: 50 };
  const w = W - m.l - m.r, ht = H - m.t - m.b;

  const svg = d3.select('#hue-stacked').append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%');

  const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

  // Build year-family counts
  const yearData = years.map(year => {
    const films = DATA.filter(d => d.year === year);
    const counts = {};
    HUE_FAMILIES.forEach(f => counts[f] = 0);
    films.forEach(d => d.palette.forEach(hex => {
      const [r, b2, b_] = parseHex(hex);
      const [h] = rgbToHsl(r, b2, b_);
      counts[hueFamily(h)]++;
    }));
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const obj = { year };
    HUE_FAMILIES.forEach(f => obj[f] = counts[f] / total * 100);
    return obj;
  });

  const x = d3.scalePoint().domain(years).range([0, w]).padding(0.3);
  const y = d3.scaleLinear().domain([0, 100]).range([ht, 0]);

  const stack = d3.stack().keys(HUE_FAMILIES);
  const series = stack(yearData);

  const area = d3.area()
    .x(d => x(d.data.year))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveBasis);

  g.selectAll('path')
    .data(series)
    .join('path')
    .attr('d', area)
    .attr('fill', (d, i) => HUE_COLORS[i])
    .attr('opacity', 0.7);

  g.append('g')
    .attr('transform', `translate(0,${ht})`)
    .call(d3.axisBottom(x).tickValues(years.filter((_, i) => i % 3 === 0)))
    .selectAll('text')
    .attr('fill', '#555')
    .attr('font-size', '10px');

  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'))
    .selectAll('text')
    .attr('fill', '#555')
    .attr('font-size', '10px');

  g.selectAll('.domain, .tick line').attr('stroke', '#222');

  // Legend
  const legend = d3.select('#hue-stacked').append('div').attr('class', 'legend');
  HUE_FAMILIES.forEach((f, i) => {
    legend.append('div').attr('class', 'legend-item')
      .html(`<div class="legend-swatch" style="background:${HUE_COLORS[i]}"></div>${f}`);
  });
}

// ─── Lightness & Saturation Trends ─────────────────────
{
  const W = 1160, H = 340, m = { t: 30, r: 80, b: 40, l: 50 };
  const w = W - m.l - m.r, ht = H - m.t - m.b;

  const svg = d3.select('#ls-trends').append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%');

  const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

  // Per-year average L* and chroma
  const yearStats = years.map(year => {
    const films = DATA.filter(d => d.year === year);
    let totalL = 0, totalC = 0, count = 0;
    films.forEach(d => d.palette.forEach(hex => {
      const [r, gb, b] = parseHex(hex);
      const [, a, b_] = rgbToLab(r, gb, b);
      totalL += rgbToLab(r, gb, b)[0];
      totalC += Math.sqrt(a * a + b_ * b_);
      count++;
    }));
    return { year, lightness: totalL / count, chroma: totalC / count };
  });

  // Rolling mean
  const rolling = (arr, key, window = 3) => {
    const result = [];
    arr.forEach((d, i) => {
      const start = Math.max(0, i - Math.floor(window / 2));
      const end = Math.min(arr.length, i + Math.ceil(window / 2));
      const slice = arr.slice(start, end);
      result.push({ year: d.year, [key]: d3.mean(slice, s => s[key]) });
    });
    return result;
  };

  const lRolling = rolling(yearStats, 'lightness');
  const cRolling = rolling(yearStats, 'chroma');

  const x = d3.scalePoint().domain(years).range([0, w]).padding(0.3);
  const yL = d3.scaleLinear().domain([0, 100]).range([ht, 0]);
  const yC = d3.scaleLinear().domain([0, 80]).range([ht, 0]);

  // L* line
  const lineL = d3.line().x(d => x(d.year)).y(d => yL(d.lightness)).curve(d3.curveBasis);
  const lineC = d3.line().x(d => x(d.year)).y(d => yC(d.chroma)).curve(d3.curveBasis);

  // Dots
  g.selectAll('.dot-l')
    .data(yearStats)
    .join('circle')
    .attr('cx', d => x(d.year))
    .attr('cy', d => yL(d.lightness))
    .attr('r', 3)
    .attr('fill', '#87ceeb')
    .attr('opacity', 0.5);

  g.selectAll('.dot-c')
    .data(yearStats)
    .join('circle')
    .attr('cx', d => x(d.year))
    .attr('cy', d => yC(d.chroma))
    .attr('r', 3)
    .attr('fill', '#ffa07a')
    .attr('opacity', 0.5);

  // Rolling lines
  g.append('path').datum(lRolling)
    .attr('fill', 'none').attr('stroke', '#87ceeb').attr('stroke-width', 2.5)
    .attr('d', lineL);

  g.append('path').datum(cRolling)
    .attr('fill', 'none').attr('stroke', '#ffa07a').attr('stroke-width', 2.5)
    .attr('d', lineC);

  // Axes
  g.append('g')
    .attr('transform', `translate(0,${ht})`)
    .call(d3.axisBottom(x).tickValues(years.filter((_, i) => i % 3 === 0)))
    .selectAll('text').attr('fill', '#555').attr('font-size', '10px');

  g.append('g')
    .call(d3.axisLeft(yL).ticks(5))
    .selectAll('text').attr('fill', '#87ceeb').attr('font-size', '10px');

  g.append('g')
    .attr('transform', `translate(${w},0)`)
    .call(d3.axisRight(yC).ticks(5))
    .selectAll('text').attr('fill', '#ffa07a').attr('font-size', '10px');

  g.selectAll('.domain, .tick line').attr('stroke', '#222');

  // Labels
  g.append('text').attr('x', -10).attr('y', -10)
    .attr('fill', '#87ceeb').attr('font-size', '11px').text('L* (Lightness)');
  g.append('text').attr('x', w + 10).attr('y', -10)
    .attr('fill', '#ffa07a').attr('font-size', '11px').attr('text-anchor', 'end').text('Chroma');

  // Legend
  const legend = d3.select('#ls-trends').append('div').attr('class', 'legend');
  legend.append('div').attr('class', 'legend-item')
    .html(`<div class="legend-swatch" style="background:#87ceeb"></div>Lightness (L*)`);
  legend.append('div').attr('class', 'legend-item')
    .html(`<div class="legend-swatch" style="background:#ffa07a"></div>Chroma (Saturation)`);
}

// ─── Color Wheel Heatmap ───────────────────────────────
{
  const W = 560, H = 560;
  const cx = W / 2, cy = H / 2, R = 220;

  const svg = d3.select('#hue-wheel').append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%')
    .attr('max-width', '560px')
    .style('margin', '0 auto');

  // Background circle
  svg.append('circle')
    .attr('cx', cx).attr('cy', cy).attr('r', R + 20)
    .attr('fill', '#111118').attr('stroke', '#1a1a24');

  // Hue ring
  const hueRes = 360;
  for (let i = 0; i < hueRes; i++) {
    const a1 = (i / hueRes) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1.5) / hueRes) * Math.PI * 2 - Math.PI / 2;
    const arc = d3.arc()
      .innerRadius(R - 15)
      .outerRadius(R)
      .startAngle(a1 + Math.PI / 2)
      .endAngle(a2 + Math.PI / 2);
    svg.append('path')
      .attr('d', arc())
      .attr('transform', `translate(${cx},${cy})`)
      .attr('fill', `hsl(${i}, 80%, 60%)`)
      .attr('opacity', 0.3);
  }

  // Plot dots
  const dots = [];
  DATA.forEach(d => d.palette.forEach(hex => {
    const [r, g, b] = parseHex(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    dots.push({ h, s, l, hex, title: d.title, year: d.year, poster: d.poster });
  }));

  const rScale = d3.scaleLinear().domain([0, 100]).range([0, R - 30]);

  svg.selectAll('circle.dot')
    .data(dots)
    .join('circle')
    .attr('class', 'dot')
    .attr('cx', d => cx + rScale(d.s) * Math.cos((d.h - 90) * Math.PI / 180))
    .attr('cy', d => cy + rScale(d.s) * Math.sin((d.h - 90) * Math.PI / 180))
    .attr('r', d => 2 + d.l / 40)
    .attr('fill', d => d.hex)
    .attr('stroke', '#0a0a0f')
    .attr('stroke-width', 0.5)
    .attr('opacity', 0.7)
    .on('mouseover', (event, d) => {
      tooltip.style('opacity', 1);
      tooltip.select('.tt-poster').attr('src', `images/SRK_Posters/${d.poster}`).attr('alt', d.title);
      tooltip.select('.tt-title').text(d.title);
      tooltip.select('.tt-year').text(`${d.year} · ${d.hex}`);
      tooltip.select('.tt-palette').html(
        `<div class="tt-swatch" style="background:${d.hex}"></div>`
      );
    })
    .on('mousemove', event => {
      tooltip
        .style('left', (event.clientX + 12) + 'px')
        .style('top', (event.clientY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));

  // Center label
  svg.append('text')
    .attr('x', cx).attr('y', cy - 6)
    .attr('text-anchor', 'middle')
    .attr('fill', '#444')
    .attr('font-size', '11px')
    .attr('font-family', 'Fira Sans')
    .text('SATURATION →');
  svg.append('text')
    .attr('x', cx).attr('y', cy + 10)
    .attr('text-anchor', 'middle')
    .attr('fill', '#444')
    .attr('font-size', '11px')
    .attr('font-family', 'Fira Sans')
    .text('← HUE ANGLE →');
}

// ─── Poster Grid ───────────────────────────────────────
{
  const grid = d3.select('#poster-grid');

  DATA.forEach(d => {
    const card = grid.append('div').attr('class', 'poster-card');

    card.append('img')
      .attr('class', 'poster-thumb')
      .attr('src', `images/SRK_Posters/${d.poster}`)
      .attr('alt', d.title)
      .attr('loading', 'lazy');

    const palette = card.append('div').attr('class', 'poster-palette');
    d.palette.forEach(hex => palette.append('div').style('background', hex));

    const info = card.append('div').attr('class', 'poster-info');
    info.append('div').attr('class', 'year').text(d.year);
    info.append('div').attr('class', 'title').text(d.title);

    card.on('mouseover', event => {
      tooltip.style('opacity', 1);
      tooltip.select('.tt-poster').attr('src', `images/SRK_Posters/${d.poster}`).attr('alt', d.title);
      tooltip.select('.tt-title').text(d.title);
      tooltip.select('.tt-year').text(d.year);
      tooltip.select('.tt-palette').html(
        d.palette.map(c => `<div class="tt-swatch" style="background:${c}"></div>`).join('')
      );
    })
    .on('mousemove', event => {
      tooltip
        .style('left', (event.clientX + 12) + 'px')
        .style('top', (event.clientY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  });
}
});
