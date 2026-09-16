/* =========================================================================
   GROOVE TRAINER — Studio di accompagnamento ritmico e loop per basso.
   Include:
   - 12 Preset acustici con micro-timing / swing / laid-back feel.
   - Sequencer a 16 step interattivo e cliccabile per comporre beat personali.
   - Salvataggio e gestione dei pattern utente in localStorage.
   - Mixer fusti con Mute e Solo individuali.
   - Internal Time Trainer (Drop-out battute mute).
   - Speed Trainer (aumento progressivo di BPM).
   - Suggerimenti armonici e deep link diretto al manico interattivo.
   ========================================================================= */
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { GROOVE_LIBRARY, kick, snare, hihat, ride } from '../audio/drums.js';
import { grooveEngine } from '../audio/grooveEngine.js';
import { getAudioCtx } from '../audio/synth.js';

let host = null;
let unsubscribeEngine = null;

// Tap tempo state
let lastTap = 0;
let tapDiffs = [];

// LocalStorage per i pattern personalizzati dell'utente
const CUSTOM_STORAGE_KEY = 'bassmate_custom_grooves';

export function getCustomGrooves() {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function saveCustomGroove(groove) {
  try {
    const list = getCustomGrooves();
    const existingIndex = list.findIndex(g => g.id === groove.id);
    if (existingIndex >= 0) {
      list[existingIndex] = groove;
    } else {
      list.unshift(groove);
    }
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (_) {
    return false;
  }
}

export function deleteCustomGroove(id) {
  try {
    const list = getCustomGrooves().filter(g => g.id !== id);
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (_) {
    return false;
  }
}

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
  const isCustom = !!g.isCustom;

  host.innerHTML = `
    <div style="margin-bottom:16px">
      <div class="head-eyebrow" data-i18n="groove_trainer">Groove Trainer</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px">
        <h2 style="font-size:clamp(22px,3vw,30px)" id="gtTitle">
          ${g.name}
          ${isCustom ? `<span class="gt-custom-badge" style="vertical-align:middle;margin-left:6px">User Pattern</span>` : ''}
          ${g.isModified && !isCustom ? `<span class="chip" style="font-size:11px;vertical-align:middle;color:var(--accent)">✏️ Modificato</span>` : ''}
        </h2>
        <div class="row" style="gap:8px">
          <span class="chip on" id="gtGenre">${g.genre || 'Groove'}</span>
          <span class="chip" id="gtFeel" style="font-family:var(--font-mono)">
            ${g.swing > 0 ? 'Feel: Laid-Back / Swing' : 'Feel: Straight'}
          </span>
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

      <!-- SEQUENCER MATRIX TOOLBAR (EDITOR PATTERN) -->
      <div class="gt-matrix-toolbar">
        <div class="row" style="gap:8px;align-items:center">
          <span style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:var(--text)">
            🥁 ${isIt ? 'Sequencer a 16 Step' : '16-Step Sequencer'}
          </span>
          <span class="muted" style="font-size:11px">
            (${isIt ? 'Clicca sui pad per comporre e modificare' : 'Click pads to compose & edit'})
          </span>
        </div>
        <div class="row" style="gap:6px">
          <button class="chip on" id="gtBtnSave" style="background:var(--accent);color:#000;font-weight:700" title="${isIt ? 'Salva questo pattern nei tuoi groove' : 'Save this pattern'}">
            💾 ${isIt ? 'Salva Pattern' : 'Save Pattern'}
          </button>
          <button class="chip" id="gtBtnClear" title="${isIt ? 'Azzera tutti i colpi' : 'Clear all steps'}">
            ✨ ${isIt ? 'Pulisci' : 'Clear'}
          </button>
          <button class="chip" id="gtBtnRandom" title="${isIt ? 'Genera un beat casuale' : 'Generate random beat'}">
            🎲 ${isIt ? 'Beat Casuale' : 'Random Beat'}
          </button>
          <button class="chip" id="gtBtnNew" title="${isIt ? 'Crea un nuovo pattern vuoto' : 'Create new empty pattern'}">
            ➕ ${isIt ? 'Nuovo' : 'New'}
          </button>
        </div>
      </div>

      <!-- 16-STEP MATRIX VISUALIZER / EDITOR -->
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
        <div class="panel-title" style="margin:0">📚 ${isIt ? 'Libreria Groove & Pattern Personali' : 'Groove & Custom Library'}</div>
        <span class="muted" style="font-size:12px">Studio Pocket Trainer</span>
      </div>
      <div class="gt-grid" id="gtGrid">
        <!-- Cards dei groove (custom + factory) -->
      </div>
    </div>

    <!-- MODAL SALVA PATTERN -->
    <div class="gt-modal-backdrop" id="gtSaveModal" style="display:none">
      <div class="card card-pad gt-modal-box">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <h3 style="margin:0;font-size:18px">💾 ${isIt ? 'Salva Pattern Personalizzato' : 'Save Custom Pattern'}</h3>
          <button class="pill" id="gtModalClose" style="padding:4px 10px">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">
              ${isIt ? 'Nome del Pattern:' : 'Pattern Name:'}
            </label>
            <input type="text" id="gtSaveName" class="tp-input" style="width:100%;padding:8px 12px;border-radius:var(--r-md);background:var(--surface-2);border:1px solid var(--border);color:var(--text)" placeholder="${isIt ? 'Es. Il Mio Funk Groove' : 'e.g. My Funk Groove'}" value="${g.name.replace(' (Copia)', '')}">
          </div>
          <div class="row" style="gap:10px">
            <div style="flex:1">
              <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">
                ${isIt ? 'Genere:' : 'Genre:'}
              </label>
              <select id="gtSaveGenre" class="tp-input" style="width:100%;padding:8px 12px;border-radius:var(--r-md);background:var(--surface-2);border:1px solid var(--border);color:var(--text)">
                <option value="Funk"${g.genre === 'Funk' ? ' selected' : ''}>Funk</option>
                <option value="Rock"${g.genre === 'Rock' || g.genre === 'Rock / Metal' ? ' selected' : ''}>Rock</option>
                <option value="Soul / R&B"${g.genre === 'Soul / R&B' ? ' selected' : ''}>Soul / R&B</option>
                <option value="Hip-Hop / Neo-Soul"${g.genre === 'Neo-Soul / Hip-Hop' ? ' selected' : ''}>Hip-Hop / Neo-Soul</option>
                <option value="Blues"${g.genre === 'Blues' ? ' selected' : ''}>Blues</option>
                <option value="Jazz"${g.genre === 'Jazz' ? ' selected' : ''}>Jazz</option>
                <option value="Pop"${g.genre === 'Pop / Rock' ? ' selected' : ''}>Pop</option>
                <option value="Latin / Bossa"${g.genre === 'Latin / Bossa' ? ' selected' : ''}>Latin / Bossa</option>
                <option value="Personalizzato">Personalizzato</option>
              </select>
            </div>
            <div style="flex:1">
              <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px">
                ${isIt ? 'Feel Ritmico:' : 'Rhythmic Feel:'}
              </label>
              <select id="gtSaveFeel" class="tp-input" style="width:100%;padding:8px 12px;border-radius:var(--r-md);background:var(--surface-2);border:1px solid var(--border);color:var(--text)">
                <option value="0"${!g.swing ? ' selected' : ''}>Straight (Dritto)</option>
                <option value="0.12"${g.swing > 0 && g.swing < 0.2 ? ' selected' : ''}>Laid-Back (Micro-swing)</option>
                <option value="0.25"${g.swing >= 0.2 && g.swing < 0.3 ? ' selected' : ''}>Swing Jazz</option>
                <option value="0.33"${g.swing >= 0.3 ? ' selected' : ''}>Shuffle Blues a terzine</option>
              </select>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
            <button class="pill" id="gtModalCancel">${isIt ? 'Annulla' : 'Cancel'}</button>
            <button class="pill on" id="gtModalConfirm" style="background:var(--accent);color:#000;font-weight:700">${isIt ? '💾 Salva nei Miei Groove' : '💾 Save to My Grooves'}</button>
          </div>
        </div>
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

      padsHtml += `<div class="${cls}" data-ch="${inst.key}" data-step="${i}" title="${inst.label} - Step ${i + 1}"></div>`;
    }

    return `
      <div class="gt-inst-row" data-inst="${inst.key}">
        <div class="gt-inst-label"><span class="gt-emoji">${inst.emoji}</span><span>${inst.label}</span></div>
        <div class="gt-pads-row">${padsHtml}</div>
      </div>
    `;
  }).join('');
}

function handlePadClick(pad) {
  const ch = pad.dataset.ch;
  const step = parseInt(pad.dataset.step, 10);
  const p = grooveEngine.groove.pattern;
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume();

  // Inizializza array a 16 se assenti
  if (!p.kick) p.kick = Array(16).fill(0);
  if (!p.snare) p.snare = Array(16).fill(0);
  if (!p.hihat) p.hihat = Array(16).fill(0);
  if (!p.open_hihat) p.open_hihat = Array(16).fill(0);
  if (!p.ride) p.ride = Array(16).fill(0);

  if (ch === 'kick') {
    // 0 -> 1 (normale) -> 2 (accento) -> 0
    const cur = p.kick[step] || 0;
    const next = cur === 0 ? 1 : (cur === 1 ? 2 : 0);
    p.kick[step] = next;
    if (next > 0) kick(ctx.currentTime, next === 2, 1.0);
  } else if (ch === 'snare') {
    // 0 -> 1 (normale) -> 2 (accento) -> 3 (ghost) -> 0
    const cur = p.snare[step] || 0;
    const next = cur === 0 ? 1 : (cur === 1 ? 2 : (cur === 2 ? 3 : 0));
    p.snare[step] = next;
    if (next > 0) snare(ctx.currentTime, next, false, 1.0);
  } else if (ch === 'hihat') {
    // 0 -> 1 (chiuso) -> 2 (chiuso accento) -> 3 (aperto con cerchio) -> 0
    const isOpen = p.open_hihat && p.open_hihat[step] > 0;
    const isClosed = p.hihat && p.hihat[step] > 0;
    const closedVal = isClosed ? p.hihat[step] : 0;

    let nextState = 0;
    if (!isOpen && !isClosed) nextState = 1;
    else if (closedVal === 1) nextState = 2;
    else if (closedVal === 2) nextState = 3;
    else nextState = 0;

    if (nextState === 0) {
      p.hihat[step] = 0;
      p.open_hihat[step] = 0;
    } else if (nextState === 1) {
      p.hihat[step] = 1;
      p.open_hihat[step] = 0;
      hihat(ctx.currentTime, 0.6, 1.0, false);
    } else if (nextState === 2) {
      p.hihat[step] = 2;
      p.open_hihat[step] = 0;
      hihat(ctx.currentTime, 0.85, 1.0, false);
    } else if (nextState === 3) {
      p.hihat[step] = 0;
      p.open_hihat[step] = 2;
      hihat(ctx.currentTime, 0.55, 1.0, true);
    }
  } else if (ch === 'ride') {
    // 0 -> 1 (normale) -> 2 (accento) -> 0
    const cur = p.ride[step] || 0;
    const next = cur === 0 ? 1 : (cur === 1 ? 2 : 0);
    p.ride[step] = next;
    if (next > 0) ride(ctx.currentTime, next === 2, 1.0);
  }

  grooveEngine.groove.isModified = true;
  renderMatrixRows();

  // Aggiorna indicatore titolo
  const titleEl = host.querySelector('#gtTitle');
  if (titleEl && !titleEl.textContent.includes('✏️')) {
    titleEl.innerHTML = `
      ${grooveEngine.groove.name}
      ${grooveEngine.groove.isCustom ? `<span class="gt-custom-badge" style="vertical-align:middle;margin-left:6px">User Pattern</span>` : ''}
      <span class="chip" style="font-size:11px;vertical-align:middle;color:var(--accent)">✏️ Modificato</span>
    `;
  }
}

function updateBassAdvice() {
  const el = host.querySelector('#gtBassBox');
  if (!el) return;
  const g = grooveEngine.groove;
  const isIt = state.lang === 'it';

  const root = g.rec_root || 'E';
  const scale = g.rec_scale || 'dorian';
  const label = g.rec_label || 'deg';
  const chords = g.chords || (isIt ? 'Accompagnamento Libero' : 'Free Form');
  const tip = isIt ? (g.tip_it || 'Sperimenta note dell\'accordo e variazioni percussive.') : (g.tip_en || 'Experiment with chord tones and rhythm.');

  const targetUrl = `index.html?r=${encodeURIComponent(root)}&s=${encodeURIComponent(scale)}&v=box&l=${label}&tab=studio`;

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px">
      <div style="flex:1;min-width:280px">
        <div class="gt-badge-glow">🎸 ${isIt ? 'Consigli per il Basso' : 'Bass Practice Advice'}</div>
        <h3 style="font-size:18px;margin:8px 0 4px;color:var(--text)">
          ${isIt ? 'Scala Consigliata' : 'Recommended Scale'}: <span style="color:var(--accent)">${root} ${scale.toUpperCase()}</span>
        </h3>
        <div class="muted" style="font-size:13px;margin-bottom:8px">
          <strong>${isIt ? 'Accordi tipici' : 'Chords'}:</strong> ${chords}
        </div>
        <p style="font-size:14px;line-height:1.5;color:var(--text);margin-bottom:8px">
          💡 ${tip}
        </p>
        <div class="muted" style="font-size:11px;opacity:0.8">
          🥁 ${isIt ? 'Batteria acustica campionata in sala stereo da Alexander Holm (Yamaha Custom, CC-BY 3.0)' : 'Stereo acoustic drumkit sampled by Alexander Holm (Yamaha Custom, CC-BY 3.0)'}
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start">
        <a href="${targetUrl}" class="pill on" style="padding:10px 18px;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
          🎸 <span>${isIt ? 'Apri sul Manico' : 'Open on Fretboard'} (${root} ${scale})</span>
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
  const customs = getCustomGrooves();

  let html = '';

  // 1. Sezione Custom Grooves se presenti
  if (customs.length > 0) {
    html += `
      <div style="grid-column: 1 / -1; margin-bottom: 4px">
        <div class="row" style="gap:8px;align-items:center">
          <span style="font-weight:700;font-size:14px;color:var(--text)">⭐ ${isIt ? 'I Tuoi Pattern Personalizzati' : 'Your Custom Patterns'} (${customs.length})</span>
          <span class="gt-custom-badge">User</span>
        </div>
      </div>
    `;

    html += customs.map(g => {
      const isSelected = g.id === currentId;
      return `
        <div class="gt-card${isSelected ? ' on' : ''}" data-gid="${g.id}" style="border-color:${isSelected ? 'var(--accent)' : 'rgba(255, 152, 0, 0.4)'}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <div class="row" style="gap:6px;align-items:center">
              <span class="gt-custom-badge">${g.genre || 'Custom'}</span>
              <span class="gt-card-bpm">${g.bpm} BPM</span>
            </div>
            <button class="gt-delete-btn" data-delete-gid="${g.id}" title="${isIt ? 'Elimina questo pattern' : 'Delete this pattern'}">🗑️</button>
          </div>
          <h4 class="gt-card-title">${g.name}</h4>
          <p class="muted gt-card-desc">${isIt ? g.desc_it : g.desc_en}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:12px">
            <span style="color:var(--accent);font-weight:600">🎸 ${g.rec_root || 'E'} ${g.rec_scale || 'dorian'}</span>
            <button class="pill${isSelected ? ' on' : ''}" style="font-size:11px;padding:4px 10px">
              ${isSelected ? (isIt ? 'Attivo' : 'Active') : (isIt ? 'Seleziona' : 'Select')}
            </button>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div style="grid-column: 1 / -1; margin-top: 16px; margin-bottom: 4px">
        <span style="font-weight:700;font-size:14px;color:var(--text)">📚 ${isIt ? 'Libreria Preset di Fabbrica' : 'Factory Preset Library'} (12)</span>
      </div>
    `;
  }

  // 2. Preset di fabbrica
  html += GROOVE_LIBRARY.map(g => {
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

  grid.innerHTML = html;
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

  // Click sui pad della matrice (editing interattivo del pattern)
  host.querySelector('#gtMatrix').addEventListener('click', e => {
    const pad = e.target.closest('.gt-pad');
    if (pad) {
      handlePadClick(pad);
    }
  });

  // Matrix Toolbar: Pulisci
  host.querySelector('#gtBtnClear').addEventListener('click', () => {
    const isIt = state.lang === 'it';
    if (confirm(isIt ? 'Vuoi azzerare tutti i colpi del pattern corrente?' : 'Clear all steps in current pattern?')) {
      grooveEngine.clearPattern();
    }
  });

  // Matrix Toolbar: Beat Casuale
  host.querySelector('#gtBtnRandom').addEventListener('click', () => {
    grooveEngine.randomizePattern();
  });

  // Matrix Toolbar: Nuovo Pattern vuoto
  host.querySelector('#gtBtnNew').addEventListener('click', () => {
    const isIt = state.lang === 'it';
    const emptyGroove = {
      id: 'custom_' + Date.now(),
      name: isIt ? 'Nuovo Groove' : 'New Groove',
      genre: 'Personalizzato',
      bpm: 100,
      swing: 0,
      isCustom: true,
      desc_it: 'Pattern vuoto pronto per essere composto sulla matrice.',
      desc_en: 'Empty pattern ready to be composed on the matrix.',
      rec_root: 'E',
      rec_scale: 'dorian',
      rec_label: 'deg',
      chords: 'Groove Libero',
      tip_it: 'Clicca sui pad per inserire cassa, rullante, charleston e ride!',
      tip_en: 'Click on pads to add kick, snare, hi-hat, and ride hits!',
      pattern: {
        kick: Array(16).fill(0),
        snare: Array(16).fill(0),
        hihat: Array(16).fill(0),
        open_hihat: Array(16).fill(0),
        ride: Array(16).fill(0),
      }
    };
    grooveEngine.loadGrooveObject(emptyGroove);
  });

  // Matrix Toolbar: Salva Pattern (Apertura Modal)
  const modal = host.querySelector('#gtSaveModal');
  const openModal = () => {
    if (modal) {
      const g = grooveEngine.groove;
      const nameInput = modal.querySelector('#gtSaveName');
      if (nameInput) {
        nameInput.value = g.isCustom ? g.name : `${g.name} (Mio Mix)`;
      }
      modal.style.display = 'flex';
      setTimeout(() => nameInput && nameInput.focus(), 50);
    }
  };

  host.querySelector('#gtBtnSave').addEventListener('click', openModal);

  // Modal close & cancel
  const closeModal = () => { if (modal) modal.style.display = 'none'; };
  host.querySelector('#gtModalClose').addEventListener('click', closeModal);
  host.querySelector('#gtModalCancel').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Modal confirm save
  host.querySelector('#gtModalConfirm').addEventListener('click', () => {
    const isIt = state.lang === 'it';
    const name = host.querySelector('#gtSaveName').value.trim() || (isIt ? 'Mio Groove' : 'My Groove');
    const genre = host.querySelector('#gtSaveGenre').value;
    const feelVal = parseFloat(host.querySelector('#gtSaveFeel').value) || 0;

    const currentG = grooveEngine.groove;
    const newGroove = {
      id: currentG.isCustom ? currentG.id : ('custom_' + Date.now()),
      name,
      genre,
      bpm: grooveEngine.bpm,
      swing: feelVal,
      isCustom: true,
      desc_it: `Pattern personalizzato a ${grooveEngine.bpm} BPM creato con il sequencer di Bassmate.`,
      desc_en: `Custom ${genre} pattern at ${grooveEngine.bpm} BPM created with Bassmate.`,
      rec_root: currentG.rec_root || 'E',
      rec_scale: currentG.rec_scale || 'dorian',
      rec_label: currentG.rec_label || 'deg',
      chords: currentG.chords || 'Groove Libero',
      tip_it: currentG.tip_it || 'Pattern ritmico personalizzato. Accompagnalo sul manico!',
      tip_en: currentG.tip_en || 'Custom rhythm pattern. Play along on the fretboard!',
      pattern: JSON.parse(JSON.stringify(currentG.pattern)),
    };

    saveCustomGroove(newGroove);
    closeModal();
    grooveEngine.loadGrooveObject(newGroove);

    // Callout di conferma
    const callout = host.querySelector('#gtCallout');
    if (callout) {
      callout.textContent = `💾 ${isIt ? 'Pattern salvato nei tuoi groove!' : 'Pattern saved to your grooves!'}`;
      callout.style.color = 'var(--accent)';
      setTimeout(() => {
        if (!grooveEngine.running && callout) {
          callout.textContent = isIt ? 'Premi Play o Barra Spaziatrice' : 'Press Play or Spacebar';
          callout.style.color = 'var(--muted)';
        }
      }, 3000);
    }
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

  // Groove Cards selection and custom deletion
  host.querySelector('#gtGrid').addEventListener('click', e => {
    const delBtn = e.target.closest('[data-delete-gid]');
    if (delBtn) {
      e.stopPropagation();
      const gid = delBtn.dataset.deleteGid;
      const isIt = state.lang === 'it';
      if (confirm(isIt ? 'Vuoi eliminare questo pattern personalizzato?' : 'Delete this custom pattern?')) {
        deleteCustomGroove(gid);
        if (grooveEngine.groove.id === gid) {
          grooveEngine.setGroove('velluto-laidback');
        } else {
          renderGrooveCards();
        }
      }
      return;
    }

    const card = e.target.closest('[data-gid]');
    if (!card) return;
    grooveEngine.setGroove(card.dataset.gid, getCustomGrooves());
  });
}
