/* Pagine secondarie: toggle lingua e tema (legge la preferenza dell'app) + email. */
const lang = localStorage.getItem('bm2_lang') || (navigator.language.startsWith('it') ? 'it' : 'en');
document.documentElement.lang = lang;
document.querySelectorAll('[data-lang]').forEach(el => { el.style.display = el.dataset.lang === lang ? '' : 'none'; });

const theme = localStorage.getItem('bm2_theme');
if (theme && theme !== 'auto') {
  document.documentElement.setAttribute('data-theme', theme);
} else {
  document.documentElement.removeAttribute('data-theme');
}

const emailBtn = document.getElementById('emailBtn');
if (emailBtn) emailBtn.addEventListener('click', () => {
  window.location.href = 'mailto:roberto.pisconti@gmail.com?subject=Bassmate Feedback';
});
