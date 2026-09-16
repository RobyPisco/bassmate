/* =========================================================================
   QUIZ — "Sfida sul manico" (arcade). 4 modalità che sfruttano il manuale:
   Nota, Grado, Orecchio, Mistero. Punteggio con combo, timer, rank finale.
   Self-contained: genera le domande dai dati di theory.js.
   ========================================================================= */
import { state } from '../core/state.js';
import { t } from '../core/i18n.js';
import {
  SCALES, TUNINGS, NOTES_EN, NOTES_IT, scaleNotes, getDeg, scaleField,
} from '../core/theory.js';
import { playNote, playSequence } from '../audio/synth.js';

const POOL = ['major', 'minor', 'minPenta', 'majPenta', 'dorian', 'mixo', 'blues', 'harmMin'];
const RANKS = [
  { min: 0,    it: 'Novizio',   en: 'Rookie',  emoji: '🌱' },
  { min: 400,  it: 'Bronzo',    en: 'Bronze',  emoji: '🥉' },
  { min: 900,  it: 'Argento',   en: 'Silver',  emoji: '🥈' },
  { min: 1600, it: 'Oro',       en: 'Gold',    emoji: '🥇' },
  { min: 2600, it: 'Maestro',   en: 'Master',  emoji: '🏆' },
  { min: 4000, it: 'Leggenda',  en: 'Legend',  emoji: '👑' },
];

const QZ = {
  mode: 'note', diff: 'normal', timeLimit: 60,
  running: false, score: 0, combo: 0, bestCombo: 0,
  best: +(localStorage.getItem('bm2_quiz_best') || 0),
  timeLeft: 60, q: null, timerId: null, locked: false,
};

const rand = n => Math.floor(Math.random() * n);
const pick = arr => arr[rand(arr.length)];
const noteNames = () => (state.label === 'solfege' ? NOTES_IT : NOTES_EN);
const maxFret = () => (QZ.diff === 'easy' ? 5 : QZ.diff === 'hard' ? 17 : 12);
let host;

