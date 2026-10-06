/* =========================================================================
   STUDIO UI — sidebar + head + pannelli teoria (layout "mockup").
   Data-driven da theory.js: estendere scale/generi/accordature non richiede
   modifiche qui. La root è condivisa con la sezione Accordi.
   ========================================================================= */
import { state, set } from '../core/state.js';
import { t } from '../core/i18n.js';
import { icon } from './icons.js';
import {
  SCALES, SCALE_GROUPS, GENRES, TUNINGS, NOTES_EN, NOTES_IT,
  scaleNotes, intervalFormula, getNoteName, scaleField, harmonize,
} from '../core/theory.js';

let sidebar, head, harmPanel, formulaPanel, sharePanel, filterBar, backdrop;
let sheetBound = false;

export function buildStudio() {
  sidebar = document.getElementById('sidebar');
  head = document.getElementById('studioHead');
  harmPanel = document.getElementById('harmPanel');
  formulaPanel = document.getElementById('formulaPanel');
  sharePanel = document.getElementById('sharePanel');
  filterBar = document.getElementById('filterBar');
  backdrop = document.getElementById('sheetBackdrop');
  buildSidebar();
  buildHead();
  bindSidebar();
  bindHead();
  bindSheet();
  refreshStudio();
}

/* ---------------- SIDEBAR ---------------- */
function buildSidebar() {
  sidebar.innerHTML = `
    <div class="sb-sheet-head">
      <span class="sb-sheet-title" data-i18n="filters">Filtri</span>
      <button class="pill on" id="sheetClose" type="button" data-i18n="done">Fatto</button>
    </div>
    <div class="sb-block">
      <div class="sb-title" data-i18n="genre">Genere</div>
      <div class="sb-genres" id="sbGenre"></div>
    </div>
    <div class="sb-block">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="sb-title" data-i18n="root_note">Nota radice</div>
        <div class="row" style="gap:4px">
          <button class="pill" id="btnTransDn" title="Semitono giù" data-i18n-title="transpose_dn" style="padding:2px 8px;font-size:11px">♭ −1</button>
          <button class="pill" id="btnTransUp" title="Semitono su" data-i18n-title="transpose_up" style="padding:2px 8px;font-size:11px">♯ +1</button>
        </div>
      </div>
      <div class="root-pad" id="sbRoot"></div>
    </div>
    <div class="sb-block">
      <div class="sb-title" data-i18n="scale_chord">Scala / Modo / Arpeggio</div>
      <div class="sg-tabs" id="sbGroups"></div>
      <div id="sbScales"></div>
    </div>
    <div class="sb-block">
      <div class="sb-title" data-i18n="tuning">Accordatura</div>
      <div class="tuning-list" id="sbTunings"></div>
    </div>
  `;
  fillGenres();
  fillRoot();
  fillScales();
  fillTunings();
}

function fillGenres() {
  const el = sidebar.querySelector('#sbGenre');
  const mk = (k, label, on) => `<button class="chip${on ? ' on' : ''}" data-genre="${k}">${label}</button>`;
  let html = mk('', t('all_scales'), !state.genre);
  for (const [k, g] of Object.entries(GENRES)) html += mk(k, g[state.lang] || g.en, state.genre === k);
  el.innerHTML = html;
}

function fillRoot() {
  const el = sidebar.querySelector('#sbRoot');
  const names = state.label === 'solfege' ? NOTES_IT : NOTES_EN;
  el.innerHTML = Array.from({ length: 12 }, (_, i) =>
    `<button class="root-key${i === +state.root ? ' on' : ''}" data-root="${i}">${names[i]}</button>`).join('');
}

