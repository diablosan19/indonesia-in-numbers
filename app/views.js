// views.js — one render function per section of the site. Each returns the
// HTML for its page; main.js drops it into #view and starts the counters.
// State that belongs to a page (toggles, filters, sort) lives with the page.
let pyramidMode = 'pct';
let sectorMode = 'share';
let inflationMode = 'both';
let regionFilter = 'ALL';
let selectedProvince = 'Jawa Barat';
let provSortKey = 'pop';
let provSortDir = -1;

function fmtNum(n, decimals) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function densityOf(p) { return p[3] * 1e6 / p[4]; }
function shareOf(p) { return p[3] / NATIONAL_POP * 100; }
function provRank(name) {
  const sorted = [...PROVINCES].sort((a, b) => b[3] - a[3]);
  return sorted.findIndex((p) => p[0] === name) + 1;
}

function sectionHead(title, sub, source) {
  return '<div class="section-head"><h2>' + title + '</h2><p>' + sub + '</p>'
    + '<p class="source-line">Source: ' + source + '</p></div>';
}

// ---- Overview ----
function renderOverview() {
  const cards = INDICATORS.map(([label, value, dec, pre, suf, year, note]) =>
    '<article class="card"><div class="card-label">' + label + '</div>'
    + '<div class="card-value"><span class="count" data-target="' + value + '" data-decimals="' + dec + '" data-prefix="' + pre + '" data-suffix="' + suf + '">0</span></div>'
    + '<div class="card-meta">' + year + ' · ' + note + '</div></article>').join('');
  const top5 = [...PROVINCES].sort((a, b) => b[3] - a[3]).slice(0, 5).map((p, i) =>
    '<tr><td>' + (i + 1) + '</td><td>' + p[0] + '</td><td class="num">' + fmtNum(p[3], 2) + '</td><td class="num">' + fmtNum(shareOf(p), 1) + '%</td></tr>').join('');
  const releases = RELEASES.map(([name, period, date]) =>
    '<tr><td>' + name + '</td><td>' + period + '</td><td class="num">' + date + '</td></tr>').join('');
  return sectionHead('Overview', 'Twelve headline figures for the country, the growth story of the last decade, and what is published next.', 'national statistics, latest available (2024–2025)')
    + '<div class="card-grid">' + cards + '</div>'
    + '<div class="panel"><h3>Real GDP growth, 2015–2024</h3>'
    + '<p class="panel-note">Annual change in real GDP. The economy shrank 2.07% in 2020, the first contraction since 1998, then recovered to above 5% a year.</p>'
    + growthBarChart(GDP_GROWTH) + '</div>'
    + '<div class="two-col"><div class="panel"><h3>Largest provinces</h3>'
    + '<table class="data-table"><thead><tr><th>#</th><th>Province</th><th class="num">People (M)</th><th class="num">Share</th></tr></thead><tbody>' + top5 + '</tbody></table>'
    + '<p class="panel-note">Full table of all 38 provinces: <a href="#/population">Population</a>.</p></div>'
    + '<div class="panel"><h3>Release calendar</h3>'
    + '<table class="data-table"><thead><tr><th>Release</th><th>Period</th><th class="num">Date</th></tr></thead><tbody>' + releases + '</tbody></table>'
    + '<p class="panel-note">New figures appear here on the morning they are published.</p></div></div>';
}

// ---- Population ----
function provinceRows(list) {
  return list.map((p) =>
    '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td><td class="num">' + fmtNum(p[3], 2) + '</td>'
    + '<td class="num">' + fmtNum(densityOf(p), 0) + '</td></tr>').join('');
}

function sortedProvinces(query) {
  let list = PROVINCES.filter((p) => p[0].toLowerCase().includes(query.toLowerCase()));
  const key = provSortKey === 'name' ? 0 : provSortKey === 'pop' ? 3 : -1;
  list.sort((a, b) => {
    const va = key === -1 ? densityOf(a) : a[key];
    const vb = key === -1 ? densityOf(b) : b[key];
    if (typeof va === 'string') return provSortDir * va.localeCompare(vb);
    return provSortDir * (va - vb);
  });
  return list;
}

