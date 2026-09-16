/* =========================================================================
   METRONOME — scheduler look-ahead su clock Web Audio (no drift).
   Portato da app.js v1: click + groove (accenti), batteria, speed trainer,
   swing, tap tempo. La UI registra metro.onBeat / metro.onBpm.
   ========================================================================= */
import { getAudioCtx } from './synth.js';
import { state } from '../core/state.js';
import { DRUM_PATTERNS, scheduleDrumStep } from './drums.js';

/* Groove: griglia 16 step (1 battuta 4/4). 'A'=accento 'N'=normale 'G'=ghost null=silenzio */
export const GROOVES = {
  none:    { it:'Click',    en:'Click',    emoji:'🎵', steps:null },
  rock:    { it:'Rock',     en:'Rock',     emoji:'🤘', steps:['A',null,'N',null,'N',null,'N',null,'N',null,'N',null,'N',null,'N',null] },
  funk:    { it:'Funk',     en:'Funk',     emoji:'🎸', steps:['A','G','N','G','N','G','N','G','N','G','N','G','N','G','N','A'] },
  jazz:    { it:'Jazz',     en:'Jazz',     emoji:'🎷', steps:['A',null,null,'N',null,null,'N',null,'N',null,null,'N',null,null,'N',null], swing:0.67 },
  bossa:   { it:'Bossa',    en:'Bossa',    emoji:'🌴', steps:['A',null,'N',null,'N',null,null,'N','N',null,'N',null,null,'N','N',null] },
  shuffle: { it:'Shuffle',  en:'Shuffle',  emoji:'🔀', steps:['A',null,null,'N',null,null,'A',null,null,'N',null,null,'A',null,null,'N'], swing:0.67 },
};

export const metro = {
  running: false,
  bpm: 90,
  beats: 4,
  subdivision: 1,
  volume: 0.8,
  groove: 'none',
  drumsEnabled: false,
  drumVolume: 0.7,
  // speed trainer
  autoIncr: false,
  incrBpm: 2,
  incrInterval: 8,   // battiti tra un incremento e l'altro
  totalBeats: 0,
  // interni
  currentBeat: 0,
  subTick: 0,
  nextNoteTime: 0,
  lookahead: 25,
  scheduleAhead: 0.1,
  timerID: null,
  queue: [],
  tapTimes: [],
  onBeat: null,
  onBpm: null,
};

function click(time, accent, isSub) {
  if (!state.audio) return;
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  const freq = accent ? 1050 : (isSub ? 440 : 630);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime((accent ? 0.55 : (isSub ? 0.15 : 0.28)) * metro.volume, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(time); osc.stop(time + 0.15);
}

function scheduler() {
  const ctx = getAudioCtx();
  const groove = GROOVES[metro.groove] || GROOVES.none;
  const activeSub = groove.steps ? 4 : metro.subdivision;
  const step = (60.0 / metro.bpm) / activeSub;

  while (metro.nextNoteTime < ctx.currentTime + metro.scheduleAhead) {
    const isMain = metro.subTick === 0;

    if (groove.steps) {
      const idx = (metro.currentBeat * 4 + metro.subTick) % groove.steps.length;
      const cell = groove.steps[idx];
      if (cell !== null) click(metro.nextNoteTime, cell === 'A', true);
      if (isMain) metro.queue.push({ time: metro.nextNoteTime, beat: metro.currentBeat });
    } else {
      click(metro.nextNoteTime, isMain && metro.currentBeat === 0, !isMain);
      if (isMain) metro.queue.push({ time: metro.nextNoteTime, beat: metro.currentBeat });
    }

    if (metro.drumsEnabled) {
      const dp = DRUM_PATTERNS[metro.groove] || DRUM_PATTERNS.none;
      const drumTick = (metro.currentBeat * 4 + metro.subTick) % 16;
      if (activeSub >= 4 || metro.subTick === 0) scheduleDrumStep(drumTick, metro.nextNoteTime, dp, metro.drumVolume);
    }

    if (isMain && metro.autoIncr) {
      metro.totalBeats++;
      if (metro.totalBeats >= metro.incrInterval) {
        metro.totalBeats = 0;
        setBpm(metro.bpm + metro.incrBpm);
      }
    }

    if (groove.steps && groove.swing && metro.subTick % 2 === 1) {
      metro.nextNoteTime += (60.0 / metro.bpm / 4) * (groove.swing - 0.5);
    }

    metro.nextNoteTime += step;
    metro.subTick = (metro.subTick + 1) % activeSub;
    if (metro.subTick === 0) metro.currentBeat = (metro.currentBeat + 1) % metro.beats;
  }
  metro.timerID = setTimeout(scheduler, metro.lookahead);
}

function draw() {
  if (!metro.running) return;
  const ctx = getAudioCtx();
  while (metro.queue.length && metro.queue[0].time < ctx.currentTime + 0.012) {
    const q = metro.queue.shift();
    window.dispatchEvent(new CustomEvent('bm:beat', { detail: q.beat }));
  }
  requestAnimationFrame(draw);
}

export function startMetro() {
  if (metro.running) return;
  const ctx = getAudioCtx();
  metro.running = true;
  metro.currentBeat = 0; metro.subTick = 0; metro.totalBeats = 0;
  metro.queue = [];
  metro.nextNoteTime = ctx.currentTime + 0.05;
  scheduler();
  requestAnimationFrame(draw);
  window.dispatchEvent(new CustomEvent('bm:run', { detail: true }));
}

export function stopMetro() {
  metro.running = false;
  clearTimeout(metro.timerID);
  metro.timerID = null;
  metro.queue = [];
  window.dispatchEvent(new CustomEvent('bm:run', { detail: false }));
}

export function toggleMetro() { metro.running ? stopMetro() : startMetro(); }

export function setBpm(v) {
  metro.bpm = Math.max(30, Math.min(300, Math.round(v)));
  window.dispatchEvent(new CustomEvent('bm:bpm', { detail: metro.bpm }));
}

export function setBeats(v) {
  metro.beats = Math.max(1, Math.min(16, +v));
  window.dispatchEvent(new CustomEvent('bm:sig', { detail: metro.beats }));
}

export function setSubdivision(v) {
  metro.subdivision = Math.max(1, Math.min(8, +v));
  window.dispatchEvent(new CustomEvent('bm:sub', { detail: metro.subdivision }));
}

export function setGroove(v) {
  if (GROOVES[v]) {
    metro.groove = v;
    window.dispatchEvent(new CustomEvent('bm:groove', { detail: metro.groove }));
  }
}

/** Tap tempo: chiama a ogni tap, calcola il BPM dalla media degli intervalli. */
export function tap() {
  const now = performance.now();
  metro.tapTimes = metro.tapTimes.filter(t => now - t < 2000);
  metro.tapTimes.push(now);
  if (metro.tapTimes.length >= 2) {
    const diffs = [];
    for (let i = 1; i < metro.tapTimes.length; i++) diffs.push(metro.tapTimes[i] - metro.tapTimes[i - 1]);
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    setBpm(60000 / avg);
  }
}

export function bpmTerm(bpm) {
  if (bpm < 40) return 'Grave';
  if (bpm < 60) return 'Largo';
  if (bpm < 66) return 'Adagio';
  if (bpm < 76) return 'Andante';
  if (bpm < 108) return 'Moderato';
  if (bpm < 120) return 'Allegretto';
  if (bpm < 156) return 'Allegro';
  if (bpm < 176) return 'Vivace';
  if (bpm < 200) return 'Presto';
  return 'Prestissimo';
}
