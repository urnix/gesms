// Builds the site into dist/: copies src/ (except the template) and renders
// src/template.html into one static page per target language
// (/, /en/, /tr/, /es/, /fr/), so search engines see ready text in each language.
// Also writes sitemap.xml and robots.txt.
//
//   node scripts/build.mjs

import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const DIST = join(SRC, '..', 'dist');
const SITE = 'https://gesms.artme.dev/';
const LOCALES = { ru: 'ru_RU', en: 'en_US', tr: 'tr_TR', es: 'es_ES', fr: 'fr_FR' };

const { LANGS, T, FLAGS, KA_ABOUT, pathFor, termsHtml, installHtml, aboutHtml } =
  await import(pathToFileURL(join(SRC, 'i18n.js')).href);

await rm(DIST, { recursive: true, force: true });
await cp(SRC, DIST, { recursive: true, filter: (f) => basename(f) !== 'template.html' });

const template = await readFile(join(SRC, 'template.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const alternates = [
  ...LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(l)}">`),
  `  <link rel="alternate" hreflang="x-default" href="${SITE}">`,
].join('\n');

for (const lang of LANGS) {
  const t = T[lang];
  const base = pathFor(lang) ? '../' : './';
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
  console.log(`✓ ${pathFor(lang) || '/'}index.html`);
}

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
