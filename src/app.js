import { analyze, render, loadDictionary, toLatin } from './translit.js';
import { translateText, translateTokens, lastProvider } from './translate.js';
import { T, FLAGS, pathFor, termsHtml, installHtml, aboutHtml } from './i18n.js';

const $ = (id) => document.getElementById(id);
const latin = $('latin');
const target = $('target');
const ka = $('ka');
const statusEl = $('status');
const copyBtn = $('copy');
const clearBtn = $('clear');
const langBtn = $('lang-btn');
const langMenu = $('lang-menu');

const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

// Anonymous usage stats via Umami (loaded by the page on the production domain only).
// Never sends any text: only event names and coarse properties.
function track(name, data) {
  try { window.umami?.track(name, data); } catch {}
}
const sizeBucket = (n) => (n <= 20 ? '1-20' : n <= 100 ? '21-100' : n <= 500 ? '101-500' : '500+');

// Site root: the folder with app.js (language pages live in subfolders).
const ROOT = new URL('./', import.meta.url);

let lang = document.documentElement.lang;
let t = T[lang];

// --- Fields: grow with content ---

const fields = { latin, target, ka };
// Browsers with `field-sizing: content` grow the fields in CSS; elsewhere we size them here.
const cssSizing = CSS.supports?.('field-sizing', 'content');
function autosize(el) {
  if (el === latin || cssSizing) return; // the source field has a fixed height
  el.style.height = 'auto';
  // scrollHeight excludes borders, while the box is border-box
  el.style.height = el.scrollHeight + (el.offsetHeight - el.clientHeight) + 'px';
}
function setField(name, value) {
  const el = fields[name];
  if (el.value !== value) el.value = value;
  autosize(el);
  store.set(name, value);
  if (name === 'latin') clearBtn.hidden = !value;
}

function showStatus(text, isError = false) {
  statusEl.hidden = !text;
  statusEl.classList.toggle('error', isError);
  statusEl.textContent = text ?? '';
}

// --- Translation flows from the field edited last ---

let source = store.get('source', 'latin'); // 'latin' | 'ka' | 'target'
let tokens = [];
let controller = null;
let debounce;
let lastJob = null;

function onEdit(name) {
  source = name;
  store.set('source', name);
  store.set(name, fields[name].value);
  autosize(fields[name]);
  if (name === 'latin') {
    clearBtn.hidden = !latin.value;
    tokens = analyze(latin.value);
    setField('ka', render(tokens));
  } else if (name === 'ka') {
    setField('latin', toLatin(ka.value));
  }
  schedule();
}

function schedule(delay = 700) {
  clearTimeout(debounce);
  debounce = setTimeout(run, delay);
}

async function run() {
  const text = fields[source].value.trim();
  const job = `${source}|${lang}|${text}`;
  if (job === lastJob) return;
  lastJob = job;
  controller?.abort();

  copyBtn.hidden = !target.value.trim();
  if (!text) {
    for (const name of Object.keys(fields)) if (name !== source) setField(name, '');
    copyBtn.hidden = true;
    showStatus(null);
    return;
  }
  if (!navigator.onLine) {
    lastJob = null;
    showStatus(t.offline, true);
    return;
  }

  const ctrl = (controller = new AbortController());
  const from = source;
  const outputs = Object.values(fields).filter((el) => el !== fields[from]);
  outputs.forEach((el) => el.classList.add('pending'));
  showStatus(t.translating);
  let retries = 0;
  try {
    if (from === 'latin') {
      ({ retries } = await translateTokens(tokens, lang, ctrl.signal, (r) => {
        if (ctrl.signal.aborted) return;
        setField('target', r.translation);
        setField('ka', r.georgian);
        copyBtn.hidden = false;
      }));
    } else if (from === 'ka') {
      const r = await translateText(ka.value.trim(), 'ka', lang, ctrl.signal);
      if (!ctrl.signal.aborted) setField('target', r);
    } else {
      const r = await translateText(target.value.trim(), lang, 'ka', ctrl.signal);
      if (!ctrl.signal.aborted) {
        setField('ka', r);
        setField('latin', toLatin(r));
      }
    }
    if (!ctrl.signal.aborted) {
      copyBtn.hidden = !target.value.trim();
      showStatus(null);
      if (target.value.trim()) scheduleInstallOffer();
      if (lastProvider !== 'cache') {
        track('translate', { from, lang, provider: lastProvider, retries, size: sizeBucket(text.length) });
      }
    }
  } catch {
    if (ctrl.signal.aborted) return;
    lastJob = null;
    showStatus(t.error, true);
    track('translate-error', { from, lang });
  } finally {
    if (controller === ctrl) outputs.forEach((el) => el.classList.remove('pending'));
  }
}

for (const [name, el] of Object.entries(fields)) el.addEventListener('input', () => onEdit(name));
window.addEventListener('online', () => { lastJob = null; run(); });
window.addEventListener('resize', () => { autosize(target); autosize(ka); });
document.fonts?.ready.then(() => { autosize(target); autosize(ka); });

// The × in the source field clears it, and with it the Georgian text and the translation.
clearBtn.addEventListener('click', () => {
  latin.value = '';
  onEdit('latin');
  latin.focus();
  track('clear');
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(target.value);
    track('copy', { lang });
    copyBtn.textContent = '✓';
    setTimeout(() => (copyBtn.textContent = '⧉'), 1200);
  } catch {}
});

// --- Target language = UI language ---

