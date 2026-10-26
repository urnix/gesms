// Transliteration of Georgian typed in Latin letters into Mkhedruli.
//
// The base scheme is the "chat" one: the standard Georgian keyboard layout
// (T=ტ, S=შ, W=ჭ, R=ღ, J=ჟ, Z=ძ, C=ჩ inside a word) plus digraphs sh, ch, kh, gh, ts, dz, zh
// and an apostrophe for ejectives (t', k', p', q', ts', ch').
//
// Latin is ambiguous: t is თ or ტ, k is კ or ქ, p is პ or ფ, and so on.
// For every word we enumerate variants and pick one found in the frequency
// dictionary (dict.bin); if none is found, the base-scheme variant wins. The other
// variants are kept so they can be tried if the translation leaves the word untranslated.

// The first option is the base scheme, the rest are alternatives.
const UNITS = {
  "ch'": ['ჭ'], "ts'": ['წ'], tch: ['ჭ'], dzh: ['ჯ'],
  "t'": ['ტ'], "k'": ['კ'], "p'": ['პ'], "q'": ['ყ'], "c'": ['წ'],
  sh: ['შ'], ch: ['ჩ', 'ჭ'], zh: ['ჟ'], gh: ['ღ'], kh: ['ხ', 'ქ'], ts: ['ც', 'წ'],
  dz: ['ძ'], th: ['თ'], ph: ['ფ'], dj: ['ჯ'],
  a: ['ა'], b: ['ბ'], c: ['ც', 'წ', 'ჩ'], d: ['დ'], e: ['ე'], f: ['ფ'], g: ['გ', 'ღ'],
  h: ['ჰ'], i: ['ი'], j: ['ჯ', 'ჟ'], k: ['კ', 'ქ', 'ყ'], l: ['ლ'], m: ['მ'], n: ['ნ'],
  o: ['ო'], p: ['პ', 'ფ'], q: ['ქ', 'ყ'], r: ['რ'], s: ['ს', 'შ'], t: ['თ', 'ტ'],
  u: ['უ'], v: ['ვ'], w: ['წ', 'ვ', 'ჭ'], x: ['ხ'], y: ['ყ'], z: ['ზ', 'ძ', 'ჟ'],
};
// Capitals inside a word are Shift keys of the keyboard layout.
const SHIFTED = { W: 'ჭ', R: 'ღ', T: 'ტ', S: 'შ', J: 'ჟ', Z: 'ძ', C: 'ჩ' };

const MAX_DEVIATIONS = 3;   // how many letters may take an alternative
const MAX_CANDIDATES = 4000;
const MAX_OPTIONS = 6;      // variants kept per word for retries

let dict = null; // Map: word → approximate frequency rank (0 = most frequent)

// dict.bin format is described in scripts/build-dict.mjs.
const TIERS = [0, 100, 300, 1000, 3000, 8000];

export async function loadDictionary(url) {
  const res = await fetch(url);
  let bytes = new Uint8Array(await res.arrayBuffer());
  // the server may have already decoded gzip (Content-Encoding)
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  }
  dict = new Map();
  new TextDecoder().decode(bytes).split('\n#\n').forEach((tier, t) => {
    let prev = '';
    for (const line of tier.split('\n')) {
      const word = prev.slice(0, Number(line[0])) + line.slice(1);
      prev = word;
      let w = '';
      for (const ch of word) {
        const i = ch <= 'Z' ? ch.charCodeAt(0) - 65 + 26 : ch.charCodeAt(0) - 97;
        w += String.fromCharCode(0x10D0 + i);
      }
      dict.set(w, TIERS[t]);
    }
  });
}

export const isKnown = (word) => dict?.has(word) ?? false;

export const hasDictionary = () => dict !== null;

// Splits a word into units (letters and digraphs) with their options.
function units(word) {
  const out = [];
  for (let i = 0; i < word.length; ) {
    const ch = word[i];
    if (SHIFTED[ch] && i > 0) { out.push([SHIFTED[ch]]); i++; continue; }
    let hit = null;
    for (let len = 3; len >= 1 && !hit; len--) {
      const key = word.slice(i, i + len).toLowerCase();
      if (UNITS[key]) hit = [len, UNITS[key]];
    }
    if (hit) { out.push(hit[1]); i += hit[0]; }
    else { out.push([ch]); i++; }
  }
  return out;
}

// All variants of a word with at most MAX_DEVIATIONS departures from the base scheme.
function candidates(word) {
  const us = units(word);
  const out = [];
  const walk = (i, acc, dev) => {
    if (out.length >= MAX_CANDIDATES) return;
    if (i === us.length) { out.push({ text: acc, dev }); return; }
    us[i].forEach((g, j) => {
      if (dev + (j > 0) <= MAX_DEVIATIONS) walk(i + 1, acc + g, dev + (j > 0));
    });
  };
  walk(0, '', 0);
  return out;
}

function rankWord(word) {
  const cands = candidates(word);
  for (const c of cands) {
    const rank = dict?.get(c.text);
    c.known = rank !== undefined;
    // a frequent word with one substitution beats a rare one with none
    c.score = c.known ? Math.log10(rank + 2) + c.dev * 1.5 : 100 + c.dev;
  }
  cands.sort((a, b) => a.score - b.score);
  return { options: cands.slice(0, MAX_OPTIONS).map((c) => c.text), known: cands[0].known };
}

const APOSTROPHES = /[’ʼ`´‘]/g;
const TOKEN = /([A-Za-z]+(?:'[A-Za-z]*)*)|([^A-Za-z]+)/g;

// Parses text: Latin words → { latin, options, known }, everything else stays a string.
export function analyze(text) {
  text = text.replace(APOSTROPHES, "'");
  const tokens = [];
  for (const [, word, other] of text.matchAll(TOKEN)) {
    if (other) { tokens.push(other); continue; }
    // a capital followed by lowercase at word start is just a capital ("Tbilisi")
    const w = /^[A-Z][a-z']/.test(word) ? word[0].toLowerCase() + word.slice(1) : word;
    tokens.push({ latin: word, ...rankWord(w) });
  }
  return tokens;
}

// Builds Georgian text; choice[i] is the option index for the i-th word (default 0).
export function render(tokens, choice = []) {
  let wi = 0;
  return tokens.map((t) => {
    if (typeof t === 'string') return t;
    const opt = t.options[Math.min(choice[wi++] ?? 0, t.options.length - 1)];
    return opt;
  }).join('');
}

export const words = (tokens) => tokens.filter((t) => typeof t !== 'string');

export function transliterate(text) {
  return render(analyze(text));
}

// Reverse: Georgian letters → Latin in the same "chat" scheme.
const TO_LATIN = {
  ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z', თ: 't', ი: 'i', კ: 'k', ლ: 'l',
  მ: 'm', ნ: 'n', ო: 'o', პ: 'p', ჟ: 'zh', რ: 'r', ს: 's', ტ: 't', უ: 'u', ფ: 'f', ქ: 'q',
  ღ: 'gh', ყ: 'y', შ: 'sh', ჩ: 'ch', ც: 'c', ძ: 'dz', წ: 'w', ჭ: 'ch', ხ: 'x', ჯ: 'j', ჰ: 'h',
};

export function toLatin(text) {
  return [...text].map((c) => TO_LATIN[c] ?? c).join('');
}
