
'use strict';

/* ═══════════════════════════════════════════════════
   TAB SWITCHING
═══════════════════════════════════════════════════ */

/**
 * @param {string} name 
 * @param {HTMLElement} btn 
 */
function switchTab(name, btn) {
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));

  const target = document.getElementById('pg-' + name);
  if (target) target.classList.add('on');
  if (btn) btn.classList.add('on');
}

document.querySelectorAll('.tab[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
});

document.querySelectorAll('[data-goto-tab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetName = link.dataset.gotoTab;
    const targetBtn  = document.querySelector(`.tab[data-tab="${targetName}"]`);
    switchTab(targetName, targetBtn);
  });
});


/* ═══════════════════════════════════════════════════
   TYPEWRITER — animates the article title on load
═══════════════════════════════════════════════════ */
(function initTypewriter() {
  const titleEl   = document.getElementById('wiki-ttl');
  if (!titleEl) return;

  const fullName  = 'Jhouvann Morden';
  const cursorEl  = document.createElement('span');
  cursorEl.className = 'cursor';
  titleEl.appendChild(cursorEl);

  let index = 0;
  const interval = setInterval(() => {
    if (index < fullName.length) {
      titleEl.insertBefore(document.createTextNode(fullName[index++]), cursorEl);
    } else {
      clearInterval(interval);
      // Remove cursor after it blinks a couple of times
      setTimeout(() => { cursorEl.style.display = 'none'; }, 1600);
    }
  }, 65);
})();


/* ═══════════════════════════════════════════════════
   COUNT-UP — animates sidebar stat numbers on load
═══════════════════════════════════════════════════ */

/**
 * @param {string} id   
 * @param {number} target 
 * @param {number} duration 
 */
function countUp(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;

  let current = 0;
  const step  = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

// Delay slightly so the page renders before counting starts
setTimeout(() => {
  countUp('st-edits', 312, 1400);
  countUp('st-cites',  3, 1000);
  countUp('st-disp',    2,  700);
  countUp('st-veri',    3,  600);
}, 700);


/* ═══════════════════════════════════════════════════
   SCROLL FADE-IN — reveals .fi elements as they enter viewport
═══════════════════════════════════════════════════ */
(function initScrollFade() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fi').forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════
   THEME TOGGLE — dark / light (Classic) mode
═══════════════════════════════════════════════════ */
(function initThemeToggle() {
  const btn  = document.getElementById('theme-btn');
  const html = document.documentElement;

  if (!btn) return;

  btn.addEventListener('click', () => {
    const isDark = html.dataset.theme === 'dark';
    html.dataset.theme = isDark ? 'light' : 'dark';
    btn.textContent    = isDark ? 'Dark Mode' : 'Classic Mode';
  });
})();


/* ═══════════════════════════════════════════════════
   TOC TOGGLE — show / hide table of contents
═══════════════════════════════════════════════════ */
(function initTocToggle() {
  const togBtn  = document.getElementById('toc-tog');
  const tocBody = document.getElementById('toc-body');

  if (!togBtn || !tocBody) return;

  togBtn.addEventListener('click', () => {
    const isHidden = tocBody.style.display === 'none';
    tocBody.style.display = isHidden ? '' : 'none';
    togBtn.textContent    = isHidden ? '[hide]' : '[show]';
  });
})();


/* ═══════════════════════════════════════════════════
   SEARCH BAR — keyword-to-anchor navigation
═══════════════════════════════════════════════════ */
(function initSearch() {
  const input    = document.getElementById('srch-in');
  const dropdown = document.getElementById('srch-out');

  if (!input || !dropdown) return;

  const searchMap = {
    'project':   '#projects',
    'mmcmate':   '#projects',
    'chatbot':   '#projects',
    'forecast':  '#projects',
    'inventory': '#projects',
    'education': '#education',
    'school':    '#education',
    'university':'#education',
    'mmcm':      '#education',
    'gpa':       '#education',
    'leadership':'#leadership',
    'vp':        '#leadership',
    'president': '#leadership',
    'comelec':   '#leadership',
    'psits':     '#leadership',
    'code mmcm': '#leadership',
    'skill':     '#skills',
    'python':    '#skills',
    'java':      '#skills',
    'react':     '#skills',
    'sql':       '#skills',
    'language':  '#skills',
    'cert':      '#certs',
    'aws':       '#certs',
    'excel':     '#certs',
    'achievement':'#certs',
    'credly':    '#certs',
    'personal':  '#personal',
    'davao':     '#personal',
    'anime':     '#personal',
    'gaming':    '#personal',
    'music':     '#personal',
    'contact':   '#external',
    'hire':      '#external',
    'email':     '#external',
    'github':    '#external',
    'linkedin':  '#external',
  };

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();

    if (!query) {
      dropdown.classList.remove('on');
      return;
    }

    if (query.includes('jhouvann') || query.includes('morden') || query === 'me') {
      dropdown.innerHTML = 'You are already viewing this article.';
      dropdown.classList.add('on');
      return;
    }

    const match = Object.keys(searchMap).find(key => query.includes(key));

    if (match) {
      const label   = match.charAt(0).toUpperCase() + match.slice(1);
      const anchor  = searchMap[match];
      dropdown.innerHTML = `→ <a href="${anchor}" id="srch-jump">Jump to: ${label}</a>`;
      const jumpLink = dropdown.querySelector('#srch-jump');
      jumpLink?.addEventListener('click', () => dropdown.classList.remove('on'));
    } else {
      dropdown.innerHTML = `No results for <i>"${escapeHtml(input.value)}"</i>. Did you mean: <a href="#" onclick="return false">someone more qualified?</a>`;
    }

    dropdown.classList.add('on');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.srch')) {
      dropdown.classList.remove('on');
    }
  });
})();


/* ═══════════════════════════════════════════════════
   UTILITY — shared HTML escape helper
   Exported to window so talk.js and history.js can use it
═══════════════════════════════════════════════════ */

/**
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}


window.escapeHtml = escapeHtml;


/* ═══════════════════════════════════════════════════
   Indicator 
═══════════════════════════════════════════════════ */
let indicator = document.querySelector('.indicator');

window.addEventListener('scroll', () => {
  const documentHeight = document.documentElement.scrollHeight;
  const percent = (window.scrollY / (documentHeight - window.innerHeight)) * 100;
  indicator.style.width = percent + '%';
}, { passive: true });