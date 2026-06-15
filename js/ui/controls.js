/* =========================================================================
   STUDIO UI — sidebar + head + pannelli teoria (layout "mockup").
   Data-driven da theory.js: estendere scale/generi/accordature non richiede
   modifiche qui. La root è condivisa con la sezione Accordi.
   ========================================================================= */
import { state, set } from '../core/state.js';
import { t } from '../core/i18n.js';
import {
  SCALES, SCALE_GROUPS, GENRES, TUNINGS, NOTES_EN, NOTES_IT,
  scaleNotes, intervalFormula, getNoteName, scaleField, harmonize,
} from '../core/theory.js';

let sidebar, head, harmPanel, formulaPanel, sharePanel;

export function buildStudio() {
  sidebar = document.getElementById('sidebar');
  head = document.getElementById('studioHead');
  harmPanel = document.getElementById('harmPanel');
  formulaPanel = document.getElementById('formulaPanel');
  sharePanel = document.getElementById('sharePanel');
  buildSidebar();
  buildHead();
  bindSidebar();
  bindHead();
  refreshStudio();
}

/* ---------------- SIDEBAR ---------------- */
function buildSidebar() {
  sidebar.innerHTML = `
    <div class="sb-block">
      <div class="sb-title" data-i18n="genre">Genere</div>
      <div class="sb-genres" id="sbGenre"></div>
    </div>
    <div class="sb-block">
      <div class="sb-title" data-i18n="root_note">Nota radice</div>
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
  for (const [k, g] of Object.entries(GENRES)) html += mk(k, `${g.emoji} ${g[state.lang] || g.en}`, state.genre === k);
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
        <span class="row-label" data-i18n="show">Mostra</span>
        <div class="seg" id="labelSeg">
          <button data-v="deg" data-i18n="degrees">Gradi</button>
          <button data-v="note" data-i18n="notes_short">Note</button>
          <button data-v="solfege" data-i18n="solfege_short">Solf.</button>
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
      <button class="pill" id="shareBtn">↗ <span data-i18n="share">Condividi</span></button>
      <button class="pill" id="pdfBtn">🖨 <span data-i18n="export_pdf">PDF</span></button>
    </div>
  `;
}

/* ---------------- EVENTI ---------------- */
function bindSidebar() {
  sidebar.querySelector('#sbGenre').addEventListener('click', e => {
    const b = e.target.closest('[data-genre]'); if (!b) return;
    set({ genre: b.dataset.genre || null }); fillScales(); fillGenres();
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
  return `bassmate.it/?r=${rootName}&s=${state.scale}`;
}
function renderShare() {
  sharePanel.innerHTML = `
    <div class="panel-title" data-i18n="share">Condividi</div>
    <div class="share-box"><code id="shareUrl">${shareUrl()}</code><button class="pill" id="shareCopy">⧉</button></div>`;
  sharePanel.querySelector('#shareCopy').addEventListener('click', copyShare);
}
function copyShare() {
  const url = 'https://' + shareUrl();
  navigator.clipboard?.writeText(url).catch(() => {});
}
