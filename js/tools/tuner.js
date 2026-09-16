/* =========================================================================
   TUNER — Accordatore Cromatico per Basso.
   Microphone-based con pitch detection ad autocorrelazione (Web Audio API).
   Ottimizzato per basse frequenze (fftSize = 4096) + generatori note guida.
   ========================================================================= */
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { getAudioCtx, playNote } from '../audio/synth.js';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const REF_NOTES = [
  { name: 'B0', midi: 23, freq: 30.9, label: 'Si (5/6c)' },
  { name: 'E1', midi: 28, freq: 41.2, label: 'Mi (4c)' },
  { name: 'A1', midi: 33, freq: 55.0, label: 'La (3c)' },
  { name: 'D2', midi: 38, freq: 73.4, label: 'Re (2c)' },
  { name: 'G2', midi: 43, freq: 98.0, label: 'Sol (1c)' },
  { name: 'C3', midi: 48, freq: 130.8, label: 'Do (6c)' },
];

let host = null;
let active = false;
let stream = null;
let analyser = null;
let animId = null;

function autoCorrelate(buf, sampleRate) {
  // Calcolo RMS per rilevare silenzio
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / buf.length);
  if (rms < 0.008) return -1; // Troppo debole

  const SIZE = buf.length;
  const corr = new Float32Array(SIZE);
  for (let lag = 0; lag < SIZE; lag++) {
    let s = 0;
    for (let i = 0; i < SIZE - lag; i++) s += buf[i] * buf[i + lag];
    corr[lag] = s;
  }

  // Trova la prima discesa
  let d = 0;
  while (d < SIZE - 1 && corr[d] > corr[d + 1]) d++;
  let maxVal = -Infinity, maxPos = -1;
  for (let i = d; i < SIZE; i++) {
    if (corr[i] > maxVal) { maxVal = corr[i]; maxPos = i; }
  }
  if (maxPos === -1 || corr[maxPos] < corr[0] * 0.45) return -1;

  // Interpolazione parabolica sub-sample
  const safePos = Math.max(1, Math.min(maxPos, SIZE - 2));
  const x0 = corr[safePos - 1], x1 = corr[safePos], x2 = corr[safePos + 1];
  const shift = (x2 - x0) / (2 * (2 * x1 - x2 - x0)) || 0;
  return sampleRate / (safePos + shift);
}

function freqToNoteInfo(freq) {
  // A4 = 440 Hz
  const semitones = 12 * Math.log2(freq / 440);
  const roundSemi = Math.round(semitones);
  const noteIndex = ((roundSemi % 12) + 12) % 12;
  const noteName = NOTES[noteIndex];
  const cents = Math.round((semitones - roundSemi) * 100);
  const octave = Math.floor((roundSemi + 57) / 12) + 1;
  return { noteName, cents, octave };
}

