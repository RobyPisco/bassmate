/* =========================================================================
   STATE — stato centrale con persistenza e pub/sub.
   Sostituisce l'oggetto globale `S` della v1 con un modulo che notifica
   i sottoscrittori a ogni cambio. La UI si limita a leggere e a reagire.
   ========================================================================= */

const LS_PREFIX = 'bm2_';

/* Chiavi che vengono salvate in localStorage (le altre sono effimere). */
const PERSIST = new Set([
  'tuning', 'label', 'view', 'hand', 'lang', 'audio', 'theme', 'mode',
]);

function load(key, fallback) {
  const v = localStorage.getItem(LS_PREFIX + key);
  if (v === null) return fallback;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
}

const NOTE_MAP = {
  'c': 0, 'c#': 1, 'cs': 1, 'db': 1,
  'd': 2, 'd#': 3, 'ds': 3, 'eb': 3,
  'e': 4,
  'f': 5, 'f#': 6, 'fs': 6, 'gb': 6,
  'g': 7, 'g#': 8, 'gs': 8, 'ab': 8,
  'a': 9, 'a#': 10, 'as': 10, 'bb': 10,
  'b': 11,
  'do': 0, 'do#': 1, 'reb': 1,
  're': 2, 're#': 3, 'mib': 3,
  'mi': 4,
  'fa': 5, 'fa#': 6, 'solb': 6,
  'sol': 7, 'sol#': 8, 'lab': 8,
  'la': 9, 'la#': 10, 'sib': 10,
  'si': 11,
};

function parseUrlParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  if (window.location.hash && window.location.hash.length > 1) {
    const hashStr = window.location.hash.replace(/^#\/?/, '');
    if (hashStr.includes('=')) {
      const hashParams = new URLSearchParams(hashStr);
      for (const [k, v] of hashParams.entries()) {
        if (!params.has(k)) params.set(k, v);
      }
    }
  }

  const patch = {};
  const r = params.get('r') ?? params.get('root');
  if (r !== null) {
    const rTrim = r.trim().toLowerCase();
    if (/^\d+$/.test(rTrim)) {
      patch.root = Math.min(11, Math.max(0, parseInt(rTrim, 10)));
    } else if (NOTE_MAP[rTrim] !== undefined) {
      patch.root = NOTE_MAP[rTrim];
    }
  }

  const s = params.get('s') ?? params.get('scale');
  if (s) patch.scale = s;

  const l = params.get('l') ?? params.get('label');
  if (l && ['deg', 'note', 'solfege', 'finger'].includes(l)) patch.label = l;

  const v = params.get('v') ?? params.get('view');
  if (v && ['full', 'box'].includes(v)) patch.view = v;

  const t = params.get('t') ?? params.get('tuning');
  if (t) patch.tuning = t;

  const h = params.get('h') ?? params.get('hand');
  if (h && ['right', 'left'].includes(h)) patch.hand = h;

  const pos = params.get('pos') ?? params.get('box') ?? params.get('b');
  if (pos !== null && /^\d+$/.test(pos)) patch.boxStart = Math.max(0, parseInt(pos, 10));

  const m = params.get('mode');
  if (m && ['simple', 'advanced'].includes(m)) patch.mode = m;

  const tab = params.get('tab') ?? params.get('view_section');
  if (tab && ['studio', 'chords', 'metro', 'groove', 'tuner', 'quiz', 'grids'].includes(tab)) patch.activeView = tab;

  return patch;
}

const urlInit = parseUrlParams();

const sysLang = (typeof navigator !== 'undefined' && navigator.language && navigator.language.slice(0, 2) === 'it') ? 'it' : 'en';

export const state = {
  // strumento (core)
  tuning: urlInit.tuning ?? load('tuning', 'std-4'),
  root: urlInit.root ?? 0,
  scale: urlInit.scale ?? 'minPenta',
  label: urlInit.label ?? load('label', 'deg'),      // deg | note | solfege | finger
  view: urlInit.view ?? load('view', 'full'),       // full | box
  hand: urlInit.hand ?? load('hand', 'right'),      // right | left
  boxStart: urlInit.boxStart ?? 0,
  genre: null,                      // genere selezionato (vista "manuale"), o null
  // app
  lang: load('lang', sysLang),      // it | en
  audio: load('audio', true),
  theme: load('theme', 'auto'),     // auto | dark | light
  mode: urlInit.mode ?? load('mode', 'simple'),     // simple | advanced
  activeView: urlInit.activeView ?? 'studio',       // studio | chords | metro | tuner | quiz | tab
};

const subs = new Set();

/** Sottoscrive ai cambi di stato. Ritorna funzione di unsubscribe. */
export function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

function persist(key) {
  if (PERSIST.has(key)) localStorage.setItem(LS_PREFIX + key, String(state[key]));
}

/** Aggiorna una o più chiavi e notifica i sottoscrittori una sola volta. */
export function set(patch) {
  const changed = [];
  for (const [k, v] of Object.entries(patch)) {
    if (state[k] !== v) { state[k] = v; persist(k); changed.push(k); }
  }
  if (changed.length) subs.forEach(fn => fn(state, changed));
  return changed;
}
