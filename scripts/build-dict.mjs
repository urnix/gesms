// Builds dict.bin, a compact frequency list of Georgian word forms (~50 KB)
// that transliteration uses to pick a meaningful variant of each word.
//
// Sources:
//   Leipzig Corpora Collection, kat_newscrawl_2016_300K (CC BY 4.0)
//   hermitdave/FrequencyWords, ka_50k from OpenSubtitles (CC BY-SA 4.0)
//
// Format (before gzip): words are split into frequency tiers (TIERS) separated by a "#" line.
// Within a tier words are sorted and front-coded: a digit says how many leading
// letters to take from the previous word, followed by the rest.
// Letters ა…ჰ (U+10D0…U+10F0) are stored as ASCII a…z, A…G.
//
//   node scripts/build-dict.mjs [word count]   (writes src/dict.bin)

import { mkdtemp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAX = Number(process.argv[2]) || 17000;
const TIERS = [0, 100, 300, 1000, 3000, 8000]; // must match translit.js
const LEIPZIG = 'https://downloads.wortschatz-leipzig.de/corpora/kat_newscrawl_2016_300K.tar.gz';
const SUBTITLES = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/ka/ka_50k.txt';

const GEORGIAN_WORD = /^[ა-ჰ]{2,}$/;
const CODE = 'abcdefghijklmnopqrstuvwxyzABCDEFG';
const encode = (w) => [...w].map((c) => CODE[c.charCodeAt(0) - 0x10D0]).join('');

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}: ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

function frontCode(words) {
  let prev = '';
  return [...words].sort().map((w) => {
    let p = 0;
    while (p < 9 && p < prev.length && p < w.length && prev[p] === w[p]) p++;
    prev = w;
    return p + w.slice(p);
  });
}

const dir = await mkdtemp(join(tmpdir(), 'ka-dict-'));
try {
  const freq = new Map();

  console.log('Leipzig newscrawl…');
  await download(LEIPZIG, join(dir, 'news.tgz'));
  execFileSync('tar', ['xzf', 'news.tgz', '--wildcards', '*-words.txt'], { cwd: dir });
  const sub = (await readdir(dir)).find((d) => d.startsWith('kat_'));
  const wordsFile = (await readdir(join(dir, sub))).find((f) => f.endsWith('-words.txt'));
  for (const line of (await readFile(join(dir, sub, wordsFile), 'utf8')).split('\n')) {
    const [, w, c] = line.split('\t');
    if (w && GEORGIAN_WORD.test(w)) freq.set(w, (freq.get(w) ?? 0) + Number(c));
  }

  // Subtitles add colloquial forms. The list has junk from broken encodings
  // (frequent meaningless two-letter "words"), so only longer words are taken,
  // with a lower weight.
  console.log('OpenSubtitles…');
  await download(SUBTITLES, join(dir, 'subs.txt'));
  for (const line of (await readFile(join(dir, 'subs.txt'), 'utf8')).split('\n')) {
    const [w, c] = line.trim().split(' ');
    if (w && w.length > 2 && GEORGIAN_WORD.test(w)) freq.set(w, (freq.get(w) ?? 0) + Number(c) * 3);
  }

  const words = [...freq].sort((a, b) => b[1] - a[1]).slice(0, MAX).map(([w]) => encode(w));
  const tiers = TIERS.map((start, i) => frontCode(words.slice(start, TIERS[i + 1] ?? words.length)));
  const packed = gzipSync(tiers.map((t) => t.join('\n')).join('\n#\n'), { level: 9 });
  await writeFile(join(ROOT, 'src', 'dict.bin'), packed);
  console.log(`dict.bin: ${words.length} words, ${(packed.length / 1024).toFixed(1)} KB`);
} finally {
  await rm(dir, { recursive: true, force: true });
}
