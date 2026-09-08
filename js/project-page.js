'use strict';

/* ═══════════════════════════════════════════════════
   PROJECT DETAIL PAGE — renders one entry from
   window.PROJECTS based on the ?slug= query param.
═══════════════════════════════════════════════════ */
(function renderProjectPage() {
  const slug    = new URLSearchParams(window.location.search).get('slug');
  const project = slug && window.PROJECTS && window.PROJECTS[slug];

  const contentEl    = document.getElementById('proj-content');
  const notFoundEl   = document.getElementById('not-found-banner');

  if (!project) {
    if (contentEl)  contentEl.hidden  = true;
    if (notFoundEl) notFoundEl.hidden = false;
    document.title = 'Article not found — DevWiki';
    return;
  }

  document.title = project.title + ' — DevWiki';

  document.getElementById('proj-title').textContent = project.title;

  const tagsEl = document.getElementById('proj-tags');
  tagsEl.innerHTML = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

  const descEl = document.getElementById('proj-desc');
  descEl.innerHTML = project.description.map(p => `<p>${p}</p>`).join('');

  const highlightsWrap = document.getElementById('proj-highlights');
  if (project.highlights && project.highlights.length) {
    highlightsWrap.innerHTML = `
      <h2 class="sh">Engineering highlights</h2>
      <div class="wc"><ul>${project.highlights.map(h => `<li>${h}</li>`).join('')}</ul></div>
    `;
  }

  document.getElementById('proj-infobox-title').textContent = project.title;
  document.getElementById('ib-stack').textContent = project.tags.join(' · ');

  const repoCell = document.getElementById('ib-repo');
  if (project.repo) {
    repoCell.innerHTML = `<a href="https://github.com/${project.repo}" target="_blank" rel="noopener">View on GitHub ↗</a>`;
  } else {
    repoCell.textContent = project.liveNote || 'Private / internal tool';
  }

  // Live GitHub badge slot — picked up by github-stats.js
  const statsCell = document.getElementById('ib-stats');
  if (project.repo) {
    statsCell.dataset.badgeSlug = slug;
    statsCell.textContent = 'Loading…';
  } else {
    statsCell.closest('tr').hidden = true;
  }
})();