export function buildTuner(sectionEl) {
  host = sectionEl;
  host.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="head-eyebrow" data-i18n="tuner">Tuner</div>
      <h2 style="font-size:clamp(22px,3vw,30px)">${t('tuner_title')}</h2>
      <p class="muted" style="font-size:13px">${t('tuner_sub')}</p>
    </div>

    <div class="card card-pad tuner-card">
      <div class="tuner-meter">
        <div class="tuner-scale">
          <span>-50</span>
          <span>-25</span>
          <span class="center">0</span>
          <span>+25</span>
          <span>+50</span>
        </div>
        <div class="tuner-bar">
          <div class="tuner-center-mark"></div>
          <div class="tuner-needle" id="tuNeedle" style="left:50%"></div>
        </div>
      </div>

      <div class="tuner-display">
        <div class="tuner-note" id="tuNote">—</div>
        <div class="tuner-info">
          <div class="tuner-cents" id="tuCents">— cents</div>
          <div class="tuner-freq" id="tuFreq">— Hz</div>
        </div>
        <div class="tuner-badge" id="tuStatus">${t('tuner_listening')}</div>
      </div>

      <div class="row" style="justify-content:center;margin-top:16px">
        <button class="pill on" id="tuToggle" style="font-size:15px;padding:10px 22px">🎙️ <span>${t('tuner_start')}</span></button>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:16px">
      <div class="panel-title">${t('tuner_ref_notes')}</div>
      <div class="tuner-ref-grid" id="tuRef"></div>
    </div>
  `;

  buildRefNotes();
  bind();
}

function buildRefNotes() {
  const el = host.querySelector('#tuRef');
  el.innerHTML = REF_NOTES.map(r => `
    <button class="pill" data-midi="${r.midi}" style="padding:10px 16px;min-width:120px;text-align:left">
      <div style="font-size:15px;font-weight:700">${r.name}</div>
      <div class="muted" style="font-size:11px">${r.label} · ${r.freq} Hz</div>
    </button>
  `).join('');

  el.addEventListener('click', e => {
    const b = e.target.closest('[data-midi]');
    if (!b) return;
    playNote(+b.dataset.midi);
    b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
  });
}

function bind() {
  host.querySelector('#tuToggle').addEventListener('click', toggleTuner);
}

async function startTuner() {
  if (active) return;
  const btn = host.querySelector('#tuToggle');
  const statusEl = host.querySelector('#tuStatus');

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
      video: false,
    });
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = t('tuner_error');
      statusEl.style.color = 'var(--danger)';
    }
    return;
  }

  const ctx = getAudioCtx();
  const source = ctx.createMediaStreamSource(stream);
  analyser = ctx.createAnalyser();
  analyser.fftSize = 4096; // Buffer ampio per cogliere note basse del basso fino a 30 Hz
  source.connect(analyser);

  const buf = new Float32Array(analyser.fftSize);
  active = true;

  if (btn) {
    btn.classList.add('on');
    btn.innerHTML = `⏹ <span>${t('tuner_stop')}</span>`;
  }
  if (statusEl) {
    statusEl.textContent = t('tuner_listening');
    statusEl.style.color = 'var(--muted)';
  }

  function tick() {
    if (!active) return;
    animId = requestAnimationFrame(tick);
    analyser.getFloatTimeDomainData(buf);
    const freq = autoCorrelate(buf, ctx.sampleRate);

    const noteEl = host?.querySelector('#tuNote');
    const freqEl = host?.querySelector('#tuFreq');
    const centsEl = host?.querySelector('#tuCents');
    const needleEl = host?.querySelector('#tuNeedle');
    const status = host?.querySelector('#tuStatus');

    if (freq < 20 || freq > 800) {
      // Fuori range o silenzio
      if (needleEl) needleEl.style.left = '50%';
      return;
    }

    const info = freqToNoteInfo(freq);
    const absCents = Math.abs(info.cents);
    const isTune = absCents <= 4;
    const isClose = absCents <= 12;

    if (noteEl) {
      noteEl.textContent = info.noteName + info.octave;
      noteEl.style.color = isTune ? 'var(--ok)' : isClose ? 'var(--warn)' : 'var(--text)';
    }
    if (freqEl) freqEl.textContent = freq.toFixed(1) + ' Hz';
    if (centsEl) {
      centsEl.textContent = (info.cents >= 0 ? '+' : '') + info.cents + ' cent';
      centsEl.style.color = isTune ? 'var(--ok)' : isClose ? 'var(--warn)' : 'var(--danger)';
    }
    if (status) {
      if (isTune) {
        status.textContent = '✓ ' + t('tuner_in_tune');
        status.style.color = 'var(--ok)';
      } else if (info.cents < 0) {
        status.textContent = '◀ ' + t('tuner_flat');
        status.style.color = 'var(--warn)';
      } else {
        status.textContent = t('tuner_sharp') + ' ▶';
        status.style.color = 'var(--warn)';
      }
    }

    if (needleEl) {
      const clamped = Math.max(-50, Math.min(50, info.cents));
      const pct = 50 + clamped;
      needleEl.style.left = pct + '%';
      needleEl.style.background = isTune ? 'var(--ok)' : isClose ? 'var(--warn)' : 'var(--accent)';
      needleEl.style.boxShadow = isTune ? '0 0 14px var(--ok)' : '0 0 10px var(--accent-glow)';
    }
  }

  tick();
}

export function stopTuner() {
  active = false;
  if (animId) cancelAnimationFrame(animId);
  if (stream) {
    stream.getTracks().forEach(tr => tr.stop());
    stream = null;
  }
  const btn = host?.querySelector('#tuToggle');
  if (btn) {
    btn.classList.remove('on');
    btn.innerHTML = `🎙️ <span>${t('tuner_start')}</span>`;
  }
}

export function toggleTuner() {
  active ? stopTuner() : startTuner();
}
