/* =========================================================================
   DRUMS — Motore di batteria acustica realistica e sintesi ibrida.
   Campioni acustici reali:
   - Salamander Drumkit (Yamaha Custom acoustic kit registrato con microfoni
     overhead stereo di sala da Alexander Holm, licenza CC-BY 3.0).
   - Inclusi in alta fedeltà stereo 44.1kHz: Kick, Snare, Snare-Ghost, Rimshot/Side-stick,
     Hi-Hat Chiuso, Hi-Hat Aperto, Piatto Ride, Crash.
   - Master Drum Bus con DynamicsCompressorNode ("glue" analogica), EQ presence/sub
     e Stereo Panner per posizionamento spaziale realistico.
   ========================================================================= */
import { getAudioCtx } from './synth.js';

/* ---------------- GESTIONE DEI CAMPIONI ACUSTICI REALI ---------------- */
const SAMPLES = {
  kick:         'assets/drums/kick.wav',
  snare:        'assets/drums/snare.wav',
  'snare-ghost':'assets/drums/snare-ghost.wav',
  rimshot:      'assets/drums/rimshot.wav',
  hihat:        'assets/drums/hihat.wav',
  'hihat-open': 'assets/drums/hihat-open.wav',
  ride:         'assets/drums/ride.wav',
  crash:        'assets/drums/crash.wav',
};

const AUDIO_BUFFERS = {};
let samplesLoaded = false;
let loadPromise = null;

export async function preloadDrumSamples() {
  if (samplesLoaded) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ctx = getAudioCtx();
    const entries = Object.entries(SAMPLES);
    await Promise.all(entries.map(async ([key, path]) => {
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        AUDIO_BUFFERS[key] = await ctx.decodeAudioData(buf);
      } catch (err) {
        // Fallback su sintesi se il file non è reperibile
        AUDIO_BUFFERS[key] = null;
      }
    }));
    samplesLoaded = true;
  })();

  return loadPromise;
}

/* ---------------- GESTIONE MASTER DRUM BUS & EFFETTI STUDIO ---------------- */
let drumBus = null;
let activeOpenHatGains = [];

/**
 * Inizializza il Drum Bus professionale:
 * - DynamicsCompressorNode: "incolla" i fusti dando punch, attacco e respiro ritmico (pumping analogico leggero).
 * - Low-Shelf EQ (+1.5 dB a 70Hz): conferisce corpo e peso tellurico alla cassa per il groove del bassista.
 * - High-Shelf EQ (+2.0 dB a 8.5kHz): dona aria, frizzantezza e sizzle a piatti e rullante senza asprezza.
 */
function getDrumBus(ctx) {
  if (drumBus && drumBus.ctx === ctx) return drumBus;

  const busInput = ctx.createGain();
  busInput.gain.value = 1.0;

  // 1. Equalizzazione di mastering per batteria
  const lowShelf = ctx.createBiquadFilter();
  lowShelf.type = 'lowshelf';
  lowShelf.frequency.value = 75;
  lowShelf.gain.value = 1.8;

  const highShelf = ctx.createBiquadFilter();
  highShelf.type = 'highshelf';
  highShelf.frequency.value = 8500;
  highShelf.gain.value = 1.8;

  // 2. Bus Compressor ("Glue" compression da studio)
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.setValueAtTime(-14, ctx.currentTime);
  comp.knee.setValueAtTime(6, ctx.currentTime);
  comp.ratio.setValueAtTime(3.8, ctx.currentTime);
  comp.attack.setValueAtTime(0.006, ctx.currentTime); // 6ms: lascia passare il transiente iniziale prima di comprimere
  comp.release.setValueAtTime(0.12, ctx.currentTime); // 120ms: respiro naturale col pocket

  // Master drum ceiling
  const masterOut = ctx.createGain();
  masterOut.gain.value = 0.95;

  // Routing della catena: input -> lowShelf -> highShelf -> comp -> masterOut -> destination
  busInput.connect(lowShelf);
  lowShelf.connect(highShelf);
  highShelf.connect(comp);
  comp.connect(masterOut);
  masterOut.connect(ctx.destination);

  drumBus = {
    ctx,
    input: busInput,
    compressor: comp,
    masterOut
  };
  return drumBus;
}

