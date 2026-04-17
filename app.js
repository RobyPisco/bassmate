/* ══════════════════════════════════════
   I18N DICTIONARY & STATE
══════════════════════════════════════ */
const I18N = {
  it: {
    tuning: "Accordatura", root_note: "Nota radice", scale_chord: "Scala/Accordo", labels: "Etichette", settings: "Vista",
    base: "Base", modes: "Modi", arps: "Arpeggi", other: "Altro",
    degrees: "Gradi", notes: "Note", finger: "Dita (Box)", all: "Tutto", box: "Box 5fr", right: "Destro", lefty: "Mancino",
    quiz_mode: "🎯 Quiz",
    export_pdf: "Esporta PDF", donate: "Offrimi un caffè", pos_root: "Nota radice", pos_note: "Nota della scala", 
    position: "Posizione: fret", string_title: "Basso a", strings_label: "Corde",
    "Magg.": "Magg.", "Maggiore": "Maggiore", "Min.": "Min.", "Minore Naturale": "Minore Naturale", "Pent.M": "Pent.M", 
    "Pentatonica Maggiore": "Pentatonica Maggiore", "Pent.m": "Pent.m", "Pentatonica Minore": "Pentatonica Minore", 
    "Min.Arm.": "Min.Arm.", "Minore Armonica": "Minore Armonica", "Min.Mel.": "Min.Mel.", "Minore Melodica": "Minore Melodica", 
    "Dim.": "Dim.", "Diminuita": "Diminuita", "Maggiore 7": "Maggiore 7", "Minore 7": "Minore 7", "Dominante 7": "Dominante 7", 
    "Semidiminuito": "Semidiminuito", "Diminuito 7": "Diminuito 7", "Aumentata": "Aumentata", "Whole Tone": "Whole Tone",
    "Std (4)": "Std (4)", "Drop D": "Drop D", "Eb (4)": "Eb (4)", "Std (5)": "Std (5)", "Std (6)": "Std (6)",
    "Standard 4-Corde": "Standard 4-Corde", "Standard 5-Corde": "Standard 5-Corde", "Standard 6-Corde": "Standard 6-Corde",
    "Half-Step Down": "Mezzo tono sotto",
    "Cromatica": "Cromatica", "Crom.": "Crom.",
    "solfege": "Note (Do, Re, Mi)", "notes": "Note (C, D, E)",
    quiz_btn: "🎯 Gioca Quiz", fav_def: "🔖 Preferiti", fav_save: "Salva Preferito",
    coffee: "Offrimi un caffè", reset_btn: "Reset Tastiera", ex_btn: "Esercizi Pratici",
    grids_btn: "Stampa Manici Vuoti", help_btn: "Aiuto e Istruzioni", export_btn: "Esporta PDF (Manico Corrente)",
    f_quote: "\"Ho creato questo strumento per non perdermi sul manico... ora lo metto a disposizione per farvi perdere su questo sito! 🤘\"",
    f_created: "Creato da", f_donate: "Se ti ho salvato l'assolo, <a href=\"donate.html\" style=\"color: var(--root-c); text-decoration: none;\">offrimi una birra (o un caffè) ☕</a>",
    right: "Destro", lefty: "Mancino", hand: "Mano",
    back_btn: "⬅️ Torna alla Tastiera",
    quiz_score: "🏆 Punteggio:", quiz_wrong: "(Ahi!)", quiz_initial: "🏆 Punteggio: 0",
    metro_btn: "Metronomo", metro_btn_lbl: "Metro", metro_sig: "Battuta", metro_start: "Start", metro_stop: "Stop",
    share_btn: "Condividi Scala", share_copied: "🔗 Link copiato negli appunti!", share_fail: "Copia questo link:",
    kbd_title: "⌨️ Scorciatoie da Tastiera",
    kbd_root_lr: "← / →", kbd_root_lr_desc: "Cambia nota radice",
    kbd_quiz: "Q", kbd_quiz_desc: "Attiva/Disattiva Quiz",
    kbd_metro: "M", kbd_metro_desc: "Apri/Chiudi Metronomo",
    kbd_reset: "R", kbd_reset_desc: "Reset tastiera",
    kbd_help: "?", kbd_help_desc: "Mostra queste scorciatoie",
    stats_title: "Le tue statistiche", stats_sessions: "Sessioni", stats_best: "Best Score", stats_weak: "Nota più difficile", stats_none: "Nessun dato ancora!",
    tour_skip: "Salta tour", tour_next: "Avanti →", tour_done: "Fatto! 🎸",
    tour_0_t: "Benvenuto su Bassmate! 🎸", tour_0_b: "Ti guidiamo in un veloce tour delle funzioni principali. Dura meno di un minuto!",
    tour_1_t: "🎵 Nota Radice", tour_1_b: "Clicca una nota (Do, Re, Mi...) per impostare la fondamentale. Cambierà tutto il manico in tempo reale.",
    tour_2_t: "🎹 Scala / Accordo", tour_2_b: "Naviga tra i tab Base, Modi, Arpeggi per esplorare le infinite combinazioni. La scala attiva è evidenziata in viola.",
    tour_3_t: "🎺 Manico Interattivo", tour_3_b: "Clicca su qualsiasi nota del manico per sentirne il suono. Usa 'Etichette' per scegliere se vedere gradi, note o dita.",
    tour_4_t: "🎯 Quiz Mode", tour_4_b: "Metti alla prova la tua memoria! Il manico si svuoterà e dovrai indovinare la nota sul tasto evidenziato.",
    tour_5_t: "🥁 Metronomo", tour_5_b: "Studia le scale a tempo preciso. Regola BPM e battuta, poi premi Start. Puoi suonare le note sul manico mentre il metro batte!",
    tour_6_t: "Sei pronto! 🤘", tour_6_b: "Buono studio bassista! Ricorda: la guida completa è sempre accessibile dall'icona \u2753 in alto a destra.",
    "Drop C (C-G-C-F)": "Drop C", "B Standard (4)": "B Standard (4-corde)", "D Standard (4)": "D Standard (4-corde)",
    "Drop C": "Drop C", "B Std (4)": "B Std (4)", "D Std (4)": "D Std (4)"
  },
  en: {
    tuning: "Tuning", root_note: "Root Note", scale_chord: "Scale/Chord", labels: "Labels", settings: "View",
    base: "Base", modes: "Modes", arps: "Arps", other: "Other",
    degrees: "Degrees", notes: "Notes", finger: "Fingers (Box)", all: "All", box: "Box 5fr", right: "Right", lefty: "Lefty",
    quiz_mode: "🎯 Quiz Mode",
    export_pdf: "Export PDF", donate: "Buy me a coffee", pos_root: "Root Note", pos_note: "Scale Note", 
    position: "Position: fret", string_title: "Bass", strings_label: "Strings",
    "Magg.": "Major", "Maggiore": "Major", "Min.": "Minor", "Minore Naturale": "Natural Minor", "Pent.M": "Maj.Pent", 
    "Pentatonica Maggiore": "Major Pentatonic", "Pent.m": "Min.Pent", "Pentatonica Minore": "Minor Pentatonic", 
    "Min.Arm.": "Harm.Min", "Minore Armonica": "Harmonic Minor", "Min.Mel.": "Mel.Min", "Minore Melodica": "Melodic Minor", 
    "Dim.": "Dim.", "Diminuita": "Diminished", "Maggiore 7": "Major 7", "Minore 7": "Minor 7", "Dominante 7": "Dominant 7", 
    "Semidiminuito": "Half-diminished", "Diminuito 7": "Diminished 7", "Aumentata": "Augmented", "Whole Tone": "Whole Tone",
    "Std (4)": "Std (4)", "Drop D": "Drop D", "Eb (4)": "Eb (4)", "Std (5)": "Std (5)", "Std (6)": "Std (6)",
    "Standard 4-Corde": "Standard 4-String", "Standard 5-Corde": "Standard 5-String", "Standard 6-Corde": "Standard 6-String",
    "Mezzo tono sotto": "Half-Step Down",
    "Cromatica": "Chromatic", "Crom.": "Chrom.",
    "solfege": "Solfege (Do,Re)", "notes": "Notes (C,D,E)",
    quiz_btn: "🎯 Play Quiz", fav_def: "🔖 Favorites", fav_save: "Save Favorite",
    coffee: "Buy me a coffee", reset_btn: "Reset Fretboard", ex_btn: "Practice Exercises",
    grids_btn: "Print Blank Grids", help_btn: "Help & Guide", export_btn: "Export PDF (Current View)",
    f_quote: "\"I created this tool so I wouldn't get lost on the fretboard... now I'm sharing it so you can get lost on this site! 🤘\"",
    f_created: "Created by", f_donate: "If I saved your bass solo, <a href=\"donate.html\" style=\"color: var(--root-c); text-decoration: none;\">buy me a beer (or a coffee) ☕</a>",
    right: "Right", lefty: "Lefty", hand: "Hand",
    back_btn: "⬅️ Back to Fretboard",
    quiz_score: "🏆 Score:", quiz_wrong: "(Ouch!)", quiz_initial: "🏆 Score: 0",
    metro_btn: "Metronome", metro_btn_lbl: "Metro", metro_sig: "Time Sig", metro_start: "Start", metro_stop: "Stop",
    share_btn: "Share Scale", share_copied: "🔗 Link copied to clipboard!", share_fail: "Copy this link:",
    kbd_title: "⌨️ Keyboard Shortcuts",
    kbd_root_lr: "← / →", kbd_root_lr_desc: "Change root note",
    kbd_quiz: "Q", kbd_quiz_desc: "Toggle Quiz Mode",
    kbd_metro: "M", kbd_metro_desc: "Open/Close Metronome",
    kbd_reset: "R", kbd_reset_desc: "Reset fretboard",
    kbd_help: "?", kbd_help_desc: "Show these shortcuts",
    stats_title: "Your Statistics", stats_sessions: "Sessions", stats_best: "Best Score", stats_weak: "Weakest Note", stats_none: "No data yet!",
    tour_skip: "Skip tour", tour_next: "Next →", tour_done: "Let's play! 🎸",
    tour_0_t: "Welcome to Bassmate! 🎸", tour_0_b: "Let's take a quick 1-minute tour of the main features!",
    tour_1_t: "🎵 Root Note", tour_1_b: "Click a note (C, D, E...) to set the root. The entire fretboard updates in real-time.",
    tour_2_t: "🎹 Scale / Chord", tour_2_b: "Browse tabs (Base, Modes, Arpeggios) to explore endless combinations. The active scale is highlighted in purple.",
    tour_3_t: "🎺 Interactive Fretboard", tour_3_b: "Click any dot to hear the note! Use 'Labels' to toggle between degrees, notes, or finger positions.",
    tour_4_t: "🎯 Quiz Mode", tour_4_b: "Test your memory! The fretboard empties and you guess the highlighted fret's note.",
    tour_5_t: "🥁 Metronome", tour_5_b: "Practice in time. Set BPM and time signature, press Start. You can still play notes while it ticks!",
    tour_6_t: "You're all set! 🤘", tour_6_b: "Happy Grooving! The full guide is always accessible from the \u2753 icon in the top right.",
    "Drop C (C-G-C-F)": "Drop C", "B Standard (4)": "B Standard (4-string)", "D Standard (4)": "D Standard (4-string)",
    "Drop C": "Drop C", "B Std (4)": "B Std (4)", "D Std (4)": "D Std (4)"
  }
};
function tl(key) { return I18N[S.lang] && I18N[S.lang][key] ? I18N[S.lang][key] : key; }

