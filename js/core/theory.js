/* =========================================================================
   THEORY ENGINE — il cuore del "manuale del basso"
   Data-driven ed estensibile: per aggiungere una scala basta una voce in
   SCALES; per un genere una voce in GENRES; per un'accordatura una in TUNINGS.
   Tutte le funzioni sono PURE: ricevono root/scala come argomenti, non
   leggono stato globale, così sono riusabili ovunque (fretboard, quiz, audio).
   Origine logica: app.js v1 (SCALES, TUNINGS, scaleNotes, getDeg, intervalFormula).
   ========================================================================= */

export const NOTES_EN = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const NOTES_IT = ['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];

/* Gruppi per la UI a tab. `manual:true` = mostrato nel pannello manuale. */
export const SCALE_GROUPS = {
  base:   { it: 'Base',     en: 'Base' },
  penta:  { it: 'Pentatoniche', en: 'Pentatonics' },
  modes:  { it: 'Modi',     en: 'Modes' },
  arps:   { it: 'Arpeggi',  en: 'Arpeggios' },
  jazz:   { it: 'Jazz',     en: 'Jazz' },
  world:  { it: 'Mondo',    en: 'World' },
};

/*
  Modello scala (estensibile):
    key: {
      group, iv:[semitoni], dg:[gradi],
      it:{name,short,desc}, en:{name,short,desc},
      genres:[...]            // tag d'uso, alimentano la vista per Genere
    }
  `desc` è didattico: a cosa serve la scala, dove si usa sul basso.
*/
export const SCALES = {
  /* ---------- BASE ---------- */
  major: {
    group: 'base', iv: [0,2,4,5,7,9,11], dg: ['1','2','3','4','5','6','7'],
    it: { name: 'Maggiore', short: 'Magg.', desc: 'La scala fondamentale, suono brillante e allegro. Base di pop, rock e country.' },
    en: { name: 'Major', short: 'Maj', desc: 'The fundamental scale: bright and happy. Backbone of pop, rock and country.' },
    genres: ['pop','rock','country'],
  },
  minor: {
    group: 'base', iv: [0,2,3,5,7,8,10], dg: ['1','2','♭3','4','5','♭6','♭7'],
    it: { name: 'Minore Naturale', short: 'Min.', desc: 'Suono malinconico e scuro. Onnipresente in rock, metal e ballate.' },
    en: { name: 'Natural Minor', short: 'Min', desc: 'Dark, melancholic sound. Everywhere in rock, metal and ballads.' },
    genres: ['rock','metal','pop'],
  },
  /* ---------- PENTATONICHE ---------- */
  minPenta: {
    group: 'penta', iv: [0,3,5,7,10], dg: ['1','♭3','4','5','♭7'],
    it: { name: 'Pentatonica Minore', short: 'Pent.m', desc: 'LA scala del bassista: cinque note infallibili per riff e walking in rock, blues e funk.' },
    en: { name: 'Minor Pentatonic', short: 'Min.Pent', desc: "The bassist's go-to: five safe notes for riffs and walking lines in rock, blues and funk." },
    genres: ['blues','funk','rock','metal'],
  },
  majPenta: {
    group: 'penta', iv: [0,2,4,7,9], dg: ['1','2','3','5','6'],
    it: { name: 'Pentatonica Maggiore', short: 'Pent.M', desc: 'Versione luminosa della pentatonica, perfetta per country, pop e groove allegri.' },
    en: { name: 'Major Pentatonic', short: 'Maj.Pent', desc: 'The bright pentatonic: perfect for country, pop and upbeat grooves.' },
    genres: ['country','pop','funk'],
  },
  blues: {
    group: 'penta', iv: [0,3,5,6,7,10], dg: ['1','♭3','4','♭5','5','♭7'],
    it: { name: 'Blues (Minore)', short: 'Blues', desc: 'Pentatonica minore + la "blue note" (♭5). Il sapore sporco di blues, funk e rock.' },
    en: { name: 'Blues (Minor)', short: 'Blues', desc: 'Minor pentatonic plus the ♭5 "blue note". The gritty flavour of blues, funk and rock.' },
    genres: ['blues','funk','rock'],
  },
  majBlues: {
    group: 'penta', iv: [0,2,3,4,7,9], dg: ['1','2','♭3','3','5','6'],
    it: { name: 'Blues Maggiore', short: 'BluesM', desc: 'Pentatonica maggiore con blue note di passaggio: groove rotondi, country-blues e southern rock.' },
    en: { name: 'Major Blues', short: 'BluesM', desc: 'Major pentatonic with a passing blue note: round grooves, country-blues and southern rock.' },
    genres: ['blues','country','rock'],
  },
  /* ---------- MODI ---------- */
  dorian: {
    group: 'modes', iv: [0,2,3,5,7,9,10], dg: ['1','2','♭3','4','5','6','♭7'],
    it: { name: 'Dorico', short: 'Dorian', desc: 'Minore con 6ª maggiore: il modo del funk e del jazz-fusion. Groove minore ma "aperto".' },
    en: { name: 'Dorian', short: 'Dorian', desc: 'Minor with a major 6th: the funk and jazz-fusion mode. Minor but open-sounding.' },
    genres: ['funk','jazz','rock'],
  },
  phrygian: {
    group: 'modes', iv: [0,1,3,5,7,8,10], dg: ['1','♭2','♭3','4','5','♭6','♭7'],
    it: { name: 'Frigio', short: 'Phrygian', desc: 'La ♭2 dà un sapore spagnolo/oscuro. Amato da metal e flamenco.' },
    en: { name: 'Phrygian', short: 'Phrygian', desc: 'The ♭2 gives a dark, Spanish flavour. Loved in metal and flamenco.' },
    genres: ['metal','latin'],
  },
  lydian: {
    group: 'modes', iv: [0,2,4,6,7,9,11], dg: ['1','2','3','♯4','5','6','7'],
    it: { name: 'Lidio', short: 'Lydian', desc: 'Maggiore con ♯4 sognante. Colonne sonore, fusion e prog.' },
    en: { name: 'Lydian', short: 'Lydian', desc: 'Major with a dreamy ♯4. Film scores, fusion and prog.' },
    genres: ['jazz','rock'],
  },
  mixo: {
    group: 'modes', iv: [0,2,4,5,7,9,10], dg: ['1','2','3','4','5','6','♭7'],
    it: { name: 'Misolidio', short: 'Mixo.', desc: 'Maggiore con ♭7: il modo dominante per eccellenza. Blues, funk e rock\'n\'roll.' },
    en: { name: 'Mixolydian', short: 'Mixo.', desc: 'Major with ♭7: the dominant mode. Blues, funk and rock\'n\'roll.' },
    genres: ['blues','funk','rock'],
  },
  locrian: {
    group: 'modes', iv: [0,1,3,5,6,8,10], dg: ['1','♭2','♭3','4','♭5','♭6','♭7'],
    it: { name: 'Locrio', short: 'Locrian', desc: 'Il modo più instabile (♭5). Tensione su accordi semidiminuiti, metal estremo e jazz.' },
    en: { name: 'Locrian', short: 'Locrian', desc: 'The most unstable mode (♭5). Tension over half-diminished chords, extreme metal and jazz.' },
    genres: ['metal','jazz'],
  },
  /* ---------- ARPEGGI ---------- */
  majTriad: {
    group: 'arps', iv: [0,4,7], dg: ['1','3','5'],
    it: { name: 'Triade Maggiore', short: 'Maj', desc: 'Le tre note dell\'accordo maggiore: la spina dorsale di ogni linea di basso.' },
    en: { name: 'Major Triad', short: 'Maj', desc: 'The three notes of a major chord: the backbone of any bass line.' },
    genres: ['pop','rock','country'],
  },
  minTriad: {
    group: 'arps', iv: [0,3,7], dg: ['1','♭3','5'],
    it: { name: 'Triade Minore', short: 'min', desc: 'Arpeggio minore: fondamentale, terza minore e quinta. Groove e ballate.' },
    en: { name: 'Minor Triad', short: 'min', desc: 'Minor arpeggio: root, minor third, fifth. Grooves and ballads.' },
    genres: ['pop','rock'],
  },
  maj7: {
    group: 'arps', iv: [0,4,7,11], dg: ['1','3','5','7'],
    it: { name: 'Maggiore 7', short: 'Maj7', desc: 'Arpeggio jazz/soul elegante. Ottimo per linee melodiche sopra accordi maj7.' },
    en: { name: 'Major 7', short: 'Maj7', desc: 'Elegant jazz/soul arpeggio. Great melodic lines over maj7 chords.' },
    genres: ['jazz','funk'],
  },
  min7: {
    group: 'arps', iv: [0,3,7,10], dg: ['1','♭3','5','♭7'],
    it: { name: 'Minore 7', short: 'min7', desc: 'L\'arpeggio del groove per eccellenza. Funk, soul e jazz vivono qui.' },
    en: { name: 'Minor 7', short: 'min7', desc: 'The ultimate groove arpeggio. Funk, soul and jazz live here.' },
    genres: ['funk','jazz','rock'],
  },
  dom7: {
    group: 'arps', iv: [0,4,7,10], dg: ['1','3','5','♭7'],
    it: { name: 'Dominante 7', short: 'Dom7', desc: 'Arpeggio di tensione che "vuole risolvere". Cuore del blues e del turnaround jazz.' },
    en: { name: 'Dominant 7', short: 'Dom7', desc: 'A tension arpeggio that wants to resolve. Heart of blues and jazz turnarounds.' },
    genres: ['blues','jazz','funk'],
  },
  m7b5: {
    group: 'arps', iv: [0,3,6,10], dg: ['1','♭3','♭5','♭7'],
    it: { name: 'Semidiminuito (m7♭5)', short: 'm7♭5', desc: 'L\'accordo del II grado minore jazz. Tensione raffinata.' },
    en: { name: 'Half-diminished (m7♭5)', short: 'm7♭5', desc: 'The jazz minor II chord. Refined tension.' },
    genres: ['jazz'],
  },
  dim7: {
    group: 'arps', iv: [0,3,6,9], dg: ['1','♭3','♭5','𝄫7'],
    it: { name: 'Diminuito 7', short: 'Dim7', desc: 'Arpeggio simmetrico di passaggio, suspense e cromatismi.' },
    en: { name: 'Diminished 7', short: 'Dim7', desc: 'Symmetric passing arpeggio: suspense and chromatic moves.' },
    genres: ['jazz','metal'],
  },
  aug: {
    group: 'arps', iv: [0,4,8], dg: ['1','3','♯5'],
    it: { name: 'Aumentata', short: 'Aug', desc: 'Triade simmetrica sospesa, colore "irrisolto". Fusion e sperimentazione.' },
    en: { name: 'Augmented', short: 'Aug', desc: 'Symmetric suspended triad, unresolved colour. Fusion and experimentation.' },
    genres: ['jazz'],
  },
  /* ---------- JAZZ avanzate ---------- */
  bebopDom: {
    group: 'jazz', iv: [0,2,4,5,7,9,10,11], dg: ['1','2','3','4','5','6','♭7','7'],
    it: { name: 'Bebop Dominante', short: 'Bebop7', desc: 'Misolidio con nota di passaggio (7): linee walking fluide a otto note per battuta.' },
    en: { name: 'Bebop Dominant', short: 'Bebop7', desc: 'Mixolydian with a passing 7th: smooth eight-note-per-bar walking lines.' },
    genres: ['jazz'],
  },
  lydianDom: {
    group: 'jazz', iv: [0,2,4,6,7,9,10], dg: ['1','2','3','♯4','5','6','♭7'],
    it: { name: 'Lidio Dominante', short: 'LydDom', desc: 'Misolidio con ♯4: il suono fusion/Hendrix sui dominanti. 4º modo della minore melodica.' },
    en: { name: 'Lydian Dominant', short: 'LydDom', desc: 'Mixolydian with ♯4: the fusion/Hendrix sound over dominants. 4th mode of melodic minor.' },
    genres: ['jazz','funk'],
  },
  altered: {
    group: 'jazz', iv: [0,1,3,4,6,8,10], dg: ['1','♭9','♯9','3','♭5','♯5','♭7'],
    it: { name: 'Alterata (Super Locria)', short: 'Alt', desc: 'Massima tensione sui dominanti: tutte le alterazioni. 7º modo della minore melodica.' },
    en: { name: 'Altered (Super Locrian)', short: 'Alt', desc: 'Maximum dominant tension: every alteration. 7th mode of melodic minor.' },
    genres: ['jazz'],
  },
  phrygianDom: {
    group: 'jazz', iv: [0,1,4,5,7,8,10], dg: ['1','♭2','3','4','5','♭6','♭7'],
    it: { name: 'Frigio Dominante (Spagnola)', short: 'PhrDom', desc: 'Il suono flamenco/medio-orientale: 5º modo della minore armonica.' },
    en: { name: 'Phrygian Dominant (Spanish)', short: 'PhrDom', desc: 'The flamenco / Middle-Eastern sound: 5th mode of harmonic minor.' },
    genres: ['latin','metal'],
  },
  /* ---------- MONDO / SIMMETRICHE ---------- */
  harmMin: {
    group: 'world', iv: [0,2,3,5,7,8,11], dg: ['1','2','♭3','4','5','♭6','7'],
    it: { name: 'Minore Armonica', short: 'Min.Arm.', desc: 'Minore con 7ª maggiore: suono drammatico, neoclassico e metal.' },
    en: { name: 'Harmonic Minor', short: 'Harm.Min', desc: 'Minor with a major 7th: dramatic, neoclassical and metal sound.' },
    genres: ['metal','latin','jazz'],
  },
  melMin: {
    group: 'world', iv: [0,2,3,5,7,9,11], dg: ['1','2','♭3','4','5','6','7'],
    it: { name: 'Minore Melodica', short: 'Min.Mel.', desc: 'Minore "jazz": 6ª e 7ª maggiori in salita. Sorgente di lidio dom e alterata.' },
    en: { name: 'Melodic Minor', short: 'Mel.Min', desc: 'The "jazz minor": raised 6th and 7th. Source of lydian dominant and altered.' },
    genres: ['jazz'],
  },
  hungarianMin: {
    group: 'world', iv: [0,2,3,6,7,8,11], dg: ['1','2','♭3','♯4','5','♭6','7'],
    it: { name: 'Minore Ungherese', short: 'Ungh.', desc: 'Due seconde aumentate: sapore gitano/est-europeo, intenso e esotico.' },
    en: { name: 'Hungarian Minor', short: 'Hung.', desc: 'Two augmented seconds: a gypsy / Eastern-European exotic flavour.' },
    genres: ['metal','latin'],
  },
  dim: {
    group: 'world', iv: [0,2,3,5,6,8,9,11], dg: ['1','2','♭3','4','♭5','♭6','6','7'],
    it: { name: 'Diminuita (Tono-Semitono)', short: 'Dim.', desc: 'Scala simmetrica a 8 note: tensione e passaggi su accordi diminuiti.' },
    en: { name: 'Diminished (Whole-Half)', short: 'Dim.', desc: 'Symmetric 8-note scale: tension and passages over diminished chords.' },
    genres: ['jazz','metal'],
  },
  whole: {
    group: 'world', iv: [0,2,4,6,8,10], dg: ['1','2','3','♯4','♯5','♭7'],
    it: { name: 'Esatonale (Whole Tone)', short: 'Whole', desc: 'Solo toni interi: sospesa e onirica, tipica del colore dominante alterato.' },
    en: { name: 'Whole Tone', short: 'Whole', desc: 'All whole steps: suspended and dreamy, a classic altered-dominant colour.' },
    genres: ['jazz'],
  },
  chromatic: {
    group: 'world', iv: [0,1,2,3,4,5,6,7,8,9,10,11],
    dg: ['1','♭2','2','♭3','3','4','♭5','5','♭6','6','♭7','7'],
    it: { name: 'Cromatica', short: 'Crom.', desc: 'Tutte le 12 note: per esercizi di tecnica, passaggi e approcci cromatici.' },
    en: { name: 'Chromatic', short: 'Chrom.', desc: 'All 12 notes: for technique drills, passing tones and chromatic approaches.' },
    genres: ['jazz'],
  },
};

/* Generi/stili → scale consigliate. Punto d'ingresso "cosa voglio suonare". */
export const GENRES = {
  blues: { it: 'Blues', en: 'Blues', emoji: '🎺', scales: ['minPenta','blues','majBlues','mixo','dom7','majPenta'] },
  funk:  { it: 'Funk',  en: 'Funk',  emoji: '🎸', scales: ['minPenta','dorian','blues','mixo','min7','dom7'] },
  rock:  { it: 'Rock',  en: 'Rock',  emoji: '🤘', scales: ['minPenta','minor','majPenta','major','mixo','blues'] },
  metal: { it: 'Metal', en: 'Metal', emoji: '🔥', scales: ['minPenta','phrygian','phrygianDom','locrian','harmMin','hungarianMin'] },
  jazz:  { it: 'Jazz',  en: 'Jazz',  emoji: '🎷', scales: ['dorian','mixo','maj7','min7','dom7','bebopDom','altered','melMin','lydianDom'] },
  latin: { it: 'Latin', en: 'Latin', emoji: '🌴', scales: ['dorian','mixo','phrygianDom','harmMin','majPenta','majBlues'] },
  pop:   { it: 'Pop',   en: 'Pop',   emoji: '✨', scales: ['major','minor','majPenta','minPenta','majTriad','minTriad'] },
};

/* Bassi: 4/5/6 corde e accordature alternate. Estensibile con nuove voci. */
export const TUNINGS = {
  'std-4':   { strings: 4, notes: [7,2,9,4],       labels: ['G','D','A','E'],         midiBase: [43,38,33,28],          it: 'Standard (4)',   en: 'Standard (4)',   short: 'Std 4' },
  'dropd-4': { strings: 4, notes: [7,2,9,2],       labels: ['G','D','A','D'],         midiBase: [43,38,33,26],          it: 'Drop D',          en: 'Drop D',          short: 'Drop D' },
  'eb-4':    { strings: 4, notes: [6,1,8,3],       labels: ['G♭','D♭','A♭','E♭'],     midiBase: [42,37,32,27],          it: 'Mezzo tono sotto', en: 'Half-Step Down', short: 'E♭ 4' },
  'dropc-4': { strings: 4, notes: [5,0,7,0],       labels: ['F','C','G','C'],         midiBase: [41,36,31,24],          it: 'Drop C',          en: 'Drop C',          short: 'Drop C' },
  'bstd-4':  { strings: 4, notes: [2,9,4,11],      labels: ['D','A','E','B'],         midiBase: [38,33,28,23],          it: 'B Standard (4)',  en: 'B Standard (4)',  short: 'B Std 4' },
  'std-5':   { strings: 5, notes: [7,2,9,4,11],    labels: ['G','D','A','E','B'],     midiBase: [43,38,33,28,23],       it: 'Standard (5)',   en: 'Standard (5)',   short: 'Std 5' },
  'std-6':   { strings: 6, notes: [0,7,2,9,4,11],  labels: ['C','G','D','A','E','B'], midiBase: [48,43,38,33,28,23],    it: 'Standard (6)',   en: 'Standard (6)',   short: 'Std 6' },
};

export const THICKNESS = { 4: [1.5,2.5,3.5,4.5], 5: [1.5,2,3,4,5], 6: [1,1.5,2,3,4,5] };
export const FRETS = 17;
export const BOX = 5;
export const MARKERS = [3,5,7,9,12,15,17];
export const DOUBLE_MARKS = new Set([12]);

/**
 * Armonizzazione: accordi diatonici (triadi) della scala, gradi I–VII.
 * Solo per scale eptatoniche (7 note); altrimenti ritorna null.
 * Ritorna [{ roman, rootPc, name, quality }].
 */
export function harmonize(root, scaleKey) {
  const iv = SCALES[scaleKey].iv;
  if (iv.length !== 7) return null;
  const pcs = iv.map(i => (+root + i) % 12);
  const ROMAN = ['I','II','III','IV','V','VI','VII'];
  return pcs.map((rootPc, i) => {
    const third = ((pcs[(i + 2) % 7] - rootPc) + 12) % 12;
    const fifth = ((pcs[(i + 4) % 7] - rootPc) + 12) % 12;
    let suffix = '?', roman = ROMAN[i], quality = 'other';
    if (third === 4 && fifth === 7) { suffix = '';  quality = 'maj'; }
    else if (third === 3 && fifth === 7) { suffix = 'm'; quality = 'min'; roman = roman.toLowerCase(); }
    else if (third === 3 && fifth === 6) { suffix = '°'; quality = 'dim'; roman = roman.toLowerCase(); }
    else if (third === 4 && fifth === 8) { suffix = '+'; quality = 'aug'; }
    return { roman, rootPc, name: NOTES_EN[rootPc] + suffix, quality };
  });
}

/* ---------- Funzioni pure ---------- */

export function getNoteName(noteIndex, label) {
  return label === 'solfege' ? NOTES_IT[noteIndex] : NOTES_EN[noteIndex];
}

/** Note (pitch class 0-11) della scala a partire dalla root. */
export function scaleNotes(root, scaleKey) {
  return SCALES[scaleKey].iv.map(i => (+root + i) % 12);
}

/** Sequenza per il playback: salita + discesa senza ripetere estremi. */
export function getScaleSequence(root, scaleKey) {
  const notes = scaleNotes(root, scaleKey);
  if (notes.length <= 1) return notes;
  return [...notes, ...[...notes].slice(1, -1).reverse()];
}

/** Grado (es. '♭3') di una nota nella scala corrente, o null se fuori scala. */
export function getDeg(noteIndex, root, scaleKey) {
  const d = ((noteIndex - root) + 12) % 12;
  const i = SCALES[scaleKey].iv.indexOf(d);
  return i >= 0 ? SCALES[scaleKey].dg[i] : null;
}

/** Formula a intervalli (T=tono, S=semitono) per il pannello info. */
export function intervalFormula(ivs) {
  return ivs.map((v, i) => {
    const next = i < ivs.length - 1 ? ivs[i + 1] : ivs[0] + 12;
    const d = next - v;
    return d === 1 ? 'S' : d === 2 ? 'T' : d === 3 ? 'T+S' : String(d);
  }).join(' ');
}

/** Localizzazione di un campo (name/short/desc) di una scala. */
export function scaleField(scaleKey, field, lang) {
  const s = SCALES[scaleKey];
  return (s[lang] && s[lang][field]) || (s.en && s.en[field]) || scaleKey;
}
