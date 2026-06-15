/* =========================================================================
   FRETBOARD — rendering del manico (la funzione "al top").
   Disegna corde/tasti, evidenzia root (glow accento) e note di scala,
   etichette commutabili (gradi/note/solfeggio/dita), vista Box, mancino.
   Click su una nota = suono. Logica derivata da render/renderFretboard v1.
   ========================================================================= */
import { state } from '../core/state.js';
import {
  SCALES, TUNINGS, FRETS, BOX, MARKERS, DOUBLE_MARKS,
  scaleNotes, getDeg, getNoteName,
} from '../core/theory.js';
import { playNote } from '../audio/synth.js';

function dotLabel(noteIndex, fret, scaleDeg) {
  if (state.label === 'finger') {
    if (fret === 0) return '0';
    if (state.view === 'box') return String(Math.min(4, Math.max(1, fret - state.boxStart + 1)));
    return String(((fret - 1) % 4) + 1);
  }
  if (state.label === 'note' || state.label === 'solfege') return getNoteName(noteIndex, state.label);
  return scaleDeg; // gradi
}

export function renderFretboard(container) {
  const tuning = TUNINGS[state.tuning];
  const sn = scaleNotes(state.root, state.scale);
  const boxOn = state.view === 'box';
  const lo = state.boxStart, hi = state.boxStart + BOX - 1;

  const fb = document.createElement('div');
  fb.className = 'fb' + (state.hand === 'left' ? ' fb-left' : '');
  fb.dataset.strings = tuning.strings;
  fb.style.setProperty('--nfrets', FRETS);

  // riga numeri tasto
  const fnums = document.createElement('div');
  fnums.className = 'fb-fnums';
  fnums.appendChild(cell('fb-fnum fb-open-col', '')); // sopra il capotasto
  for (let f = 1; f <= FRETS; f++) {
    const inMarker = MARKERS.includes(f);
    const c = cell('fb-fnum' + (inMarker ? ' is-marker' : ''), String(f));
    fnums.appendChild(c);
  }
  fb.appendChild(fnums);

  const grid = document.createElement('div');
  grid.className = 'fb-grid';

  tuning.notes.forEach((openPc, si) => {
    const row = document.createElement('div');
    row.className = 'fb-row';

    for (let f = 0; f <= FRETS; f++) {
      const pc = (openPc + f) % 12;
      const midi = tuning.midiBase[si] + f;
      const inScale = sn.includes(pc);
      const inBox = !boxOn || (f >= lo && f <= hi) || f === 0;

      const c = document.createElement('div');
      c.className = 'fb-cell'
        + (f === 0 ? ' fb-open-col' : '')
        + (MARKERS.includes(f) ? ' is-marker' : '')
        + (DOUBLE_MARKS.has(f) ? ' is-dmarker' : '')
        + (boxOn && f >= lo && f <= hi ? ' in-box' : '');

      if (inScale && inBox) {
        const deg = getDeg(pc, state.root, state.scale);
        const isRoot = pc === +state.root;
        const dot = document.createElement('button');
        dot.className = 'dot' + (isRoot ? ' is-root' : '');
        dot.type = 'button';
        dot.textContent = dotLabel(pc, f, deg);
        dot.setAttribute('aria-label', getNoteName(pc, 'note') + (isRoot ? ' (root)' : ''));
        dot.addEventListener('click', () => {
          playNote(midi);
          dot.classList.remove('pulse'); void dot.offsetWidth; dot.classList.add('pulse');
        });
        c.appendChild(dot);
      }
      row.appendChild(c);
    }
    grid.appendChild(row);
  });

  fb.appendChild(grid);
  container.replaceChildren(fb);
}

function cell(cls, text) {
  const el = document.createElement('div');
  el.className = cls;
  el.textContent = text;
  return el;
}