const NOTES_EN = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTES_IT = ['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];

function getNoteName(ni) {
  return S.label === 'solfege' ? NOTES_IT[ni] : NOTES_EN[ni];
}

function intervalFormula(ivs) {
  return ivs.map((v,i) => {
    const next = i < ivs.length-1 ? ivs[i+1] : ivs[0]+12;
    const d = next - v;
    return d===1 ? 'S' : d===2 ? 'T' : d===3 ? 'T+S' : String(d);
  }).join(' ');
}

const SCALES = {
  major:    {g:'base',  name:'Maggiore',              short:'Magg.',     iv:[0,2,4,5,7,9,11],    dg:['1','2','3','4','5','6','7']},
  minor:    {g:'base',  name:'Minore Naturale',        short:'Min.',      iv:[0,2,3,5,7,8,10],    dg:['1','2','♭3','4','5','♭6','♭7']},
  majPenta: {g:'base',  name:'Pentatonica Maggiore',   short:'Pent.M',    iv:[0,2,4,7,9],         dg:['1','2','3','5','6']},
  minPenta: {g:'base',  name:'Pentatonica Minore',     short:'Pent.m',    iv:[0,3,5,7,10],        dg:['1','♭3','4','5','♭7']},
  blues:    {g:'base',  name:'Blues',                  short:'Blues',     iv:[0,3,5,6,7,10],      dg:['1','♭3','4','♭5','5','♭7']},
  dorian:   {g:'modes', name:'Dorian',                 short:'Dorian',    iv:[0,2,3,5,7,9,10],    dg:['1','2','♭3','4','5','6','♭7']},
  phrygian: {g:'modes', name:'Phrygian',               short:'Phrygian',  iv:[0,1,3,5,7,8,10],    dg:['1','♭2','♭3','4','5','♭6','♭7']},
  lydian:   {g:'modes', name:'Lydian',                 short:'Lydian',    iv:[0,2,4,6,7,9,11],    dg:['1','2','3','♯4','5','6','7']},
  mixo:     {g:'modes', name:'Mixolydian',             short:'Mixo.',     iv:[0,2,4,5,7,9,10],    dg:['1','2','3','4','5','6','♭7']},
  locrian:  {g:'modes', name:'Locrian',                short:'Locrian',   iv:[0,1,3,5,6,8,10],    dg:['1','♭2','♭3','4','♭5','♭6','♭7']},
  maj7:     {g:'arps',  name:'Maggiore 7',             short:'Maj7',      iv:[0,4,7,11],          dg:['1','3','5','7']},
  min7:     {g:'arps',  name:'Minore 7',               short:'Min7',      iv:[0,3,7,10],          dg:['1','♭3','5','♭7']},
  dom7:     {g:'arps',  name:'Dominante 7',            short:'Dom7',      iv:[0,4,7,10],          dg:['1','3','5','♭7']},
  m7b5:     {g:'arps',  name:'Semidiminuito',          short:'m7♭5',      iv:[0,3,6,10],          dg:['1','♭3','♭5','♭7']},
  dim7:     {g:'arps',  name:'Diminuito 7',            short:'Dim7',      iv:[0,3,6,9],           dg:['1','♭3','♭5','bb7']},
  aug:      {g:'arps',  name:'Aumentata',              short:'Aug',       iv:[0,4,8],             dg:['1','3','♯5']},
  harmMin:  {g:'other', name:'Minore Armonica',        short:'Min.Arm.',  iv:[0,2,3,5,7,8,11],    dg:['1','2','♭3','4','5','♭6','7']},
  melMin:   {g:'other', name:'Minore Melodica',        short:'Min.Mel.',  iv:[0,2,3,5,7,9,11],    dg:['1','2','♭3','4','5','6','7']},
  dim:      {g:'other', name:'Diminuita',              short:'Dim.',      iv:[0,2,3,5,6,8,9,11],  dg:['1','2','♭3','4','♭5','♭6','6','7']},
  whole:    {g:'other', name:'Whole Tone',             short:'Whole',     iv:[0,2,4,6,8,10],      dg:['1','2','3','♯4','♯5','♭7']},
  chromatic:{g:'other', name:'Cromatica',              short:'Crom.',     iv:[0,1,2,3,4,5,6,7,8,9,10,11], dg:['1','♭2','2','♭3','3','4','♭5','5','♭6','6','♭7','7']},
};

const TUNINGS = {
  'std-4':  { strings:4, notes:[7,2,9,4],      labels:['G','D','A','E'],         midiBase:[43,38,33,28], desc:'Standard 4-Corde',   short:'Std (4)' },
  'dropd-4':{ strings:4, notes:[7,2,9,2],      labels:['G','D','A','D'],         midiBase:[43,38,33,26], desc:'Drop D (D-A-D-G)',   short:'Drop D' },
  'eb-4':   { strings:4, notes:[6,1,8,3],      labels:['Gb','Db','Ab','Eb'],     midiBase:[42,37,32,27], desc:'Half-Step Down',     short:'Eb (4)' },
  'dropC-4':{ strings:4, notes:[5,0,7,0],      labels:['F','C','G','C'],         midiBase:[41,36,31,24], desc:'Drop C (C-G-C-F)',   short:'Drop C' },
  'bstd-4': { strings:4, notes:[2,9,4,11],     labels:['D','A','E','B'],         midiBase:[38,33,28,23], desc:'B Standard (4)',     short:'B Std (4)' },
  'dstd-4': { strings:4, notes:[5,0,7,2],      labels:['F','C','G','D'],         midiBase:[41,36,31,26], desc:'D Standard (4)',     short:'D Std (4)' },
  'std-5':  { strings:5, notes:[7,2,9,4,11],   labels:['G','D','A','E','B'],     midiBase:[43,38,33,28,23], desc:'Standard 5-Corde',   short:'Std (5)' },
  'std-6':  { strings:6, notes:[0,7,2,9,4,11], labels:['C','G','D','A','E','B'], midiBase:[48,43,38,33,28,23], desc:'Standard 6-Corde',   short:'Std (6)' },
};

const THICKNESS = { 4:[1.5,2.5,3.5,4.5], 5:[1.5,2,3,4,5], 6:[1,1.5,2,3,4,5] };
const FRETS = 15;
const BOX   = 5;
const MARKERS      = [3,5,7,9,12,15];
const DOUBLE_MARKS = new Set([12]);

const defaultLang = localStorage.getItem('bass_lang') || (navigator.language.startsWith('it') ? 'it' : 'en');
const S = { tuning:'std-4', root:0, scale:'major', label:'deg', view:'full', hand:'right', boxStart:0, lang: defaultLang, audio: true };

let quizActiveNote = null;
let quizScore = 0;
let quizCombo = 1;
let quizBestCombo = 0;
let quizTimeLeft = 60;
let quizTimerId = null;
let quizCountdownId = null;
let isQuizRunning = false;

// Tuner state
let tunerActive = false;
let tunerStream = null;
let tunerAnimId = null;
let tunerAnalyser = null;

/* ══════════════════════════════════════
   AUDIO ENGINE
══════════════════════════════════════ */
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume context if suspended (browser autoplay policy)
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playNote(midi) {
  if (!S.audio) return;
  try {
    const ctx = getAudioCtx();
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const now = ctx.currentTime;

    // Main oscillator: sawtooth (biting bass character)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    // Sub oscillator: sine one octave below (adds warmth)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq / 2, now);

    // Low-pass filter: softens harshness, sweeps down like a pluck
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.4);
    filter.Q.setValueAtTime(1.2, now);

    // Master gain envelope: punchy attack, natural decay
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.008); // fast attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8); // decay

    // Sub gain (quieter blend)
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.18, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    // Connect graph
    osc1.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.8);
    osc2.stop(now + 1.8);
  } catch(e) { console.warn('Audio error:', e); }
}

