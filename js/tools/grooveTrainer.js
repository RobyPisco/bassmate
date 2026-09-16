/* =========================================================================
   GROOVE TRAINER — Studio di accompagnamento ritmico e loop per basso.
   Ispirato a Scott's Bass Lessons (SBL) Groove Trainer ("Sloppy Joe", ecc.).
   Include:
   - 12 Groove sintetizzati con micro-timing / swing / laid-back feel.
   - Visualizzatore dinamico a 16 step (Kick, Snare, Hihat, Ride).
   - Mixer fusti con Mute e Solo individuali.
   - Internal Time Trainer (Drop-out battute mute).
   - Speed Trainer (aumento progressivo di BPM).
   - Suggerimenti armonici e deep link diretto al manico interattivo.
   ========================================================================= */
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { GROOVE_LIBRARY } from '../audio/drums.js';
import { grooveEngine } from '../audio/grooveEngine.js';

let host = null;
let unsubscribeEngine = null;

// Tap tempo state
let lastTap = 0;
let tapDiffs = [];

export function buildGrooveTrainer(sectionEl) {
  host = sectionEl;
  render();
  bind();

  if (unsubscribeEngine) unsubscribeEngine();
  unsubscribeEngine = grooveEngine.subscribe(onEngineUpdate);
}

export function stopGrooveTrainer() {
  grooveEngine.stop();
}