function fillScales() {
  const tabs = sidebar.querySelector('#sbGroups');
  const list = sidebar.querySelector('#sbScales');
  tabs.innerHTML = ''; list.innerHTML = '';

  if (state.genre) {
    tabs.classList.add('hide');
    const panel = document.createElement('div');
    panel.className = 'sg-panel show';
    GENRES[state.genre].scales.forEach(k => panel.appendChild(scalePill(k)));
    list.appendChild(panel);
    return;
  }
  tabs.classList.remove('hide');
  const active = SCALES[state.scale]?.group || 'base';
  for (const [gk, g] of Object.entries(SCALE_GROUPS)) {
    const tab = document.createElement('button');
    tab.className = 'chip' + (gk === active ? ' on' : '');
    tab.dataset.group = gk;
    tab.textContent = g[state.lang] || g.en;
    tabs.appendChild(tab);
    const panel = document.createElement('div');
    panel.className = 'sg-panel' + (gk === active ? ' show' : '');
    panel.dataset.group = gk;
    Object.keys(SCALES).filter(k => SCALES[k].group === gk).forEach(k => panel.appendChild(scalePill(k)));
    list.appendChild(panel);
  }
}

function scalePill(key) {
  const b = document.createElement('button');
  b.className = 'chip' + (key === state.scale ? ' on' : '');
  b.dataset.scale = key;
  b.textContent = scaleField(key, 'short', state.lang);
  b.title = scaleField(key, 'name', state.lang);
  return b;
}

function fillTunings() {
  const el = sidebar.querySelector('#sbTunings');
  el.innerHTML = Object.entries(TUNINGS).map(([k, tn]) =>
    `<button class="tuning-row${k === state.tuning ? ' on' : ''}" data-tuning="${k}">
       <span class="tn-name">${tn[state.lang] || tn.en}</span>
       <span class="tn-notes">${tn.labels.join(' ')}</span>
     </button>`).join('');
}

/* ---------------- HEAD ---------------- */
function buildHead() {
  head.innerHTML = `
    <div class="head-left">
      <div class="head-eyebrow" data-i18n="selected_scale">Scala selezionata</div>
      <div class="info" id="info"></div>
    </div>
    <div class="head-right">
      <div class="head-opt">
        <span class="row-label" data-i18n="view">Vista</span>
        <div class="seg" id="viewSeg">
          <button data-v="full" data-i18n="all">Tutto</button>
          <button data-v="box" data-i18n="box">Box 5 tasti</button>
        </div>
      </div>
      <div class="head-opt">
        <span class="row-label" data-i18n="show">Mostra</span>
        <div class="seg" id="labelSeg">
          <button data-v="deg" data-i18n="degrees">Gradi</button>
          <button data-v="note" data-i18n="notes_short">Note</button>
          <button data-v="solfege" data-i18n="solfege_short">Solf.</button>
          <button data-v="finger" data-i18n="fingers_short">Dita</button>
        </div>
      </div>
      <div class="head-opt">
        <span class="row-label" data-i18n="hand">Mano</span>
        <div class="seg" id="handSeg">
          <button data-v="right" data-i18n="right">Destro</button>
          <button data-v="left" data-i18n="lefty">Mancino</button>
        </div>
      </div>
      <button class="pill on" id="playBtn">▶ <span data-i18n="listen">Ascolta</span></button>
      <button class="pill" id="shareBtn">${icon('share', 15)} <span data-i18n="share">Condividi</span></button>
      <button class="pill" id="pdfBtn">${icon('print', 15)} <span data-i18n="export_pdf">PDF</span></button>
    </div>
  `;
}