/* ══════════════════════════════════════
   METRONOME ENGINE (Lookahead Scheduler)
   Uses Web Audio clock for sample-accurate timing.
   No setInterval drift.
══════════════════════════════════════ */
const metro = {
  running: false,
  bpm: 80,
  beats: 4,         // beats per bar
  currentBeat: 0,
  nextNoteTime: 0.0,
  lookahead: 25.0,      // ms — how often to call scheduler
  scheduleAhead: 0.1,   // sec — how far ahead to schedule audio
  timerID: null,
  queue: []             // [{time, beat}] for visual sync via rAF
};

function _metroClick(time, isAccent) {
  const ctx = getAudioCtx();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(isAccent ? 1050 : 630, time);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(isAccent ? 0.55 : 0.28, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.07);

  metro.queue.push({ time, beat: metro.currentBeat });
}

function _metroScheduler() {
  const ctx = getAudioCtx();
  while (metro.nextNoteTime < ctx.currentTime + metro.scheduleAhead) {
    _metroClick(metro.nextNoteTime, metro.currentBeat === 0);
    metro.nextNoteTime += (60.0 / metro.bpm);
    metro.currentBeat  = (metro.currentBeat + 1) % metro.beats;
  }
  metro.timerID = setTimeout(_metroScheduler, metro.lookahead);
}

function _metroDraw() {
  if (!metro.running) return;
  const ctx = getAudioCtx();
  const now = ctx.currentTime;
  while (metro.queue.length && metro.queue[0].time < now + 0.012) {
    const info = metro.queue.shift();
    _metroLightBeat(info.beat);
  }
  requestAnimationFrame(_metroDraw);
}

function _metroLightBeat(beat) {
  const dots = document.querySelectorAll('.metro-beat-dot');
  dots.forEach((d, i) => d.classList.toggle('lit', i === beat));
  // Auto-off after ~70ms so the dot doesn't stay lit until next beat
  setTimeout(() => dots.forEach(d => d.classList.remove('lit')), 80);
}

function _buildMetroDots() {
  const c = document.getElementById('metroBeatDots');
  if (!c) return;
  c.innerHTML = '';
  for (let i = 0; i < metro.beats; i++) {
    const d = document.createElement('div');
    d.className = 'metro-beat-dot' + (i === 0 ? ' accent' : '');
    c.appendChild(d);
  }
}

function _setMetroBpm(bpm) {
  metro.bpm = Math.max(30, Math.min(240, bpm));
  const numEl  = document.getElementById('metroBpmNum');
  const slider = document.getElementById('metroBpmSlider');
  if (numEl)  numEl.textContent  = metro.bpm;
  if (slider) slider.value       = metro.bpm;
}

function _metroToggle() {
  if (metro.running) {
    // STOP
    metro.running = false;
    clearTimeout(metro.timerID);
    metro.queue = [];
    metro.currentBeat = 0;
    document.querySelectorAll('.metro-beat-dot').forEach(d => d.classList.remove('lit'));
    const btn = document.getElementById('metroStartBtn');
    const togBtn = document.getElementById('metroTogBtn');
    if (btn) { btn.classList.remove('running'); btn.querySelector('[data-i18n]').dataset.i18n = 'metro_start'; btn.querySelector('[data-i18n]').textContent = tl('metro_start'); }
    if (togBtn) togBtn.classList.remove('metroTogBtn-active');
  } else {
    // START — resume AudioContext if needed (browser autoplay policy)
    getAudioCtx();
    metro.running    = true;
    metro.currentBeat = 0;
    metro.queue      = [];
    metro.nextNoteTime = getAudioCtx().currentTime + 0.05;
    _metroScheduler();
    requestAnimationFrame(_metroDraw);
    const btn = document.getElementById('metroStartBtn');
    const togBtn = document.getElementById('metroTogBtn');
    if (btn) { btn.classList.add('running'); btn.querySelector('[data-i18n]').dataset.i18n = 'metro_stop'; btn.querySelector('[data-i18n]').textContent = tl('metro_stop'); }
    if (togBtn) togBtn.classList.add('metroTogBtn-active');
  }
}

function mkEl(tag,cls) { const d=document.createElement(tag); if(cls) d.className=cls; return d; }

/* ══════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════ */
function showToast(msg, duration = 2500) {
  let t = document.getElementById('_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '_toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast-show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = '', duration);
}

/* ══════════════════════════════════════
   THEME TOGGLE (Dark / Light)
══════════════════════════════════════ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeTogBtn');
  if (btn) btn.textContent = theme === 'light' ? '☀️' : '🌙';
  localStorage.setItem('bass_theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('bass_theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ══════════════════════════════════════
   SHARE BUTTON
══════════════════════════════════════ */
function shareCurrentScale() {
  const url = window.location.origin + window.location.pathname + buildURL();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => showToast(tl('share_copied')))
      .catch(() => prompt(tl('share_fail'), url));
  } else {
    prompt(tl('share_fail'), url);
  }
}