export function buildQuiz(sectionEl) {
  host = sectionEl;
  host.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="head-eyebrow" data-i18n="quiz">Quiz</div>
      <h2 style="font-size:clamp(22px,3vw,30px)">${state.lang === 'it' ? 'Sfida sul Manico' : 'Fretboard Challenge'}</h2>
    </div>

    <div class="card card-pad quiz-setup" id="quizSetup">
      <div class="row" style="gap:18px;flex-wrap:wrap">
        <div class="tp-group">
          <span class="row-label" data-i18n="quiz_mode_lbl">Modalità</span>
          <div class="seg" id="qMode">
            <button data-v="note">🎵 <span data-i18n="mode_note">Nota</span></button>
            <button data-v="degree">🔢 <span data-i18n="mode_degree">Grado</span></button>
            <button data-v="ear">👂 <span data-i18n="mode_ear">Orecchio</span></button>
            <button data-v="shape">🧩 <span data-i18n="mode_shape">Mistero</span></button>
          </div>
        </div>
        <div class="tp-group">
          <span class="row-label" data-i18n="difficulty">Difficoltà</span>
          <div class="seg" id="qDiff">
            <button data-v="easy" data-i18n="easy">Facile</button>
            <button data-v="normal" data-i18n="normal">Normale</button>
            <button data-v="hard" data-i18n="hard">Difficile</button>
          </div>
        </div>
        <div class="tp-group">
          <span class="row-label" data-i18n="time">Tempo</span>
          <div class="seg" id="qTime">
            <button data-v="60">60s</button>
            <button data-v="120">120s</button>
            <button data-v="0">∞</button>
          </div>
        </div>
        <button class="pill on quiz-start" id="qStart">▶ <span data-i18n="quiz_start">Inizia</span></button>
      </div>
      <div class="quiz-best muted" id="qBest"></div>
    </div>

    <div class="card card-pad quiz-play hide" id="quizPlay">
      <div class="quiz-hud">
        <div class="quiz-stat"><span class="quiz-lbl" data-i18n="score">Punti</span><span class="quiz-val" id="qScore">0</span></div>
        <div class="quiz-stat"><span class="quiz-lbl" data-i18n="combo">Combo</span><span class="quiz-val accent" id="qCombo">x1</span></div>
        <div class="quiz-stat"><span class="quiz-lbl" data-i18n="time">Tempo</span><span class="quiz-val" id="qTimer">60</span></div>
        <button class="pill" id="qStop">⏹ <span data-i18n="quiz_stop">Stop</span></button>
      </div>
      <div class="quiz-prompt" id="qPrompt"></div>
      <div class="quiz-board" id="qBoard"></div>
      <div class="quiz-answers" id="qAnswers"></div>
      <div class="quiz-feedback" id="qFeedback"></div>
    </div>

    <div class="card card-pad quiz-result hide" id="quizResult"></div>
  `;
  bind();
  syncSetup();
  showBest();
  document.querySelectorAll('#quiz [data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
}

function showBest() {
  host.querySelector('#qBest').textContent = `🏆 ${t('best')}: ${QZ.best}`;
}
function syncSetup() {
  host.querySelectorAll('#qMode button').forEach(b => b.classList.toggle('on', b.dataset.v === QZ.mode));
  host.querySelectorAll('#qDiff button').forEach(b => b.classList.toggle('on', b.dataset.v === QZ.diff));
  host.querySelectorAll('#qTime button').forEach(b => b.classList.toggle('on', +b.dataset.v === QZ.timeLimit));
}

function bind() {
  host.querySelector('#qMode').addEventListener('click', e => seg(e, v => QZ.mode = v));
  host.querySelector('#qDiff').addEventListener('click', e => seg(e, v => QZ.diff = v));
  host.querySelector('#qTime').addEventListener('click', e => seg(e, v => QZ.timeLimit = +v));
  host.querySelector('#qStart').addEventListener('click', start);
  host.querySelector('#qStop').addEventListener('click', () => end(true));
  host.querySelector('#qPrompt').addEventListener('click', e => {
    if (e.target.closest('#qReplay')) {
      if (QZ.q?.audio) QZ.q.audio();
    }
  });
}
function seg(e, setFn) {
  const b = e.target.closest('[data-v]'); if (!b) return;
  setFn(b.dataset.v); syncSetup();
}

/* ---------- gioco ---------- */
function start() {
  QZ.running = true; QZ.score = 0; QZ.combo = 0; QZ.bestCombo = 0; QZ.locked = false;
  QZ.timeLeft = QZ.timeLimit;
  host.querySelector('#quizSetup').classList.add('hide');
  host.querySelector('#quizResult').classList.add('hide');
  host.querySelector('#quizPlay').classList.remove('hide');
  updateHud();
  if (QZ.timeLimit > 0) {
    clearInterval(QZ.timerId);
    QZ.timerId = setInterval(() => {
      QZ.timeLeft--; host.querySelector('#qTimer').textContent = QZ.timeLeft;
      if (QZ.timeLeft <= 0) end(false);
    }, 1000);
  } else {
    host.querySelector('#qTimer').textContent = '∞';
  }
  nextQuestion();
}

function end(stopped) {
  QZ.running = false;
  clearInterval(QZ.timerId);
  if (QZ.score > QZ.best) { QZ.best = QZ.score; localStorage.setItem('bm2_quiz_best', QZ.best); }
  const rank = [...RANKS].reverse().find(r => QZ.score >= r.min) || RANKS[0];
  const res = host.querySelector('#quizResult');
  host.querySelector('#quizPlay').classList.add('hide');
  res.classList.remove('hide');
  res.innerHTML = `
    <div class="quiz-rank">${rank.emoji}</div>
    <h2>${rank[state.lang] || rank.en}</h2>
    <div class="quiz-final">${t('score')}: <b>${QZ.score}</b></div>
    <div class="muted">${t('best_combo')}: x${QZ.bestCombo} · 🏆 ${t('best')}: ${QZ.best}</div>
    <button class="pill on" id="qAgain" style="margin-top:14px">↻ <span>${t('quiz_again')}</span></button>
  `;
  res.querySelector('#qAgain').addEventListener('click', () => {
    res.classList.add('hide');
    host.querySelector('#quizSetup').classList.remove('hide');
    showBest();
  });
}

function updateHud() {
  host.querySelector('#qScore').textContent = QZ.score;
  host.querySelector('#qCombo').textContent = 'x' + multiplier();
}
function multiplier() { return Math.min(5, 1 + Math.floor(QZ.combo / 3)); }

function nextQuestion() {
  QZ.locked = false;
  const gen = { note: genNote, degree: genDegree, ear: genEar, shape: genShape }[QZ.mode];
  QZ.q = gen();
  host.querySelector('#qPrompt').innerHTML = QZ.q.prompt;
  host.querySelector('#qFeedback').textContent = '';
  renderBoard(QZ.q.board);
  renderAnswers(QZ.q.options);
  if (QZ.q.audio) QZ.q.audio();
}

function renderAnswers(options) {
  const el = host.querySelector('#qAnswers');
  el.innerHTML = '';
  options.forEach(o => {
    const b = document.createElement('button');
    b.className = 'pill quiz-ans';
    b.dataset.correct = o.correct ? '1' : '0';
    b.innerHTML = o.label;
    b.addEventListener('click', () => answer(b, o.correct));
    el.appendChild(b);
  });
}

function answer(btn, correct) {
  if (QZ.locked) return;
  QZ.locked = true;
  const fb = host.querySelector('#qFeedback');
  if (correct) {
    const pts = 100 * multiplier();
    QZ.score += pts; QZ.combo++; QZ.bestCombo = Math.max(QZ.bestCombo, QZ.combo);
    btn.classList.add('ok');
    fb.innerHTML = `<span class="fb-ok">+${pts}${QZ.combo > 2 ? ' 🔥' : ''}</span>`;
  } else {
    QZ.combo = 0;
    btn.classList.add('ko');
    host.querySelectorAll('.quiz-ans').forEach(b => { if (b.dataset.correct === '1') b.classList.add('ok'); });
    fb.innerHTML = `<span class="fb-ko">✗</span>`;
  }
  updateHud();
  setTimeout(() => { if (QZ.running) nextQuestion(); }, correct ? 420 : 850);
}

/* ---------- generatori domanda ---------- */
function genNote() {
  const tn = TUNINGS[state.tuning], mf = maxFret();
  const si = rand(tn.strings), fret = rand(mf + 1);
  const pc = (tn.notes[si] + fret) % 12;
  const names = noteNames();
  const options = names.map((n, i) => ({ label: n, correct: i === pc }));
  return {
    prompt: t('quiz_q_note'),
    board: { maxFret: mf, marks: [{ si, fret, label: '?', cls: 'q-target' }] },
    options,
  };
}

function genDegree() {
  const scaleKey = pick(POOL), root = rand(12);
  const sn = scaleNotes(root, scaleKey), tn = TUNINGS[state.tuning], mf = maxFret();
  // trova una posizione (si,fret) la cui nota è nella scala
  let si, fret, pc, tries = 0;
  do { si = rand(tn.strings); fret = rand(mf + 1); pc = (tn.notes[si] + fret) % 12; tries++; }
  while (!sn.includes(pc) && tries < 200);
  const deg = getDeg(pc, root, scaleKey);
  const dg = SCALES[scaleKey].dg;
  const options = dg.map(d => ({ label: d, correct: d === deg }));
  // board: tutte le note di scala come puntini, target con '?'
  const marks = [];
  for (let s = 0; s < tn.strings; s++) for (let f = 0; f <= mf; f++) {
    if (sn.includes((tn.notes[s] + f) % 12)) marks.push({ si: s, fret: f, label: '', cls: 'q-dim' });
  }
  marks.push({ si, fret, label: '?', cls: 'q-target' });
  const rootName = noteNames()[root];
  return {
    prompt: `${t('quiz_q_degree')} <b>${rootName} ${scaleField(scaleKey, 'name', state.lang)}</b>`,
    board: { maxFret: mf, marks },
    options,
  };
}

function genEar() {
  const correctKey = pick(POOL), root = rand(12);
  const distractors = POOL.filter(k => k !== correctKey).sort(() => Math.random() - 0.5).slice(0, 3);
  const opts = [correctKey, ...distractors].sort(() => Math.random() - 0.5)
    .map(k => ({ label: scaleField(k, 'name', state.lang), correct: k === correctKey }));
  const audio = () => {
    const rootMidi = 40 + root;
    const seq = [...SCALES[correctKey].iv.map(i => rootMidi + i), rootMidi + 12];
    playSequence(seq, 0.28);
  };
  return {
    prompt: `${t('quiz_q_ear')} <button class="pill" id="qReplay">🔊 ${t('quiz_replay')}</button>`,
    board: null, options: opts, audio,
    afterRender: () => host.querySelector('#qReplay')?.addEventListener('click', audio),
  };
}

function genShape() {
  const correctKey = pick(POOL), root = rand(12);
  const sn = scaleNotes(root, correctKey), tn = TUNINGS[state.tuning], mf = maxFret();
  const marks = [];
  for (let s = 0; s < tn.strings; s++) for (let f = 0; f <= mf; f++) {
    const pc = (tn.notes[s] + f) % 12;
    if (sn.includes(pc)) marks.push({ si: s, fret: f, label: '', cls: pc === root ? 'q-target' : 'q-dot' });
  }
  const distractors = POOL.filter(k => k !== correctKey).sort(() => Math.random() - 0.5).slice(0, 3);
  const opts = [correctKey, ...distractors].sort(() => Math.random() - 0.5)
    .map(k => ({ label: scaleField(k, 'name', state.lang), correct: k === correctKey }));
  const rootName = noteNames()[root];
  return {
    prompt: `${t('quiz_q_shape')} <b>${rootName}</b>?`,
    board: { maxFret: mf, marks },
    options: opts,
  };
}

/* ---------- board (riusa lo stile .fb) ---------- */
function renderBoard(board) {
  const el = host.querySelector('#qBoard');
  if (!board) { el.innerHTML = ''; if (QZ.q?.afterRender) QZ.q.afterRender(); return; }
  const tn = TUNINGS[state.tuning], mf = board.maxFret;
  const fb = document.createElement('div');
  fb.className = 'fb'; fb.style.setProperty('--nfrets', mf);
  const fnums = document.createElement('div');
  fnums.className = 'fb-fnums';
  fnums.appendChild(cell('fb-fnum fb-open-col', ''));
  for (let f = 1; f <= mf; f++) fnums.appendChild(cell('fb-fnum', String(f)));
  fb.appendChild(fnums);
  const grid = document.createElement('div'); grid.className = 'fb-grid';
  for (let s = 0; s < tn.strings; s++) {
    const row = document.createElement('div'); row.className = 'fb-row';
    for (let f = 0; f <= mf; f++) {
      const c = document.createElement('div');
      c.className = 'fb-cell' + (f === 0 ? ' fb-open-col' : '');
      const m = board.marks.find(x => x.si === s && x.fret === f);
      if (m) {
        const d = document.createElement('div');
        d.className = 'dot ' + m.cls;
        d.textContent = m.label;
        c.appendChild(d);
      }
      row.appendChild(c);
    }
    grid.appendChild(row);
  }
  fb.appendChild(grid);
  el.replaceChildren(fb);
  if (QZ.q?.afterRender) QZ.q.afterRender();
}
function cell(cls, txt) { const d = document.createElement('div'); d.className = cls; d.textContent = txt; return d; }