/* ---------------- PANNELLO FILTRI (mobile) ---------------- */
function sheetOpen() { return document.body.classList.contains('sheet-open'); }
function setSheet(open) {
  document.body.classList.toggle('sheet-open', open);
  backdrop.hidden = !open;
  filterBar.setAttribute('aria-expanded', String(open));
  if (open) sidebar.querySelector('#sheetClose')?.focus();
  else if (document.activeElement && sidebar.contains(document.activeElement)) filterBar.focus();
}
function bindSheet() {
  sidebar.querySelector('#sheetClose').addEventListener('click', () => setSheet(false));
  if (sheetBound) return;       // gli elementi statici si collegano una volta sola
  sheetBound = true;
  filterBar.addEventListener('click', () => setSheet(!sheetOpen()));
  backdrop.addEventListener('click', () => setSheet(false));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetOpen()) setSheet(false); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setSheet(false); });
}
function renderSummary() {
  if (!filterBar) return;
  const useSolf = state.label === 'solfege';
  const root = getNoteName(+state.root, useSolf ? 'solfege' : 'note');
  const tn = TUNINGS[state.tuning];
  const parts = [root, scaleField(state.scale, 'name', state.lang), tn ? (tn[state.lang] || tn.en) : ''];
  filterBar.innerHTML = `
    <span class="mf-sum">${parts.filter(Boolean).join(' · ')}</span>
    <span class="mf-act">${icon('filters', 18)}<span>${t('filters')}</span></span>`;
}

/* ---------------- EVENTI ---------------- */
function bindSidebar() {
  sidebar.querySelector('#sbGenre').addEventListener('click', e => {
    const b = e.target.closest('[data-genre]'); if (!b) return;
    set({ genre: b.dataset.genre || null }); fillScales(); fillGenres();
  });
  sidebar.querySelector('#btnTransDn')?.addEventListener('click', () => {
    set({ root: (+state.root + 11) % 12 });
  });
  sidebar.querySelector('#btnTransUp')?.addEventListener('click', () => {
    set({ root: (+state.root + 1) % 12 });
  });
  sidebar.querySelector('#sbRoot').addEventListener('click', e => {
    const b = e.target.closest('[data-root]'); if (!b) return;
    set({ root: +b.dataset.root });
  });
  sidebar.querySelector('#sbGroups').addEventListener('click', e => {
    const b = e.target.closest('[data-group]'); if (!b) return;
    sidebar.querySelectorAll('#sbGroups .chip').forEach(c => c.classList.toggle('on', c === b));
    sidebar.querySelectorAll('#sbScales .sg-panel').forEach(p => p.classList.toggle('show', p.dataset.group === b.dataset.group));
  });
  sidebar.querySelector('#sbScales').addEventListener('click', e => {
    const b = e.target.closest('[data-scale]'); if (!b) return;
    set({ scale: b.dataset.scale });
  });
  sidebar.querySelector('#sbTunings').addEventListener('click', e => {
    const b = e.target.closest('[data-tuning]'); if (!b) return;
    set({ tuning: b.dataset.tuning, boxStart: 0 });
  });
}

function bindHead() {
  head.querySelector('#viewSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    set({ view: b.dataset.v });
  });
  head.querySelector('#labelSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    set({ label: b.dataset.v }); fillRoot();
  });
  head.querySelector('#handSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    set({ hand: b.dataset.v });
  });
  head.querySelector('#playBtn').addEventListener('click', () => window.dispatchEvent(new Event('bm:play-scale')));
  head.querySelector('#shareBtn').addEventListener('click', copyShare);
  head.querySelector('#pdfBtn').addEventListener('click', () => { document.body.dataset.print = 'scale'; window.print(); });
}

if (!window.__bmAfterPrint) {
  window.__bmAfterPrint = true;
  window.addEventListener('afterprint', () => { delete document.body.dataset.print; });
}

