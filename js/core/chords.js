/* =========================================================================
   CHORDS — libreria accordi per basso (4 corde, standard E·A·D·G).
   Portato da chords.html v1. Data-driven: ogni tipo è un oggetto con
   voicing relativi (ds = corde sopra la root, df = offset di tasto).
   computeDots() calcola le posizioni reali sul manico per una data root.
   ========================================================================= */

export const CHORD_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const CHORD_OPEN = [7, 2, 9, 4];        // strIdx 0=G 1=D 2=A 3=E (pitch class)
export const CHORD_MIDI = [43, 38, 33, 28];    // MIDI corda a vuoto: G2 D2 A1 E1
export const CHORD_STR_LABEL = ['G','D','A','E'];

/*
  Tipo accordo: { id, symbol, it:{name,desc}, en:{name,desc}, genres, voicings:[...] }
  Voicing: { rootStr (3=E..0=G), label, dots:[{ds,df,deg}] }
*/
export const CHORD_TYPES = [
  { id:'power5', symbol:'5',
    it:{ name:'Power 5a', desc:'Solo fondamentale e quinta: l\'accordo del rock e del metal, potente e neutro.' },
    en:{ name:'Power 5th', desc:'Root and fifth only: the rock and metal chord, powerful and neutral.' },
    genres:['rock','metal'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:2,deg:'5'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:2,deg:'5'}]},
      {rootStr:1,label:'on D',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:2,deg:'5'}]},
    ]},
  { id:'octave', symbol:'8va',
    it:{ name:'Ottava', desc:'Fondamentale raddoppiata all\'ottava: il "riff a ottave" di funk e disco.' },
    en:{ name:'Octave', desc:'Root doubled an octave up: the funk and disco octave riff.' },
    genres:['funk','pop'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:2,df:2,deg:'8'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:2,df:2,deg:'8'}]},
    ]},
  { id:'power5oct', symbol:'5+8',
    it:{ name:'Power + Ottava', desc:'Power chord con l\'ottava: corpo pieno per riff potenti.' },
    en:{ name:'Power + Octave', desc:'Power chord plus octave: full body for heavy riffs.' },
    genres:['rock','metal'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:2,deg:'5'},{ds:2,df:2,deg:'8'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:2,deg:'5'},{ds:2,df:2,deg:'8'}]},
    ]},
  { id:'major', symbol:'',
    it:{ name:'Maggiore', desc:'Triade maggiore (R·3·5): suono pieno e luminoso.' },
    en:{ name:'Major', desc:'Major triad (R·3·5): full, bright sound.' },
    genres:['pop','rock','country'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:-3,deg:'5'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:-3,deg:'5'}]},
    ]},
  { id:'minor', symbol:'m',
    it:{ name:'Minore', desc:'Triade minore (R·♭3·5): colore scuro e malinconico.' },
    en:{ name:'Minor', desc:'Minor triad (R·♭3·5): dark, melancholic colour.' },
    genres:['pop','rock'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-2,deg:'♭3'},{ds:2,df:-3,deg:'5'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-2,deg:'♭3'},{ds:2,df:-3,deg:'5'}]},
    ]},
  { id:'sus2', symbol:'sus2',
    it:{ name:'Sospesa 2', desc:'La 2ª al posto della 3ª: suono aperto e sospeso.' },
    en:{ name:'Suspended 2', desc:'The 2nd replaces the 3rd: open, suspended sound.' },
    genres:['pop','rock'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-3,deg:'2'},{ds:2,df:-3,deg:'5'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-3,deg:'2'},{ds:2,df:-3,deg:'5'}]},
    ]},
  { id:'sus4', symbol:'sus4',
    it:{ name:'Sospesa 4', desc:'La 4ª al posto della 3ª: tensione che chiede risoluzione.' },
    en:{ name:'Suspended 4', desc:'The 4th replaces the 3rd: tension wanting to resolve.' },
    genres:['pop','rock'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:0,deg:'4'},{ds:2,df:-3,deg:'5'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:0,deg:'4'},{ds:2,df:-3,deg:'5'}]},
    ]},
  { id:'aug', symbol:'+',
    it:{ name:'Aumentata', desc:'Quinta aumentata (R·3·♯5): colore sospeso e inquieto.' },
    en:{ name:'Augmented', desc:'Raised fifth (R·3·♯5): suspended, restless colour.' },
    genres:['jazz'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:-2,deg:'♯5'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:-2,deg:'♯5'}]},
    ]},
  { id:'dim', symbol:'°',
    it:{ name:'Diminuita', desc:'Terza e quinta abbassate (R·♭3·♭5): tensione drammatica.' },
    en:{ name:'Diminished', desc:'Lowered third and fifth (R·♭3·♭5): dramatic tension.' },
    genres:['jazz','metal'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-2,deg:'♭3'},{ds:2,df:-4,deg:'♭5'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-2,deg:'♭3'},{ds:2,df:-4,deg:'♭5'}]},
    ]},
  { id:'dom7', symbol:'7',
    it:{ name:'Dominante 7', desc:'R·3·♭7: la tensione del blues e del turnaround jazz.' },
    en:{ name:'Dominant 7', desc:'R·3·♭7: the tension of blues and jazz turnarounds.' },
    genres:['blues','jazz','funk'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:0,deg:'♭7'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:0,deg:'♭7'}]},
    ]},
  { id:'maj7', symbol:'maj7',
    it:{ name:'Maggiore 7', desc:'R·3·7: morbido ed elegante, suono soul e jazz.' },
    en:{ name:'Major 7', desc:'R·3·7: soft and elegant, soul and jazz sound.' },
    genres:['jazz','funk'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:1,deg:'7'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-1,deg:'3'},{ds:2,df:1,deg:'7'}]},
    ]},
  { id:'min7', symbol:'m7',
    it:{ name:'Minore 7', desc:'R·♭3·♭7: l\'accordo del groove, cuore di funk e soul.' },
    en:{ name:'Minor 7', desc:'R·♭3·♭7: the groove chord, heart of funk and soul.' },
    genres:['funk','jazz'],
    voicings:[
      {rootStr:3,label:'on E',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-2,deg:'♭3'},{ds:2,df:0,deg:'♭7'}]},
      {rootStr:2,label:'on A',dots:[{ds:0,df:0,deg:'R'},{ds:1,df:-2,deg:'♭3'},{ds:2,df:0,deg:'♭7'}]},
    ]},
];

/**
 * Calcola le posizioni reali (strIdx, fret, grado, nota, midi) di un voicing
 * per una data root. Ritorna null se il voicing esce dal manico (0-15).
 */
export function computeDots(voicing, rootPc) {
  let rootFret = (rootPc - CHORD_OPEN[voicing.rootStr] + 12) % 12;
  const mk = rf => voicing.dots.map(d => ({
    strIdx: voicing.rootStr - d.ds,
    fret: rf + d.df,
    deg: d.deg,
    isRoot: d.deg === 'R',
  }));
  let frets = mk(rootFret);
  if (frets.some(f => f.fret < 0)) { rootFret += 12; frets = mk(rootFret); }
  for (const f of frets) {
    if (f.strIdx < 0 || f.strIdx > 3 || f.fret < 0 || f.fret > 15) return null;
    f.noteName = CHORD_NOTES[(CHORD_OPEN[f.strIdx] + f.fret) % 12];
    f.midi = CHORD_MIDI[f.strIdx] + f.fret;
  }
  return frets;
}

export function chordField(type, field, lang) {
  return (type[lang] && type[lang][field]) || type.en[field];
}