/** Configurazione spaziale stereo (panning) e guadagni calibrati da studio.
 * Cassa e rullante guidano il mix ritmico, piatti e charleston si collocano come accompagnamento dinamico naturale. */
const INSTRUMENT_SPECS = {
  kick:         { pan:  0.00, gain: 1.15, jitter: 0.004 },
  snare:        { pan: -0.06, gain: 1.05, jitter: 0.012 },
  'snare-ghost':{ pan: -0.06, gain: 0.70, jitter: 0.020 },
  rimshot:      { pan: -0.08, gain: 0.90, jitter: 0.008 },
  hihat:        { pan: -0.22, gain: 0.58, jitter: 0.015 },
  'hihat-open': { pan: -0.20, gain: 0.38, jitter: 0.010 }, // attenuato per non sovrastare cassa e rullante
  ride:         { pan:  0.28, gain: 0.42, jitter: 0.008 }, // calibrato per un morbido accompagnamento jazz/blues
  crash:        { pan: -0.32, gain: 0.55, jitter: 0.005 },
};

/** Choking realistico: quando il charleston si chiude, strozza l'open hat ancora attivo */
function chokeOpenHiHat(time) {
  const ctx = getAudioCtx();
  const safeTime = Math.max(ctx.currentTime, time);
  activeOpenHatGains = activeOpenHatGains.filter(({ gainNode, stopTime }) => {
    if (stopTime <= safeTime) return false;
    try {
      gainNode.cancelScheduledValues(safeTime);
      gainNode.setValueAtTime(gainNode.value || 0.8, safeTime);
      gainNode.linearRampToValueAtTime(0.001, safeTime + 0.018); // 18ms pedata sul pedale
    } catch (_) {}
    return false;
  });
}

function playSample(key, time, vol = 1.0, pitch = 1.0) {
  const buf = AUDIO_BUFFERS[key];
  if (!buf) return false;
  const ctx = getAudioCtx();
  const bus = getDrumBus(ctx);

  const spec = INSTRUMENT_SPECS[key] || { pan: 0, gain: 1.0, jitter: 0.01 };

  // Micro-humanization (variazione impercettibile di intonazione come in una vera esecuzione)
  const humanPitch = pitch * (1 + (Math.random() - 0.5) * (spec.jitter || 0.01));
  const finalVol = Math.max(0.001, vol * spec.gain);

  const src = ctx.createBufferSource();
  const g = ctx.createGain();

  src.buffer = buf;
  src.playbackRate.value = humanPitch;
  g.gain.setValueAtTime(finalVol, time);

  // Se è charleston aperto, memorizziamo per choking
  if (key === 'hihat-open') {
    activeOpenHatGains.push({
      gainNode: g,
      stopTime: time + buf.duration
    });
  } else if (key === 'hihat') {
    // Choke open hihat quando suona il closed
    chokeOpenHiHat(time);
  }

  // Panning stereo se supportato
  if (typeof ctx.createStereoPanner === 'function' && spec.pan !== 0) {
    try {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(spec.pan, time);
      src.connect(g);
      g.connect(panner);
      panner.connect(bus.input);
    } catch (_) {
      src.connect(g);
      g.connect(bus.input);
    }
  } else {
    src.connect(g);
    g.connect(bus.input);
  }

  src.start(time);
  return true;
}

