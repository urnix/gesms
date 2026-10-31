// Builds the site into dist/: copies src/ (except the template) and renders
// src/template.html into one static page per target language
// (/en/, /ru/, /tr/, /es/, /fr/), so search engines see ready text in each language.
// The root page only redirects to the last used or the browser's language (English by default).
// Also writes sitemap.xml and robots.txt.
//
//   node scripts/build.mjs

import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const DIST = join(SRC, '..', 'dist');
const SITE = 'https://gesms.artme.dev/';
// Umami website for anonymous stats (dashboard: https://stats.artme.dev)
const UMAMI_WEBSITE_ID = 'f5e56872-87a1-4dca-92ba-2fc6b2a4d6a5';
const LOCALES = { ru: 'ru_RU', en: 'en_US', tr: 'tr_TR', es: 'es_ES', fr: 'fr_FR' };

const { LANGS, DEFAULT_LANG, T, FLAGS, KA_ABOUT, pathFor, termsHtml, installHtml, aboutHtml } =
  await import(pathToFileURL(join(SRC, 'i18n.js')).href);

await rm(DIST, { recursive: true, force: true });
await cp(SRC, DIST, { recursive: true, filter: (f) => basename(f) !== 'template.html' });

// Cache busting: Cloudflare rewrites Cache-Control on JS/CSS to a 4-hour browser TTL, so a deploy
// could pair fresh HTML with stale scripts. Every JS/CSS/data URL gets ?v=<hash of all sources>;
// all imports of a module share the same URL, so each module still loads once.
const hash = createHash('sha256');
for (const f of (await readdir(SRC, { recursive: true })).sort()) {
  try { hash.update(f).update(await readFile(join(SRC, f))); } catch { /* directory */ }
}
const version = hash.digest('hex').slice(0, 10);
for (const f of await readdir(DIST)) {
  if (!f.endsWith('.js') || f === 'sw.js') continue;
  const code = await readFile(join(DIST, f), 'utf8');
  await writeFile(join(DIST, f), code
    .replace(/(from '\.\/[\w-]+\.js)'/g, `$1?v=${version}'`)
    .replace(/new URL\('dict\.bin'/g, `new URL('dict.bin?v=${version}'`));
}

const template = await readFile(join(SRC, 'template.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const alternates = [
  ...LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(l)}">`),
  `  <link rel="alternate" hreflang="x-default" href="${SITE}">`,
].join('\n');

for (const lang of LANGS) {
  const t = T[lang];
  const base = '../';
  const url = SITE + pathFor(lang);
  const langMenu = LANGS.map((l) =>
    `              <a href="${base}${pathFor(l)}" data-lang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ''}>`
    + `<span class="flag">${FLAGS[l]}</span>${esc(T[l].name)}</a>`
  ).join('\n');
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GeSMS',
    url,
    description: t.description,
    inLanguage: lang,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }).replace(/</g, '\\u003c');

  const raw = {
    alternates, langMenu, jsonld,
    flag: FLAGS[lang], terms: termsHtml(t), install: installHtml(t), about: aboutHtml(t),
  };
  const vars = {
    ...t, lang, base, url, site: SITE, locale: LOCALES[lang],
    kaTitle: KA_ABOUT.title, kaText: KA_ABOUT.text, kaKeywords: KA_ABOUT.keywords,
    umamiId: UMAMI_WEBSITE_ID, umamiDomain: new URL(SITE).host, version,
  };
  const html = template
    .replace(/\{\{\{(\w+)\}\}\}/g, (_, k) => raw[k] ?? '')
    .replace(/\{\{(\w+)\}\}/g, (_, k) => {
      if (vars[k] === undefined) throw new Error(`template: no value for {{${k}}}`);
      return esc(vars[k]);
    });
  const dir = join(DIST, pathFor(lang));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
  console.log(`✓ ${pathFor(lang)}index.html`);
}

// Root: the browser's (system) language if we have it, else the default.
// Only the installed app, which always starts at the root, reopens the last used language.
// Search engines get the default page as canonical and the language versions as alternates.
const fallback = SITE + pathFor(DEFAULT_LANG);
await writeFile(join(DIST, 'index.html'), `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(T[DEFAULT_LANG].title)}</title>
  <link rel="canonical" href="${fallback}">
${alternates}
  <link rel="manifest" href="./manifest.webmanifest">
  <link rel="icon" href="./icons/icon.svg" type="image/svg+xml">
  <meta name="theme-color" content="#E4002B">
  <script>
    (() => {
      const langs = ${JSON.stringify(LANGS)};
      let lang = null;
      if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
        try { lang = localStorage.getItem('lang'); } catch {}
      }
      if (!langs.includes(lang)) {
        lang = (navigator.languages || [navigator.language || ''])
          .map((l) => String(l).slice(0, 2).toLowerCase()).find((l) => langs.includes(l)) || ${JSON.stringify(DEFAULT_LANG)};
      }
      location.replace('./' + lang + '/' + location.search + location.hash);
    })();
  </script>
  <noscript><meta http-equiv="refresh" content="0; url=./${pathFor(DEFAULT_LANG)}"></noscript>
</head>
<body>
  <p><a href="./${pathFor(DEFAULT_LANG)}">GeSMS</a></p>
</body>
</html>
`);
console.log('✓ /index.html (language redirect)');

const today = new Date().toISOString().slice(0, 10);
await writeFile(join(DIST, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
  + LANGS.map((l) => `  <url>\n    <loc>${SITE}${pathFor(l)}</loc>\n    <lastmod>${today}</lastmod>\n`
    + LANGS.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${SITE}${pathFor(a)}"/>\n`).join('')
    + '  </url>\n').join('')
  + '</urlset>\n');
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log('✓ sitemap.xml, robots.txt');
