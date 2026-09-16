/* =========================================================================
   TRANSPORT — barra metronomo integrata nello Studio (stile mockup).
   Play, BPM ±/slider, pallini battito, tempo (numeratore), suddivisione.
   ========================================================================= */
import { t } from '../core/i18n.js';
import { metro, toggleMetro, stopMetro, setBpm, setBeats, setSubdivision } from '../audio/metronome.js';

const SIGS = [3, 4, 6, 7];                 // numeratori battuta
const SUBS = [{ v: 1, s: '1' }, { v: 2, s: '2' }, { v: 3, s: '3' }, { v: 4, s: '4' }];

let host;

export function buildTransport() {
  host = document.getElementById('transport');
  host.innerHTML = `
    <button class="tp-play" id="tpPlay" aria-label="Play/Stop">▶</button>
    <div class="tp-bpm">
      <button class="tp-step" id="tpDn">−</button>
      <div class="tp-bpm-val"><span id="tpBpm">${metro.bpm}</span><small data-i18n="bpm">BPM</small></div>
      <button class="tp-step" id="tpUp">+</button>
    </div>
    <input type="range" class="tp-slider" id="tpSlider" min="30" max="300" value="${metro.bpm}">
    <div class="tp-beats" id="tpBeats"></div>
    <div class="tp-group">
      <span class="row-label" data-i18n="tempo">Tempo</span>
      <div class="seg" id="tpSig">${SIGS.map(n => `<button data-v="${n}"${n === metro.beats ? ' class="on"' : ''}>${n}/4</button>`).join('')}</div>
    </div>
    <div class="tp-group">
      <span class="row-label" data-i18n="subdivision">Suddivisione</span>
      <div class="seg" id="tpSub">${SUBS.map(s => `<button data-v="${s.v}"${s.v === metro.subdivision ? ' class="on"' : ''}>${s.s}</button>`).join('')}</div>
    </div>
  `;
  buildBeats();
  bind();
  const p = host.querySelector('#tpPlay');
  if (p) {
    p.textContent = metro.running ? '❚❚' : '▶';
    p.classList.toggle('on', metro.running);
  }
  document.querySelectorAll('#transport [data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
}

function buildBeats() {
  const el = host.querySelector('#tpBeats');
  el.innerHTML = Array.from({ length: metro.beats }, (_, i) => `<span class="tp-dot" data-b="${i}"></span>`).join('');
}

function bind() {
  host.querySelector('#tpPlay').addEventListener('click', () => toggleMetro());
  host.querySelector('#tpDn').addEventListener('click', () => bump(-1));
  host.querySelector('#tpUp').addEventListener('click', () => bump(+1));
  host.querySelector('#tpSlider').addEventListener('input', e => { setBpm(+e.target.value); syncBpm(); });
  host.querySelector('#tpSig').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    setBeats(+b.dataset.v);
  });
  host.querySelector('#tpSub').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    setSubdivision(+b.dataset.v);
  });
}

/* Listener globali una sola volta: interrogano il DOM per id (resistono ai rebuild).
   Condivisi con la pagina Metro tramite gli eventi del motore. */
if (!window.__bmTransportBound) {
  window.__bmTransportBound = true;
  window.addEventListener('bm:beat', e => {
    document.querySelectorAll('#transport .tp-dot').forEach((d, i) => d.classList.toggle('hit', i === e.detail));
  });
  window.addEventListener('bm:bpm', () => {
    const n = document.getElementById('tpBpm'), s = document.getElementById('tpSlider');
    if (n) n.textContent = metro.bpm; if (s) s.value = metro.bpm;
  });
  window.addEventListener('bm:sig', e => {
    document.querySelectorAll('#transport #tpSig button').forEach(x => x.classList.toggle('on', +x.dataset.v === e.detail));
    const h = document.getElementById('transport');
    if (h) {
      const el = h.querySelector('#tpBeats');
      if (el) el.innerHTML = Array.from({ length: metro.beats }, (_, i) => `<span class="tp-dot" data-b="${i}"></span>`).join('');
    }
  });
  window.addEventListener('bm:sub', e => {
    document.querySelectorAll('#transport #tpSub button').forEach(x => x.classList.toggle('on', +x.dataset.v === e.detail));
  });
  window.addEventListener('bm:run', e => {
    const p = document.getElementById('tpPlay'); if (!p) return;
    p.textContent = e.detail ? '❚❚' : '▶';
    p.classList.toggle('on', e.detail);
  });
}

function bump(d) { setBpm(metro.bpm + d); syncBpm(); }
function syncBpm() {
  host.querySelector('#tpBpm').textContent = metro.bpm;
  host.querySelector('#tpSlider').value = metro.bpm;
}

export function stopTransport() {
  stopMetro();
  if (host) { const p = host.querySelector('#tpPlay'); if (p) { p.textContent = '▶'; p.classList.remove('on'); } }
}