/* ══════════════════════════════════════
   IMAGE EXPORT (html2canvas)
══════════════════════════════════════ */
function exportFretboardImage() {
  if (typeof html2canvas === 'undefined') {
    showToast('Libreria in caricamento, riprova tra un istante...');
    return;
  }
  
  const el = document.getElementById('fretboard');
  if (!el) return;

  const bgCol = getComputedStyle(document.body).backgroundColor;
  showToast('Generazione immagine in corso... 📸');

  html2canvas(el, { 
    backgroundColor: bgCol,
    scale: 2 // High-res export
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `bassmate-${getNoteName(S.root).replace('#','s')}-${SCALES[S.scale].short}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(() => {
    showToast('Errore durante l\'esportazione ❌');
  });
}

/* ══════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════ */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, select, textarea')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight':
        S.root = (S.root + 1) % 12;
        render();
        break;
      case 'ArrowLeft':
        S.root = (S.root + 11) % 12;
        render();
        break;
      case 'q': case 'Q': {
        const qBtn = document.getElementById('quizTogBtn');
        if (qBtn) qBtn.click();
        break;
      }
      case 'm': case 'M': {
        const mBtn = document.getElementById('metroTogBtn');
        if (mBtn) mBtn.click();
        break;
      }
      case 'r': case 'R': {
        const rBtn = document.getElementById('resetBtn');
        if (rBtn) rBtn.click();
        break;
      }
      case '?':
        toggleKbdPanel();
        break;
    }
  });
}

function toggleKbdPanel() {
  let panel = document.getElementById('kbdPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'kbdPanel';
    panel.className = 'kbd-panel';
    panel.innerHTML = `
      <h3 class="kbd-title" id="kbdTitle">${tl('kbd_title')}</h3>
      <div class="kbd-list">
        <span class="kbd-key">← / →</span><span>${tl('kbd_root_lr_desc')}</span>
        <span class="kbd-key">Q</span><span>${tl('kbd_quiz_desc')}</span>
        <span class="kbd-key">M</span><span>${tl('kbd_metro_desc')}</span>
        <span class="kbd-key">R</span><span>${tl('kbd_reset_desc')}</span>
        <span class="kbd-key">?</span><span>${tl('kbd_help_desc')}</span>
      </div>
      <button class="kbd-close" onclick="document.getElementById('kbdPanel').remove()">✕</button>
    `;
    document.body.appendChild(panel);
    setTimeout(() => panel.classList.add('kbd-show'), 10);
  } else {
    panel.remove();
  }
}

/* ══════════════════════════════════════
   QUIZ STATISTICS
══════════════════════════════════════ */
function getQuizStats() {
  try { return JSON.parse(localStorage.getItem('bass_quiz_stats') || '{}'); } catch(e) { return {}; }
}
function saveQuizStats(stats) {
  localStorage.setItem('bass_quiz_stats', JSON.stringify(stats));
}
function recordQuizResult(ni, correct) {
  const stats = getQuizStats();
  if (!stats.notes) stats.notes = {};
  if (!stats.notes[ni]) stats.notes[ni] = { c: 0, w: 0 };
  correct ? stats.notes[ni].c++ : stats.notes[ni].w++;
  if (!stats.sessions) stats.sessions = 0;
  if (!stats.bestScore) stats.bestScore = 0;
  saveQuizStats(stats);
}
function recordQuizSession(score, bestCombo) {
  const stats = getQuizStats();
  stats.sessions = (stats.sessions || 0) + 1;
  stats.bestScore = Math.max(stats.bestScore || 0, score);
  stats.bestCombo = Math.max(stats.bestCombo || 0, bestCombo || 0);
  // Daily streak
  const today = new Date().toDateString();
  if (stats.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    stats.streak = (stats.lastDate === yesterday) ? (stats.streak || 0) + 1 : 1;
    stats.lastDate = today;
  }
  saveQuizStats(stats);
}
function updateQuizStatsDisplay() {
  const el = document.getElementById('quizStatsBar');
  if (!el) return;
  const stats = getQuizStats();
  if (!stats.sessions) { el.textContent = tl('stats_none'); return; }
  const weakNote = (() => {
    if (!stats.notes) return '—';
    let worst = null, worstRatio = -1;
    Object.entries(stats.notes).forEach(([ni, d]) => {
      const total = d.c + d.w;
      if (total < 3) return;
      const ratio = d.w / total;
      if (ratio > worstRatio) { worstRatio = ratio; worst = +ni; }
    });
    return worst !== null ? getNoteName(worst) : '—';
  })();
  el.innerHTML = `<span>📊 ${tl('stats_sessions')}: <strong>${stats.sessions}</strong></span>
    <span>🏅 ${tl('stats_best')}: <strong>${stats.bestScore}</strong></span>
    <span>⚡ ${tl('stats_weak')}: <strong>${weakNote}</strong></span>
    ${stats.streak > 1 ? `<span>🔥 Streak: <strong>${stats.streak}gg</strong></span>` : ''}`;
}

/* ══════════════════════════════════════
   ONBOARDING TOUR (Simple Modal — no spotlight)
══════════════════════════════════════ */
function startTour() {
  if (document.getElementById('tourOverlay')) return;
  if (!document.getElementById('fretboard')) return;

  const total = 7;
  let step = 0;

  // Overlay: fullscreen, above EVERYTHING, blocks all events
  const overlay = document.createElement('div');
  overlay.id = 'tourOverlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:999999',
    'background:rgba(5,5,15,0.82)', 'backdrop-filter:blur(3px)',
    'display:flex', 'align-items:center', 'justify-content:center',
    'pointer-events:all'
  ].join(';');

  // Card: does NOT inherit overlay's stacking issues
  const card = document.createElement('div');
  card.style.cssText = [
    'background:#131326', 'border:1px solid #7c3aed', 'border-radius:18px',
    'padding:32px 28px', 'max-width:380px', 'width:90%',
    'box-shadow:0 16px 60px rgba(0,0,0,0.7)',
    'pointer-events:all', 'position:relative'
  ].join(';');

  function render() {
    const isLast = step === total - 1;
    card.innerHTML = `
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:10px;">${step + 1} / ${total}</div>
      <div style="font-size:20px;font-weight:900;color:#7c3aed;margin-bottom:12px;line-height:1.3;">${tl('tour_' + step + '_t')}</div>
      <div style="font-size:14px;color:#dcdcf5;opacity:.9;line-height:1.65;margin-bottom:24px;">${tl('tour_' + step + '_b')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <button id="_tSkip" style="background:none;border:none;color:#6b7280;font-size:13px;cursor:pointer;padding:4px;">${tl('tour_skip')}</button>
        <button id="_tNext" style="padding:10px 24px;border-radius:8px;border:none;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(124,58,237,.5);">${isLast ? tl('tour_done') : tl('tour_next')}</button>
      </div>
    `;
    card.querySelector('#_tSkip').onclick = () => { overlay.remove(); localStorage.setItem('bass_toured', '1'); };
    card.querySelector('#_tNext').onclick = () => {
      if (step >= total - 1) { overlay.remove(); localStorage.setItem('bass_toured', '1'); return; }
      step++;
      render();
    };
  }

  render();
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

function maybeStartTour() {
  if (localStorage.getItem('bass_toured')) return;
  setTimeout(startTour, 800);
}

/* ══════════════════════════════════════
   ASYNC INIT AND INJECTIONS
══════════════════════════════════════ */
async function initApp() {
  const hp = document.getElementById('header-placeholder');
  const fp = document.getElementById('footer-placeholder');
  
  const cb = '?v=' + new Date().getTime();
  const promises = [];
  if (hp) promises.push(fetch('header.html'+cb).then(r=>r.text()).then(html => hp.innerHTML = html));
  if (fp) promises.push(fetch('footer.html'+cb).then(r=>r.text()).then(html => fp.innerHTML = html));
  
  try {
    await Promise.all(promises);
  } catch (err) {
    console.error("Component fetch failed.", err);
  }

  // MINIMAL HEADER LOGIC
  const path = window.location.pathname;
  const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
  if (!isHome) {
    document.body.classList.add('minimal-header');
  }

  // BIND LANG (Globale)
  const lc = document.getElementById('langCtrl');
  if (lc) {
    lc.addEventListener('click', e => {
      const btn = e.target.closest('[data-v]');
      if (!btn) return;
      S.lang = btn.dataset.v;
      localStorage.setItem('bass_lang', S.lang);
      lc.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === S.lang));
      updateI18nLabels();
      if(typeof render === 'function') render();
    });
    // Set initial active state
    lc.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === S.lang));
  }
  
  updateI18nLabels();

  if (document.getElementById('tuningCtrl')) {
    
    // BUILD CONTROLS
    Object.entries(TUNINGS).forEach(([k, t]) => {
      const b = mkEl('option'); b.value = k; b.textContent = tl(t.short);
      if (k === S.tuning) b.selected = true;
      document.getElementById('tuningCtrl').appendChild(b);
    });
    for(let i=0; i<12; i++) {
      const b = mkEl('button','p'); b.dataset.v = i; b.textContent = getNoteName(i);
      b.id = 'rootBtn_' + i;
      if (i===S.root) b.classList.add('on');
      document.getElementById('rootCtrl').appendChild(b);
    }
    ['base','modes','arps','other'].forEach(g => {
      const panel = document.getElementById('sg-'+g);
      if(!panel) return;
      Object.entries(SCALES).filter(([,v])=>v.g===g).forEach(([k,v]) => {
        const b = mkEl('button','p'); b.dataset.v = k; b.textContent = tl(v.short);
        if (k===S.scale) b.classList.add('on');
        panel.appendChild(b);
      });
    });

    // BIND DROPDOWNS
    function bindSelect(id, key) {
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('change', e => {
        S[key] = e.target.value;
        if(key === 'view' && S.view === 'quiz') startQuiz();
        render();
      });
    }
    bindSelect('tuningCtrl', 'tuning');
    bindSelect('labelCtrl',  'label');
    bindSelect('viewCtrl',   'view');
    bindSelect('handCtrl',   'hand');

    // BIND PILLS
    function bindPills(id, key, isNum) {
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('click', e => {
        const btn = e.target.closest('[data-v]');
        if (!btn) return;
        S[key] = isNum ? +btn.dataset.v : btn.dataset.v;
        el.querySelectorAll('[data-v]').forEach(b=>b.classList.remove('on'));
        btn.classList.add('on');
        
        if(key === 'lang') {
            localStorage.setItem('bass_lang', S.lang);
            updateI18nLabels();
        }
        render();
      });
    }
    bindPills('rootCtrl',  'root',   true);

    const viewCtrlEl = document.getElementById('viewCtrl');
    if(viewCtrlEl) viewCtrlEl.addEventListener('change', ()=>{ S.boxStart=0; });

    document.getElementById('sgTabs').addEventListener('click', e => {
      const tab = e.target.closest('.sg-tab');
      if (!tab) return;
      const g = tab.dataset.g;
      document.querySelectorAll('.sg-tab').forEach(t=>t.classList.remove('on'));
      document.querySelectorAll('.sg-panel').forEach(p=>p.classList.remove('show'));
      tab.classList.add('on');
      document.getElementById('sg-'+g).classList.add('show');
      
      if (SCALES[S.scale].g !== g) {
        const first = Object.keys(SCALES).find(k=>SCALES[k].g===g);
        if (first) { S.scale = first; syncScalePills(); }
      }
      render();
    });

    ['base','modes','arps','other'].forEach(g => {
      document.getElementById('sg-'+g).addEventListener('click', e => {
        const btn = e.target.closest('[data-v]');
        if (!btn) return;
        S.scale = btn.dataset.v;
        syncScalePills();
        render();
      });
    });

    const expBtn = document.getElementById('exportBtn');
    if(expBtn) expBtn.addEventListener('click', ()=> window.print());

    const pL = document.getElementById('posL');
    if(pL) pL.addEventListener('click', ()=>{ S.boxStart=Math.max(0,S.boxStart-1); render(); });
    const pR = document.getElementById('posR');
    if(pR) pR.addEventListener('click', ()=>{ S.boxStart=Math.min(FRETS-BOX+1,S.boxStart+1); render(); });

    const rstBtn = document.getElementById('resetBtn');
    if(rstBtn) {
      rstBtn.addEventListener('click', () => {
        location.hash = ''; // Resetta l'URL
        S.tuning='std-4'; S.root=0; S.scale='major'; S.label='deg'; S.view='full'; S.hand='right'; S.boxStart=0;
        
        document.getElementById('tuningCtrl').value = S.tuning;
        document.getElementById('labelCtrl').value = S.label;
        document.getElementById('viewCtrl').value = S.view;
        document.getElementById('handCtrl').value = S.hand;
        
        document.querySelectorAll('#rootCtrl [data-v]').forEach(b=>b.classList.toggle('on', +b.dataset.v===0));
        document.querySelectorAll('#sgTabs .sg-tab').forEach(t=>t.classList.toggle('on',t.dataset.g==='base'));
        document.querySelectorAll('.sg-panel').forEach(p=>p.classList.toggle('show',p.dataset.g==='base'));
        syncScalePills();
        render();
      });
    }
    
    // FAVORITES SYSTEM
    const favBtn = document.getElementById('favBtn');
    const favCtrl = document.getElementById('favCtrl');
    
    function updateFavDropdown() {
      const favs = JSON.parse(localStorage.getItem('bass_favs') || '[]');
      if(favs.length === 0) { if(favCtrl) favCtrl.style.display = 'none'; return; }
      if(favCtrl) {
          favCtrl.style.display = 'inline-block';
          favCtrl.innerHTML = `<option value="">${tl('fav_def')}...</option>` + favs.map((f, i) => `<option value="${i}">${f.name}</option>`).join('');
      }
    }
    
    if(favBtn) {
      favBtn.addEventListener('click', () => {
        const name = prompt("Salva questo setup! Che nome gli diamo?", "Mio Groove");
        if(!name) return;
        syncURL();
        const favs = JSON.parse(localStorage.getItem('bass_favs') || '[]');
        favs.push({name, hash: location.hash});
        localStorage.setItem('bass_favs', JSON.stringify(favs));
        updateFavDropdown();
      });
    }
    if(favCtrl) {
      favCtrl.addEventListener('change', (e) => {
        const val = e.target.value;
        if(val === '') return;
        const favs = JSON.parse(localStorage.getItem('bass_favs') || '[]');
        if(favs[val]) {
           location.hash = favs[val].hash;
           loadURL();
           if(S.view === 'quiz') startQuiz();
           render();
        }
        e.target.value = '';
      });
      updateFavDropdown();
    }
    
    // QUIZ BTN TOGGLE
    const qTog = document.getElementById('quizTogBtn');
    if(qTog) {
      qTog.addEventListener('click', () => {
        if(S.view === 'quiz') {
          S.view = document.getElementById('viewCtrl').value || 'full';
          document.querySelectorAll('.quiz-time-opt').forEach(el=>el.style.display='none');
          stopQuiz(); // Stop if navigating away
        } else {
          S.view = 'quiz';
          document.querySelectorAll('.quiz-time-opt').forEach(el=>el.style.display='inline-flex');
          resetQuiz(); // Reset to clean state when opening
        }
        render();
      });
    }

    // QUIZ CONTROLS
    const qsBtn = document.getElementById('quizStartBtn');
    const qstBtn = document.getElementById('quizStopBtn');
    const qrBtn = document.getElementById('quizResetBtn');
    if(qsBtn) qsBtn.addEventListener('click', () => { if(!isQuizRunning) startQuiz(); });
    if(qstBtn) qstBtn.addEventListener('click', stopQuiz);
    if(qrBtn) qrBtn.addEventListener('click', resetQuiz);

    // QUIZ BTNS BUILDER OR UPDATE
    function buildQuizBtns() {
      const qb = document.getElementById('quizBtns');
      if(!qb) return;
      qb.innerHTML = '';
      for(let i=0; i<12; i++) {
          const b = mkEl('button', 'quiz-btn');
          b.innerText = getNoteName(i);
          b.onclick = () => handleQuizGuess(i, b);
          qb.appendChild(b);
      }
    }
    
    // Lo espongo su window per chiamarlo nel render()
    window.buildQuizBtns = buildQuizBtns;
    buildQuizBtns();

    // METRONOME BINDINGS
    _buildMetroDots();

    const metroTogBtn = document.getElementById('metroTogBtn');
    if (metroTogBtn) {
      metroTogBtn.addEventListener('click', () => {
        const panel = document.getElementById('metroPanel');
        if (panel) panel.classList.toggle('show');
        // If hiding, also stop the metro
        if (panel && !panel.classList.contains('show') && metro.running) _metroToggle();
      });
    }

    const metroStartBtn = document.getElementById('metroStartBtn');
    if (metroStartBtn) metroStartBtn.addEventListener('click', _metroToggle);

    const metroBpmUp = document.getElementById('metroBpmUp');
    if (metroBpmUp) metroBpmUp.addEventListener('click', () => _setMetroBpm(metro.bpm + 1));

    const metroBpmDn = document.getElementById('metroBpmDn');
    if (metroBpmDn) metroBpmDn.addEventListener('click', () => _setMetroBpm(metro.bpm - 1));

    // Hold +/- for fast scroll
    let _bpmHoldTimer = null;
    function _startBpmHold(dir) {
      _bpmHoldTimer = setInterval(() => _setMetroBpm(metro.bpm + dir), 80);
    }
    function _stopBpmHold() { clearInterval(_bpmHoldTimer); }
    if (metroBpmUp) { metroBpmUp.addEventListener('mousedown', () => _startBpmHold(+1)); metroBpmUp.addEventListener('touchstart', () => _startBpmHold(+1), {passive:true}); }
    if (metroBpmDn) { metroBpmDn.addEventListener('mousedown', () => _startBpmHold(-1)); metroBpmDn.addEventListener('touchstart', () => _startBpmHold(-1), {passive:true}); }
    document.addEventListener('mouseup',  _stopBpmHold);
    document.addEventListener('touchend', _stopBpmHold);

    const metroBpmSlider = document.getElementById('metroBpmSlider');
    if (metroBpmSlider) metroBpmSlider.addEventListener('input', e => _setMetroBpm(+e.target.value));

    const metroTimeSig = document.getElementById('metroTimeSig');
    if (metroTimeSig) {
      metroTimeSig.addEventListener('change', e => {
        metro.beats = +e.target.value;
        metro.currentBeat = 0;
        _buildMetroDots();
        // Restart scheduler if running to apply immediately
        if (metro.running) {
          clearTimeout(metro.timerID);
          metro.queue = [];
          metro.nextNoteTime = getAudioCtx().currentTime + 0.05;
          _metroScheduler();
        }
      });
    }

    // SHARE BUTTON
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) shareBtn.addEventListener('click', shareCurrentScale);

    // SNAPSHOT BUTTON
    const snapBtn = document.getElementById('snapshotBtn');
    if (snapBtn) snapBtn.addEventListener('click', exportFretboardImage);

    // KEYBOARD SHORTCUTS
    initKeyboardShortcuts();

    // TRANSPOSE BUTTONS
    const transpDn = document.getElementById('transpDn');
    const transpUp = document.getElementById('transpUp');
    if (transpDn) transpDn.addEventListener('click', () => { S.root = (S.root + 11) % 12; render(); });
    if (transpUp) transpUp.addEventListener('click', () => { S.root = (S.root + 1) % 12; render(); });

    // THEME TOGGLE
    const themeBtn = document.getElementById('themeTogBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // TUNER TOGGLE
    const tunerTogBtn = document.getElementById('tunerTogBtn');
    if(tunerTogBtn) {
      tunerTogBtn.addEventListener('click', () => {
        const panel = document.getElementById('tunerPanel');
        if(!panel) return;
        const isOpen = panel.classList.toggle('show');
        if(isOpen) {
          startTuner();
          tunerTogBtn.style.background = 'var(--accent)';
          tunerTogBtn.style.color = '#fff';
        } else {
          stopTuner();
          tunerTogBtn.style.background = '';
          tunerTogBtn.style.color = '';
        }
      });
    }

    initTheme();

    loadURL();
    if(S.view === 'quiz') startQuiz();
    render();
    updateQuizStatsDisplay();
    maybeStartTour();
  } else {
    updateI18nLabels();
  }
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('No PWA support.', err));
  }
}

function syncScalePills() {
  document.querySelectorAll('.sg-panel [data-v]').forEach(b=>b.classList.toggle('on', b.dataset.v===S.scale));
}

/* ══════════════════════════════════════
   CHROMATIC TUNER ENGINE
══════════════════════════════════════ */
const TUNER_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

function autoCorrelate(buf, sampleRate) {
  // RMS silence check
  let rms = 0;
  for(let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / buf.length);
  if(rms < 0.01) return -1; // too quiet

  // Autocorrelation
  const SIZE = buf.length;
  const corr = new Float32Array(SIZE);
  for(let lag = 0; lag < SIZE; lag++) {
    let s = 0;
    for(let i = 0; i < SIZE - lag; i++) s += buf[i] * buf[i + lag];
    corr[lag] = s;
  }

  // Find first peak after initial dip
  let d = 0;
  while(d < SIZE && corr[d] > corr[d+1]) d++;  // go downhill
  let maxVal = -Infinity, maxPos = -1;
  for(let i = d; i < SIZE; i++) {
    if(corr[i] > maxVal) { maxVal = corr[i]; maxPos = i; }
  }
  if(maxPos === -1 || corr[maxPos] < corr[0] * 0.5) return -1; // weak correlation

  // Sub-sample interpolation for accuracy
  const x0 = corr[maxPos - 1], x1 = corr[maxPos], x2 = corr[maxPos + 1] || 0;
  const shift = (x2 - x0) / (2 * (2 * x1 - x2 - x0)) || 0;
  return sampleRate / (maxPos + shift);
}

function freqToNoteInfo(freq) {
  // A4 = 440 Hz
  const semitones = 12 * Math.log2(freq / 440);
  const noteIndex = Math.round(semitones) % 12;
  const noteI = ((noteIndex % 12) + 12) % 12;
  const noteName = TUNER_NOTES[noteI];
  const cents = Math.round((semitones - Math.round(semitones)) * 100);
  const octave = Math.floor((Math.round(semitones) + 57) / 12) + 1;
  return { noteName, cents, octave };
}

async function startTuner() {
  const statusEl  = document.getElementById('tunerStatus');
  try {
    tunerStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch(e) {
    if(statusEl) statusEl.textContent = '❌ Microfono non accessibile. Controlla i permessi.';
    return;
  }

  const ctx = getAudioCtx();
  const source = ctx.createMediaStreamSource(tunerStream);
  tunerAnalyser = ctx.createAnalyser();
  tunerAnalyser.fftSize = 2048;
  source.connect(tunerAnalyser);

  const buf = new Float32Array(tunerAnalyser.fftSize);
  tunerActive = true;
  if(statusEl) statusEl.textContent = '🎵 Ascolto in corso...';

  function tick() {
    if(!tunerActive) return;
    tunerAnimId = requestAnimationFrame(tick);
    tunerAnalyser.getFloatTimeDomainData(buf);
    const freq = autoCorrelate(buf, ctx.sampleRate);

    const noteEl   = document.getElementById('tunerNote');
    const freqEl   = document.getElementById('tunerFreq');
    const centsEl  = document.getElementById('tunerCents');
    const needleEl = document.getElementById('tunerNeedle');

    if(freq < 0) {
      if(noteEl)  { noteEl.textContent = '—'; noteEl.className = 'tuner-note-display'; }
      if(freqEl)  freqEl.textContent = '— Hz';
      if(centsEl) centsEl.textContent = '— cents';
      if(needleEl){ needleEl.style.left = '50%'; needleEl.className = 'tuner-needle'; }
      return;
    }

    const { noteName, cents, octave } = freqToNoteInfo(freq);
    const absCents = Math.abs(cents);
    const status = absCents <= 5 ? 'in-tune' : absCents <= 15 ? 'close' : 'out';

    if(noteEl)  { noteEl.textContent = noteName + octave; noteEl.className = 'tuner-note-display ' + status; }
    if(freqEl)  freqEl.textContent = freq.toFixed(1) + ' Hz';
    if(centsEl) { centsEl.textContent = (cents >= 0 ? '+' : '') + cents + ' cents'; centsEl.style.color = status === 'in-tune' ? '#10b981' : status === 'close' ? '#f59e0b' : '#ef4444'; }

    // Move needle: 0 cents = 50%, ±50 cents = 0% / 100%
    if(needleEl) {
      const clampedCents = Math.max(-50, Math.min(50, cents));
      const pct = 50 + clampedCents; // 0-100
      needleEl.style.left = pct + '%';
      needleEl.className = 'tuner-needle ' + status;
    }
  }
  tick();
}

function stopTuner() {
  tunerActive = false;
  if(tunerAnimId) cancelAnimationFrame(tunerAnimId);
  if(tunerStream) { tunerStream.getTracks().forEach(t => t.stop()); tunerStream = null; }
  const noteEl   = document.getElementById('tunerNote');
  const freqEl   = document.getElementById('tunerFreq');
  const centsEl  = document.getElementById('tunerCents');
  const needleEl = document.getElementById('tunerNeedle');
  const statusEl = document.getElementById('tunerStatus');
  if(noteEl)  { noteEl.textContent = '—'; noteEl.className = 'tuner-note-display'; }
  if(freqEl)  freqEl.textContent = '— Hz';
  if(centsEl) { centsEl.textContent = '0 cents'; centsEl.style.color = ''; }
  if(needleEl){ needleEl.style.left = '50%'; needleEl.className = 'tuner-needle'; }
  if(statusEl) statusEl.textContent = 'Premi 🎹 Tuner per iniziare';
}

/* ══════════════════════════════════════
   ARCADE QUIZ ENGINE
══════════════════════════════════════ */
function startQuiz() {
  quizScore = 0;
  quizCombo = 1;
  quizBestCombo = 0;
  const tc = document.getElementById('quizTimeCtrl');
  const timeStr = tc ? tc.value : '60';
  isQuizRunning = false; 
  if(quizTimerId) clearInterval(quizTimerId);
  
  const qs = document.getElementById('quizScore');
  const qc = document.getElementById('quizCombo');
  const qt = document.getElementById('quizTime');
  const fill = document.getElementById('quizTimerFill');
  const btns = document.getElementById('quizBtns');
  
  if (qs) qs.innerText = 'Pronti?';
  if (qc) { qc.innerText = ''; qc.className = 'quiz-combo'; }
  if (qt) qt.innerText = '⏱️ ...';
  if (fill) { fill.style.width = '100%'; fill.classList.remove('urgent'); }
  if (btns) btns.style.opacity = '0.5';

  quizActiveNote = null; // Disabilita click durante il countdown
  renderFretboard();

  // Countdown overlay e Toast
  let count = 3;
  showToast(count + '...');
  
  quizCountdownId = setInterval(() => {
    count--;
    if(count > 0) {
      showToast(count + '...');
    } else {
      clearInterval(quizCountdownId);
      showToast('GO! 🔥');
      
      isQuizRunning = true;
      if(btns) btns.style.opacity = '1';
      if(qs) qs.innerText = 'Go!';
      if(qc) qc.innerText = 'Combo x1';

      
      generateQuizNode();
      renderFretboard();

      if (timeStr !== 'infinite') {
        const totalTime = parseInt(timeStr, 10);
        quizTimeLeft = totalTime;
        if(fill) fill.style.display = 'block';
        if(qt) qt.innerText = `⏱️ ${quizTimeLeft}s`;

        quizTimerId = setInterval(() => {
          quizTimeLeft--;
          if(qt) qt.innerText = `⏱️ ${quizTimeLeft}s`;
          if(fill) {
            const pct = (quizTimeLeft / totalTime) * 100;
            fill.style.width = pct + '%';
            if(quizTimeLeft <= 10) fill.classList.add('urgent');
          }
          if(quizTimeLeft <= 0) {
            endQuizMode();
          }
        }, 1000);
      } else {
        if(qt) qt.innerText = '⏱️ ∞';
        if(fill) fill.style.display = 'none';
      }
    }
  }, 1000);
}

function stopQuiz() {
  isQuizRunning = false;
  if(quizTimerId) clearInterval(quizTimerId);
  if(quizCountdownId) clearInterval(quizCountdownId);
  quizActiveNote = null;
  const qt = document.getElementById('quizTime');
  if(qt) qt.innerText = '⏱️ PAUSA';
  const btns = document.getElementById('quizBtns');
  if(btns) btns.style.opacity = '0.5';
  renderFretboard();
}

function resetQuiz() {
  stopQuiz();
  quizScore = 0;
  quizCombo = 1;
  const qs = document.getElementById('quizScore');
  const qc = document.getElementById('quizCombo');
  const fill = document.getElementById('quizTimerFill');
  const tc = document.getElementById('quizTimeCtrl');
  
  if (qs) qs.innerText = 'Punteggio: 0';
  if (qc) { qc.innerText = 'Combo x1'; qc.className = 'quiz-combo'; }
  if (fill) { fill.style.width = '100%'; fill.classList.remove('urgent'); }
  const qt = document.getElementById('quizTime');
  if (qt) qt.innerText = '⏱️ ' + (tc ? tc.value : '60') + 's';
}

function endQuizMode() {
  isQuizRunning = false;
  clearInterval(quizTimerId);
  if(quizCountdownId) clearInterval(quizCountdownId);
  quizActiveNote = null;
  recordQuizSession(quizScore, quizBestCombo);
  const stats = getQuizStats();
  
  // --- Risultato finale: modale ---
  const existing = document.getElementById('quizResultModal');
  if(existing) existing.remove();

  const weakNote = (() => {
    if (!stats.notes) return '—';
    let worst = null, worstRatio = -1;
    Object.entries(stats.notes).forEach(([ni, d]) => {
      const total = d.c + d.w;
      if (total < 3) return;
      const ratio = d.w / total;
      if (ratio > worstRatio) { worstRatio = ratio; worst = +ni; }
    });
    return worst !== null ? getNoteName(worst) : '—';
  })();

  const modal = document.createElement('div');
  modal.id = 'quizResultModal';
  modal.className = 'quiz-result-modal';
  modal.innerHTML = `
    <div class="quiz-result-card">
      <div class="quiz-result-title">⏱️ Tempo scaduto!</div>
      <div class="quiz-result-score">${quizScore}</div>
      <div class="quiz-result-label">Punti totali</div>
      <div class="quiz-result-stats">
        <div class="quiz-result-stat">
          <span class="qrs-val">x${quizBestCombo}</span>
          <span class="qrs-lbl">Combo Max</span>
        </div>
        <div class="quiz-result-stat">
          <span class="qrs-val">${stats.bestScore}</span>
          <span class="qrs-lbl">Record</span>
        </div>
        <div class="quiz-result-stat">
          <span class="qrs-val">${weakNote}</span>
          <span class="qrs-lbl">Nota debole</span>
        </div>
      </div>
      ${quizScore >= (stats.bestScore || 0) ? '<div class="quiz-result-new-record">🏆 Nuovo Record!</div>' : ''}
      <div style="display:flex; gap:12px;">
        <button class="quiz-ctrl-btn" id="quizResultRetry" style="flex:1; background:var(--accent); color:#fff; border-color:var(--accent);">▶️ Rigioca</button>
        <button class="quiz-ctrl-btn" id="quizResultClose" style="flex:1;">✖ Chiudi</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if(e.target === modal) modal.remove(); });
  document.getElementById('quizResultRetry').addEventListener('click', () => { modal.remove(); startQuiz(); });
  document.getElementById('quizResultClose').addEventListener('click', () => modal.remove());

  setTimeout(updateQuizStatsDisplay, 100);
  renderFretboard();
}

function generateQuizNode() {
  const t = TUNINGS[S.tuning];
  const maxFret = Math.min(12, FRETS);
  const s = Math.floor(Math.random() * t.strings);
  const f = Math.floor(Math.random() * maxFret) + 1; 
  const ni = (t.notes[s] + f) % 12;
  quizActiveNote = {s, f, ni};

  // Ear training: suona la nota automaticamente!
  if(S.audio) {
    const midi = t.midiBase[s] + f;
    playNote(midi);
  }
}

function handleQuizGuess(ni, btn) {
   if (!quizActiveNote || !isQuizRunning) {
     if(!isQuizRunning && quizTimeLeft <= 0) startQuiz(); // Restart upon click
     return;
   }
   
   const qs = document.getElementById('quizScore');
   const qc = document.getElementById('quizCombo');

   if (ni === quizActiveNote.ni) {
       btn.classList.add('correct');
       const pointsEarned = 10 * quizCombo;
       quizScore += pointsEarned;
       quizCombo++;
       if(quizCombo - 1 > quizBestCombo) quizBestCombo = quizCombo - 1;
       
       if (qs) qs.innerText = 'Score: ' + quizScore;
       if (qc) {
         qc.innerText = 'Combo x' + quizCombo;
         qc.classList.add('pop');
         setTimeout(() => qc.classList.remove('pop'), 200);
       }
       
       recordQuizResult(ni, true);
       setTimeout(() => {
           btn.classList.remove('correct');
           if(isQuizRunning) { generateQuizNode(); renderFretboard(); }
       }, 300);
   } else {
       btn.classList.add('wrong');
       recordQuizResult(quizActiveNote.ni, false);
       
       // Fai lampeggiare il pallino sbagliato sul manico in rosso
       const wrongDot = document.querySelector('.nd.q-dot');
       if(wrongDot) {
         wrongDot.style.background = '#ef4444';
         wrongDot.style.boxShadow = '0 0 20px #ef4444';
         wrongDot.style.transform = 'translate(-50%,-50%) scale(1.3)';
         setTimeout(() => {
           wrongDot.style.background = '';
           wrongDot.style.boxShadow = '';
           wrongDot.style.transform = '';
         }, 500);
       }
       
       // Sbagliato? Perdi la combo
       quizCombo = 1;
       if (qc) {
         qc.innerText = 'Combo Break!';
         qc.style.color = '#ef4444';
         setTimeout(() => { qc.innerText = 'Combo x1'; qc.style.color = ''; }, 1000);
       }
       setTimeout(() => btn.classList.remove('wrong'), 400);
   }
}


/* ══════════════════════════════════════
   CORE LOGIC & RENDER
══════════════════════════════════════ */
function scaleNotes() { return SCALES[S.scale].iv.map(i=>(S.root+i)%12); }
function getDeg(ni) {
  const d = ((ni-S.root)+12)%12;
  const i = SCALES[S.scale].iv.indexOf(d);
  return i>=0 ? SCALES[S.scale].dg[i] : null;
}
function dotLabel(ni, f) {
  if (S.label === 'finger') {
    if (f === 0) return '0';
    if (S.view === 'quiz') return '?';
    // In full view: show finger relative to natural 4-fret hand position block
    // Fret 1-4 = 1,2,3,4 | Fret 5-8 = 1,2,3,4 | etc.
    if (S.view === 'full') return String(((f - 1) % 4) + 1);
    return String(Math.min(4, Math.max(1, f - S.boxStart + 1)));
  }
  return (S.label === 'note' || S.label === 'solfege') ? getNoteName(ni) : getDeg(ni); 
}

function updateI18nLabels() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = tl(el.dataset.i18n);
    if(el.tagName === 'OPTION' && el.parentElement.tagName === 'SELECT') el.text = val;
    else el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = tl(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = tl(el.dataset.i18nTitle);
  });

  const itBlock = document.getElementById('text-it');
  const enBlock = document.getElementById('text-en');
  if(itBlock && enBlock) {
    itBlock.style.display = S.lang === 'it' ? 'block' : 'none';
    enBlock.style.display = S.lang === 'en' ? 'block' : 'none';
  }
  
  
  // Aggiorna l'attributo lang dell'HTML dinamicamente
  document.documentElement.lang = S.lang;

  const tc = document.getElementById('tuningCtrl');
  if (tc) {
    Array.from(tc.options).forEach(opt => { opt.text = tl(TUNINGS[opt.value].short); });
    document.querySelectorAll('.sg-panel [data-v]').forEach(el => el.textContent = tl(SCALES[el.dataset.v].short));
  }
  
  // Aggiorna score quiz se a zero (non sovrascrivere punteggio in corso)
  const qs = document.getElementById('quizScore');
  if (qs && quizScore === 0) qs.innerText = tl('quiz_initial');
}