function render() {
  const g = grooveEngine.groove;
  const isIt = state.lang === 'it';

  host.innerHTML = `
    <div style="margin-bottom:16px">
      <div class="head-eyebrow" data-i18n="groove_trainer">Groove Trainer</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px">
        <h2 style="font-size:clamp(22px,3vw,30px)" id="gtTitle">${g.name}</h2>
        <div class="row" style="gap:8px">
          <span class="chip on" id="gtGenre">${g.genre}</span>
          <span class="chip" id="gtFeel" style="font-family:var(--font-mono)">${g.swing > 0 ? (isIt ? 'Feel: Laid-Back / Swing' : 'Feel: Laid-Back / Swing') : 'Feel: Straight'}</span>
        </div>
      </div>
      <p class="muted" id="gtDesc" style="font-size:13px;margin-top:4px">${isIt ? g.desc_it : g.desc_en}</p>
    </div>

    <!-- CONSOLE PRINCIPALE -->
    <div class="card card-pad gt-console">
      <div class="gt-top-bar">
        <button class="gt-play-btn" id="gtPlay" aria-label="Play / Stop">▶</button>

        <div class="gt-bpm-zone">
          <div class="row" style="gap:6px;align-items:center">
            <button class="tp-step" id="gtBpmDn5" title="-5 BPM">−5</button>
            <button class="tp-step" id="gtBpmDn1" title="-1 BPM">−</button>
            <div class="gt-bpm-readout">
              <span id="gtBpmVal">${grooveEngine.bpm}</span>
              <small>BPM</small>
            </div>
            <button class="tp-step" id="gtBpmUp1" title="+1 BPM">+</button>
            <button class="tp-step" id="gtBpmUp5" title="+5 BPM">+5</button>
          </div>
          <input type="range" class="tp-slider" id="gtBpmSlider" min="40" max="240" value="${grooveEngine.bpm}" style="width:100%;margin-top:8px">
        </div>

        <div class="gt-actions">
          <button class="pill" id="gtTap">TAP</button>
          <button class="pill${grooveEngine.countInEnabled ? ' on' : ''}" id="gtCountIn" title="Pre-roll 4 click">
            ${isIt ? '⏱️ 4 Click Avvio' : '⏱️ 4 Count-in'}
          </button>
        </div>
      </div>

      <!-- STATUS & BAR INDICATOR -->
      <div class="gt-status-strip" id="gtStatusStrip">
        <div class="gt-bar-badge" id="gtBarBadge">${isIt ? 'Battuta: 1' : 'Bar: 1'}</div>
        <div class="gt-callout" id="gtCallout">${isIt ? 'Premi Play o Barra Spaziatrice' : 'Press Play or Spacebar'}</div>
      </div>

      <!-- 16-STEP MATRIX VISUALIZER -->
      <div class="gt-matrix-wrap">
        <div class="gt-step-header" id="gtStepHeaders">
          ${Array.from({ length: 16 }, (_, i) => {
            const beat = Math.floor(i / 4) + 1;
            const sub = ['1', 'e', '&', 'a'][i % 4];
            return `<div class="gt-step-col${i % 4 === 0 ? ' gt-beat-start' : ''}" data-step="${i}">
              <span class="gt-sub-txt">${i % 4 === 0 ? beat : sub}</span>
            </div>`;
          }).join('')}
        </div>

        <div class="gt-matrix-rows" id="gtMatrix">
          <!-- Righe fusti generate dinamicamente -->
        </div>
      </div>

      <!-- DRUM MIXER (MUTE / SOLO) -->
      <div class="gt-mixer">
        <div class="gt-ch-strip" data-ch="kick">
          <div class="gt-ch-name">🥁 ${isIt ? 'Cassa' : 'Kick'}</div>
          <div class="row" style="gap:4px">
            <button class="chip" data-action="mute" data-ch="kick">MUTE</button>
            <button class="chip" data-action="solo" data-ch="kick">SOLO</button>
          </div>
        </div>

        <div class="gt-ch-strip" data-ch="snare">
          <div class="gt-ch-name">🪘 ${isIt ? 'Rullante' : 'Snare'}</div>
          <div class="row" style="gap:4px">
            <button class="chip" data-action="mute" data-ch="snare">MUTE</button>
            <button class="chip" data-action="solo" data-ch="snare">SOLO</button>
          </div>
        </div>

        <div class="gt-ch-strip" data-ch="hihat">
          <div class="gt-ch-name">🪙 ${isIt ? 'Charleston' : 'Hi-Hat'}</div>
          <div class="row" style="gap:4px">
            <button class="chip" data-action="mute" data-ch="hihat">MUTE</button>
            <button class="chip" data-action="solo" data-ch="hihat">SOLO</button>
          </div>
        </div>

        <div class="gt-ch-strip" data-ch="ride">
          <div class="gt-ch-name">🔔 ${isIt ? 'Piatti / Perc' : 'Ride / Perc'}</div>
          <div class="row" style="gap:4px">
            <button class="chip" data-action="mute" data-ch="ride">MUTE</button>
            <button class="chip" data-action="solo" data-ch="ride">SOLO</button>
          </div>
        </div>
      </div>
    </div>

    <!-- STRUMENTI DI ALLENAMENTO (TIME TRAINER & SPEED TRAINER) -->
    <div class="gt-trainers-grid" style="margin-top:16px">
      <!-- TIME TRAINER (DROP-OUT) -->
      <div class="card card-pad">
        <div class="panel-title" style="display:flex;justify-content:space-between;align-items:center">
          <span>⏳ ${isIt ? 'Internal Time Trainer (Drop-out)' : 'Internal Time Trainer (Drop-out)'}</span>
          <label class="adv-toggle" style="margin:0">
            <input type="checkbox" id="gtDropToggle"${grooveEngine.timeTrainer.enabled ? ' checked' : ''}>
          </label>
        </div>
        <p class="muted" style="font-size:12px;margin:6px 0 10px">
          ${isIt 
            ? 'Allena il tuo clock interno: la batteria va in muto improvviso per testare se mantieni il tempo preciso senza accelerare!'
            : 'Train your internal rhythm: drums drop silent so you test if you stay locked in the pocket without rushing!'}
        </p>
        <div class="seg" id="gtDropMode">
          <button data-on="3" data-off="1" class="on">${isIt ? '3 Suona / 1 Muto' : '3 Play / 1 Silent'}</button>
          <button data-on="2" data-off="2">${isIt ? '2 Suona / 2 Muti' : '2 Play / 2 Silent'}</button>
          <button data-on="1" data-off="1">${isIt ? '1 Suona / 1 Muto' : '1 Play / 1 Silent'}</button>
        </div>
      </div>

      <!-- SPEED TRAINER -->
      <div class="card card-pad">
        <div class="panel-title" style="display:flex;justify-content:space-between;align-items:center">
          <span>📈 ${isIt ? 'Speed Trainer (Rampa BPM)' : 'Speed Trainer (BPM Ramp)'}</span>
          <label class="adv-toggle" style="margin:0">
            <input type="checkbox" id="gtSpeedToggle"${grooveEngine.speedTrainer.enabled ? ' checked' : ''}>
          </label>
        </div>
        <p class="muted" style="font-size:12px;margin:6px 0 10px">
          ${isIt 
            ? 'Aumenta gradualmente la velocità ogni 4 battute per costruire resistenza e fluidità.'
            : 'Gradually increases tempo every 4 bars to build stamina and pocket flexibility.'}
        </p>
        <div class="row" style="gap:10px;align-items:center">
          <span class="muted" style="font-size:12px">${isIt ? '+2 BPM ogni 4 battute' : '+2 BPM every 4 bars'}</span>
          <span class="chip on" style="font-size:11px">Max 240 BPM</span>
        </div>
      </div>
    </div>

    <!-- SEZIONE CON BASS TIPS E TASTO DIRETTO APRI SUL MANICO -->
    <div class="card card-pad gt-bass-box" style="margin-top:16px" id="gtBassBox">
      <!-- popolato da updateBassAdvice() -->
    </div>

    <!-- LIBRERIA GROOVE (CARDS) -->
    <div style="margin-top:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="panel-title" style="margin:0">📚 ${isIt ? 'Libreria Groove Disponibili' : 'Groove Library'}</div>
        <span class="muted" style="font-size:12px">12 ${isIt ? 'loop ritmici' : 'drum loops'}</span>
      </div>
      <div class="gt-grid" id="gtGrid">
        <!-- Cards dei 12 groove -->
      </div>
    </div>
  `;

  renderMatrixRows();
  updateBassAdvice();
  renderGrooveCards();
  syncMuteButtons();
}

