/* =========================================================================
   ICONS — set SVG unico (stroke 1.8, currentColor) al posto delle emoji.
   Uso: icon('theme-dark') -> stringa SVG da inserire con innerHTML.
   ========================================================================= */
const P = {
  'theme-auto':  '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
  'theme-dark':  '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  'theme-light': '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  'audio-on':    '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
  'audio-off':   '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  'exercises':   '<path d="M5 4.5h11a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z"/><path d="M5 17.5a2 2 0 0 1 2-2h11M9 8.5h5"/>',
  'help':        '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8"/><circle cx="12" cy="16.8" r=".6" fill="currentColor"/>',
  'donate':      '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2M11 3.5v2M14 3.5v2"/>',
  'filters':     '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  'print':       '<path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2"/><rect x="7" y="14" width="10" height="6" rx="1"/>',
  'share':       '<path d="M12 15V4M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
  /* tab bar */
  'studio':      '<path d="M3 8.5h18v7H3z"/><path d="M8 8.5v7M13 8.5v7M17.5 8.5v7"/><circle cx="10.5" cy="12" r=".9" fill="currentColor"/>',
  'chords':      '<path d="M7 4v16M12 4v16M17 4v16M4.5 8h15M4.5 14h15"/><circle cx="12" cy="11" r="1.6" fill="currentColor"/><circle cx="7" cy="17" r="1.6" fill="currentColor"/>',
  'metro':       '<path d="M9 4h6l3.5 16h-13z"/><path d="M12 15.5l4-8"/><circle cx="16" cy="7.5" r="1" fill="currentColor"/>',
  'groove':      '<ellipse cx="12" cy="9" rx="8" ry="3"/><path d="M4 9v7c0 1.7 3.6 3 8 3s8-1.3 8-3V9M9 4l-2-1.5M15 4l2-1.5"/>',
  'tuner':       '<circle cx="12" cy="12" r="8.5"/><path d="M12 12l3.5-4.5M7.5 8.2l.8.8M12 6v1.2M16.5 8.2l-.8.8"/>',
  'quiz':        '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  'grids':       '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
};

export function icon(name, size = 20) {
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`;
}