function render() {
  updateI18nLabels();
  const qp = document.getElementById('quizPanel');
  const sl = document.querySelector('.td-row-scales');
  const sr = document.querySelector('.td-row-root');
  const info = document.getElementById('scaleInfo');
  const leg = document.getElementById('fbLegend');
  
  if (S.view === 'quiz') {
      if(qp) qp.classList.add('show');
      if(sl) sl.style.display = 'none';
      if(sr) sr.style.display = 'none';
      if(info) info.style.display = 'none';
      if(leg) leg.style.display = 'none';
  } else {
      if(qp) qp.classList.remove('show');
      if(sl) sl.style.display = 'flex';
      if(sr) sr.style.display = 'flex';
      if(info) info.style.display = 'flex';
      if(leg) leg.style.display = 'flex';
      quizActiveNote = null;
  }
  
  if (S.view !== 'quiz') { renderInfo(); }
  
  // Update root buttons names just in case label changed
  for(let i=0; i<12; i++) {
     const rb = document.getElementById('rootBtn_' + i);
     if(rb) rb.textContent = getNoteName(i);
  }
  if(window.buildQuizBtns) window.buildQuizBtns();

  renderFretboard();
  syncURL();
}

function renderInfo() {
  const sn = scaleNotes();
  const sd = SCALES[S.scale];
  const t  = TUNINGS[S.tuning];
  
  document.title = `${getNoteName(S.root)} ${tl(sd.name)} — ${tl('string_title')} ${t.strings} ${tl('strings_label')} | Bassmate`;
  
  const scaleInfoId = document.getElementById('scaleInfo');
  if(!scaleInfoId) return;

  const html = `
     <div class="si-left">
       <div class="si-name">${getNoteName(S.root)} ${tl(sd.name)}</div>
       <div class="si-sub">${tl(t.desc)} &nbsp;·&nbsp; ${intervalFormula(sd.iv)}</div>
     </div>
     <div class="notes-row">` +
    sn.map((ni,i)=>`<div class="nb ${ni===S.root?'root':''}">
        <div class="nb-n">${getNoteName(ni)}</div>
        <div class="nb-d">${sd.dg[i]}</div>
     </div>`).join('') + `</div>`;
     
  scaleInfoId.innerHTML = html;
}