function applyLang(next) {
  lang = next;
  t = T[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
  document.querySelectorAll('[data-t]').forEach((el) => (el.textContent = t[el.dataset.t]));
  document.querySelectorAll('[data-ph]').forEach((el) => (el.placeholder = t[el.dataset.ph]));
  document.querySelectorAll('[data-aria]').forEach((el) => el.setAttribute('aria-label', t[el.dataset.aria]));
  document.querySelectorAll('[data-alt]').forEach((el) => (el.alt = t[el.dataset.alt]));
  $('copy').title = t.copy;
  clearBtn.title = t.clear;
  document.querySelector('[data-flag]').innerHTML = FLAGS[lang];
  document.querySelector('[data-html="terms"]').innerHTML = termsHtml(t);
  document.querySelector('[data-html="install"]').innerHTML = installHtml(t);
  document.querySelector('[data-html="about"]').innerHTML = aboutHtml(t);
  target.lang = lang;
  markCurrentLang();
  store.set('lang', lang);
}

function markCurrentLang() {
  langMenu.querySelectorAll('a').forEach((a) =>
    a.dataset.lang === lang ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
}

function switchLang(next) {
  if (next === lang) return;
  track('lang-switch', { from: lang, to: next });
  history.replaceState(null, '', new URL(pathFor(next), ROOT));
  applyLang(next);
  // re-translate from the source text: Latin or Georgian
  if (source === 'target') { source = 'ka'; store.set('source', 'ka'); }
  setField('target', '');
  lastJob = null;
  schedule(0);
}

function toggleMenu(open) {
  langMenu.hidden = !open;
  langBtn.setAttribute('aria-expanded', String(open));
}
langBtn.addEventListener('click', () => toggleMenu(langMenu.hidden));
langMenu.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-lang]');
  if (!a) return;
  e.preventDefault();
  toggleMenu(false);
  switchLang(a.dataset.lang);
});
document.addEventListener('click', (e) => {
  if (!langMenu.hidden && !e.target.closest('#lang-menu, #lang-btn')) toggleMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !langMenu.hidden) { toggleMenu(false); langBtn.focus(); }
});

// --- Dialogs: about, terms, install ---

for (const id of ['about', 'terms', 'install']) {
  const dlg = $(id);
  $(`${id}-open`).addEventListener('click', () => { dlg.showModal(); track('open-dialog', { name: id }); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

// If the browser can install the PWA itself, show an "Install" button.
let installPrompt = null;
const installNow = $('install-now');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  installNow.hidden = false;
});
installNow.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  const choice = await installPrompt.userChoice.catch(() => null);
  track('install-prompt', { outcome: choice?.outcome ?? 'unknown', via: 'guide' });
  installPrompt = null;
  installNow.hidden = true;
  $('install').close();
});
window.addEventListener('appinstalled', () => {
  installNow.hidden = true;
  store.set('installed', '1');
  track('installed');
});
// Launches from the home-screen icon, to see whether installed users come back.
if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
  addEventListener('load', () => setTimeout(() => track('launch-installed'), 1000));
}

// A gentle offer to add the app to the phone, 30 s after the first successful translation.
// Shown once per page load, only on touch devices, never inside the installed app,
// and not again for two weeks after the person says "not now".
const OFFER_DELAY = 30_000;
const OFFER_SNOOZE = 14 * 24 * 3600_000;
const offer = $('offer');
let offerTimer = null;

function offerAllowed() {
  const installed = matchMedia('(display-mode: standalone)').matches || navigator.standalone
    || store.get('installed', '') === '1';
  const snoozed = Date.now() - Number(store.get('offerSnoozedAt', '0')) < OFFER_SNOOZE;
  return !installed && !snoozed && matchMedia('(pointer: coarse)').matches;
}

function scheduleInstallOffer() {
  if (offerTimer !== null || !offerAllowed()) return;
  offerTimer = setTimeout(function show() {
    // wait until the person is not in another dialog
    if (document.querySelector('dialog[open]')) { offerTimer = setTimeout(show, 3000); return; }
    $('offer-yes').textContent = installPrompt ? t.installNow : t.offerYes;
    offer.returnValue = '';
    offer.showModal();
    track('install-offer', { action: 'shown' });
  }, OFFER_DELAY);
}

$('offer-yes').addEventListener('click', async () => {
  offer.close('yes');
  if (installPrompt) {
    installPrompt.prompt();
    const choice = await installPrompt.userChoice.catch(() => null);
    track('install-prompt', { outcome: choice?.outcome ?? 'unknown', via: 'offer' });
    installPrompt = null;
    installNow.hidden = true;
  } else {
    $('install').showModal();
  }
});
offer.addEventListener('close', () => {
  track('install-offer', { action: offer.returnValue === 'yes' ? 'yes' : 'no' });
  if (offer.returnValue !== 'yes') store.set('offerSnoozedAt', String(Date.now()));
});
offer.addEventListener('click', (e) => { if (e.target === offer) offer.close(); });

// --- Startup ---

// remembered for the root page, which redirects to the last used language
store.set('lang', lang);

latin.value = store.get('latin', '');
ka.value = store.get('ka', '');
target.value = store.get('target', '');
tokens = analyze(latin.value);
autosize(target);
autosize(ka);
markCurrentLang();
copyBtn.hidden = !target.value.trim();
clearBtn.hidden = !latin.value;
if (source === 'latin' && latin.value) setField('ka', render(tokens));
schedule(0);

loadDictionary(new URL('dict.bin', ROOT))
  .then(() => {
    if (source !== 'latin') return;
    tokens = analyze(latin.value);
    setField('ka', render(tokens));
    lastJob = null;
    schedule(0);
  })
  .catch(() => {});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('sw.js', ROOT)).catch(() => {});
}
