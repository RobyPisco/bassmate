/* =========================================================================
   DRUMS — Motore di batteria acustica realistica e sintesi ibrida.
   Campioni acustici reali:
   - Registrati da Lars Muldjord (MuldjordKit, FreePats project, licenza CC-BY 4.0).
   - Inclusi: Kick, Snare, Snare-Ghost, Rimshot/Side-stick, Hi-Hat Chiuso,
     Hi-Hat Aperto, Piatto Ride, Crash.
   - Riproduzione sample-based ad alta fedeltà con fallback sintetizzato immediato.
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

function playSample(key, time, vol = 1.0, pitch = 1.0) {
  const buf = AUDIO_BUFFERS[key];
  if (!buf) return false;
  const ctx = getAudioCtx();
  const src = ctx.createBufferSource();
  const g = ctx.createGain();

  src.buffer = buf;
  if (pitch !== 1.0) src.playbackRate.value = pitch;
  g.gain.setValueAtTime(vol, time);

  src.connect(g);
  g.connect(ctx.destination);
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
  if (playSample('ride', time, vol * (accent ? 0.95 : 0.75))) return;
  const ctx = getAudioCtx();
  const v = vol * (accent ? 0.55 : 0.38);
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
  {
    id: 'velluto-laidback',
    name: 'Velluto Laid-Back',
    genre: 'Neo-Soul / Hip-Hop',
    bpm: 84,
    swing: 0.18,
    desc_it: 'Pocket morbido e rilassato con cassa profonda, ghost note di rullante e charleston con sfumature dinamiche.',
    desc_en: 'Silky laid-back pocket with deep bass drum, ghosted acoustic snare, and nuanced dynamics.',
    rec_root: 'F',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'Fm7 · B♭m7 · E♭7 · A♭maj7',
    tip_it: 'Suona leggermente "dietro" al tempo (laid-back). Sostieni la fondamentale sull\'1 e lascia respirare il groove.',
    tip_en: 'Play slightly behind the beat (laid-back). Anchor the root on beat 1 and give the pocket room to breathe.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,2,0, 0,1,0,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,0, 2,0,3,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
      hh_vol:[0.85,0.3,0.65,0.35, 0.85,0.3,0.6,0.35, 0.9,0.3,0.65,0.35, 0.85,0.3,0.6,0.0],
      open_hihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,2],
    }
  },
  {
    id: 'funk-metropolitano',
    name: 'Funk Metropolitano',
    genre: 'Funk',
    bpm: 100,
    swing: 0.05,
    desc_it: 'Sedicesimi sincopati incalzanti, rullante con ghost note veloci e cassa scattante.',
    desc_en: 'Punchy 16th-note syncopation, rapid acoustic ghost notes, and driving kick groove.',
    rec_root: 'E',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'E9 · E7#9',
    tip_it: 'Staccato mutato con la mano sinistra. Fai rimbalzare i sedicesimi con tocco deciso e percussivo.',
    tip_en: 'Tight left-hand muting. Keep your 16ths percussive and bouncy near the bridge.',
    pattern: {
      kick:  [2,0,0,1, 0,0,1,0, 0,0,2,0, 0,1,0,0],
      snare: [0,0,0,0, 2,0,0,3, 0,3,0,0, 2,0,0,3],
      hihat: [2,1,2,1, 2,1,2,1, 2,1,2,1, 2,1,2,1],
      hh_vol:[0.8,0.4,0.7,0.4, 0.8,0.4,0.7,0.4, 0.8,0.4,0.7,0.4, 0.8,0.4,0.7,0.5],
    }
  },
  {
    id: 'detroit-pulse',
    name: 'Detroit 60s Pulse',
    genre: 'Soul / R&B',
    bpm: 114,
    swing: 0.0,
    desc_it: 'Tributo al tocco leggendario di Detroit: cassa che guida in quarti/ottavi e rullante solido sul 2 e sul 4.',
    desc_en: 'Classic Motown heartbeat: driving 8ths, solid 2 and 4 backbeat, and infectious bounce.',
    rec_root: 'C',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'C · Am · Dm · G',
    tip_it: 'Pizzica con un solo dito come i maestri del soul. Aggiungi note cromatiche di approccio sul quarto movimento.',
    tip_en: 'Channel the classic one-finger hook. Add chromatic passing tones on beat 4.',
    pattern: {
      kick:  [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },
  {
    id: 'delta-shuffle',
    name: 'Mississippi Delta Shuffle',
    genre: 'Blues',
    bpm: 112,
    swing: 0.33,
    desc_it: 'Shuffle blues a terzine con rimbalzo naturale: indispensabile per accompagnare il walking bass a 12 battute.',
    desc_en: 'Swinging triplet blues shuffle: essential for walking bass lines and 12-bar blues progressions.',
    rec_root: 'A',
    rec_scale: 'blues',
    rec_label: 'deg',
    chords: 'A7 · D7 · E7',
    tip_it: 'Cammina deciso su Fondamentale, Terza maggiore, Quinta e Sesta. Il beat terzinato ti porta da solo!',
    tip_en: 'Walk firmly across 1 - 3 - 5 - 6. Let the triplet bounce carry your bassline.',
    pattern: {
      kick:  [2,0,0,0, 1,0,0,0, 2,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
      hh_vol:[0.9,0.0,0.5,0.0, 0.9,0.0,0.5,0.0, 0.9,0.0,0.5,0.0, 0.9,0.0,0.5,0.0],
    }
  },
  {
    id: 'roots-one-drop',
    name: 'Roots Dub One-Drop',
    genre: 'Reggae',
    bpm: 72,
    swing: 0.08,
    desc_it: 'Pura tradizione roots: il battito 1 è lasciato vuoto, mentre cassa e rimshot esplodono insieme sul 3.',
    desc_en: 'Authentic roots reggae foundation: beat 1 is silent, while kick and rimshot drop together on beat 3.',
    rec_root: 'G',
    rec_scale: 'minor',
    rec_label: 'deg',
    chords: 'Gm · Cm · Dm',
    tip_it: 'Chiudi i toni del basso per avere un timbro caldo e rotondo. Rispetta la sacralità del silenzio sull\'1.',
    tip_en: 'Roll off the tone knob for deep dub warmth. Respect the space on beat 1.',
    pattern: {
      kick:  [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      snare: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      rimshot: true,
      hihat: [0,0,2,0, 0,0,2,0, 0,0,2,0, 0,0,2,0],
    }
  },
  {
    id: 'studio54-fever',
    name: 'Studio 54 Fever',
    genre: 'Disco / Funk',
    bpm: 122,
    swing: 0.0,
    desc_it: 'Four-on-the-floor con cassa su ogni battito e charleston aperto sui levare (&). Irresistibile per ottave disco.',
    desc_en: 'Four-on-the-floor kick with open hi-hat on every off-beat (&). The ultimate dancefloor engine.',
    rec_root: 'D',
    rec_scale: 'minor',
    rec_label: 'deg',
    chords: 'Dm7 · G7',
    tip_it: 'Suona l\'ottava sui sedicesimi in levare: Fondamentale sul battito, Ottava alta sul levare.',
    tip_en: 'Drive continuous octaves: Root on the beat, high octave on the off-beat 16ths.',
    pattern: {
      kick:  [2,0,0,0, 2,0,0,0, 2,0,0,0, 2,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      open_hihat: [0,0,2,0, 0,0,2,0, 0,0,2,0, 0,0,2,0],
    }
  },
  {
    id: 'fusion-sincopata',
    name: 'Fusion Sincopata',
    genre: 'Jazz / Fusion',
    bpm: 104,
    swing: 0.08,
    desc_it: 'Sedicesimi sincopati veloci, ghost notes e accenti imprevedibili per linee di basso complesse e solistiche.',
    desc_en: 'Fast syncopated 16ths, percussive ghost notes, and accents tailored for lead bass grooves.',
    rec_root: 'D',
    rec_scale: 'dorian',
    rec_label: 'note',
    chords: 'D9sus · C9sus',
    tip_it: 'Pizzica vicinissimo al ponte per far cantare i medi. Riempi gli spazi con ghost notes della mano sinistra.',
    tip_en: 'Pluck right over the bridge pickup for midrange bite. Fill gaps with muted left-hand ghosts.',
    pattern: {
      kick:  [2,0,0,1, 0,0,1,0, 0,1,2,0, 0,0,1,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,1, 2,0,3,0],
      hihat: [2,1,1,1, 2,1,1,1, 2,1,1,1, 2,1,1,1],
      hh_vol:[0.8,0.4,0.5,0.35, 0.8,0.4,0.5,0.4, 0.8,0.4,0.5,0.35, 0.8,0.4,0.6,0.4],
    }
  },
  {
    id: 'bossa-carioca',
    name: 'Bossa Carioca',
    genre: 'Latin / Bossa',
    bpm: 126,
    swing: 0.0,
    desc_it: 'Elegante rimshot acustico in cross-stick con cassa soffice e charleston morbido in ottavi costanti.',
    desc_en: 'Warm acoustic cross-stick rimshot, soft bass drum, and gentle steady hi-hat.',
    rec_root: 'F',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'Fmaj7 · G7 · Gm7 · C7',
    tip_it: 'La formula magica della Bossa: Fondamentale sul battito 1, Quinta sull\'e del 2.',
    tip_en: 'The secret Bossa formula: Root on beat 1, Fifth on the & of 2.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
      snare: [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,1,0,0],
      rimshot: true,
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      hh_vol:[0.5,0.0,0.4,0.0, 0.5,0.0,0.4,0.0, 0.5,0.0,0.4,0.0, 0.5,0.0,0.4,0.0],
    }
  },
  {
    id: 'afro-poliritmo',
    name: 'Afro-Groove Poliritmico',
    genre: 'Afrobeat',
    bpm: 116,
    swing: 0.05,
    desc_it: 'Poliritmia ipnotica circolare: rullante ritmato e cassa che spinge senza sosta.',
    desc_en: 'Hypnotic circular polyrhythm: interlocking acoustic snare and relentless driving kick.',
    rec_root: 'A',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'Am7 · Bm7',
    tip_it: 'Crea una linea di basso circolare (ostinato) di due battute e ripetila fino all\'estasi.',
    tip_en: 'Build an interlocking two-bar ostinato riff and lock it into the pocket endlessly.',
    pattern: {
      kick:  [2,0,0,0, 1,0,0,1, 0,0,2,0, 1,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,1,0,0, 2,0,1,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
      hh_vol:[0.7,0.4,0.6,0.4, 0.7,0.4,0.6,0.4, 0.7,0.4,0.6,0.4, 0.7,0.4,0.6,0.5],
    }
  },
  {
    id: 'rock-cavernoso',
    name: 'Rock Cavernoso Half-Time',
    genre: 'Rock / Metal',
    bpm: 70,
    swing: 0.0,
    desc_it: 'Groove rock mastodontico: rullante acustico potente sul terzo movimento e cassa pesante.',
    desc_en: 'Monumental half-time rock groove: thunderous snare strictly on beat 3 with massive low-end kick.',
    rec_root: 'E',
    rec_scale: 'minPenta',
    rec_label: 'note',
    chords: 'E5 · G5 · A5',
    tip_it: 'Suona potente e deciso con plettro o tocco pesante. Lascia vibrare la nota fino all\'ultimo millisecondo.',
    tip_en: 'Play with heavy authority. Let each low note ring out with maximum sustain.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      hh_vol:[0.9,0,0.7,0, 0.9,0,0.7,0, 0.9,0,0.7,0, 0.9,0,0.7,0],
    }
  },
  {
    id: 'walking-swing',
    name: 'Walking Jazz Swing',
    genre: 'Jazz',
    bpm: 144,
    swing: 0.28,
    desc_it: 'Piatto ride acustico reale con pattern tradizionale swing (ding-ding-a-ding) e pedale charleston sul 2 e 4.',
    desc_en: 'Real acoustic ride cymbal swing pattern with foot chick on beats 2 and 4. Built for walking bass.',
    rec_root: 'B',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'B♭7 · E♭7 · F7',
    tip_it: 'Linee walking in quarti costanti: Fondamentale sul battito 1, note di accordo e approcci cromatici sul 4.',
    tip_en: 'Walk in steady quarter notes: connect chord tones smoothly with chromatic approaches.',
    pattern: {
      kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
      snare: [0,0,0,0, 0,0,0,3, 0,0,0,0, 0,0,3,0],
      hihat: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      ride:  [2,0,1,1, 0,1,2,0, 1,0,1,1, 0,1,2,0],
    }
  },
  {
    id: 'indie-pop',
    name: 'Indie Pop Pocket',
    genre: 'Pop / Rock',
    bpm: 94,
    swing: 0.0,
    desc_it: 'Pattern essenziale e compatto: cassa d\'appoggio, rullante presente sul 2 e 4 e accenti aperti di charleston.',
    desc_en: 'Punchy, focused acoustic pocket: solid kick foundation, crisp snare on 2 and 4, and dynamic hi-hats.',
    rec_root: 'G',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'G · D · Em · C',
    tip_it: 'Suona dritto, essenziale e pulito. Meno note suoni, più il brano acquista respiro e potenza.',
    tip_en: 'Play clean and straightforward. Less notes, more foundation and dynamic breath.',
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
    hihat(time, 0.9, vol, true);
  } else if (!muteH && dp.hihat && dp.hihat[si]) {
    const hhLvl = dp.hh_vol ? dp.hh_vol[si] : (dp.hihat[si] === 2 ? 1.0 : 0.6);
    hihat(time, hhLvl, vol, false);
  }
  if (!muteR && dp.ride && dp.ride[si]) {
    ride(time, dp.ride[si] === 2, vol);
  }
}
