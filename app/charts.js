// charts.js — every chart on the site is drawn here as inline SVG strings,
// so the pages need no library and no network. All charts share one palette:
// navy for the main series, amber for the highlight, grey for the second series.
const NAVY = '#0b3d91';
const AMBER = '#f0a500';
const GREY = '#8a94a6';
const LIGHT = '#dbe4f0';

function svgOpen(w, h, label) {
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + label + '">';
}

function niceTicks(min, max, count) {
  const step = (max - min) / count;
  const ticks = [];
  for (let i = 0; i <= count; i++) ticks.push(min + step * i);
  return ticks;
}

// Vertical bar chart for yearly GDP growth. Negative bars hang below zero.
function growthBarChart(series) {
  const w = 640, h = 210, padL = 44, padR = 10, padT = 14, padB = 26;
  const lo = -3, hi = 6;
  const y = (v) => padT + (hi - v) * (h - padT - padB) / (hi - lo);
  const slot = (w - padL - padR) / series.length;
  const barW = Math.min(34, slot * 0.62);
  let out = svgOpen(w, h, 'GDP growth by year, 2015 to 2024');
  niceTicks(lo, hi, 3).forEach((t) => {
    out += '<line x1="' + padL + '" y1="' + y(t) + '" x2="' + (w - padR) + '" y2="' + y(t) + '" stroke="#e3e8ef"/>';
    out += '<text x="' + (padL - 6) + '" y="' + (y(t) + 4) + '" font-size="11" fill="#5b6472" text-anchor="end">' + t + '%</text>';
  });
  out += '<line x1="' + padL + '" y1="' + y(0) + '" x2="' + (w - padR) + '" y2="' + y(0) + '" stroke="#9aa5b5"/>';
  series.forEach(([year, v], i) => {
    const x = padL + slot * i + (slot - barW) / 2;
    const top = y(Math.max(0, v));
    const bottom = y(Math.min(0, v));
    const fill = v < 0 ? '#c0392b' : (year === 2024 ? AMBER : NAVY);
    out += '<rect x="' + x.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + barW + '" height="' + Math.max(1, bottom - top).toFixed(1) + '" fill="' + fill + '" rx="2"/>';
    out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (v < 0 ? bottom + 14 : top - 6) + '" font-size="11" font-weight="700" fill="#1c2733" text-anchor="middle">' + v.toFixed(2) + '</text>';
    out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (h - 10) + '" font-size="11" fill="#5b6472" text-anchor="middle">' + year + '</text>';
  });
  return out + '</svg>';
}

// Line chart. `series` is an array of {color, values, label}; `labels` are x labels.
function lineChart(series, labels, unit, label) {
  const w = 640, h = 250, padL = 44, padR = 14, padT = 16, padB = 30;
  let lo = Infinity, hi = -Infinity;
  series.forEach((s) => s.values.forEach((v) => { lo = Math.min(lo, v); hi = Math.max(hi, v); }));
  lo = Math.floor(lo) - 0.5; hi = Math.ceil(hi) + 0.5;
  const x = (i) => padL + i * (w - padL - padR) / (labels.length - 1);
  const y = (v) => padT + (hi - v) * (h - padT - padB) / (hi - lo);
  let out = svgOpen(w, h, label);
  niceTicks(lo, hi, 4).forEach((t) => {
    out += '<line x1="' + padL + '" y1="' + y(t) + '" x2="' + (w - padR) + '" y2="' + y(t) + '" stroke="#e3e8ef"/>';
    out += '<text x="' + (padL - 6) + '" y="' + (y(t) + 4) + '" font-size="11" fill="#5b6472" text-anchor="end">' + t.toFixed(1) + unit + '</text>';
  });
  if (lo < 0 && hi > 0) out += '<line x1="' + padL + '" y1="' + y(0) + '" x2="' + (w - padR) + '" y2="' + y(0) + '" stroke="#9aa5b5"/>';
  series.forEach((s) => {
    let d = '';
    s.values.forEach((v, i) => { d += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); });
    out += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2.5" stroke-linejoin="round"/>';
    s.values.forEach((v, i) => {
      out += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="2.6" fill="' + s.color + '"/>';
    });
  });
  labels.forEach((lb, i) => {
    if (i % 4 === 0 || i === labels.length - 1) {
      out += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" font-size="11" fill="#5b6472" text-anchor="middle">' + lb + '</text>';
    }
  });
  return out + '</svg>';
}

