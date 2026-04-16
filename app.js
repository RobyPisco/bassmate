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
    back_btn: "⬅️ Torna alla Tastiera"
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
    back_btn: "⬅️ Back to Fretboard"
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
  'std-4':  { strings:4, notes:[7,2,9,4],      labels:['G','D','A','E'],         desc:'Standard 4-Corde',   short:'Std (4)' },
  'dropd-4':{ strings:4, notes:[7,2,9,2],      labels:['G','D','A','D'],         desc:'Drop D (D-A-D-G)',   short:'Drop D' },
  'eb-4':   { strings:4, notes:[6,1,8,3],      labels:['Gb','Db','Ab','Eb'],     desc:'Half-Step Down',     short:'Eb (4)' },
  'std-5':  { strings:5, notes:[7,2,9,4,11],   labels:['G','D','A','E','B'],     desc:'Standard 5-Corde',   short:'Std (5)' },
  'std-6':  { strings:6, notes:[0,7,2,9,4,11], labels:['C','G','D','A','E','B'], desc:'Standard 6-Corde',   short:'Std (6)' },
};

const THICKNESS = { 4:[1.5,2.5,3.5,4.5], 5:[1.5,2,3,4,5], 6:[1,1.5,2,3,4,5] };
const FRETS = 15;
const BOX   = 5;
const MARKERS      = [3,5,7,9,12,15];
const DOUBLE_MARKS = new Set([12]);

const defaultLang = localStorage.getItem('bass_lang') || (navigator.language.startsWith('it') ? 'it' : 'en');
const S = { tuning:'std-4', root:0, scale:'major', label:'deg', view:'full', hand:'right', boxStart:0, lang: defaultLang };

let quizActiveNote = null;
let quizScore = 0;

function mkEl(tag,cls) { const d=document.createElement(tag); if(cls) d.className=cls; return d; }

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
        } else {
          S.view = 'quiz';
        }
        if(S.view === 'quiz') startQuiz();
        render();
      });
    }

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

    loadURL();
    if(S.view === 'quiz') startQuiz();
    render();
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
   QUIZ ENGINE
══════════════════════════════════════ */
function startQuiz() {
  quizScore = 0;
  document.getElementById('quizScore').innerText = '🏆 Punteggio: 0';
  generateQuizNode();
}

function generateQuizNode() {
  const t = TUNINGS[S.tuning];
  // Raggio ristretto al Manico per evitare panico (Max 12 tasti)
  const maxFret = Math.min(12, FRETS);
  const s = Math.floor(Math.random() * t.strings);
  const f = Math.floor(Math.random() * maxFret) + 1; // escludo tasto a vuoto 0, troppo facile
  const ni = (t.notes[s] + f) % 12;
  quizActiveNote = {s, f, ni};
}

function handleQuizGuess(ni, btn) {
   if (!quizActiveNote) return;
   if (ni === quizActiveNote.ni) {
       btn.classList.add('correct');
       quizScore += 10;
       document.getElementById('quizScore').innerText = '🏆 Punteggio: ' + quizScore;
       setTimeout(() => {
           btn.classList.remove('correct');
           generateQuizNode();
           renderFretboard();
       }, 300);
   } else {
       btn.classList.add('wrong');
       quizScore = 0; // Punizione spietata!
       document.getElementById('quizScore').innerText = '🏆 Punteggio: 0 (Ahi!)';
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
    if (S.view === 'full' || S.view === 'quiz') return '?';
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
  
  const tc = document.getElementById('tuningCtrl');
  if (tc) {
    Array.from(tc.options).forEach(opt => { opt.text = tl(TUNINGS[opt.value].short); });
    document.querySelectorAll('.sg-panel [data-v]').forEach(el => el.textContent = tl(SCALES[el.dataset.v].short));
  }
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
      d.title = `${getNoteName(ni)}  ·  grado ${getDeg(ni)}  ·  fret ${f}`;
      
      d.onclick = function() { d.classList.add('playing'); setTimeout(()=>d.classList.remove('playing'), 200); };
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
