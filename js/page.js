/* Pagine secondarie: toggle lingua (legge la preferenza dell'app) + email. */
const lang = localStorage.getItem('bm2_lang') || (navigator.language.startsWith('it') ? 'it' : 'en');
document.documentElement.lang = lang;
document.querySelectorAll('[data-lang]').forEach(el => { el.style.display = el.dataset.lang === lang ? '' : 'none'; });
const emailBtn = document.getElementById('emailBtn');
if (emailBtn) emailBtn.addEventListener('click', () => {
  window.location.href = 'mailto:roberto.pisconti@gmail.com?subject=Bassmate Feedback';
});
