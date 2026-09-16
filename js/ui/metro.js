/* =========================================================================
   METRO — pagina metronomo dedicata. Condivide il motore (oggetto `metro`)
   con la barra transport dello Studio: stesso BPM/groove/stato.
   Modalità Semplice: BPM, tap, play, tempo, suddivisione, groove.
   Avanzata: batteria, speed trainer, volume.
   ========================================================================= */
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { metro, GROOVES, toggleMetro, setBpm, tap, bpmTerm, setBeats, setSubdivision, setGroove } from '../audio/metronome.js';

const SIGS = [3, 4, 6, 7];
const SUBS = [{ v: 1, s: '1' }, { v: 2, s: '2' }, { v: 3, s: '3' }, { v: 4, s: '4' }];
let host;

export function buildMetro(sectionEl) {
  host = sectionEl;
  host.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="head-eyebrow" data-i18n="metronome">Metronomo</div>
      <h2 style="font-size:clamp(22px,3vw,30px)">${state.lang === 'it' ? 'Metronomo' : 'Metronome'}</h2>
    </div>

    <div class="card card-pad metro-card">
      <div class="metro-hero">
        <button class="tp-step" id="mDn">−</button>
        <div class="metro-bpm-disp">
          <span id="mBpm">${metro.bpm}</span>
          <small data-i18n="bpm">BPM</small>
          <div class="metro-term" id="mTerm">${bpmTerm(metro.bpm)}</div>
        </div>
        <button class="tp-step" id="mUp">+</button>
      </div>

      <div class="metro-ctrl-row">
        <button class="pill" id="mTap">TAP</button>
        <button class="tp-play" id="mPlay">▶</button>
      </div>

      <input type="range" class="tp-slider" id="mSlider" min="30" max="300" value="${metro.bpm}">
      <div class="tp-beats metro-dots" id="mBeats"></div>

      <div class="metro-opts">
        <div class="tp-group">
          <span class="row-label" data-i18n="tempo">Tempo</span>
          <div class="seg" id="mSig">${SIGS.map(n => `<button data-v="${n}"${n === metro.beats ? ' class="on"' : ''}>${n}/4</button>`).join('')}</div>
        </div>
        <div class="tp-group">
          <span class="row-label" data-i18n="subdivision">Suddivisione</span>
          <div class="seg" id="mSub">${SUBS.map(s => `<button data-v="${s.v}"${s.v === metro.subdivision ? ' class="on"' : ''}>${s.s}</button>`).join('')}</div>
        </div>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:14px">
      <div class="panel-title" data-i18n="groove">Groove</div>
      <div class="metro-grooves" id="mGroove"></div>
    </div>

    <div class="card card-pad adv-only" style="margin-top:14px">
      <div class="panel-title" data-i18n="advanced_opts">Opzioni avanzate</div>
      <div class="metro-adv">
        <div class="adv-item">
          <label class="adv-toggle"><input type="checkbox" id="mDrums"${metro.drumsEnabled ? ' checked' : ''}> 🥁 <span data-i18n="drums">Batteria</span></label>
          <input type="range" id="mDrumVol" min="0" max="100" value="${Math.round(metro.drumVolume * 100)}" class="tp-slider">
        </div>
        <div class="adv-item">
          <label class="adv-toggle"><input type="checkbox" id="mTrainer"${metro.autoIncr ? ' checked' : ''}> 📈 <span data-i18n="speed_trainer">Speed trainer</span></label>
          <div class="row">
            <span class="muted" style="font-size:12px">+</span>
            <input type="number" id="mIncrBpm" min="1" max="20" value="${metro.incrBpm}" class="num-sm">
            <span class="muted" style="font-size:12px" data-i18n="bpm_every">BPM ogni</span>
            <input type="number" id="mIncrInt" min="1" max="64" value="${metro.incrInterval}" class="num-sm">
            <span class="muted" style="font-size:12px" data-i18n="beats_unit">battiti</span>
          </div>
        </div>
        <div class="adv-item">
          <span class="row-label" data-i18n="volume">Volume</span>
          <input type="range" id="mVol" min="0" max="100" value="${Math.round(metro.volume * 100)}" class="tp-slider">
        </div>
      </div>
    </div>
  `;
  buildBeats();
  buildGrooves();
  bind();
  syncPlay(metro.running);
  document.querySelectorAll('#metro [data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
}

function buildBeats() {
  host.querySelector('#mBeats').innerHTML =
    Array.from({ length: metro.beats }, (_, i) => `<span class="tp-dot${i === 0 ? ' accent' : ''}"></span>`).join('');
}

function buildGrooves() {
  host.querySelector('#mGroove').innerHTML = Object.entries(GROOVES).map(([k, g]) =>
    `<button class="chip${k === metro.groove ? ' on' : ''}" data-groove="${k}">${g.emoji} ${g[state.lang] || g.en}</button>`).join('');
}

function syncBpm() {
  const n = host.querySelector('#mBpm'), s = host.querySelector('#mSlider'), term = host.querySelector('#mTerm');
  if (n) n.textContent = metro.bpm;
  if (s) s.value = metro.bpm;
  if (term) term.textContent = bpmTerm(metro.bpm);
}
function syncPlay(running) {
  const p = host?.querySelector('#mPlay'); if (!p) return;
  p.textContent = running ? '❚❚' : '▶';
  p.classList.toggle('on', running);
}

function bind() {
  host.querySelector('#mDn').addEventListener('click', () => setBpm(metro.bpm - 1));
  host.querySelector('#mUp').addEventListener('click', () => setBpm(metro.bpm + 1));
  host.querySelector('#mSlider').addEventListener('input', e => setBpm(+e.target.value));
  host.querySelector('#mTap').addEventListener('click', tap);
  host.querySelector('#mPlay').addEventListener('click', () => toggleMetro());
  host.querySelector('#mSig').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    setBeats(+b.dataset.v);
  });
  host.querySelector('#mSub').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    setSubdivision(+b.dataset.v);
  });
  host.querySelector('#mGroove').addEventListener('click', e => {
    const b = e.target.closest('[data-groove]'); if (!b) return;
    setGroove(b.dataset.groove);
  });
  host.querySelector('#mDrums').addEventListener('change', e => { metro.drumsEnabled = e.target.checked; });
  host.querySelector('#mDrumVol').addEventListener('input', e => { metro.drumVolume = e.target.value / 100; });
  host.querySelector('#mTrainer').addEventListener('change', e => { metro.autoIncr = e.target.checked; });
  host.querySelector('#mIncrBpm').addEventListener('change', e => { metro.incrBpm = Math.max(1, +e.target.value); });
  host.querySelector('#mIncrInt').addEventListener('change', e => { metro.incrInterval = Math.max(1, +e.target.value); });
  host.querySelector('#mVol').addEventListener('input', e => { metro.volume = e.target.value / 100; });
}

/* eventi globali del motore (una volta sola; interrogano il DOM per id) */
if (!window.__bmMetroBound) {
  window.__bmMetroBound = true;
  window.addEventListener('bm:beat', e => {
    document.querySelectorAll('#metro .tp-dot').forEach((d, i) => d.classList.toggle('hit', i === e.detail));
  });
  window.addEventListener('bm:bpm', () => {
    const n = document.getElementById('mBpm'), s = document.getElementById('mSlider'), term = document.getElementById('mTerm');
    if (n) n.textContent = metro.bpm; if (s) s.value = metro.bpm;
    if (term) term.textContent = bpmTerm(metro.bpm);
  });
  window.addEventListener('bm:sig', e => {
    document.querySelectorAll('#metro #mSig button').forEach(x => x.classList.toggle('on', +x.dataset.v === e.detail));
    const beatsEl = document.querySelector('#metro #mBeats');
    if (beatsEl) beatsEl.innerHTML = Array.from({ length: metro.beats }, (_, i) => `<span class="tp-dot${i === 0 ? ' accent' : ''}"></span>`).join('');
  });
  window.addEventListener('bm:sub', e => {
    document.querySelectorAll('#metro #mSub button').forEach(x => x.classList.toggle('on', +x.dataset.v === e.detail));
  });
  window.addEventListener('bm:groove', e => {
    document.querySelectorAll('#metro #mGroove .chip').forEach(x => x.classList.toggle('on', x.dataset.groove === e.detail));
  });
  window.addEventListener('bm:run', e => {
    const p = document.getElementById('mPlay'); if (!p) return;
    p.textContent = e.detail ? '❚❚' : '▶';
    p.classList.toggle('on', e.detail);
  });
}