function renderPopulation() {
  const facts = DEMO_FACTS.map(([k, v, d]) =>
    '<li><strong>' + k + ' — ' + v + '.</strong> ' + d + '</li>').join('');
  return sectionHead('Population', 'Who lives here: 283.5 million people across 38 provinces, from the crowded cities of Jawa to the wide spaces of Papua.', 'national statistics, 2024')
    + '<div class="panel"><h3>Age pyramid, 2024</h3>'
    + '<div class="toggle" role="group" aria-label="Pyramid units">'
    + '<button data-pyr="pct" class="' + (pyramidMode === 'pct' ? 'active' : '') + '">Percent of population</button>'
    + '<button data-pyr="abs" class="' + (pyramidMode === 'abs' ? 'active' : '') + '">Millions of people</button></div>'
    + '<div id="pyramid-slot">' + pyramidChart(pyramidMode) + '</div>'
    + '<p class="panel-note">The pyramid is wide at the bottom and narrows steadily: a young population still growing, with the 20–24 cohort the largest of all.</p></div>'
    + '<div class="two-col"><div class="panel"><h3>Ten demographic facts</h3><ol class="fact-list">' + facts + '</ol></div>'
    + '<div class="panel"><h3>Reading the pyramid</h3>'
    + '<p>Nearly seven in ten Indonesians are of working age, which is why the labour force grows by roughly two million people every year. The child share has been falling for a decade as families have fewer children, while the share over 65 is rising slowly and will pass 10% in the 2030s. Jawa holds 55.7% of the population on 6.6% of the land; the five Papua provinces together hold 1.9% of the people on 22.3% of the land.</p>'
    + '<p>Migration runs toward the cities: the urban share rose from 49.8% in 2010 to 58.6% in 2024, and the Jakarta metro area now holds about 31 million people.</p></div></div>'
    + '<div class="panel"><h3>All 38 provinces</h3>'
    + '<input id="prov-search" type="search" placeholder="Search a province…" aria-label="Search provinces">'
    + '<table class="data-table" id="prov-table"><thead><tr>'
    + '<th><button class="sort-btn" data-sort="name">Province ↕</button></th>'
    + '<th><button class="sort-btn" data-sort="group">Islands ↕</button></th>'
    + '<th class="num"><button class="sort-btn" data-sort="pop">People (M) ↕</button></th>'
    + '<th class="num"><button class="sort-btn" data-sort="density">Density /km² ↕</button></th>'
    + '</tr></thead><tbody id="prov-tbody">' + provinceRows(sortedProvinces('')) + '</tbody></table>'
    + '<p class="panel-note"><span id="prov-count">38</span> provinces shown · densities are people per square kilometre · populations sum to 283.50 million.</p></div>';
}

function refreshProvinceTable() {
  const q = document.getElementById('prov-search').value;
  const list = sortedProvinces(q);
  document.getElementById('prov-tbody').innerHTML = provinceRows(list);
  document.getElementById('prov-count').textContent = list.length;
}

// ---- Economy ----
function renderEconomy() {
  const top6 = [...SECTORS].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const rest = 100 - top6.reduce((a, s) => a + s[1], 0);
  const colors = [NAVY, '#2f6fd0', '#5b93e0', '#8fb3e8', AMBER, '#c77f00', GREY];
  const slices = top6.map((s, i) => [s[0], s[1], colors[i]]);
  slices.push(['All other industries', rest, colors[6]]);
  const legend = slices.map(([name, v, c]) =>
    '<li><span class="swatch" style="background:' + c + '"></span>' + name + ' <strong>' + v.toFixed(2) + '%</strong></li>').join('');
  const ranked = [...SECTORS].sort((a, b) => b[2] - a[2]).map((s) => [s[0], s[2]]);
  const sectorBody = sectorMode === 'share'
    ? '<div class="donut-wrap">' + donutChart(slices, 'GDP by industry, 2024') + '<ul class="legend">' + legend + '</ul></div>'
    : growthBars(ranked);
  const trade = TRADE_CARDS.map(([k, v, y, d]) =>
    '<article class="card"><div class="card-label">' + k + '</div><div class="card-value">' + v + '</div><div class="card-meta">' + y + ' · ' + d + '</div></article>').join('');
  return sectionHead('Economy', 'What the country makes, who makes it, and what it sells to the world. GDP was Rp 22,139 trillion in 2024.', 'national statistics, 2024')
    + '<div class="panel"><h3>Structure of the economy</h3>'
    + '<div class="toggle" role="group" aria-label="Sector view">'
    + '<button data-sector="share" class="' + (sectorMode === 'share' ? 'active' : '') + '">Share of GDP</button>'
    + '<button data-sector="growth" class="' + (sectorMode === 'growth' ? 'active' : '') + '">Growth by industry</button></div>'
    + '<div id="sector-slot">' + sectorBody + '</div>'
    + '<p class="panel-note">Manufacturing is the largest single industry at 18.67% of GDP. Services together — trade, transport, finance, public administration and the rest — are more than half of the economy.</p></div>'
    + '<div class="panel"><h3>Nominal GDP, 2020–2024</h3>'
    + lineChart([{ color: NAVY, values: NOMINAL_GDP.map((d) => d[1]) }], NOMINAL_GDP.map((d) => String(d[0])), '', 'Nominal GDP in trillion rupiah')
    + '<p class="panel-note">Nominal GDP in trillion rupiah, current prices. It rose 43% in four years, from Rp 15,434 trillion in 2020 to Rp 22,139 trillion in 2024.</p></div>'
    + '<div class="panel"><h3>Reading the structure</h3>'
    + '<p>Manufacturing, agriculture and trade together are 44% of GDP, which is why food prices and factory orders move the whole economy. Mining has shrunk as a share as services grew, but coal and nickel still dominate exports. The fastest-growing industries in 2024 were the ones that serve people directly: accommodation and food services grew 9.87%, transport 8.69%, and other services 8.94%.</p></div>'
    + '<h3 class="sub-head">Foreign trade</h3><div class="card-grid">' + trade + '</div>';
}