function renderMatrixRows() {
  const matrix = host.querySelector('#gtMatrix');
  if (!matrix) return;
  const p = grooveEngine.groove.pattern;

  const instruments = [
    { key: 'kick',  label: 'Kick',  emoji: '🥁', hits: p.kick },
    { key: 'snare', label: 'Snare', emoji: '🪘', hits: p.snare, clap: p.clap },
    { key: 'hihat', label: 'Hi-Hat',emoji: '🪙', hits: p.hihat, open: p.open_hihat },
    { key: 'ride',  label: 'Ride',  emoji: '🔔', hits: p.ride },
  ];

  matrix.innerHTML = instruments.map(inst => {
    let padsHtml = '';
    for (let i = 0; i < 16; i++) {
      let isHit = false;
      let isGhost = false;
      let isAccent = false;
      let isOpen = false;

      if (inst.key === 'kick' && inst.hits && inst.hits[i]) {
        isHit = true; isAccent = inst.hits[i] === 2;
      } else if (inst.key === 'snare') {
        if (inst.hits && inst.hits[i]) {
          isHit = true; isGhost = inst.hits[i] === 3; isAccent = inst.hits[i] === 2;
        } else if (inst.clap && inst.clap[i]) {
          isHit = true;
        }
      } else if (inst.key === 'hihat') {
        if (inst.open && inst.open[i]) {
          isHit = true; isOpen = true;
        } else if (inst.hits && inst.hits[i]) {
          isHit = true; isAccent = inst.hits[i] === 2;
        }
      } else if (inst.key === 'ride' && inst.hits && inst.hits[i]) {
        isHit = true; isAccent = inst.hits[i] === 2;
      }

      const cls = [
        'gt-pad',
        isHit ? 'has-hit' : '',
        isAccent ? 'accent' : '',
        isGhost ? 'ghost' : '',
        isOpen ? 'open' : '',
        i % 4 === 0 ? 'beat-pad' : ''
      ].filter(Boolean).join(' ');

      padsHtml += `<div class="${cls}" data-ch="${inst.key}" data-step="${i}"></div>`;
    }

    return `
      <div class="gt-inst-row" data-inst="${inst.key}">
        <div class="gt-inst-label"><span class="gt-emoji">${inst.emoji}</span><span>${inst.label}</span></div>
        <div class="gt-pads-row">${padsHtml}</div>
      </div>
    `;
  }).join('');
}

