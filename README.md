# GeSMS: gesms → გესმს → гесмс

**https://gesms.artme.dev**

Got an SMS from Georgian friends that reads `gamarjoba, rogor khar? xval mogwer`? Georgians often type in Latin letters: SMS, WhatsApp, Viber and Telegram messages written on phones without a Georgian keyboard. Regular translators don't understand this.

GeSMS turns Georgian written in Latin letters into real Georgian script and translates it right away into Russian, English, Turkish, Spanish or French.

- **Understands different typing styles:** sh, ch, kh, ts, dz, apostrophes (t', k', ch') and the Georgian keyboard layout (T, S, W, R, J, Z, C).
- **Picks the meaningful variant.** Ambiguous letters (t can be თ or ტ, k can be კ, ქ or ყ) are resolved with a dictionary. If the translation still looks like nonsense, other variants are tried.
- **Works both ways.** All three fields are editable: type a reply in your language and get it in Georgian script and in Latin letters, ready to send by SMS.
- **Free, no sign-up,** on phones and computers. Installable as an app (PWA).

> **По-русски.** GeSMS переводит грузинские СМС, написанные латиницей: превращает их в грузинские буквы и переводит на русский, английский, турецкий, испанский или французский. Работает и в обратную сторону.
>
> **ქართულად.** ლათინური ასოებით აკრეფილი ქართული ტექსტი ავტომატურად გადაიყვანება ქართულ შრიფტზე და ითარგმნება. მუშაობს პირიქითაც.

## How it works

Plain JS with no dependencies or bundlers.

```
src/
  translit.js           transliteration: variants per word, dictionary-based choice, reverse to Latin
  translate.js          Google Translate (unofficial client=gtx), MyMemory fallback, retries for untranslated words
  i18n.js               UI texts in 5 languages, terms of use, install guide
  app.js, styles.css    UI
  template.html         page template, rendered into one static page per language (for SEO)
  sw.js, manifest.webmanifest   PWA
  dict.bin              17k most frequent Georgian word forms, ~46 KB
  icons/                kitten, app icons, social preview
scripts/
  build.mjs             src/ → dist/ (pages for /, /en/, /tr/, /es/, /fr/, sitemap, robots)
  build-dict.mjs        rebuilds src/dict.bin from the source corpora
  serve.mjs             local static server for dist/
```

Transliteration works offline; for translation the text is sent to Google Translate or MyMemory.

## Development

```bash
npm start
```

Builds `dist/` and serves it at http://localhost:8080/.

Rebuild the dictionary (downloads about 70 MB of source data):

```bash
npm run build:dict
```

## Deployment

The `Dockerfile` builds `dist/` and serves it with nginx. The site runs on the homelab server as the `gesms` stack of [rostok](https://jsr.io/@rostok/cli), behind Traefik at gesms.artme.dev.

## Data sources

The word list is built from the [Leipzig Corpora Collection](https://wortschatz.uni-leipzig.de/en/download) (CC BY 4.0) and [FrequencyWords](https://github.com/hermitdave/FrequencyWords) / OpenSubtitles (CC BY-SA 4.0).
