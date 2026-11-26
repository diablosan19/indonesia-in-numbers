// main.js — routing and interaction for Indonesia in Numbers.
// Hash routes: #/overview, #/population, #/economy, #/regions,
// #/inflation, #/methodology. Every control is wired by delegation on
// #view, so a page works the moment it is rendered.
const ROUTES = {
  '/overview': renderOverview,
  '/population': renderPopulation,
  '/economy': renderEconomy,
  '/regions': renderRegions,
  '/inflation': renderInflation,
  '/methodology': renderMethodology,
};
const NAV_ORDER = ['/overview', '/population', '/economy', '/regions', '/inflation', '/methodology'];

// Animate every .count element from 0 to its target, then mark the page
// ready for screenshots. Counters settle in under a second.
function runCounters(done) {
  const nodes = Array.from(document.querySelectorAll('.count'));
  if (nodes.length === 0) { done(); return; }
  const start = performance.now();
  const duration = 900;
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    nodes.forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const dec = parseInt(el.dataset.decimals, 10);
      const value = target * eased;
      el.textContent = el.dataset.prefix + fmtNum(value, dec) + el.dataset.suffix;
    });
    if (t < 1) requestAnimationFrame(frame);
    else done();
  }
  requestAnimationFrame(frame);
}

function renderRoute() {
  const hash = location.hash.replace(/^#/, '') || '/overview';
  const render = ROUTES[hash] || ROUTES['/overview'];
  window.__shotReady = false;
  document.getElementById('view').innerHTML = render();
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + (ROUTES[hash] ? hash : '/overview'));
  });
  window.scrollTo(0, 0);
  runCounters(() => { window.__shotReady = true; });
}

// One delegated listener handles every control on every page.
document.getElementById('view').addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (!btn) return;
  if (btn.dataset.pyr) {
    pyramidMode = btn.dataset.pyr;
    document.getElementById('pyramid-slot').innerHTML = pyramidChart(pyramidMode);
    btn.parentElement.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
  }
  if (btn.dataset.sector) {
    sectorMode = btn.dataset.sector;
    location.hash = '#/economy';
    renderRoute();
  }
  if (btn.dataset.inflation) {
    inflationMode = btn.dataset.inflation;
    location.hash = '#/inflation';
    renderRoute();
  }
  if (btn.dataset.group) {
    regionFilter = btn.dataset.group;
    location.hash = '#/regions';
    renderRoute();
  }
  if (btn.dataset.province) {
    selectedProvince = btn.dataset.province;
    location.hash = '#/regions';
    renderRoute();
  }
  if (btn.dataset.sort) {
    if (provSortKey === btn.dataset.sort) provSortDir = -provSortDir;
    else { provSortKey = btn.dataset.sort; provSortDir = btn.dataset.sort === 'name' ? 1 : -1; }
    refreshProvinceTable();
  }
});

document.getElementById('view').addEventListener('input', (event) => {
  if (event.target.id === 'prov-search') refreshProvinceTable();
});

window.addEventListener('hashchange', renderRoute);
renderRoute();
