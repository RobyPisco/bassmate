/* =========================================================================
   GRIDS — manici vuoti stampabili per scrivere esercizi (per insegnanti).
   Genera N manici vuoti (corde/tasti scelti) con un titolo editabile,
   poi si stampa via PDF nativo (print.css, body[data-print="grids"]).
   ========================================================================= */
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { TUNINGS, MARKERS } from '../core/theory.js';

const STR_LABELS = {
  4: TUNINGS['std-4'].labels,
  5: TUNINGS['std-5'].labels,
  6: TUNINGS['std-6'].labels,
};

let host;
const cfg = { count: 2, strings: 4, frets: 12 };

export function buildGrids(sectionEl) {
  host = sectionEl;
  host.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="head-eyebrow" data-i18n="grids">Griglie</div>
      <h2 style="font-size:clamp(22px,3vw,30px)">${state.lang === 'it' ? 'Manici vuoti da stampare' : 'Printable blank necks'}</h2>
      <p class="muted" style="font-size:13px" data-i18n="grids_sub">Per scrivere scale, esercizi e compiti a mano.</p>
    </div>

    <div class="card card-pad grids-toolbar">
      <div class="row" style="gap:18px;flex-wrap:wrap;align-items:flex-end">
        <div class="tp-group">
          <span class="row-label" data-i18n="grids_count">Numero manici</span>
          <input type="number" id="gCount" class="num-sm" min="1" max="12" value="${cfg.count}">
        </div>
        <div class="tp-group">
          <span class="row-label" data-i18n="grids_strings">Corde</span>
          <div class="seg" id="gStrings">
            <button data-v="4">4</button><button data-v="5">5</button><button data-v="6">6</button>
          </div>
        </div>
        <div class="tp-group">
          <span class="row-label" data-i18n="grids_frets">Tasti</span>
          <input type="number" id="gFrets" class="num-sm" min="5" max="17" value="${cfg.frets}">
        </div>
        <button class="pill on" id="gPrint">🖨 <span data-i18n="export_pdf">PDF</span></button>
      </div>
    </div>

    <div id="gPreview"></div>
  `;
  bind();
  syncSeg();
  render();
  document.querySelectorAll('#grids [data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
}

function syncSeg() {
  host.querySelectorAll('#gStrings button').forEach(b => b.classList.toggle('on', +b.dataset.v === cfg.strings));
}

function bind() {
  host.querySelector('#gCount').addEventListener('change', e => { cfg.count = clamp(+e.target.value, 1, 12); e.target.value = cfg.count; render(); });
  host.querySelector('#gFrets').addEventListener('change', e => { cfg.frets = clamp(+e.target.value, 5, 17); e.target.value = cfg.frets; render(); });
  host.querySelector('#gStrings').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    cfg.strings = +b.dataset.v; syncSeg(); render();
  });
  host.querySelector('#gPrint').addEventListener('click', () => { document.body.dataset.print = 'grids'; window.print(); });
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v || lo)); }

function render() {
  const prev = host.querySelector('#gPreview');
  prev.innerHTML = '';
  for (let i = 0; i < cfg.count; i++) prev.appendChild(neck(cfg.strings, cfg.frets, i));
}

function neck(strings, frets, idx) {
  const labels = STR_LABELS[strings];
  const wrap = document.createElement('div');
  wrap.className = 'gneck';

  const title = document.createElement('input');
  title.className = 'gneck-title';
  title.type = 'text';
  title.placeholder = (state.lang === 'it' ? 'Titolo esercizio…' : 'Exercise title…');
  wrap.appendChild(title);

  const fb = document.createElement('div');
  fb.className = 'fb gneck-fb';
  fb.style.setProperty('--nfrets', frets);

  const fnums = document.createElement('div');
  fnums.className = 'fb-fnums';
  fnums.appendChild(cell('fb-fnum fb-open-col', ''));
  for (let f = 1; f <= frets; f++) fnums.appendChild(cell('fb-fnum' + (MARKERS.includes(f) ? ' is-marker' : ''), String(f)));
  fb.appendChild(fnums);

  const grid = document.createElement('div');
  grid.className = 'fb-grid';
  for (let s = 0; s < strings; s++) {
    const row = document.createElement('div');
    row.className = 'fb-row';
    row.appendChild(cell('fb-cell fb-open-col gneck-str', labels[s] || ''));
    for (let f = 1; f <= frets; f++) row.appendChild(cell('fb-cell' + (MARKERS.includes(f) ? ' is-marker' : ''), ''));
    grid.appendChild(row);
  }
  fb.appendChild(grid);
  wrap.appendChild(fb);
  return wrap;
}

function cell(cls, txt) { const d = document.createElement('div'); d.className = cls; d.textContent = txt; return d; }
