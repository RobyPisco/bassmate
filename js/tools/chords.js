/* =========================================================================
   CHORDS (UI) — sezione libreria accordi integrata nell'app.
   Griglia di diagrammi SVG nel tema corrente, filtri root/tipo, audio.
   ========================================================================= */
import { state, set } from '../core/state.js';
import { t } from '../core/i18n.js';
import { CHORD_NOTES, CHORD_TYPES, CHORD_STR_LABEL, computeDots, chordField } from '../core/chords.js';
import { playSequence } from '../audio/synth.js';

let host;
let selType = 'all';

export function buildChords(sectionEl) {
  host = sectionEl;
  host.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="head-eyebrow" data-i18n="chords_lib">Libreria accordi</div>
      <h2 style="font-size:clamp(22px,3vw,30px)">${state.lang === 'it' ? 'Accordi per Basso' : 'Bass Chords'}</h2>
      <p class="muted" style="font-size:13px" data-i18n="chords_sub">Basso 4 corde · accordatura standard E·A·D·G</p>
    </div>
    <div class="card card-pad" style="margin-bottom:16px">
      <div class="row" style="margin-bottom:10px">
        <span class="row-label" data-i18n="root_note">Nota</span>
        <div class="note-pills" id="chRoot"></div>
      </div>
      <div class="row">
        <span class="row-label" data-i18n="scale_chord">Tipo</span>
        <div class="row" id="chType"></div>
      </div>
    </div>
    <div class="legend" style="margin-bottom:12px">
      <div class="li"><span class="ld" style="background:var(--root-c)"></span>Root</div>
      <div class="li"><span class="ld" style="background:var(--note-c)"></span>Intervallo</div>
      <div class="li"><span class="ld" style="border:2px solid var(--note-c)"></span>Corda vuota</div>
    </div>
    <div class="chord-grid" id="chGrid"></div>
  `;
  buildRoot();
  buildTypes();
  bind();
  renderChords();
}

function buildRoot() {
  const el = host.querySelector('#chRoot');
  el.innerHTML = '';
  CHORD_NOTES.forEach((n, i) => {
    const b = document.createElement('button');
    b.className = 'pill' + (i === +state.root ? ' on' : '');
    b.dataset.root = i; b.textContent = n;
    el.appendChild(b);
  });
}

function buildTypes() {
  const el = host.querySelector('#chType');
  el.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'pill' + (selType === 'all' ? ' on' : '');
  all.dataset.type = 'all'; all.textContent = state.lang === 'it' ? 'Tutti' : 'All';
  el.appendChild(all);
  CHORD_TYPES.forEach(ct => {
    const b = document.createElement('button');
    b.className = 'pill' + (selType === ct.id ? ' on' : '');
    b.dataset.type = ct.id;
    b.textContent = chordField(ct, 'name', state.lang) + (ct.symbol ? ` (${ct.symbol})` : '');
    el.appendChild(b);
  });
}

/** Riallinea root e griglia (es. root cambiata dallo Studio). */
export function refreshChords() {
  if (!host) return;
  buildRoot(); renderChords();
}

function bind() {
  host.querySelector('#chRoot').addEventListener('click', e => {
    const b = e.target.closest('[data-root]'); if (!b) return;
    set({ root: +b.dataset.root });            // condiviso con lo Studio
    buildRoot(); renderChords();
  });
  host.querySelector('#chType').addEventListener('click', e => {
    const b = e.target.closest('[data-type]'); if (!b) return;
    selType = b.dataset.type; buildTypes(); renderChords();
  });
}

export function renderChords() {
  if (!host) return;
  const grid = host.querySelector('#chGrid');
  grid.innerHTML = '';
  const types = selType === 'all' ? CHORD_TYPES : CHORD_TYPES.filter(c => c.id === selType);
  const rootName = CHORD_NOTES[+state.root];

  types.forEach(ct => {
    ct.voicings.forEach(v => {
      const dots = computeDots(v, +state.root);
      if (!dots) return;
      const card = document.createElement('button');
      card.className = 'chord-card';
      card.type = 'button';
      card.innerHTML = `
        <div class="card-name">${rootName}${ct.symbol}</div>
        <div class="card-type">${chordField(ct, 'name', state.lang)}</div>
        <div class="card-pos">${v.label}</div>
        <div class="card-svg">${buildSVG(dots)}</div>
        <div class="card-notes">${dots.map(d => d.noteName).join(' · ')}</div>
      `;
      card.addEventListener('click', () => {
        const midis = dots.slice().sort((a, b) => a.midi - b.midi).map(d => d.midi);
        playSequence(midis, 0.12);
      });
      grid.appendChild(card);
    });
  });
  if (!grid.children.length) grid.innerHTML = `<div class="muted" style="grid-column:1/-1;text-align:center;padding:40px">—</div>`;
}

/* Diagramma accordo (4 corde). Colori dal tema via currentColor + classi. */
function buildSVG(dots) {
  const SX = { 3: 15, 2: 36, 1: 57, 0: 78 };
  const SW = { 3: 3.5, 2: 2.5, 1: 1.8, 0: 1.2 };
  const NUT_Y = 32, FH = 20, NF = 4;
  const fretted = dots.filter(d => d.fret > 0);
  const opened = dots.filter(d => d.fret === 0);
  const aFrets = fretted.map(d => d.fret);
  const minF = aFrets.length ? Math.min(...aFrets) : 1;
  const maxF = aFrets.length ? Math.max(...aFrets) : 1;
  let sf = minF;
  if (maxF - sf >= NF) sf = maxF - NF + 1;
  const showNut = sf === 1;

  let s = `<svg viewBox="-22 0 120 138" xmlns="http://www.w3.org/2000/svg">`;
  for (let si = 0; si <= 3; si++)
    s += `<line x1="${SX[si]}" y1="${NUT_Y}" x2="${SX[si]}" y2="${NUT_Y + NF * FH}" class="cd-str" stroke-width="${SW[si]}"/>`;
  for (let f = 0; f <= NF; f++) {
    const y = NUT_Y + f * FH, isNut = f === 0 && showNut;
    s += `<line x1="${SX[3]}" y1="${y}" x2="${SX[0]}" y2="${y}" class="${isNut ? 'cd-nut' : 'cd-fret'}" stroke-width="${isNut ? 4 : 1}"/>`;
  }
  if (!showNut && aFrets.length)
    s += `<text x="-9" y="${NUT_Y + FH * .65}" text-anchor="middle" class="cd-pos" font-size="11">${sf}fr</text>`;
  for (let si = 0; si <= 3; si++)
    s += `<text x="${SX[si]}" y="${NUT_Y - 18}" text-anchor="middle" class="cd-txt" font-size="8">${CHORD_STR_LABEL[si]}</text>`;
  for (const d of opened)
    s += `<circle class="${d.isRoot ? 'cd-ropen' : 'cd-iopen'}" cx="${SX[d.strIdx]}" cy="${NUT_Y - 8}" r="5"/>`;
  for (const d of fretted) {
    const row = d.fret - sf;
    if (row < 0 || row >= NF) continue;
    const x = SX[d.strIdx], y = NUT_Y + row * FH + FH / 2;
    s += `<circle class="${d.isRoot ? 'cd-rdot' : 'cd-idot'}" cx="${x}" cy="${y}" r="9"/>`;
    s += `<text class="cd-lbl" x="${x}" y="${y + 3.5}" text-anchor="middle">${d.deg}</text>`;
  }
  return s + '</svg>';
}
