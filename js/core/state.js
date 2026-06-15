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

const sysLang = navigator.language.slice(0, 2) === 'it' ? 'it' : 'en';

export const state = {
  // strumento (core)
  tuning: load('tuning', 'std-4'),
  root: 0,
  scale: 'minPenta',
  label: load('label', 'deg'),      // deg | note | solfege | finger
  view: load('view', 'full'),       // full | box
  hand: load('hand', 'right'),      // right | left
  boxStart: 0,
  genre: null,                      // genere selezionato (vista "manuale"), o null
  // app
  lang: load('lang', sysLang),      // it | en
  audio: load('audio', true),
  theme: load('theme', 'auto'),     // auto | dark | light
  mode: load('mode', 'simple'),     // simple | advanced
  activeView: 'studio',             // studio | chords | metro | tuner | quiz | tab
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
