const TARGET = 'https://rainball-psi.vercel.app/';
const TARGET_HOST = new URL(TARGET).host;
const LS_URL = 'rbp.url';
const LS_HIST = 'rbp.hist';

const $ = (id) => document.getElementById(id);
const view = $('view');
const url = $('url');
const bar = $('bar');
const start = $('start');
const track = $('track');
const status = $('status');
const histSel = $('histSel');

$('targetHost').textContent = TARGET_HOST;

let past = [];
let future = [];
let current = null;
let visited = [];

function normalize(input) {
  const raw = input.trim();
  if (!raw) return TARGET;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(raw) || raw.startsWith('localhost')) {
    return 'https://' + raw.replace(/^\/+/, '');
  }
  return TARGET.replace(/\/+$/, '') + '/search?q=' + encodeURIComponent(raw);
}

function pretty(u) {
  try {
    const p = new URL(u);
    return p.host + (p.pathname === '/' ? '' : p.pathname) + p.search + p.hash;
  } catch {
    return u;
  }
}

function save() {
  try {
    localStorage.setItem(LS_URL, current || '');
    localStorage.setItem(LS_HIST, JSON.stringify(visited.slice(-50)));
  } catch {}
}

function renderHist() {
  const items = visited
    .slice(-50)
    .reverse()
    .map((u) => `<option value="${u}">${pretty(u)}</option>`)
    .join('');
  histSel.innerHTML = items ? items : '<option value="">пусто</option>';
}

function syncNav() {
  $('btnBack').disabled = past.length === 0;
  $('btnFwd').disabled = future.length === 0;
}

function showStatus(text) {
  status.textContent = text;
}

function load(u, push = true) {
  if (!u) return;
  track.classList.remove('on');
  void track.offsetWidth;
  track.classList.add('on');

  if (push && current && current !== u) {
    past.push(current);
    future = [];
  }
  current = u;

  start.classList.add('hide');
  view.classList.add('show');
  view.src = u;
  url.value = pretty(u);
  url.title = u;

  visited = visited.filter((x) => x !== u);
  visited.push(u);
  save();
  renderHist();
  syncNav();
  showStatus('загрузка…');
}

function goBack() {
  if (!past.length) return;
  future.push(current);
  load(past.pop(), false);
}

function goFwd() {
  if (!future.length) return;
  past.push(current);
  load(future.pop(), false);
}

function reload() {
  if (!current) return;
  try {
    view.contentWindow.location.reload();
  } catch {
    load(current, false);
  }
}

function home() {
  start.classList.remove('hide');
  view.classList.remove('show');
  view.removeAttribute('src');
  current = null;
  past = [];
  future = [];
  url.value = '';
  url.title = '';
  save();
  syncNav();
  showStatus('готов');
}

bar.addEventListener('submit', (e) => {
  e.preventDefault();
  load(normalize(url.value));
  url.blur();
});

$('btnBack').addEventListener('click', goBack);
$('btnFwd').addEventListener('click', goFwd);
$('btnReload').addEventListener('click', reload);
$('btnHome').addEventListener('click', home);

$('btnNewTab').addEventListener('click', () => {
  if (current) window.open(current, '_blank', 'noopener');
});

$('btnFull').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
});

document.querySelectorAll('.tile').forEach((t) => {
  t.addEventListener('click', () => load(TARGET.replace(/\/+$/, '') + t.dataset.url));
});

histSel.addEventListener('change', () => {
  if (histSel.value) load(histSel.value);
});

view.addEventListener('load', () => {
  track.classList.remove('on');
  showStatus('загружено');
});

view.addEventListener('error', () => {
  showStatus('ошибка загрузки — сайт может запрещать встраивание');
});

url.addEventListener('focus', () => {
  url.value = current || '';
  url.select();
});

url.addEventListener('blur', () => {
  url.value = pretty(current || '');
});

document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); goBack(); }
  else if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); goFwd(); }
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') { e.preventDefault(); reload(); }
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); url.focus(); }
});

let tx = 0;
let ty = 0;
document.addEventListener('touchstart', (e) => {
  tx = e.touches[0].clientX;
  ty = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - tx;
  const dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
  if (dx > 0) goBack();
  else goFwd();
}, { passive: true });

try {
  const savedUrl = localStorage.getItem(LS_URL);
  const savedHist = JSON.parse(localStorage.getItem(LS_HIST) || '[]');
  if (Array.isArray(savedHist)) {
    visited = savedHist.filter((x) => typeof x === 'string');
    renderHist();
  }
  if (savedUrl) url.value = pretty(savedUrl);
} catch {}

syncNav();