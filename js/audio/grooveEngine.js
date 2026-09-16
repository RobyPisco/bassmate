/* =========================================================================
   GROOVE ENGINE — Motore di scheduling Web Audio a lookahead per il Groove Trainer.
   Supporta:
   - Loop a 16 step con micro-timing / swing / laid-back offset.
   - Canali fusti Mute / Solo (Kick, Snare, Hihat, Ride).
   - Pre-roll / Count-In (4 click prima di partire).
   - Internal Time Trainer (Drop-out: es. 3 barre ON, 1 barra muta).
   - Speed Trainer (aumento progressivo di BPM ogni N battute).
   - Sincronizzazione precisa a 60fps con la UI.
   ========================================================================= */
import { getAudioCtx } from './synth.js';
import { GROOVE_LIBRARY, scheduleDrumStep, preloadDrumSamples } from './drums.js';

class GrooveEngine {
  constructor() {
    this.groove = GROOVE_LIBRARY[0]; // default Velluto Laid-Back
    this.bpm = this.groove.bpm;
    this.volume = 0.85;
    this.running = false;
    preloadDrumSamples().catch(() => {});

    // Canali mixer
    this.mutes = {
      kick: false,
      snare: false,
      hihat: false,
      ride: false,
    };

    // Count in
    this.countInEnabled = true;
    this.isCountingIn = false;
    this.countInBeat = 0;

    // Time Trainer (Drop-out)
    this.timeTrainer = {
      enabled: false,
      barsOn: 3,
      barsOff: 1,
    };

    // Speed Trainer
    this.speedTrainer = {
      enabled: false,
      bpmIncr: 2,
      everyBars: 4,
      maxBpm: 240,
    };

    // Scheduling state
    this.currentStep = 0; // 0..15
    this.currentBar = 0;
    this.nextStepTime = 0;
    this.timerId = null;
    this.lookahead = 25; // ms
    this.scheduleAheadTime = 0.12; // sec

    // UI callbacks
    this.listeners = new Set();
  }

  setGroove(id) {
    const found = GROOVE_LIBRARY.find(g => g.id === id);
    if (!found) return;
    this.groove = found;
    this.bpm = found.bpm;
    this.notify({ type: 'groove-changed', groove: this.groove, bpm: this.bpm });
  }

  setBpm(newBpm) {
    this.bpm = Math.max(40, Math.min(260, Math.round(newBpm)));
    this.notify({ type: 'bpm-changed', bpm: this.bpm });
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  toggleMute(channel) {
    if (channel in this.mutes) {
      this.mutes[channel] = !this.mutes[channel];
      this.notify({ type: 'mutes-changed', mutes: { ...this.mutes } });
    }
  }

  solo(channel) {
    const isOnlyThisOn = this.mutes[channel] === false &&
      Object.keys(this.mutes).filter(k => k !== channel).every(k => this.mutes[k] === true);

    if (isOnlyThisOn) {
      // Un-solo: riattiva tutto
      Object.keys(this.mutes).forEach(k => { this.mutes[k] = false; });
    } else {
      // Solo: muta tutti tranne channel
      Object.keys(this.mutes).forEach(k => { this.mutes[k] = (k !== channel); });
    }
    this.notify({ type: 'mutes-changed', mutes: { ...this.mutes } });
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify(data) {
    this.listeners.forEach(fn => fn(data));
  }

  start() {
    if (this.running) return;
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    this.running = true;
    this.currentStep = 0;
    this.currentBar = 0;
    this.nextStepTime = ctx.currentTime + 0.05;

    if (this.countInEnabled) {
      this.isCountingIn = true;
      this.countInBeat = 0;
    } else {
      this.isCountingIn = false;
    }

    this.timerId = setInterval(() => this.scheduler(), this.lookahead);
    this.notify({ type: 'state-changed', running: true });
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isCountingIn = false;
    this.countInBeat = 0;
    this.currentStep = 0;
    this.notify({ type: 'state-changed', running: false, step: 0 });
  }

  toggle() {
    this.running ? this.stop() : this.start();
  }

  scheduler() {
    const ctx = getAudioCtx();
    while (this.nextStepTime < ctx.currentTime + this.scheduleAheadTime) {
      if (this.isCountingIn) {
        this.scheduleCountInStep(this.nextStepTime);
        this.advanceCountIn();
      } else {
        this.scheduleLoopStep(this.nextStepTime);
        this.advanceLoop();
      }
    }
  }

  scheduleCountInStep(time) {
    const beatIndex = this.countInBeat;
    // Solo sui 4 quarti (step 0, 4, 8, 12)
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.value = (beatIndex === 0) ? 1400 : 900;
    g.gain.setValueAtTime(this.volume * 0.7, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.start(time); osc.stop(time + 0.06);

    // UI sync
    this.scheduleUiTick(time, {
      countingIn: true,
      countBeat: beatIndex + 1,
      step: beatIndex * 4,
      bar: 0,
      isDropOut: false,
    });
  }

  advanceCountIn() {
    const beatDur = 60 / this.bpm;
    this.nextStepTime += beatDur;
    this.countInBeat++;
    if (this.countInBeat >= 4) {
      this.isCountingIn = false;
      this.currentStep = 0;
      this.currentBar = 0;
    }
  }

  scheduleLoopStep(time) {
    const step = this.currentStep;
    const bar = this.currentBar;

    // Controllo Time Trainer (Drop-out)
    let isDropOut = false;
    if (this.timeTrainer.enabled) {
      const cycle = Math.max(2, this.timeTrainer.barsOn + this.timeTrainer.barsOff);
      const barInCycle = bar % cycle;
      if (barInCycle >= this.timeTrainer.barsOn) {
        isDropOut = true;
      }
    }

    if (!isDropOut) {
      const pattern = this.groove.pattern;
      scheduleDrumStep(step, time, pattern, this.volume, {
        muteKick: this.mutes.kick,
        muteSnare: this.mutes.snare,
        muteHihat: this.mutes.hihat,
        muteRide: this.mutes.ride,
      });
    }

    // UI sync
    this.scheduleUiTick(time, {
      countingIn: false,
      step,
      bar,
      isDropOut,
      bpm: this.bpm,
    });
  }

  advanceLoop() {
    const step16Dur = (60 / this.bpm) / 4;
    const swing = this.groove.swing || 0;

    // Swing / Laid-back timing offset: i sedicesimi dispari (1, 3, 5, 7...) subiscono un leggero ritardo
    let currentStepDuration = step16Dur;
    if (swing > 0) {
      if (this.currentStep % 2 === 0) {
        currentStepDuration = step16Dur * (1 + swing * 0.75);
      } else {
        currentStepDuration = step16Dur * (1 - swing * 0.75);
      }
    }

    this.nextStepTime += currentStepDuration;
    this.currentStep++;

    if (this.currentStep >= 16) {
      this.currentStep = 0;
      this.currentBar++;

      // Speed trainer check a fine battuta
      if (this.speedTrainer.enabled && this.currentBar > 0 && (this.currentBar % this.speedTrainer.everyBars === 0)) {
        this.bpm = Math.min(this.speedTrainer.maxBpm, this.bpm + this.speedTrainer.bpmIncr);
        this.notify({ type: 'bpm-changed', bpm: this.bpm });
      }
    }
  }

  scheduleUiTick(time, info) {
    const ctx = getAudioCtx();
    const delay = Math.max(0, (time - ctx.currentTime) * 1000);
    setTimeout(() => {
      if (this.running) {
        this.notify({ type: 'tick', ...info });
      }
    }, delay);
  }
}

export const grooveEngine = new GrooveEngine();
