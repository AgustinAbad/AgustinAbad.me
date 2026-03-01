// theme.js
// maneja el cambio entre tema claro y oscuro y guarda la selección en localStorage

document.addEventListener('DOMContentLoaded', () => {
    const switchEl = document.getElementById('theme-switch');
    const root = document.documentElement;

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            switchEl.classList.add('dark');
            switchEl.querySelector('.knob').textContent = '🌙';
        } else {
            switchEl.classList.remove('dark');
            switchEl.querySelector('.knob').textContent = '☀️';
        }
    }

    // crear knob si no existe
    if (!switchEl.querySelector('.knob')) {
        const knob = document.createElement('span');
        knob.className = 'knob';
        switchEl.appendChild(knob);
    }

    // leer preferencia guardada o del sistema
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved) {
        setTheme(saved);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }

    switchEl.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    switchEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchEl.click();
        }
    });
});