/* ---------------- STRUMENTI SINTETIZZATI (FALLBACK) ---------------- */
export function kick(time, accent = false, vol = 1.0) {
  if (playSample('kick', time, vol * (accent ? 1.05 : 0.88), accent ? 1.02 : 0.98)) return;
  const ctx = getAudioCtx();
  const v = vol * (accent ? 1.05 : 0.8);
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.frequency.setValueAtTime(145, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);
  g.gain.setValueAtTime(v * 1.15, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.38);
  osc.start(time); osc.stop(time + 0.38);
}

export function snare(time, level = 1, rimshot = false, vol = 1.0) {
  const isGhost = level === 3;
  const isAccent = level === 2;
  const v = vol * (isAccent ? 1.05 : isGhost ? 0.35 : 0.85);

  if (rimshot) {
    if (playSample('rimshot', time, v)) return;
  } else if (isGhost) {
    if (playSample('snare-ghost', time, v, 0.98)) return;
  } else {
    if (playSample('snare', time, v, isAccent ? 1.02 : 0.99)) return;
  }

  const ctx = getAudioCtx();
  const dur = rimshot ? 0.06 : isGhost ? 0.11 : 0.20;
  const osc = ctx.createOscillator(), og = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = rimshot ? 380 : (isGhost ? 175 : 195);
  osc.connect(og); og.connect(ctx.destination);
  og.gain.setValueAtTime(v * (rimshot ? 0.55 : isGhost ? 0.35 : 0.75), time);
  og.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.start(time); osc.stop(time + dur);

  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = 'highpass';
  flt.frequency.value = rimshot ? 2600 : isGhost ? 950 : 1400;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(v * (isGhost ? 0.3 : 0.6), time);
  ng.gain.exponentialRampToValueAtTime(0.001, time + dur);
  src.connect(flt); flt.connect(ng); ng.connect(ctx.destination);
  src.start(time); src.stop(time + dur);
}

export function hihat(time, hhVol = 0.6, vol = 1.0, isOpen = false) {
  const v = vol * hhVol;
  if (isOpen) {
    if (playSample('hihat-open', time, v * 0.9)) return;
  } else {
    if (playSample('hihat', time, v * 0.95)) return;
  }

  const ctx = getAudioCtx();
  const dur = isOpen ? 0.28 : 0.045;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - (i / n) * (isOpen ? 0.7 : 1));
  const src = ctx.createBufferSource(); src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = 'highpass';
  flt.frequency.value = isOpen ? 6000 : 7800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(v * (isOpen ? 0.45 : 0.35), time);
  g.gain.exponentialRampToValueAtTime(0.001, time + dur);
  src.connect(flt); flt.connect(g); g.connect(ctx.destination);
  src.start(time); src.stop(time + dur);
}

export function ride(time, accent = false, vol = 1.0) {
  if (playSample('ride', time, vol * (accent ? 0.70 : 0.48))) return;
  const ctx = getAudioCtx();
  const v = vol * (accent ? 0.40 : 0.28);
  [1046, 1567, 2637, 3120].forEach((freq, i) => {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    osc.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(v * (0.32 - i * 0.06), time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.48);
    osc.start(time); osc.stop(time + 0.48);
  });
}

export function crash(time, vol = 1.0) {
  if (playSample('crash', time, vol * 0.9)) return;
}

/* ---------------- PATTERN BASE (METRONOMO) ---------------- */
export const DRUM_PATTERNS = {
  none:    { kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0] },
  rock:    { kick:[2,0,0,0,0,0,1,0,2,0,0,0,0,0,0,0], snare:[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0] },
  funk:    { kick:[2,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0], snare:[0,0,0,0,2,0,0,1,0,0,0,0,2,0,0,0], hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], hh_vol:[0.7,0.3,0.5,0.3,0.5,0.3,0.5,0.3,0.7,0.3,0.5,0.3,0.5,0.3,0.5,0.8] },
  jazz:    { kick:[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0], hihat:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], ride:[2,0,1,1,0,1,2,0,1,0,1,1,0,1,2,0] },
  bossa:   { kick:[2,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], snare:[0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], rimshot:true },
  shuffle: { kick:[2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], snare:[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0], hihat:[1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1] },
};