function renderFretboard() {
  const fb = document.getElementById('fretboard');
  if(!fb) return;

  const t      = TUNINGS[S.tuning];
  const sn     = scaleNotes();
  const th     = THICKNESS[t.strings];
  const isBox  = S.view === 'box';
  const fStart = isBox ? S.boxStart : 0;
  const fEnd   = isBox ? S.boxStart+BOX-1 : FRETS;

  const pb = document.getElementById('posBar');
  if (isBox) {
    pb.classList.remove('hide');
    document.getElementById('posTxt').textContent = `${tl('position')} ${fStart} – ${fEnd}`;
  } else {
    pb.classList.add('hide');
  }

  fb.innerHTML = '';

  const lcol = mkEl('div','fb-labels');
  t.notes.forEach(stringOpenNote => {
    const d = mkEl('div','fb-lbl'); d.textContent = getNoteName(stringOpenNote);
    lcol.appendChild(d);
  });

  const main = mkEl('div','fb-main');
  if(S.hand === 'left') main.classList.add('lefty');
  main.appendChild(numRow(fStart,fEnd));

  const neck = mkEl('div','fb-neck');
  if (fStart===0) neck.appendChild(mkEl('div','fb-nut'));

  for (let f=fStart; f<=fEnd; f++) {
    if (f===0) continue;
    const w = mkEl('div','fb-wire'); w.style.left = `calc(${f - fStart + 1} * 60px)`;
    neck.appendChild(w);
  }

  MARKERS.forEach(pos => {
    if (pos<fStart||pos>fEnd) return;
    if (DOUBLE_MARKS.has(pos)) {
      [-13,13].forEach(off=>{
        const m=mkEl('div','fb-dot'); m.style.left=`calc(${pos - fStart + 0.5} * 60px + ${off}px)`;
        neck.appendChild(m);
      });
    } else {
      const m=mkEl('div','fb-dot'); m.style.left=`calc(${pos - fStart + 0.5} * 60px)`;
      neck.appendChild(m);
    }
  });

  const sa = mkEl('div','fb-strings');
  t.notes.forEach((openNote,si) => {
    const row = mkEl('div','fb-str');
    const sl  = mkEl('div','fb-sl'); sl.style.height = th[si]+'px'; row.appendChild(sl);

    for (let f=fStart; f<=fEnd; f++) {
      
      // LOGICA QUIZ MODE TRONCATA
      if(quizActiveNote) {
         if(si === quizActiveNote.s && f === quizActiveNote.f) {
            const d = mkEl('div','nd q-dot');
            d.style.left = `calc(${f - fStart + 0.5} * 60px)`;
            const span = mkEl('span'); span.textContent = '?'; d.appendChild(span);
            row.appendChild(d);
         }
         continue;
      }
      
      // NORMALE
      const ni = (openNote+f)%12;
      if (!sn.includes(ni)) continue;
      const isRoot = ni===S.root;
      const d = mkEl('div','nd '+(isRoot?'rn':'sn'));
      d.style.left = `calc(${f - fStart + 0.5} * 60px)`;
      
      const span = mkEl('span'); span.textContent = dotLabel(ni, f); d.appendChild(span);
      d.title = `${getNoteName(ni)}  ·  ${getDeg(ni)}  ·  fret ${f}`;
      
      const midiNote = t.midiBase[si] + f;
      d.onclick = function() {
        d.classList.add('playing');
        setTimeout(() => d.classList.remove('playing'), 300);
        playNote(midiNote);
      };
      row.appendChild(d);
    }
    sa.appendChild(row);
  });

  neck.appendChild(sa); main.appendChild(neck);
  const nb2 = numRow(fStart,fEnd); nb2.style.marginTop='4px'; main.appendChild(nb2);
  fb.appendChild(lcol); fb.appendChild(main);
}

