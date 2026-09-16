/* =========================================================================
   DRUMS — batteria sintetizzata per metronomo e Groove Trainer.
   Strumenti: Kick (sub + click), Snare (body + noise), Ghost Snare, Rimshot,
   Hi-Hat chiuso, Hi-Hat aperto (open), Ride cymbal e Clap.
   Pattern a 16 step (1 battuta 4/4, risoluzione sedicesimi).
   Valori: 0=silenzio, 1=hit normale, 2=accento forte, 3=ghost note / morbido.
   ========================================================================= */
import { getAudioCtx } from './synth.js';

/* ---------------- STRUMENTI SINTETIZZATI ---------------- */

export function kick(time, accent = false, vol = 1.0) {
  const ctx = getAudioCtx();
  const v = vol * (accent ? 1.05 : 0.8);
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.frequency.setValueAtTime(145, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);
  g.gain.setValueAtTime(v * 1.15, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.38);
  osc.start(time); osc.stop(time + 0.38);

  // Transient beater click
  const n = Math.floor(ctx.sampleRate * 0.03);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(v * 0.5, time);
  ng.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
  src.connect(ng); ng.connect(ctx.destination);
  src.start(time); src.stop(time + 0.03);
}

export function snare(time, level = 1, rimshot = false, vol = 1.0) {
  const ctx = getAudioCtx();
  const isGhost = level === 3;
  const isAccent = level === 2;
  const v = vol * (isAccent ? 1.0 : isGhost ? 0.28 : 0.7);
  const dur = rimshot ? 0.06 : isGhost ? 0.11 : 0.20;

  // Corpo oscillatore
  const osc = ctx.createOscillator(), og = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = rimshot ? 380 : (isGhost ? 175 : 195);
  osc.connect(og); og.connect(ctx.destination);
  og.gain.setValueAtTime(v * (rimshot ? 0.55 : isGhost ? 0.35 : 0.75), time);
  og.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.start(time); osc.stop(time + dur);

  // Cordiera rullante (noise)
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
  const ctx = getAudioCtx();
  const dur = isOpen ? 0.28 : 0.045;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) {
    const env = 1 - (i / n) * (isOpen ? 0.7 : 1);
    data[i] = (Math.random() * 2 - 1) * env;
  }
  const src = ctx.createBufferSource(); src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = 'highpass';
  flt.frequency.value = isOpen ? 6000 : 7800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol * hhVol * (isOpen ? 0.45 : 0.35), time);
  g.gain.exponentialRampToValueAtTime(0.001, time + dur);
  src.connect(flt); flt.connect(g); g.connect(ctx.destination);
  src.start(time); src.stop(time + dur);
}

