// Translation via free, keyless APIs (both allow CORS):
//   Google Translate: the unofficial client=gtx endpoint, primary;
//   MyMemory: fallback (~5000 chars/day per IP) when Google fails.
//
// If a word missing from the dictionary comes back from Georgian merely transcribed
// ("Сакартвело" instead of "Грузия"), transliteration picked the wrong variant,
// so we retry with the next variants of such words.

import { render, words } from './translit.js';

const LIMITS = { google: 1800, mymemory: 450 };
const MAX_RETRIES = 2;
const GOOGLE_COOLDOWN = 60_000;

let googleDownUntil = 0;
const cache = new Map();

async function google(text, from, to, signal) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=`
    + encodeURIComponent(text);
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Google: HTTP ${res.status}`);
  const data = await res.json();
  return data[0].map((part) => part[0]).join('');
}

async function mymemory(text, from, to, signal) {
  const url = `https://api.mymemory.translated.net/get?langpair=${from}|${to}&q=` + encodeURIComponent(text);
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`MyMemory: HTTP ${res.status}`);
  const data = await res.json();
  if (data.quotaFinished) throw new Error('MyMemory: daily quota exceeded');
  if (data.responseStatus !== 200) throw new Error(`MyMemory: ${data.responseDetails || data.responseStatus}`);
  return data.responseData.translatedText;
}

// Split by lines, long lines by sentences, to fit the request size limit.
function chunks(text, limit) {
  const out = [];
  let cur = '';
  const push = (piece) => {
    if (cur && cur.length + piece.length > limit) { out.push(cur); cur = ''; }
    cur += piece;
  };
  for (const line of text.split(/(?<=\n)/)) {
    if (line.length <= limit) { push(line); continue; }
    for (const s of line.match(/[^.!?…]+[.!?…]*\s*/g) ?? [line]) {
      for (let i = 0; i < s.length; i += limit) push(s.slice(i, i + limit));
    }
  }
  if (cur) out.push(cur);
  return out;
}

async function translateWith(fn, provider, text, from, to, signal) {
  const parts = [];
  for (const chunk of chunks(text, LIMITS[provider])) {
    if (!chunk.trim()) { parts.push(chunk); continue; }
    const lead = chunk.match(/^\s*/)[0];
    const trail = chunk.match(/\s*$/)[0];
    parts.push(lead + (await fn(chunk.trim(), from, to, signal)) + trail);
  }
  return parts.join('');
}

// Which service produced the last result ('google', 'mymemory' or 'cache'), for anonymous stats.
export let lastProvider = null;

export async function translateText(text, from, to, signal) {
  const key = `${from}|${to}|${text}`;
  if (cache.has(key)) { lastProvider = 'cache'; return cache.get(key); }
  let result;
  if (Date.now() >= googleDownUntil) {
    try {
      result = await translateWith(google, 'google', text, from, to, signal);
      lastProvider = 'google';
    } catch (err) {
      if (signal?.aborted) throw err;
      googleDownUntil = Date.now() + GOOGLE_COOLDOWN;
    }
  }
  if (result === undefined) {
    result = await translateWith(mymemory, 'mymemory', text, from, to, signal);
    lastProvider = 'mymemory';
  }
  cache.set(key, result);
  return result;
}

// --- Checking that the translation makes sense ---

// Rough phonetic key to compare a Georgian word with its Cyrillic or Latin
// transcription in the translation.
const KA_KEY = {
  ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z', თ: 't', ი: 'i', კ: 'k', ლ: 'l',
  მ: 'm', ნ: 'n', ო: 'o', პ: 'p', ჟ: 'zh', რ: 'r', ს: 's', ტ: 't', უ: 'u', ფ: 'p', ქ: 'k',
  ღ: 'g', ყ: 'k', შ: 'sh', ჩ: 'ch', ც: 'ts', ძ: 'dz', წ: 'ts', ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h',
};
const CYR_KEY = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'p',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'iu', я: 'ia',
};
const kaKey = (w) => [...w].map((c) => KA_KEY[c] ?? c).join('');
const outKey = (w) => [...w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')]
  .map((c) => CYR_KEY[c] ?? c).join('')
  .replace(/ph|f/g, 'p').replace(/th/g, 't').replace(/q/g, 'k').replace(/x/g, 'kh').replace(/c(?!h)/g, 'ts');

// The word is untranslated if the output contains it or its transcription.
function isUntranslated(geo, output, outKeys) {
  if (output.includes(geo)) return true;
  const k = kaKey(geo);
  if (k.length < 3) return false;
  const stem = k.slice(0, Math.max(3, k.length - 2));
  return outKeys.some((w) => w.startsWith(stem));
}

function suspicious(tokens, choice, output) {
  const outKeys = (output.match(/\p{L}+/gu) ?? []).map(outKey);
  const out = [];
  words(tokens).forEach((w, i) => {
    if (w.known && (choice[i] ?? 0) === 0) return;
    const geo = w.options[Math.min(choice[i] ?? 0, w.options.length - 1)];
    if (isUntranslated(geo, output, outKeys)) out.push(i);
  });
  return out;
}

// Translates parsed Latin text into `to`; returns { georgian, translation }.
// onUpdate receives the best result so far after each improving attempt.
export async function translateTokens(tokens, to, signal, onUpdate) {
  const choice = [];
  let best = null;
  let retries = 0;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const georgian = render(tokens, choice);
    const translation = await translateText(georgian, 'ka', to, signal);
    const bad = suspicious(tokens, choice, translation);
    if (!best || bad.length < best.bad) {
      best = { georgian, translation, bad: bad.length };
      onUpdate?.(best);
    }
    const retry = bad.filter((i) => (choice[i] ?? 0) + 1 < words(tokens)[i].options.length);
    if (!retry.length) break;
    for (const i of retry) choice[i] = (choice[i] ?? 0) + 1;
    retries++;
  }
  return { ...best, retries };
}
