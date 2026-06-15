/* =========================================================================
   APP — bootstrap. Monta header, Studio (sidebar/head/pannelli), transport
   e fretboard; collega lo stato al rendering reattivo. I tool si registrano
   in NAV.
   ========================================================================= */
import { state, set, subscribe } from './core/state.js';
import { t, applyI18n } from './core/i18n.js';
import { SCALES, BOX, FRETS } from './core/theory.js';
import { playSequence } from './audio/synth.js';
import { buildStudio, refreshStudio, syncActive } from './ui/controls.js';
import { buildTransport } from './ui/transport.js';
import { renderFretboard } from './ui/fretboard.js';
import { buildChords, refreshChords } from './tools/chords.js';
import { buildMetro } from './ui/metro.js';
import { buildQuiz } from './tools/quiz.js';
import { buildGrids } from './ui/grids.js';

const NAV = [
  { id: 'studio', i18n: 'studio', icon: '🎸', ready: true },
  { id: 'chords', i18n: 'chords', icon: '🎼', ready: true },
  { id: 'metro',  i18n: 'metro',  icon: '🥁', ready: true },
  { id: 'quiz',   i18n: 'quiz',   icon: '🎯', ready: true },
  { id: 'grids',  i18n: 'grids',  icon: '📋', ready: true },
];

const $ = sel => document.querySelector(sel);
let chordsBuilt = false;
let metroBuilt = false;
let quizBuilt = false;
let gridsBuilt = false;

function buildNav() {
  const nav = $('#navTabs'), bar = $('#tabbar');
  nav.innerHTML = ''; bar.innerHTML = '';
  NAV.forEach(item => {
    const label = t(item.i18n);
    const active = item.id === state.activeView;
    const top = document.createElement('button');
    top.className = 'pill' + (active ? ' on' : '');
    top.dataset.view = item.id; top.textContent = label;
    if (!item.ready) { top.disabled = true; top.style.opacity = .4; top.title = 'Presto'; }
    nav.appendChild(top);

    const bt = document.createElement('button');
    bt.className = active ? 'on' : '';
    bt.dataset.view = item.id;
    bt.innerHTML = `<span class="ic">${item.icon}</span><span>${label}</span>`;
    if (!item.ready) bt.style.opacity = .4;
    bar.appendChild(bt);
  });
}

function switchView(id) {
  const item = NAV.find(n => n.id === id);
  if (!item || !item.ready) return;
  state.activeView = id;
  document.querySelectorAll('.view-section').forEach(s => s.classList.toggle('active', s.id === id));
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', b.dataset.view === id));
  if (id === 'chords' && !chordsBuilt) { buildChords($('#chords')); chordsBuilt = true; }
  if (id === 'metro' && !metroBuilt) { buildMetro($('#metro')); metroBuilt = true; }
  if (id === 'quiz' && !quizBuilt) { buildQuiz($('#quiz')); quizBuilt = true; }
  if (id === 'grids' && !gridsBuilt) { buildGrids($('#grids')); gridsBuilt = true; }
}

/* ---------- tema ---------- */
function applyTheme() {
  const root = document.documentElement;
  if (state.theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', state.theme);
  $('#themeBtn').textContent = state.theme === 'auto' ? '🌓' : state.theme === 'dark' ? '🌙' : '☀️';
}
function cycleTheme() {
  const order = ['auto', 'dark', 'light'];
  set({ theme: order[(order.indexOf(state.theme) + 1) % 3] });
  applyTheme();
}

function syncAudioBtn() { $('#audioBtn').textContent = state.audio ? '🔊' : '🔇'; }
function syncSeg(id, val) { document.querySelectorAll(`#${id} button`).forEach(b => b.classList.toggle('on', b.dataset.v === val)); }

function syncPosBar() {
  const show = state.mode === 'advanced' && state.view === 'box';
  $('#posbar').classList.toggle('hide', !show);
  if (show) $('#posTxt').textContent = `${t('position')}: ${state.boxStart}–${state.boxStart + BOX - 1}`;
}

function playScale() {
  const rootMidi = 36 + (+state.root);
  const iv = SCALES[state.scale].iv;
  const asc = [...iv.map(i => rootMidi + i), rootMidi + 12];
  const seq = [...asc, ...asc.slice(0, -1).reverse()];
  playSequence(seq, 0.3);
}

function renderAll() {
  refreshStudio();
  renderFretboard($('#fretboard'));
  syncPosBar();
}

function init() {
  buildNav();
  buildStudio();
  buildTransport();
  applyI18n();
  applyTheme();
  syncAudioBtn();
  syncSeg('modeSeg', state.mode);
  syncSeg('langSeg', state.lang);
  document.documentElement.setAttribute('data-mode', state.mode);
  renderAll();

  $('#navTabs').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) switchView(b.dataset.view); });
  $('#tabbar').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) switchView(b.dataset.view); });

  $('#themeBtn').addEventListener('click', cycleTheme);
  $('#audioBtn').addEventListener('click', () => { set({ audio: !state.audio }); syncAudioBtn(); });
  $('#modeSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    set({ mode: b.dataset.v });
    document.documentElement.setAttribute('data-mode', state.mode);
    syncSeg('modeSeg', state.mode); syncPosBar();
  });
  $('#langSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    set({ lang: b.dataset.v });
    syncSeg('langSeg', state.lang);
    buildNav(); buildStudio(); buildTransport(); applyI18n(); renderAll();
    if (chordsBuilt) buildChords($('#chords'));
    if (metroBuilt) buildMetro($('#metro'));
    if (quizBuilt) buildQuiz($('#quiz'));
    if (gridsBuilt) buildGrids($('#grids'));
  });

  $('#posPrev').addEventListener('click', () => set({ boxStart: Math.max(0, state.boxStart - 1) }));
  $('#posNext').addEventListener('click', () => set({ boxStart: Math.min(FRETS - BOX, state.boxStart + 1) }));

  window.addEventListener('bm:play-scale', playScale);
  window.addEventListener('keydown', e => {
    if (e.target.matches('input, select, textarea')) return;
    if (e.key === 'ArrowRight') set({ root: (+state.root + 1) % 12 });
    else if (e.key === 'ArrowLeft') set({ root: (+state.root + 11) % 12 });
    else if (e.key === ' ') { e.preventDefault(); playScale(); }
  });

  subscribe((s, changed) => {
    if (changed.some(k => ['root', 'scale', 'tuning', 'label', 'view', 'hand', 'boxStart', 'genre'].includes(k))) {
      renderAll();
    }
    if (chordsBuilt && changed.includes('root')) refreshChords();
  });
}

/* ---------- PWA: service worker + banner aggiornamento ---------- */
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw && nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(reg);
      });
    });
  }).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return; reloaded = true; window.location.reload();
  });
}
function showUpdateBanner(reg) {
  if (document.getElementById('swBanner')) return;
  const b = document.createElement('div');
  b.id = 'swBanner'; b.className = 'sw-banner';
  b.innerHTML = `<span>${t('sw_update')}</span><button class="pill on" id="swUpd">${t('sw_update_btn')}</button>`;
  document.body.appendChild(b);
  b.querySelector('#swUpd').addEventListener('click', () => reg.waiting && reg.waiting.postMessage({ type: 'SKIP_WAITING' }));
}

document.addEventListener('DOMContentLoaded', () => { init(); registerSW(); });