// ---- Regions ----
function renderRegions() {
  const chips = ISLAND_GROUPS.map(([code, label]) =>
    '<button data-group="' + code + '" class="chip' + (regionFilter === code ? ' active' : '') + '">' + label + '</button>').join('');
  const list = PROVINCES.filter((p) => regionFilter === 'ALL' || p[1] === regionFilter);
  const items = list.map((p) =>
    '<li><button data-province="' + p[0] + '" class="prov-item' + (selectedProvince === p[0] ? ' selected' : '') + '">'
    + '<span>' + p[0] + '</span><span class="num">' + fmtNum(p[3], 2) + 'M</span></button></li>').join('');
  const p = PROVINCES.find((x) => x[0] === selectedProvince);
  const meter = (v, max) => '<div class="meter"><div style="width:' + Math.min(100, v / max * 100).toFixed(1) + '%"></div></div>';
  const detail = '<div class="panel detail-panel"><h3>' + p[0] + '</h3>'
    + '<dl class="detail-list">'
    + '<dt>Capital</dt><dd>' + p[2] + '</dd>'
    + '<dt>Population</dt><dd>' + fmtNum(p[3], 2) + ' million (2024)</dd>'
    + '<dt>National share</dt><dd>' + fmtNum(shareOf(p), 2) + '% ' + meter(shareOf(p), 20) + '</dd>'
    + '<dt>Area</dt><dd>' + fmtNum(p[4], 0) + ' km²</dd>'
    + '<dt>Density</dt><dd>' + fmtNum(densityOf(p), 0) + ' people per km²</dd>'
    + '<dt>Human Development Index</dt><dd>' + fmtNum(p[5], 2) + ' (2024) ' + meter(p[5], 100) + '</dd>'
    + '<dt>Poverty rate</dt><dd>' + fmtNum(p[6], 2) + '% (Sep 2024)</dd>'
    + '<dt>Population rank</dt><dd>#' + provRank(p[0]) + ' of 38 provinces</dd>'
    + '</dl></div>';
  return sectionHead('Regions', 'Thirty-eight provinces in six island groups. Pick a group, then a province, to see its numbers.', 'national statistics, 2024')
    + '<div class="chips">' + chips + '</div>'
    + '<div class="two-col regions-grid"><div class="panel"><h3>Provinces <span class="muted">(' + list.length + ' shown)</span></h3><ul class="prov-list">' + items + '</ul></div>'
    + detail + '</div>';
}

