'use strict';

/* ═══════════════════════════════════════════════════
   GITHUB STATS — live profile stats + per-repo badges
   Cached in localStorage to stay well under GitHub's
   unauthenticated rate limit (60 req/hr per IP).
═══════════════════════════════════════════════════ */

const GH_USER     = 'Joooban';
const GH_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function ghFetchCached(url) {
  const cacheKey = 'gh_cache_' + url;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (cached && Date.now() - cached.t < GH_CACHE_TTL) return cached.v;
  } catch { /* ignore corrupt cache */ }

  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error('GitHub API ' + res.status);
  const data = await res.json();

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), v: data }));
  } catch { /* storage full or unavailable — non-fatal */ }

  return data;
}

function ghRelativeDate(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days   = Math.floor(diffMs / 86400000);
  if (days < 1)   return 'today';
  if (days < 30)  return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}


/* ─────────────────────────────────────────────
   PROFILE-LEVEL STATS (sidebar box)
───────────────────────────────────────────── */
async function initGithubProfileStats() {
  const repoEl   = document.getElementById('gh-repos');
  const followEl = document.getElementById('gh-followers');
  const starEl   = document.getElementById('gh-stars');
  const sinceEl  = document.getElementById('gh-since');

  if (!repoEl && !followEl && !starEl && !sinceEl) return;

  try {
    const user = await ghFetchCached(`https://api.github.com/users/${GH_USER}`);

    if (repoEl)   repoEl.textContent   = user.public_repos;
    if (followEl) followEl.textContent = user.followers;
    if (sinceEl)  sinceEl.textContent  = new Date(user.created_at).getFullYear();

    if (starEl) {
      const repos = await ghFetchCached(`https://api.github.com/users/${GH_USER}/repos?per_page=100`);
      const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      starEl.textContent = totalStars;
    }
  } catch (err) {
    console.warn('[github-stats] profile fetch failed:', err.message);
    [repoEl, followEl, starEl, sinceEl].forEach(el => { if (el) el.textContent = '—'; });
  }
}


/* ─────────────────────────────────────────────
   PER-REPO BADGES (project cards + detail page)
───────────────────────────────────────────── */
async function initGithubRepoBadges() {
  const badges = document.querySelectorAll('[data-badge-slug]');

  await Promise.all(Array.from(badges).map(async el => {
    const slug = el.dataset.badgeSlug;
    const project = window.PROJECTS && window.PROJECTS[slug];
    if (!project || !project.repo) return;

    try {
      const repo = await ghFetchCached(`https://api.github.com/repos/${project.repo}`);
      el.textContent = `★ ${repo.stargazers_count} · Updated ${ghRelativeDate(repo.pushed_at)}`;
    } catch (err) {
      console.warn(`[github-stats] repo fetch failed for ${project.repo}:`, err.message);
      el.textContent = '—';
    }
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  initGithubProfileStats();
  initGithubRepoBadges();
});