/* ---------------- LIBRERIA GROOVE ORIGINALE BASSMATE ---------------- */
export const GROOVE_LIBRARY = [
  // --- ROCK ---
  {
    id: 'rock-classic-8',
    name: 'Classic Rock 8th Pulse',
    category: 'rock',
    genre: 'Classic Rock',
    bpm: 118,
    swing: 0.0,
    rec_root: 'A',
    rec_scale: 'minPenta',
    rec_label: 'note',
    chords: 'A5 · D5 · E5',
    tip_it: 'Ottavi dritti e compatti. Plettro o tocco deciso per spingere il brano.',
    tip_en: 'Straight driving 8ths. Solid pick or finger attack right in the groove.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 2,0,0,0, 0,0,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
    }
  },
  {
    id: 'rock-cavernoso',
    name: 'Rock Cavernoso Half-Time',
    category: 'rock',
    genre: 'Heavy Rock',
    bpm: 70,
    swing: 0.0,
    rec_root: 'E',
    rec_scale: 'minPenta',
    rec_label: 'note',
    chords: 'E5 · G5 · A5',
    tip_it: 'Rullante potente sul terzo movimento. Lascia risuonare ogni nota con sustain massimo.',
    tip_en: 'Heavy snare strictly on beat 3. Let low notes ring with maximum power.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },
  {
    id: 'hard-rock-driving',
    name: 'Hard Rock Driving Beat',
    category: 'rock',
    genre: 'Hard Rock',
    bpm: 128,
    swing: 0.0,
    rec_root: 'D',
    rec_scale: 'minor',
    rec_label: 'deg',
    chords: 'D5 · C5 · G5',
    tip_it: 'Cassa incalzante con accenti sincopati. Ottimo per riff aggressivi e veloci.',
    tip_en: 'Driving kick with syncopated push. Perfect for aggressive bass riffs.',
    pattern: {
      kick:  [2,0,1,0, 0,0,1,0, 2,0,0,0, 0,1,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
      open_hihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,2],
    }
  },
  {
    id: 'punk-grunge-power',
    name: 'Grunge & Punk Energy',
    category: 'rock',
    genre: 'Grunge / Punk',
    bpm: 148,
    swing: 0.0,
    rec_root: 'F#',
    rec_scale: 'minPenta',
    rec_label: 'note',
    chords: 'F#5 · A5 · B5 · D5',
    tip_it: 'Charleston aperto e cassa martellante. Tieni il polso sciolto per ottavi continui.',
    tip_en: 'Open hats and relentless kick. Keep your wrist loose for driving 8ths.',
    pattern: {
      kick:  [2,0,2,0, 0,0,1,0, 2,0,0,0, 2,0,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      open_hihat: [2,0,2,0, 2,0,2,0, 2,0,2,0, 2,0,2,0],
    }
  },
  {
    id: 'southern-rock',
    name: 'Southern Rock Pocket',
    category: 'rock',
    genre: 'Southern Rock',
    bpm: 104,
    swing: 0.08,
    rec_root: 'G',
    rec_scale: 'mixolydian',
    rec_label: 'deg',
    chords: 'G · F · C',
    tip_it: 'Leggero rimbalzo laid-back e cassa d\'appoggio. Ideale per pentatoniche maggiori.',
    tip_en: 'Subtle laid-back bounce with solid kick. Perfect for Major Pentatonic riffs.',
    pattern: {
      kick:  [2,0,0,1, 0,0,1,0, 2,0,0,0, 0,0,1,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },
  {
    id: 'rock-ballad',
    name: 'Slow Rock Ballad',
    category: 'rock',
    genre: 'Rock Ballad',
    bpm: 66,
    swing: 0.0,
    rec_root: 'C',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'C · G/B · Am · F',
    tip_it: 'Tempo largo e arioso. Fai cantare il basso sulle fondamentali e note di passaggio.',
    tip_en: 'Spacious slow tempo. Let your bassline breathe with melodic passing tones.',
    pattern: {
      kick:  [2,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      ride:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
    }
  },

  // --- BLUES ---
  {
    id: 'delta-shuffle',
    name: 'Mississippi Delta Shuffle',
    category: 'blues',
    genre: 'Chicago Blues',
    bpm: 112,
    swing: 0.33,
    rec_root: 'A',
    rec_scale: 'blues',
    rec_label: 'deg',
    chords: 'A7 · D7 · E7',
    tip_it: 'Shuffle a terzine autentico: cammina su 1 - 3 - 5 - 6 per il classico blues a 12 battute.',
    tip_en: 'Triplet blues shuffle: walk across 1 - 3 - 5 - 6 for traditional 12-bar blues.',
    pattern: {
      kick:  [2,0,0,0, 1,0,0,0, 2,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
    }
  },
  {
    id: 'texas-double-shuffle',
    name: 'Texas Blues Double-Shuffle',
    category: 'blues',
    genre: 'Texas Blues',
    bpm: 128,
    swing: 0.35,
    rec_root: 'E',
    rec_scale: 'blues',
    rec_label: 'deg',
    chords: 'E7 · A7 · B7',
    tip_it: 'Stile Stevie Ray: rullante spinto continuamente in terzine, ritmo travolgente.',
    tip_en: 'Stevie Ray style double-shuffle with constant snare push and driving triplet feel.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 2,0,0,0, 0,0,1,0],
      snare: [0,0,1,0, 2,0,1,0, 0,0,1,0, 2,0,1,0],
      hihat: [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
    }
  },
  {
    id: 'slow-blues-12-8',
    name: 'Slow Blues 12/8 Ballad',
    category: 'blues',
    genre: 'Slow Blues',
    bpm: 56,
    swing: 0.33,
    rec_root: 'G',
    rec_scale: 'blues',
    rec_label: 'deg',
    chords: 'G7 · C7 · D7',
    tip_it: 'Blues lento ed emozionale. Piatto ride con terzine e tocco profondo di cassa sull\'1.',
    tip_en: 'Soulful slow blues. Gentle ride cymbal triplets and deep kick anchor on beat 1.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      ride:  [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
    }
  },
  {
    id: 'chicago-boogie',
    name: 'Chicago Boogie Blues',
    category: 'blues',
    genre: 'Boogie Blues',
    bpm: 138,
    swing: 0.28,
    rec_root: 'C',
    rec_scale: 'blues',
    rec_label: 'deg',
    chords: 'C7 · F7 · G7',
    tip_it: 'Boogie incalzante: suona la linea ostinato 1-3-5-6-b7-6-5-3 a tempo serrato.',
    tip_en: 'Driving boogie-woogie: play the classic 1-3-5-6-b7-6-5-3 walking pattern.',
    pattern: {
      kick:  [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },
  {
    id: 'swamp-blues',
    name: 'Louisiana Swamp Blues',
    category: 'blues',
    genre: 'Swamp Blues',
    bpm: 88,
    swing: 0.20,
    rec_root: 'D',
    rec_scale: 'blues',
    rec_label: 'deg',
    chords: 'D7 · G7 · A7',
    tip_it: 'Blues paludoso e pigro del Sud. Rullante con ghost note rilassate.',
    tip_en: 'Lazy, hypnotic southern swamp blues pocket with relaxed ghost notes.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,2,0, 0,1,0,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },

  // --- FUNK & SOUL ---
  {
    id: 'funk-metropolitano',
    name: 'Funk Metropolitano',
    category: 'funk',
    genre: 'Funk',
    bpm: 100,
    swing: 0.05,
    rec_root: 'E',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'E9 · E7#9',
    tip_it: 'Staccato mutato con la mano sinistra. Fai rimbalzare i sedicesimi con tocco percussivo.',
    tip_en: 'Tight left-hand muting. Keep your 16ths percussive and bouncy near the bridge.',
    pattern: {
      kick:  [2,0,0,1, 0,0,1,0, 0,0,2,0, 0,1,0,0],
      snare: [0,0,0,0, 2,0,0,3, 0,3,0,0, 2,0,0,3],
      hihat: [2,1,2,1, 2,1,2,1, 2,1,2,1, 2,1,2,1],
    }
  },
  {
    id: 'velluto-laidback',
    name: 'Velluto Laid-Back',
    category: 'funk',
    genre: 'Neo-Soul',
    bpm: 84,
    swing: 0.18,
    rec_root: 'F',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'Fm7 · B♭m7 · E♭7 · A♭maj7',
    tip_it: 'Suona leggermente "dietro" al tempo. Sostieni la fondamentale sull\'1.',
    tip_en: 'Play slightly behind the beat. Anchor the root on beat 1 and give pocket room.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,2,0, 0,1,0,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,0, 2,0,3,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
      open_hihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,2],
    }
  },
  {
    id: 'detroit-pulse',
    name: 'Detroit 60s Pulse',
    category: 'funk',
    genre: 'Soul / Motown',
    bpm: 114,
    swing: 0.0,
    rec_root: 'C',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'C · Am · Dm · G',
    tip_it: 'Tocco a un dito in stile Jamerson. Approcci cromatici sul 4 per connettere gli accordi.',
    tip_en: 'Classic one-finger hook. Add chromatic passing tones on beat 4.',
    pattern: {
      kick:  [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },
  {
    id: 'studio54-fever',
    name: 'Studio 54 Fever',
    category: 'funk',
    genre: 'Disco Funk',
    bpm: 122,
    swing: 0.0,
    rec_root: 'D',
    rec_scale: 'minor',
    rec_label: 'deg',
    chords: 'Dm7 · G7',
    tip_it: 'Ottave continue: Fondamentale sul battito, ottava acuta sul levare (&).',
    tip_en: 'Continuous octaves: root on the beat, high octave on the off-beat &.',
    pattern: {
      kick:  [2,0,0,0, 2,0,0,0, 2,0,0,0, 2,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      open_hihat: [0,0,2,0, 0,0,2,0, 0,0,2,0, 0,0,2,0],
    }
  },
  {
    id: 'roots-one-drop',
    name: 'Roots Dub One-Drop',
    category: 'funk',
    genre: 'Reggae',
    bpm: 72,
    swing: 0.08,
    rec_root: 'G',
    rec_scale: 'minor',
    rec_label: 'deg',
    chords: 'Gm · Cm · Dm',
    tip_it: 'Battito 1 vuoto. Cassa e rimshot esplodono insieme sul 3 con bassi profondi.',
    tip_en: 'Beat 1 is silent. Kick and rimshot drop together on beat 3.',
    pattern: {
      kick:  [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      snare: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      rimshot: true,
      hihat: [0,0,2,0, 0,0,2,0, 0,0,2,0, 0,0,2,0],
    }
  },
  {
    id: 'afro-poliritmo',
    name: 'Afro-Groove Poliritmico',
    category: 'funk',
    genre: 'Afrobeat',
    bpm: 116,
    swing: 0.05,
    rec_root: 'A',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'Am7 · Bm7',
    tip_it: 'Ostinato circolare di due battute: incastrati nel poliritmo ipnotico.',
    tip_en: 'Two-bar circular ostinato riff locked into the hypnotic polyrhythm.',
    pattern: {
      kick:  [2,0,0,0, 1,0,0,1, 0,0,2,0, 1,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,1,0,0, 2,0,1,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
    }
  },

  // --- JAZZ & LATIN ---
  {
    id: 'walking-swing',
    name: 'Walking Jazz Swing',
    category: 'jazz',
    genre: 'Jazz Swing',
    bpm: 144,
    swing: 0.28,
    rec_root: 'B',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'B♭7 · E♭7 · F7',
    tip_it: 'Piatto ride acustico reale (ding-ding-a-ding). Cammina in quarti costanti.',
    tip_en: 'Acoustic ride cymbal swing. Walk firmly in steady quarter notes.',
    pattern: {
      kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
      snare: [0,0,0,0, 0,0,0,3, 0,0,0,0, 0,0,3,0],
      hihat: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      ride:  [2,0,1,1, 0,1,2,0, 1,0,1,1, 0,1,2,0],
    }
  },
  {
    id: 'bossa-carioca',
    name: 'Bossa Carioca',
    category: 'jazz',
    genre: 'Bossa Nova',
    bpm: 126,
    swing: 0.0,
    rec_root: 'F',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'Fmaj7 · G7 · Gm7 · C7',
    tip_it: 'Rimshot in cross-stick acustico: Fondamentale sull\'1, quinta sull\'e del 2.',
    tip_en: 'Cross-stick rimshot: Root on beat 1, Fifth on the & of 2.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
      snare: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,1,0,0],
      rimshot: true,
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },
  {
    id: 'fusion-sincopata',
    name: 'Fusion Sincopata',
    category: 'jazz',
    genre: 'Jazz-Fusion',
    bpm: 104,
    swing: 0.08,
    rec_root: 'D',
    rec_scale: 'dorian',
    rec_label: 'note',
    chords: 'D9sus · C9sus',
    tip_it: 'Pizzica vicino al ponte per far cantare i medi sulle sincopi veloci.',
    tip_en: 'Pluck near the bridge for midrange growl on fast syncopations.',
    pattern: {
      kick:  [2,0,0,1, 0,0,1,0, 0,1,2,0, 0,0,1,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,1, 2,0,3,0],
      hihat: [2,1,1,1, 2,1,1,1, 2,1,1,1, 2,1,1,1],
    }
  },

  // --- POP ---
  {
    id: 'indie-pop',
    name: 'Indie Pop Pocket',
    category: 'pop',
    genre: 'Pop / Indie',
    bpm: 94,
    swing: 0.0,
    rec_root: 'G',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'G · D · Em · C',
    tip_it: 'Suonato dritto, essenziale e pulito per accompagnamenti moderni.',
    tip_en: 'Straight, clean and punchy for modern pop and indie songs.',
    pattern: {
      kick:  [2,0,0,0, 1,0,0,0, 2,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
      open_hihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,2],
    }
  }
];

/** Programma gli hit di batteria allo step `si` (0-15) del pattern `dp` con opzioni di mute. */
export function scheduleDrumStep(si, time, dp, vol = 1.0, opts = {}) {
  const muteK = !!opts.muteKick;
  const muteS = !!opts.muteSnare;
  const muteH = !!opts.muteHihat;
  const muteR = !!opts.muteRide;

  const rimshot = !!dp.rimshot;
  if (!muteK && dp.kick && dp.kick[si]) {
    kick(time, dp.kick[si] === 2, vol);
  }
  if (!muteS && dp.snare && dp.snare[si]) {
    snare(time, dp.snare[si], rimshot, vol);
  }
  if (!muteH && dp.open_hihat && dp.open_hihat[si]) {
    hihat(time, 0.55, vol, true);
  } else if (!muteH && dp.hihat && dp.hihat[si]) {
    const hhLvl = dp.hh_vol ? dp.hh_vol[si] : (dp.hihat[si] === 2 ? 1.0 : 0.6);
    hihat(time, hhLvl, vol, false);
  }
  if (!muteR && dp.ride && dp.ride[si]) {
    ride(time, dp.ride[si] === 2, vol);
  }
}
