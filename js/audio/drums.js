/* =========================================================================
   DRUMS — batteria sintetizzata per i groove di accompagnamento.
   Portato da app.js v1 (_drumKick/Snare/Hihat/Ride). Pattern a 16 step
   (1 battuta 4/4, risoluzione sedicesimi). Valori: 0=silenzio 1=hit 2=accento.
   ========================================================================= */
import { getAudioCtx } from './synth.js';

export const DRUM_PATTERNS = {
  none:    { kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0] },
  rock:    { kick:[2,0,0,0,0,0,1,0,2,0,0,0,0,0,0,0], snare:[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0] },
  funk:    { kick:[2,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0], snare:[0,0,0,0,2,0,0,1,0,0,0,0,2,0,0,0], hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], hh_vol:[0.7,0.3,0.5,0.3,0.5,0.3,0.5,0.3,0.7,0.3,0.5,0.3,0.5,0.3,0.5,0.8] },
  jazz:    { kick:[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0], hihat:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], ride:[2,0,1,1,0,1,2,0,1,0,1,1,0,1,2,0] },
  bossa:   { kick:[2,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], snare:[0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], rimshot:true },
  shuffle: { kick:[2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], snare:[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0], hihat:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1] },
};

function kick(time, accent, vol) {
  const ctx = getAudioCtx();
  const v = vol * (accent ? 1.0 : 0.75);
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.07);
  g.gain.setValueAtTime(v * 1.1, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.38);
  osc.start(time); osc.stop(time + 0.38);
  const n = Math.floor(ctx.sampleRate * 0.035);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(v * 0.45, time);
  ng.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
  src.connect(ng); ng.connect(ctx.destination);
  src.start(time); src.stop(time + 0.035);
}

function snare(time, accent, rimshot, vol) {
  const ctx = getAudioCtx();
  const v = vol * (accent ? 1.0 : 0.65);
  const dur = rimshot ? 0.055 : 0.19;
  const osc = ctx.createOscillator(), og = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = rimshot ? 380 : 195;
  osc.connect(og); og.connect(ctx.destination);
  og.gain.setValueAtTime(v * (rimshot ? 0.55 : 0.75), time);
  og.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.start(time); osc.stop(time + dur);
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const flt = ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = rimshot ? 2500 : 1400;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(v * 0.55, time);
  ng.gain.exponentialRampToValueAtTime(0.001, time + dur);
  src.connect(flt); flt.connect(ng); ng.connect(ctx.destination);
  src.start(time); src.stop(time + dur);
}

function hihat(time, hhVol, vol) {
  const ctx = getAudioCtx();
  const dur = 0.042;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const flt = ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = 7500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol * hhVol * 0.38, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + dur);
  src.connect(flt); flt.connect(g); g.connect(ctx.destination);
  src.start(time); src.stop(time + dur);
}

function ride(time, accent, vol) {
  const ctx = getAudioCtx();
  const v = vol * (accent ? 0.55 : 0.38);
  [1046, 1567, 2637].forEach((freq, i) => {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    osc.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(v * (0.3 - i * 0.07), time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
    osc.start(time); osc.stop(time + 0.45);
  });
}

/** Programma gli hit di batteria allo step `si` (0-15) del pattern `dp`. */
export function scheduleDrumStep(si, time, dp, vol) {
  const rimshot = !!dp.rimshot;
  if (dp.kick  && dp.kick[si])  kick(time,  dp.kick[si]  === 2, vol);
  if (dp.snare && dp.snare[si]) snare(time, dp.snare[si] === 2, rimshot, vol);
  if (dp.hihat && dp.hihat[si]) hihat(time, dp.hh_vol ? dp.hh_vol[si] : (dp.hihat[si] === 2 ? 1.0 : 0.6), vol);
  if (dp.ride  && dp.ride[si])  ride(time,  dp.ride[si]  === 2, vol);
}