export function ride(time, accent = false, vol = 1.0) {
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

export function clap(time, vol = 1.0) {
  const ctx = getAudioCtx();
  const dur = 0.16;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;

  // 3 micro-transienti tipici del clap di gruppo
  [0, 0.011, 0.024].forEach((offset, idx) => {
    const src = ctx.createBufferSource(); src.buffer = buf;
    const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 1100; flt.Q.value = 2.5;
    const g = ctx.createGain();
    const t = time + offset;
    g.gain.setValueAtTime(vol * (idx === 2 ? 0.65 : 0.35), t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    src.connect(flt); flt.connect(g); g.connect(ctx.destination);
    src.start(t); src.stop(t + 0.14);
  });
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

/* ---------------- LIBRERIA COMPLETA GROOVE TRAINER ---------------- */
export const GROOVE_LIBRARY = [
  {
    id: 'sloppy-joe',
    name: 'Sloppy Joe (Killing Me Softly)',
    genre: 'Neo-Soul / Hip-Hop',
    bpm: 85,
    swing: 0.18, // Laid-back swing sui 16esimi
    desc_it: 'Il celebre groove laid-back di Nate Wood: pocket profondo, cassa dilatata, ghost note rilassate di rullante e charleston setoso.',
    desc_en: 'The signature Nate Wood laid-back pocket: deep kick, relaxed ghost-note snare, and silky loose hi-hats.',
    rec_root: 'F',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'Fm7 · B♭m7 · E♭7 · A♭maj7',
    tip_it: 'Suona leggermente "dietro" al tempo (laid-back). Tieni ferma la fondamentale sull\'1 e fai respirare il groove.',
    tip_en: 'Play slightly behind the beat (laid-back). Hold down the root on beat 1 and give the pocket room to breathe.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,2,0, 0,1,0,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,0, 2,0,3,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,0],
      hh_vol:[0.85,0.3,0.65,0.35, 0.85,0.3,0.6,0.35, 0.9,0.3,0.65,0.35, 0.85,0.3,0.6,0.0],
      open_hihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,2],
    }
  },
  {
    id: 'tower-funk',
    name: 'Tower Funk (Oakland 16ths)',
    genre: 'Funk',
    bpm: 102,
    swing: 0.05,
    desc_it: 'Funk stile Tower of Power / Rocco Prestia: sedicesimi serrati, cassa martellante e rullante scattante.',
    desc_en: 'Tower of Power / Rocco Prestia style funk: machine-gun 16ths, punchy kick, and snappy snare.',
    rec_root: 'E',
    rec_scale: 'dorian',
    rec_label: 'deg',
    chords: 'E9 · E7#9',
    tip_it: 'Staccato mutato con la mano sinistra. Fai rimbalzare i sedicesimi con tocco deciso.',
    tip_en: 'Muted 16th staccato. Keep your plucking light and bouncy near the bridge.',
    pattern: {
      kick:  [2,0,0,1, 0,0,1,0, 0,0,2,0, 0,1,0,0],
      snare: [0,0,0,0, 2,0,0,3, 0,3,0,0, 2,0,0,3],
      hihat: [2,1,2,1, 2,1,2,1, 2,1,2,1, 2,1,2,1],
      hh_vol:[0.8,0.4,0.7,0.4, 0.8,0.4,0.7,0.4, 0.8,0.4,0.7,0.4, 0.8,0.4,0.7,0.5],
    }
  },
  {
    id: 'motown-soul',
    name: 'Motown Soul Machine',
    genre: 'Soul / R&B',
    bpm: 114,
    swing: 0.0,
    desc_it: 'Il motore di James Jamerson: cassa trascinante in quarti/ottavi e rullante deciso sul 2 e sul 4.',
    desc_en: 'The James Jamerson engine: driving 8ths, solid 2 and 4 backbeat, and infectious bounce.',
    rec_root: 'C',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'C · Am · Dm · G',
    tip_it: 'Usa l\'indice "The Hook" come Jamerson. Aggiungi note cromatiche di approccio sul quarto movimento.',
    tip_en: 'Channel Jamerson with one plucking finger. Add chromatic approaches on beat 4.',
    pattern: {
      kick:  [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    }
  },
  {
    id: 'chicago-shuffle',
    name: 'Chicago Blues Shuffle',
    genre: 'Blues',
    bpm: 112,
    swing: 0.33, // Shuffle terzinato puro
    desc_it: 'Il classico shuffle blues a terzine: rimbalzo irresistibile ideale per linee walking o riff alla Muddy Waters.',
    desc_en: 'Classic swinging triplet blues shuffle: essential for walking bass lines and Chicago blues riffs.',
    rec_root: 'A',
    rec_scale: 'blues',
    rec_label: 'deg',
    chords: 'A7 · D7 · E7',
    tip_it: 'Cammina deciso su Fondamentale, Terza, Quinta e Sesta. Il beat terzinato ti porta da solo!',
    tip_en: 'Walk firmly across 1 - 3 - 5 - 6. Let the triplet swing carry your attack.',
    pattern: {
      kick:  [2,0,0,0, 1,0,0,0, 2,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,1,0],
      hh_vol:[0.9,0.0,0.5,0.0, 0.9,0.0,0.5,0.0, 0.9,0.0,0.5,0.0, 0.9,0.0,0.5,0.0],
    }
  },
  {
    id: 'dangelo-pocket',
    name: "D'Angelo Pocket (Voodoo)",
    genre: 'Neo-Soul',
    bpm: 76,
    swing: 0.22,
    desc_it: 'L\'apoteosi del groove lento e trascinato (Questlove & Pino Palladino). Il rullante cade un micro-istante dopo il battito.',
    desc_en: 'Pino Palladino & Questlove classic Voodoo pocket. Extreme laid-back snare and greasy bass presence.',
    rec_root: 'D',
    rec_scale: 'minPenta',
    rec_label: 'note',
    chords: 'Dm9 · G13',
    tip_it: 'Non anticipare mai! Tieni il tocco grasso e morbido sulle note gravi.',
    tip_en: 'Never rush! Keep your tone fat and warm, letting the sub-bass bloom.',
    pattern: {
      kick:  [2,0,0,0, 0,0,0,1, 0,0,2,0, 0,0,1,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,0, 2,0,3,0],
      hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
      hh_vol:[0.7,0.3,0.5,0.3, 0.75,0.3,0.5,0.4, 0.7,0.3,0.5,0.3, 0.75,0.3,0.6,0.3],
    }
  },
  {
    id: 'reggae-one-drop',
    name: 'One Drop Roots Reggae',
    genre: 'Reggae',
    bpm: 74,
    swing: 0.08,
    desc_it: 'La firma del roots reggae: il battito 1 è lasciato volutamente vuoto, mentre cassa e rimshot esplodono sul 3.',
    desc_en: 'Roots reggae foundation: beat 1 is completely empty, while kick and rimshot drop together on beat 3.',
    rec_root: 'G',
    rec_scale: 'minor',
    rec_label: 'deg',
    chords: 'Gm · Cm · Dm',
    tip_it: 'Chiudi i toni del basso per avere un suono caldo e rotondo. Lascia respirare il primo battito!',
    tip_en: 'Roll off your tone knob for that deep dub thud. Respect the silence on beat 1.',
    pattern: {
      kick:  [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      snare: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      rimshot: true,
      hihat: [0,0,2,0, 0,0,2,0, 0,0,2,0, 0,0,2,0],
    }
  },
  {
    id: 'disco-70s',
    name: '70s Disco Inferno',
    genre: 'Disco / Funk',
    bpm: 120,
    swing: 0.0,
    desc_it: 'Four-on-the-floor con cassa su ogni battito e charleston aperto sui levare (&). Puro trascinamento da pista.',
    desc_en: 'Four-on-the-floor kick with open hi-hat on every off-beat (&). The ultimate dancefloor bass engine.',
    rec_root: 'D',
    rec_scale: 'minor',
    rec_label: 'deg',
    chords: 'Dm7 · G7',
    tip_it: 'Suona l\'ottava sui sedicesimi in levare: Fondamentale (basso) sull\'1, Ottava (alto) sull\'&.',
    tip_en: 'Drive continuous octaves: Root on the beat, high octave on the off-beat 16ths.',
    pattern: {
      kick:  [2,0,0,0, 2,0,0,0, 2,0,0,0, 2,0,0,0],
      snare: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0],
      hihat: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      open_hihat: [0,0,2,0, 0,0,2,0, 0,0,2,0, 0,0,2,0],
      clap:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    }
  },
  {
    id: 'jaco-fusion',
    name: 'Jaco 16th Fusion',
    genre: 'Jazz / Fusion',
    bpm: 106,
    swing: 0.08,
    desc_it: 'Ispirato allo stile rivoluzionario di Jaco Pastorius: sedicesimi sincopati veloci, ghost notes e accenti imprevedibili.',
    desc_en: 'Inspired by Jaco Pastorius: lightning syncopated 16ths, percussive ghost notes, and bold accents.',
    rec_root: 'D',
    rec_scale: 'dorian',
    rec_label: 'note',
    chords: 'D9sus · C9sus',
    tip_it: 'Pizzica vicinissimo al ponte per far cantare i medi. Riempi gli spazi con ghost notes della mano sinistra.',
    tip_en: 'Pluck right over the bridge pickup for midrange growl. Fill gaps with percussive left-hand mutes.',
    pattern: {
      kick:  [2,0,0,1, 0,0,1,0, 0,1,2,0, 0,0,1,0],
      snare: [0,0,0,0, 2,0,0,3, 0,0,0,1, 2,0,3,0],
      hihat: [2,1,1,1, 2,1,1,1, 2,1,1,1, 2,1,1,1],
      hh_vol:[0.8,0.4,0.5,0.35, 0.8,0.4,0.5,0.4, 0.8,0.4,0.5,0.35, 0.8,0.4,0.6,0.4],
    }
  },
  {
    id: 'bossa-lounge',
    name: 'Bossa Nova Ipanema',
    genre: 'Latin / Bossa',
    bpm: 128,
    swing: 0.0,
    desc_it: 'Il calore di Rio de Janeiro: rimshot sincopato elegante e charleston morbido in ottavi costanti.',
    desc_en: 'The elegance of Brazilian Bossa: syncopated cross-stick rimshot and steady flowing hi-hat.',
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
    id: 'afrobeat-pulse',
    name: 'Afrobeat Fela Pulse',
    genre: 'Afrobeat',
    bpm: 116,
    swing: 0.05,
    desc_it: 'Poliritmia ipnotica in stile Fela Kuti & Tony Allen: rullante poliritmico e cassa che spinge senza sosta.',
    desc_en: 'Fela Kuti & Tony Allen polyrhythmic engine: relentless interlocking pulse and rolling snare accents.',
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
    id: 'rock-half-time',
    name: 'Heavy Half-Time Rock',
    genre: 'Rock / Metal',
    bpm: 72,
    swing: 0.0,
    desc_it: 'Groove rock mastodontico: rullante potente solo sul terzo movimento e cassa pesante.',
    desc_en: 'Monumental half-time rock groove: thunderous snare strictly on beat 3 with massive low-end kick.',
    rec_root: 'E',
    rec_scale: 'minPenta',
    rec_label: 'note',
    chords: 'E5 · G5 · A5',
    tip_it: 'Suona potente e preciso con plettro o tocco pesante. Lascia vibrare la nota fino all\'ultimo millisecondo.',
    tip_en: 'Play with heavy authority. Let each low note ring out with maximum sustain.',
    pattern: {
      kick:  [2,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
      snare: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0],
      hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
      hh_vol:[0.9,0,0.7,0, 0.9,0,0.7,0, 0.9,0,0.7,0, 0.9,0,0.7,0],
    }
  },
  {
    id: 'jazz-fast-ride',
    name: 'Fast Swing Walking',
    genre: 'Jazz',
    bpm: 145,
    swing: 0.28,
    desc_it: 'Il leggendario pattern del piatto ride swing (ding-ding-a-ding) con charleston a pedale sul 2 e 4.',
    desc_en: 'The classic jazz ride cymbal swing pattern with foot chick on beats 2 and 4. Built for walking bass.',
    rec_root: 'B',
    rec_scale: 'major',
    rec_label: 'deg',
    chords: 'B♭7 · E♭7 · F7',
    tip_it: 'Linee walking in quarti costanti: Fondamentale sul battito 1, note di accordo e approcci cromatici sul 4.',
    tip_en: 'Walk in steady quarter notes: connect chord tones smoothly with chromatic approaches.',
    pattern: {
      kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
      snare: [0,0,0,0, 0,0,0,3, 0,0,0,0, 0,0,3,0],
      hihat: [0,0,0,0, 2,0,0,0, 0,0,0,0, 2,0,0,0], // Foot hihat on 2 and 4
      ride:  [2,0,1,1, 0,1,2,0, 1,0,1,1, 0,1,2,0],
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
  if (!muteS && dp.clap && dp.clap[si]) {
    clap(time, vol);
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