// ---- Inflation & Prices ----
function renderInflation() {
  const labels = INFLATION.map((d) => d[0]);
  const headline = INFLATION.map((d) => d[1]);
  const core = INFLATION.map((d) => d[2]);
  const series = inflationMode === 'both'
    ? [{ color: NAVY, values: headline }, { color: AMBER, values: core }]
    : [{ color: NAVY, values: headline }];
  const legend = inflationMode === 'both'
    ? '<p class="legend-line"><span class="swatch" style="background:' + NAVY + '"></span>Headline inflation &nbsp; <span class="swatch" style="background:' + AMBER + '"></span>Core inflation (excludes volatile food and administered prices)</p>'
    : '<p class="legend-line"><span class="swatch" style="background:' + NAVY + '"></span>Headline inflation only</p>';
  const rows = CPI_GROUPS.map(([name, w, yoy]) =>
    '<tr><td>' + name + '</td><td class="num">' + w.toFixed(2) + '</td><td class="num">' + (yoy > 0 ? '+' : '') + yoy.toFixed(2) + '%</td></tr>').join('');
  return sectionHead('Inflation & Prices', 'Prices rose 2.86% in the year to October 2025 — inside the 1.5–3.5% target band for a third straight year.', 'national statistics, Jan 2023 – Oct 2025')
    + '<div class="panel"><h3>Headline vs core inflation, Jan 2023 – Oct 2025</h3>'
    + '<div class="toggle" role="group" aria-label="Inflation series">'
    + '<button data-inflation="both" class="' + (inflationMode === 'both' ? 'active' : '') + '">Headline + core</button>'
    + '<button data-inflation="headline" class="' + (inflationMode === 'headline' ? 'active' : '') + '">Headline only</button></div>'
    + '<div id="inflation-slot">' + lineChart(series, labels, '%', 'Inflation, percent year on year') + legend + '</div>'
    + '<p class="panel-note">Headline inflation fell below zero in February 2025 (−0.09%), the first monthly deflation on record, as electricity tariffs were cut. Core inflation stayed near 2.5% throughout, which is why the central bank held rates steady.</p></div>'
    + '<div class="panel"><h3>The CPI basket — what a household buys</h3>'
    + '<table class="data-table"><thead><tr><th>Group</th><th class="num">Weight %</th><th class="num">Inflation Oct 2025</th></tr></thead><tbody>' + rows + '</tbody></table>'
    + '<p class="panel-note">Weights are the average household budget shares from the 2022 cost-of-living survey and add to 100.00%. Food is the heaviest group at 26.02%.</p></div>';
}

// ---- Methodology ----
function renderMethodology() {
  return sectionHead('Methodology & About', 'How each figure on this site is produced, what the words mean, and where the numbers come from.', 'national statistics, latest available')
    + '<div class="panel"><h3>How the series are produced</h3><ul class="fact-list">'
    + '<li><strong>Population.</strong> Mid-year estimates built from the 2020 census and the annual population survey, by province, age and sex.</li>'
    + '<li><strong>GDP.</strong> Quarterly national accounts at current and constant 2010 prices; growth is the change in constant-price GDP on a year earlier.</li>'
    + '<li><strong>Consumer prices.</strong> Prices collected monthly in 90 cities; the index is a weighted average of 11 spending groups.</li>'
    + '<li><strong>Poverty.</strong> From the March and September household surveys; a household is poor when its spending falls below the poverty line.</li>'
    + '<li><strong>Labour force.</strong> From the August labour force survey of about 200,000 households.</li>'
    + '<li><strong>Human Development Index.</strong> A composite of life expectancy, expected and mean years of schooling, and spending per person.</li>'
    + '</ul></div>'
    + '<div class="two-col"><div class="panel"><h3>Definitions</h3><ul class="fact-list">'
    + '<li><strong>Poverty line.</strong> Rp 595,242 per person per month (September 2024) — the cost of a minimum food basket plus basic non-food needs.</li>'
    + '<li><strong>Open unemployment.</strong> People without work who are available for work and actively looking, as a share of the labour force.</li>'
    + '<li><strong>Core inflation.</strong> Consumer-price inflation excluding volatile food prices and prices set by the government.</li>'
    + '<li><strong>HDI.</strong> The Human Development Index, on a scale of 0 to 100; above 80 is very high, 70–80 is high.</li>'
    + '<li><strong>Gini ratio.</strong> A measure of income inequality from 0 (everyone earns the same) to 1 (one person earns everything).</li>'
    + '</ul></div>'
    + '<div class="panel"><h3>Revisions & rounding</h3>'
    + '<p>Figures are revised when better data arrives: GDP for the last two years, trade for the last three months, and CPI weights after each cost-of-living survey. This site shows the latest published vintage. Percentages are rounded to two decimals; province populations are rounded to 0.01 million and add to the national total of 283.50 million. Small differences between a rounded total and its parts are rounding, not error.</p>'
    + '<p><strong>About this site.</strong> Indonesia in Numbers is an independent statistics portal built for the make.fun best-national-statistics-site bounty. It is not affiliated with any government statistics office.</p>'
    + '</div></div>';
}
