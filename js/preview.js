'use strict';

/* ═══════════════════════════════════════════════════
   HOVER PREVIEW CARDS — Wikipedia-style "page preview"
   for project links. Desktop-only (requires real hover).
═══════════════════════════════════════════════════ */
(function initHoverPreviews() {
  if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;
  if (!window.PROJECTS) return;

  const card = document.createElement('div');
  card.id = 'wiki-hovercard';
  card.innerHTML = `
    <div class="hc-title"></div>
    <div class="hc-tagline"></div>
    <div class="hc-tags"></div>
    <a class="hc-more" href="#">Continue reading →</a>
  `;
  document.body.appendChild(card);

  const titleEl   = card.querySelector('.hc-title');
  const taglineEl = card.querySelector('.hc-tagline');
  const tagsEl    = card.querySelector('.hc-tags');
  const moreEl    = card.querySelector('.hc-more');

  let showTimer = null;
  let hideTimer = null;
  let activeLink = null;

  function positionCard(link) {
    const rect = link.getBoundingClientRect();
    const cardWidth = 280;
    let left = rect.left;
    if (left + cardWidth > window.innerWidth - 12) {
      left = window.innerWidth - cardWidth - 12;
    }
    card.style.left = Math.max(12, left) + 'px';
    card.style.top  = (rect.bottom + 8) + 'px';
  }

  function showCard(link, slug) {
    const project = window.PROJECTS[slug];
    if (!project) return;

    titleEl.textContent   = project.title;
    taglineEl.textContent = project.tagline;
    tagsEl.innerHTML      = project.tags.slice(0, 4).map(t => `<span class="sk">${window.escapeHtml(t)}</span>`).join('');
    moreEl.href           = link.href;

    positionCard(link);
    card.classList.add('on');
    activeLink = link;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      card.classList.remove('on');
      activeLink = null;
    }, 200);
  }

  function cancelHide() {
    clearTimeout(hideTimer);
  }

  document.querySelectorAll('a[data-slug]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      clearTimeout(showTimer);
      cancelHide();
      showTimer = setTimeout(() => showCard(link, link.dataset.slug), 220);
    });
    link.addEventListener('mouseleave', () => {
      clearTimeout(showTimer);
      scheduleHide();
    });
  });

  card.addEventListener('mouseenter', cancelHide);
  card.addEventListener('mouseleave', scheduleHide);
})();