function numRow(fStart,fEnd) {
  const row = mkEl('div','fb-nums');
  for (let f=fStart; f<=fEnd; f++) {
    const n = mkEl('div','fb-n'+(f===0?' z':'')); n.textContent = f; row.appendChild(n);
  }
  return row;
}

/* ══════════════════════════════════════
   URL SYNC
══════════════════════════════════════ */
function syncURL() {
  history.replaceState(null,'',`#r=${S.root}&s=${S.scale}&t=${S.tuning}&l=${S.label}&v=${S.view}&h=${S.hand}&b=${S.boxStart}&lang=${S.lang}`);
}
function loadURL() {
  const h = location.hash.slice(1);
  if (!h) return;
  const p = Object.fromEntries(h.split('&').map(x=>x.split('=')));
  if (p.r!==undefined && !isNaN(+p.r)) S.root = +p.r;
  if (p.s && SCALES[p.s]) S.scale = p.s;
  if (p.t && TUNINGS[p.t]) S.tuning = p.t;
  if (p.l) S.label = p.l;
  if (p.v) S.view = p.v;
  if (p.h) S.hand = p.h;
  if (p.b!==undefined) S.boxStart = +p.b;
  if (p.lang && I18N[p.lang]) S.lang = p.lang;
  
  const syncSelect = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
  syncSelect('tuningCtrl', S.tuning);
  syncSelect('labelCtrl', S.label);
  syncSelect('viewCtrl', S.view);
  syncSelect('handCtrl', S.hand);

  document.querySelectorAll('#rootCtrl   [data-v]').forEach(b=>b.classList.toggle('on', +b.dataset.v===S.root));
  document.querySelectorAll('#langCtrl   [data-v]').forEach(b=>b.classList.toggle('on', b.dataset.v===S.lang));
  
  const g = SCALES[S.scale].g;
  document.querySelectorAll('.sg-tab').forEach(t=>t.classList.toggle('on',t.dataset.g===g));
  document.querySelectorAll('.sg-panel').forEach(p2=>p2.classList.toggle('show',p2.dataset.g===g));
  syncScalePills();
}

// Lancia l'app all'avvio
initApp();