function updateBassAdvice() {
  const el = host.querySelector('#gtBassBox');
  if (!el) return;
  const g = grooveEngine.groove;
  const isIt = state.lang === 'it';

  // URL per caricare nello studio
  const targetUrl = `index.html?r=${encodeURIComponent(g.rec_root)}&s=${encodeURIComponent(g.rec_scale)}&v=box&l=${g.rec_label || 'deg'}&tab=studio`;

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px">
      <div style="flex:1;min-width:280px">
        <div class="gt-badge-glow">🎸 ${isIt ? 'Consigli per il Basso' : 'Bass Practice Advice'}</div>
        <h3 style="font-size:18px;margin:8px 0 4px;color:var(--text)">
          ${isIt ? 'Scala Consigliata' : 'Recommended Scale'}: <span style="color:var(--accent)">${g.rec_root} ${g.rec_scale.toUpperCase()}</span>
        </h3>
        <div class="muted" style="font-size:13px;margin-bottom:8px">
          <strong>${isIt ? 'Accordi tipici' : 'Chords'}:</strong> ${g.chords}
        </div>
        <p style="font-size:14px;line-height:1.5;color:var(--text);margin-bottom:8px">
          💡 ${isIt ? g.tip_it : g.tip_en}
        </p>
        <div class="muted" style="font-size:11px;opacity:0.8">
          🥁 ${isIt ? 'Batteria acustica campionata da Lars Muldjord (FreePats, CC-BY 4.0)' : 'Real acoustic drums sampled by Lars Muldjord (FreePats, CC-BY 4.0)'}
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start">
        <a href="${targetUrl}" class="pill on" style="padding:10px 18px;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
          🎸 <span>${isIt ? 'Apri sul Manico' : 'Open on Fretboard'} (${g.rec_root} ${g.rec_scale})</span>
        </a>
        <span class="muted" style="font-size:11px">${isIt ? 'Carica subito la scala e il box sul manico' : 'Loads this key and box onto the interactive neck'}</span>
      </div>
    </div>
  `;
}

function renderGrooveCards() {
  const grid = host.querySelector('#gtGrid');
  if (!grid) return;
  const currentId = grooveEngine.groove.id;
  const isIt = state.lang === 'it';

  grid.innerHTML = GROOVE_LIBRARY.map(g => {
    const isSelected = g.id === currentId;
    return `
      <div class="gt-card${isSelected ? ' on' : ''}" data-gid="${g.id}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          <span class="chip on" style="font-size:11px;padding:2px 8px">${g.genre}</span>
          <span class="gt-card-bpm">${g.bpm} BPM</span>
        </div>
        <h4 class="gt-card-title">${g.name}</h4>
        <p class="muted gt-card-desc">${isIt ? g.desc_it : g.desc_en}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:12px">
          <span style="color:var(--accent);font-weight:600">🎸 ${g.rec_root} ${g.rec_scale}</span>
          <button class="pill${isSelected ? ' on' : ''}" style="font-size:11px;padding:4px 10px">
            ${isSelected ? (isIt ? 'Attivo' : 'Active') : (isIt ? 'Seleziona' : 'Select')}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function syncMuteButtons() {
  const mutes = grooveEngine.mutes;
  host.querySelectorAll('.gt-ch-strip').forEach(strip => {
    const ch = strip.dataset.ch;
    const muteBtn = strip.querySelector('[data-action="mute"]');
    if (muteBtn) muteBtn.classList.toggle('on', !!mutes[ch]);
  });
}

function onEngineUpdate(data) {
  if (!host) return;

  if (data.type === 'tick') {
    const { step, bar, countingIn, countBeat, isDropOut, bpm } = data;
    const isIt = state.lang === 'it';

    // Step highlight su visualizer
    host.querySelectorAll('.gt-step-col').forEach(c => {
      c.classList.toggle('active', +c.dataset.step === step);
    });
    host.querySelectorAll('.gt-pad').forEach(p => {
      p.classList.toggle('step-active', +p.dataset.step === step);
    });

    // Callout & Bar
    const callout = host.querySelector('#gtCallout');
    const badge = host.querySelector('#gtBarBadge');

    if (countingIn) {
      if (callout) {
        callout.textContent = `⏱️ PRE-ROLL: ${countBeat} / 4`;
        callout.style.color = 'var(--accent)';
      }
      if (badge) badge.textContent = isIt ? 'Avvio...' : 'Count-in...';
    } else if (isDropOut) {
      if (callout) {
        callout.textContent = `🤫 ${isIt ? 'DROPOUT! MANTIENI IL TEMPO!' : 'DROPOUT! HOLD THE POCKET!'}`;
        callout.style.color = 'var(--warn)';
      }
      if (badge) badge.textContent = `${isIt ? 'Battuta' : 'Bar'} ${bar + 1} (${isIt ? 'Muta' : 'Silent'})`;
    } else {
      if (callout) {
        callout.textContent = `🥁 ${grooveEngine.groove.name}`;
        callout.style.color = 'var(--ok)';
      }
      if (badge) badge.textContent = `${isIt ? 'Battuta' : 'Bar'} ${bar + 1}`;
    }

    if (bpm && bpm !== grooveEngine.bpm) {
      updateBpmDisplay(bpm);
    }
  } else if (data.type === 'state-changed') {
    const btn = host.querySelector('#gtPlay');
    if (btn) {
      btn.textContent = data.running ? '⏹' : '▶';
      btn.classList.toggle('playing', data.running);
    }
    if (!data.running) {
      host.querySelectorAll('.gt-step-col').forEach(c => c.classList.remove('active'));
      host.querySelectorAll('.gt-pad').forEach(p => p.classList.remove('step-active'));
      const callout = host.querySelector('#gtCallout');
      if (callout) {
        callout.textContent = state.lang === 'it' ? 'Premi Play o Barra Spaziatrice' : 'Press Play or Spacebar';
        callout.style.color = 'var(--muted)';
      }
    }
  } else if (data.type === 'bpm-changed') {
    updateBpmDisplay(data.bpm);
  } else if (data.type === 'groove-changed') {
    render();
    bind();
  } else if (data.type === 'mutes-changed') {
    syncMuteButtons();
  }
}

function updateBpmDisplay(bpm) {
  const bpmVal = host?.querySelector('#gtBpmVal');
  const slider = host?.querySelector('#gtBpmSlider');
  if (bpmVal) bpmVal.textContent = bpm;
  if (slider) slider.value = bpm;
}

function bind() {
  // Play button
  host.querySelector('#gtPlay').addEventListener('click', () => grooveEngine.toggle());

  // BPM controls
  host.querySelector('#gtBpmSlider').addEventListener('input', e => {
    grooveEngine.setBpm(+e.target.value);
  });
  host.querySelector('#gtBpmDn1').addEventListener('click', () => grooveEngine.setBpm(grooveEngine.bpm - 1));
  host.querySelector('#gtBpmUp1').addEventListener('click', () => grooveEngine.setBpm(grooveEngine.bpm + 1));
  host.querySelector('#gtBpmDn5').addEventListener('click', () => grooveEngine.setBpm(grooveEngine.bpm - 5));
  host.querySelector('#gtBpmUp5').addEventListener('click', () => grooveEngine.setBpm(grooveEngine.bpm + 5));

  // Count in
  host.querySelector('#gtCountIn').addEventListener('click', e => {
    grooveEngine.countInEnabled = !grooveEngine.countInEnabled;
    e.currentTarget.classList.toggle('on', grooveEngine.countInEnabled);
  });

  // Tap tempo
  host.querySelector('#gtTap').addEventListener('click', () => {
    const now = performance.now();
    if (lastTap && now - lastTap < 2500) {
      tapDiffs.push(now - lastTap);
      if (tapDiffs.length > 4) tapDiffs.shift();
      const avg = tapDiffs.reduce((a, b) => a + b, 0) / tapDiffs.length;
      grooveEngine.setBpm(Math.round(60000 / avg));
    } else {
      tapDiffs = [];
    }
    lastTap = now;
  });

  // Mute / Solo buttons
  host.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.action;
      const ch = btn.dataset.ch;
      if (act === 'mute') grooveEngine.toggleMute(ch);
      else if (act === 'solo') grooveEngine.solo(ch);
    });
  });

  // Time Trainer toggle & modes
  host.querySelector('#gtDropToggle').addEventListener('change', e => {
    grooveEngine.timeTrainer.enabled = e.target.checked;
  });
  host.querySelector('#gtDropMode').addEventListener('click', e => {
    const b = e.target.closest('[data-on]');
    if (!b) return;
    host.querySelectorAll('#gtDropMode button').forEach(el => el.classList.toggle('on', el === b));
    grooveEngine.timeTrainer.barsOn = +b.dataset.on;
    grooveEngine.timeTrainer.barsOff = +b.dataset.off;
  });

  // Speed Trainer toggle
  host.querySelector('#gtSpeedToggle').addEventListener('change', e => {
    grooveEngine.speedTrainer.enabled = e.target.checked;
  });

  // Groove Cards selection
  host.querySelector('#gtGrid').addEventListener('click', e => {
    const card = e.target.closest('[data-gid]');
    if (!card) return;
    grooveEngine.setGroove(card.dataset.gid);
  });
}