// Donut chart: `slices` is [[label, value, color]]; the rest slice is added by the caller.
function donutChart(slices, label) {
  const cx = 130, cy = 130, r = 104, inner = 66;
  const total = slices.reduce((a, s) => a + s[1], 0);
  let out = svgOpen(260, 260, label);
  let angle = -Math.PI / 2;
  slices.forEach(([name, v, color]) => {
    const frac = v / total;
    const a2 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const x3 = cx + inner * Math.cos(a2), y3 = cy + inner * Math.sin(a2);
    const x4 = cx + inner * Math.cos(angle), y4 = cy + inner * Math.sin(angle);
    out += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' L' + x3.toFixed(1) + ' ' + y3.toFixed(1) + ' A' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + x4.toFixed(1) + ' ' + y4.toFixed(1) + ' Z" fill="' + color + '"><title>' + name + ' ' + v.toFixed(2) + '%</title></path>';
    angle = a2;
  });
  out += '<text x="' + cx + '" y="' + (cy - 6) + '" font-size="26" font-weight="800" fill="#1c2733" text-anchor="middle">100%</text>';
  out += '<text x="' + cx + '" y="' + (cy + 16) + '" font-size="12" fill="#5b6472" text-anchor="middle">of GDP, 2024</text>';
  return out + '</svg>';
}

// Ranked horizontal bars for industry growth.
function growthBars(rows) {
  const w = 640, barH = 24, gap = 8, padL = 208, padR = 56, top = 8;
  const h = top + rows.length * (barH + gap) + 8;
  const max = Math.max(...rows.map((r) => r[1]));
  let out = svgOpen(w, h, 'Industry growth in 2024, ranked');
  rows.forEach(([name, v], i) => {
    const y0 = top + i * (barH + gap);
    const bw = (v / max) * (w - padL - padR);
    out += '<text x="' + (padL - 8) + '" y="' + (y0 + barH / 2 + 4) + '" font-size="12" fill="#1c2733" text-anchor="end">' + name + '</text>';
    out += '<rect x="' + padL + '" y="' + y0 + '" width="' + bw.toFixed(1) + '" height="' + barH + '" fill="' + (i === 0 ? AMBER : NAVY) + '" rx="3"/>';
    out += '<text x="' + (padL + bw + 6).toFixed(1) + '" y="' + (y0 + barH / 2 + 4) + '" font-size="12" font-weight="700" fill="#1c2733">' + v.toFixed(2) + '%</text>';
  });
  return out + '</svg>';
}

// Age pyramid: male bars left, female bars right, centre labels.
function pyramidChart(mode) {
  const w = 640, rowH = 19, padT = 26, padB = 8, mid = w / 2, gap = 30;
  const h = padT + AGE_PYRAMID.length * rowH + padB;
  const maxPct = 4.5;
  const scale = (mid - 46 - gap) / maxPct;
  const fmt = (pct) => mode === 'abs'
    ? (pct / 100 * NATIONAL_POP).toFixed(1) + 'M'
    : pct.toFixed(1) + '%';
  let out = svgOpen(w, h, 'Population by age group and sex, 2024');
  out += '<text x="46" y="16" font-size="12" font-weight="700" fill="' + NAVY + '">Male ' + (mode === 'abs' ? '(millions)' : '(%)') + '</text>';
  out += '<text x="' + (w - 46) + '" y="16" font-size="12" font-weight="700" fill="#7a4a00" text-anchor="end">Female ' + (mode === 'abs' ? '(millions)' : '(%)') + '</text>';
  AGE_PYRAMID.forEach(([cohort, m, f], i) => {
    const y0 = padT + i * rowH;
    out += '<rect x="' + (mid - gap - m * scale).toFixed(1) + '" y="' + y0 + '" width="' + (m * scale).toFixed(1) + '" height="' + (rowH - 3) + '" fill="' + NAVY + '" rx="2"/>';
    out += '<rect x="' + (mid + gap) + '" y="' + y0 + '" width="' + (f * scale).toFixed(1) + '" height="' + (rowH - 3) + '" fill="' + AMBER + '" rx="2"/>';
    out += '<text x="' + (mid - gap - m * scale - 6).toFixed(1) + '" y="' + (y0 + rowH / 2 + 3) + '" font-size="11" fill="#1c2733" text-anchor="end">' + fmt(m) + '</text>';
    out += '<text x="' + (mid + gap + f * scale + 6).toFixed(1) + '" y="' + (y0 + rowH / 2 + 3) + '" font-size="11" fill="#1c2733">' + fmt(f) + '</text>';
    out += '<text x="' + mid + '" y="' + (y0 + rowH / 2 + 3) + '" font-size="11" font-weight="700" fill="#1c2733" text-anchor="middle">' + cohort + '</text>';
  });
  return out + '</svg>';
}
