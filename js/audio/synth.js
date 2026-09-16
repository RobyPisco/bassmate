/* =========================================================================
   SYNTH — motore audio (Web Audio API).
   Riuso fedele da app.js v1: getAudioCtx, playBeep, playNote.
   playNote sintetizza una voce di basso (saw + sub sine + low-pass).
   ========================================================================= */
import { state } from '../core/state.js';

let _ctx = null;

export function getAudioCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

export function playBeep(freq, duration = 0.15) {
  if (!state.audio) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { console.warn('Audio error:', e); }
}

let _seqTimers = [];

export function stopSequence() {
  _seqTimers.forEach(id => clearTimeout(id));
  _seqTimers = [];
}

/** Suona una nota MIDI con timbro di basso (saw biting + sub sine + lowpass). */
export function playNote(midi, when = null) {
  if (!state.audio) return;
  try {
    const ctx = getAudioCtx();
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const now = (when !== null && when >= ctx.currentTime) ? when : ctx.currentTime;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq / 2, now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.4);
    filter.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.18, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);

    osc1.start(now); osc2.start(now);
    osc1.stop(now + 1.8); osc2.stop(now + 1.8);
  } catch (e) { console.warn('Audio error:', e); }
}

/** Suona una sequenza di note MIDI a intervallo fisso (per "ascolta scala"). */
export function playSequence(midiList, gap = 0.32) {
  if (!state.audio || !midiList.length) return;
  stopSequence();
  const ctx = getAudioCtx();
  const startAt = ctx.currentTime + 0.04;
  midiList.forEach((m, i) => {
    playNote(m, startAt + i * gap);
  });
}