/* ---------------- REFRESH ---------------- */
export function refreshStudio() {
  if (!head) return;
  renderInfo();
  renderHarmonization();
  renderFormula();
  renderShare();
  renderSummary();
  syncActive();
  // applica i18n agli elementi appena creati
  document.querySelectorAll('#studio [data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
}

export function syncActive() {
  if (!sidebar) return;
  sidebar.querySelectorAll('[data-root]').forEach(b => b.classList.toggle('on', +b.dataset.root === +state.root));
  sidebar.querySelectorAll('[data-scale]').forEach(b => b.classList.toggle('on', b.dataset.scale === state.scale));
  sidebar.querySelectorAll('[data-genre]').forEach(b => b.classList.toggle('on', (b.dataset.genre || null) === state.genre));
  sidebar.querySelectorAll('[data-tuning]').forEach(b => b.classList.toggle('on', b.dataset.tuning === state.tuning));
  head.querySelectorAll('#viewSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === state.view));
  head.querySelectorAll('#labelSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === state.label));
  head.querySelectorAll('#handSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === state.hand));
}

function renderInfo() {
  const info = head.querySelector('#info');
  const s = SCALES[state.scale];
  const useSolf = state.label === 'solfege';
  const rootName = getNoteName(+state.root, useSolf ? 'solfege' : 'note');
  info.innerHTML = `
    <span class="root-badge">${rootName}</span>
    <span class="title">${scaleField(state.scale, 'name', state.lang)}</span>
    <span class="meta">${s.iv.length} ${t('notes_count')}</span>
    <p class="desc">${scaleField(state.scale, 'desc', state.lang)}</p>
  `;
}

function renderFormula() {
  const s = SCALES[state.scale];
  const useSolf = state.label === 'solfege';
  const notes = scaleNotes(state.root, state.scale)
    .map(pc => getNoteName(pc, useSolf ? 'solfege' : 'note'));
  formulaPanel.innerHTML = `
    <div class="panel-title" data-i18n="formula">Formula</div>
    <div class="formula-deg">${s.dg.map(d => `<span>${d}</span>`).join('<i>·</i>')}</div>
    <div class="formula-notes">${notes.join(' · ')}</div>
    <div class="formula-int muted">${intervalFormula(s.iv)}</div>
  `;
}

function renderHarmonization() {
  const chords = harmonize(state.root, state.scale);
  if (!chords) {
    harmPanel.innerHTML = `<div class="panel-title" data-i18n="harmonization">Armonizzazione</div>
      <div class="muted" style="font-size:13px">${t('harm_na')}</div>`;
    return;
  }
  harmPanel.innerHTML = `
    <div class="panel-title" data-i18n="harmonization">Armonizzazione</div>
    <div class="harm-row">
      ${chords.map(c => `<button class="harm-cell q-${c.quality}" data-root="${c.rootPc}">
          <span class="harm-roman">${c.roman}</span>
          <span class="harm-name">${c.name}</span>
        </button>`).join('')}
    </div>`;
  harmPanel.querySelector('.harm-row').addEventListener('click', e => {
    const b = e.target.closest('[data-root]'); if (!b) return;
    set({ root: +b.dataset.root });   // clic su un grado = nuova root
  });
}

function shareUrl() {
  const rootName = NOTES_EN[+state.root].replace('#', 's');
  let q = `?r=${rootName}&s=${state.scale}`;
  if (state.view === 'box') q += `&v=box&pos=${state.boxStart}`;
  if (state.label !== 'deg') q += `&l=${state.label}`;
  if (state.tuning !== 'std-4') q += `&t=${state.tuning}`;
  if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
    return `${window.location.origin}${window.location.pathname}${q}`;
  }
  return `https://bassmate.it/${q}`;
}
function renderShare() {
  const url = shareUrl();
  sharePanel.innerHTML = `
    <div class="panel-title" data-i18n="share">Condividi</div>
    <div class="share-box"><code id="shareUrl">${url}</code><button class="pill" id="shareCopy" title="Copia link">⧉</button></div>`;
  sharePanel.querySelector('#shareCopy').addEventListener('click', copyShare);
}
function copyShare() {
  const url = shareUrl();
  const copyFn = () => {
    const btn = head.querySelector('#shareBtn span') || head.querySelector('#shareBtn');
    const copyBtn = sharePanel.querySelector('#shareCopy');
    if (btn) {
      const old = btn.textContent;
      btn.textContent = state.lang === 'it' ? 'Copiato!' : 'Copied!';
      setTimeout(() => { btn.textContent = old; }, 1800);
    }
    if (copyBtn) {
      copyBtn.textContent = '✓';
      setTimeout(() => { copyBtn.textContent = '⧉'; }, 1800);
    }
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(copyFn).catch(() => {});
  }
}
