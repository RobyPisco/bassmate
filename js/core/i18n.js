/* =========================================================================
   I18N — dizionario UI bilingue (it/en) + helper.
   Per aggiungere una lingua: una nuova voce in DICT. Per una stringa: una
   chiave in entrambe le lingue. La UI usa data-i18n / data-i18n-title.
   ========================================================================= */
import { state } from './state.js';

export const DICT = {
  it: {
    // header / nav
    studio: 'Studio', manual: 'Manuale', chords: 'Accordi', metro: 'Metro', tuner: 'Tuner', quiz: 'Quiz', tab: 'Tab',
    mode_simple: 'Semplice', mode_advanced: 'Avanzata', mode: 'Modalità',
    // controlli strumento
    root_note: 'Nota radice', scale_chord: 'Scala / Accordo', tuning: 'Accordatura',
    labels: 'Etichette', view: 'Vista', hand: 'Mano', genre: 'Genere',
    degrees: 'Gradi', notes: 'Note (C,D,E)', solfege: 'Note (Do,Re,Mi)', fingers: 'Dita (Box)',
    all: 'Tutto', box: 'Box 5 tasti', right: 'Destro', lefty: 'Mancino',
    play_scale: 'Ascolta scala', reset: 'Reset', transpose_up: 'Semitono su', transpose_dn: 'Semitono giù',
    pos_prev: 'Posizione precedente', pos_next: 'Posizione successiva', position: 'Posizione',
    // pannello info / manuale
    formula: 'Formula', used_in: 'Si usa in', notes_label: 'Note',
    all_scales: 'Tutte le scale', pick_genre: 'Scegli uno stile',
    // tema / lingua
    theme: 'Tema', theme_auto: 'Auto', theme_dark: 'Scuro', theme_light: 'Chiaro',
    audio_on: 'Audio ON', audio_off: 'Audio OFF',
    // legenda
    leg_root: 'Nota radice', leg_note: 'Nota della scala',
    // studio head / pannelli
    selected_scale: 'Scala selezionata', show: 'Mostra', notes_short: 'Note', solfege_short: 'Solf.', fingers_short: 'Dita',
    listen: 'Ascolta', share: 'Condividi', notes_count: 'note',
    harmonization: 'Armonizzazione', harm_na: 'Disponibile per scale a 7 note.',
    // transport / metronomo
    tempo: 'Tempo', subdivision: 'Suddivisione', bpm: 'BPM',
    chords_lib: 'Libreria accordi', chords_sub: 'Basso 4 corde · accordatura standard E·A·D·G',
    metronome: 'Metronomo', groove: 'Groove', advanced_opts: 'Opzioni avanzate',
    drums: 'Batteria', speed_trainer: 'Speed trainer', bpm_every: 'BPM ogni', beats_unit: 'battiti', volume: 'Volume',
    // quiz
    quiz_mode_lbl: 'Modalità', mode_note: 'Nota', mode_degree: 'Grado', mode_ear: 'Orecchio', mode_shape: 'Mistero',
    difficulty: 'Difficoltà', easy: 'Facile', normal: 'Normale', hard: 'Difficile', time: 'Tempo',
    quiz_start: 'Inizia', quiz_stop: 'Stop', quiz_again: 'Rigioca', quiz_replay: 'Riascolta',
    score: 'Punti', combo: 'Combo', best: 'Record', best_combo: 'Combo max',
    quiz_q_note: 'Che nota è quella evidenziata?',
    quiz_q_degree: 'Che grado è la nota nella scala',
    quiz_q_ear: 'Quale scala hai sentito?',
    quiz_q_shape: 'Che scala è questa, con radice',
    // tuner
    tuner_title: 'Accordatore Cromatico',
    tuner_sub: 'Usa il microfono per accordare il tuo basso o ascolta le note di riferimento.',
    tuner_start: 'Attiva microfono',
    tuner_stop: 'Disattiva',
    tuner_listening: 'In ascolto...',
    tuner_in_tune: 'In tono',
    tuner_flat: 'Calante (troppo basso)',
    tuner_sharp: 'Crescente (troppo alto)',
    tuner_error: 'Accesso al microfono non consentito o non supportato.',
    tuner_ref_notes: 'Note di riferimento (tocca per ascoltare):',
    // export / griglie
    export_pdf: 'PDF', grids: 'Griglie', grids_sub: 'Per scrivere scale, esercizi e compiti a mano.',
    grids_count: 'Numero manici', grids_strings: 'Corde', grids_frets: 'Tasti',
    sw_update: 'Nuova versione disponibile', sw_update_btn: 'Aggiorna',
  },
  en: {
    studio: 'Studio', manual: 'Manual', chords: 'Chords', metro: 'Metro', tuner: 'Tuner', quiz: 'Quiz', tab: 'Tab',
    mode_simple: 'Simple', mode_advanced: 'Advanced', mode: 'Mode',
    root_note: 'Root note', scale_chord: 'Scale / Chord', tuning: 'Tuning',
    labels: 'Labels', view: 'View', hand: 'Hand', genre: 'Genre',
    degrees: 'Degrees', notes: 'Notes (C,D,E)', solfege: 'Solfege (Do,Re,Mi)', fingers: 'Fingers (Box)',
    all: 'All', box: 'Box 5 frets', right: 'Right', lefty: 'Lefty',
    play_scale: 'Play scale', reset: 'Reset', transpose_up: 'Semitone up', transpose_dn: 'Semitone down',
    pos_prev: 'Previous position', pos_next: 'Next position', position: 'Position',
    formula: 'Formula', used_in: 'Used in', notes_label: 'Notes',
    all_scales: 'All scales', pick_genre: 'Pick a style',
    theme: 'Theme', theme_auto: 'Auto', theme_dark: 'Dark', theme_light: 'Light',
    audio_on: 'Audio ON', audio_off: 'Audio OFF',
    leg_root: 'Root note', leg_note: 'Scale note',
    selected_scale: 'Selected scale', show: 'Show', notes_short: 'Notes', solfege_short: 'Solf.', fingers_short: 'Fingers',
    listen: 'Listen', share: 'Share', notes_count: 'notes',
    harmonization: 'Harmonization', harm_na: 'Available for 7-note scales.',
    tempo: 'Time', subdivision: 'Subdivision', bpm: 'BPM',
    chords_lib: 'Chord library', chords_sub: '4-string bass · standard E·A·D·G tuning',
    metronome: 'Metronome', groove: 'Groove', advanced_opts: 'Advanced options',
    drums: 'Drums', speed_trainer: 'Speed trainer', bpm_every: 'BPM every', beats_unit: 'beats', volume: 'Volume',
    quiz_mode_lbl: 'Mode', mode_note: 'Note', mode_degree: 'Degree', mode_ear: 'Ear', mode_shape: 'Mystery',
    difficulty: 'Difficulty', easy: 'Easy', normal: 'Normal', hard: 'Hard', time: 'Time',
    quiz_start: 'Start', quiz_stop: 'Stop', quiz_again: 'Play again', quiz_replay: 'Replay',
    score: 'Score', combo: 'Combo', best: 'Best', best_combo: 'Best combo',
    quiz_q_note: 'Which note is highlighted?',
    quiz_q_degree: 'Which degree is the note in the scale',
    quiz_q_ear: 'Which scale did you hear?',
    quiz_q_shape: 'Which scale is this, with root',
    // tuner
    tuner_title: 'Chromatic Tuner',
    tuner_sub: 'Use your microphone to tune your bass or play reference tones.',
    tuner_start: 'Enable microphone',
    tuner_stop: 'Stop',
    tuner_listening: 'Listening...',
    tuner_in_tune: 'In tune',
    tuner_flat: 'Flat (too low)',
    tuner_sharp: 'Sharp (too high)',
    tuner_error: 'Microphone permission denied or not supported.',
    tuner_ref_notes: 'Reference notes (tap to hear):',
    export_pdf: 'PDF', grids: 'Grids', grids_sub: 'For writing scales, exercises and homework by hand.',
    grids_count: 'Necks', grids_strings: 'Strings', grids_frets: 'Frets',
    sw_update: 'New version available', sw_update_btn: 'Update',
  },
};

/** Traduce una chiave nella lingua corrente (fallback: en, poi la chiave). */
export function t(key) {
  return (DICT[state.lang] && DICT[state.lang][key]) || DICT.en[key] || key;
}

/** Applica le traduzioni a tutti gli elementi marcati nel DOM. */
export function applyI18n(rootEl = document) {
  rootEl.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  rootEl.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
    el.setAttribute('aria-label', t(el.dataset.i18nTitle));
  });
  document.documentElement.lang = state.lang;
}
