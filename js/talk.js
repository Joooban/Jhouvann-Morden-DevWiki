'use strict';

/* ═══════════════════════════════════════════════════
   1. SUPABASE INIT — must be first
═══════════════════════════════════════════════════ */
const SUPABASE_URL      = 'https://vwodfbgdcertwswhmxff.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3b2RmYmdkY2VydHdzd2hteGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjY0MzEsImV4cCI6MjA4OTQwMjQzMX0.jfmPn4rGJH-nJCEz2HoI7mEd4oVvTqqALFFkucEkCxA';

const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Named supabaseClient to avoid clashing with window.supabase (the CDN global)
let supabaseClient = null;
if (SUPABASE_CONFIGURED) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}


/* ═══════════════════════════════════════════════════
   2. ADMIN AUTH — after supabaseClient is ready
═══════════════════════════════════════════════════ */
let isAdmin = false;

async function loginAdmin() {
  const email    = prompt('Email:');
  const password = prompt('Password:');
  if (!email || !password) return;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) { alert('Login failed: ' + error.message); return; }
  isAdmin = true;
  renderThreads();
}

async function logoutAdmin() {
  await supabaseClient.auth.signOut();
  isAdmin = false;
  renderThreads();
}

window.loginAdmin  = loginAdmin;
window.logoutAdmin = logoutAdmin;

// Check if already logged in from a previous session
if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) { isAdmin = true; renderThreads(); }
  });
}


/* ═══════════════════════════════════════════════════
   3. DOM REFERENCES
═══════════════════════════════════════════════════ */
const threadList = document.getElementById('thread-list');
const emptyState = document.getElementById('talk-empty');
const talkCount  = document.getElementById('talk-count');
const ntfBody    = document.getElementById('ntf-body');
const ntfTog     = document.getElementById('ntf-tog');
const ntfTitle   = document.getElementById('ntf-title');
const ntfUser    = document.getElementById('ntf-user');
const ntfComment = document.getElementById('ntf-comment');
const postMsg    = document.getElementById('post-msg');
const btnPost    = document.getElementById('btn-post-thread');
const btnCancel  = document.getElementById('btn-cancel-thread');


/* ═══════════════════════════════════════════════════
   4. TOGGLE NEW THREAD FORM
═══════════════════════════════════════════════════ */
function toggleForm(forceClose = false) {
  const isOpen = ntfBody.classList.contains('open');
  if (forceClose || isOpen) {
    ntfBody.classList.remove('open');
    ntfTog.textContent = '[ open ]';
    clearFormMsg();
  } else {
    ntfBody.classList.add('open');
    ntfTog.textContent = '[ close ]';
  }
}

ntfTog.addEventListener('click', () => toggleForm());
btnCancel?.addEventListener('click', () => { resetForm(); toggleForm(true); });

function resetForm() {
  if (ntfTitle)   ntfTitle.value   = '';
  if (ntfUser)    ntfUser.value    = '';
  if (ntfComment) ntfComment.value = '';
  clearFormMsg();
}

function setMsg(text, type = 'ok') {
  if (!postMsg) return;
  postMsg.textContent = text;
  postMsg.className   = `post-msg msg-${type}`;
}

function clearFormMsg() {
  if (!postMsg) return;
  postMsg.textContent = '';
  postMsg.className   = 'post-msg';
}


/* ═══════════════════════════════════════════════════
   5. DATA — FETCH
═══════════════════════════════════════════════════ */
async function fetchThreads() {
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from('threads')
      .select('*, replies(*)')
      .order('created_at', { ascending: false });
    if (error) { console.error('[talk.js] fetch error:', error.message); return []; }
    return (data || []).map(t => ({
      ...t,
      replies: (t.replies || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }));
  }
  try {
    return JSON.parse(localStorage.getItem('devwiki_threads') || '[]');
  } catch { return []; }
}


/* ═══════════════════════════════════════════════════
   6. DATA — POST THREAD
═══════════════════════════════════════════════════ */
async function postThread(title, author, comment) {
  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('threads')
      .insert([{ title, author, comment }]);
    if (error) { console.error('[talk.js] insert error:', error.message); return false; }
    return true;
  }
  try {
    const existing = JSON.parse(localStorage.getItem('devwiki_threads') || '[]');
    existing.unshift({ id: Date.now(), title, author, comment, created_at: new Date().toISOString(), replies: [] });
    localStorage.setItem('devwiki_threads', JSON.stringify(existing));
    return true;
  } catch { return false; }
}


/* ═══════════════════════════════════════════════════
   7. DATA — POST REPLY
═══════════════════════════════════════════════════ */
async function postReply(threadId, author, comment) {
  if (supabaseClient) {
    const { error } = await supabaseClient
      .from('replies')
      .insert([{ thread_id: threadId, author, comment }]);
    if (error) { console.error('[talk.js] reply insert error:', error.message); return false; }
    return true;
  }
  try {
    const existing = JSON.parse(localStorage.getItem('devwiki_threads') || '[]');
    const thread = existing.find(t => t.id === threadId);
    if (thread) {
      thread.replies = thread.replies || [];
      thread.replies.push({ id: Date.now(), author, comment, created_at: new Date().toISOString() });
    }
    localStorage.setItem('devwiki_threads', JSON.stringify(existing));
    return true;
  } catch { return false; }
}


/* ═══════════════════════════════════════════════════
   8. DATA — DELETE (admin only)
═══════════════════════════════════════════════════ */
window.deleteThread = async (id) => {
  if (!confirm('Delete this thread and all its replies?')) return;
  if (supabaseClient) {
    const { error } = await supabaseClient.from('threads').delete().eq('id', id);
    if (error) { console.error('[talk.js] delete thread error:', error.message); return; }
  }
  renderThreads();
};

window.deleteReply = async (id) => {
  if (!confirm('Delete this reply?')) return;
  if (supabaseClient) {
    const { error } = await supabaseClient.from('replies').delete().eq('id', id);
    if (error) { console.error('[talk.js] delete reply error:', error.message); return; }
  }
  renderThreads();
};


/* ═══════════════════════════════════════════════════
   9. UI — REPLY FORM TOGGLE
═══════════════════════════════════════════════════ */
window.toggleReplyForm = (threadId) => {
  const form = document.getElementById(`reply-form-${threadId}`);
  if (!form) return;
  form.classList.toggle('open', !form.classList.contains('open'));
};

window.submitReply = async (threadId) => {
  const authorEl  = document.getElementById(`reply-author-${threadId}`);
  const commentEl = document.getElementById(`reply-comment-${threadId}`);
  const msgEl     = document.getElementById(`reply-msg-${threadId}`);
  const btnEl     = document.getElementById(`reply-btn-${threadId}`);

  const author  = authorEl?.value.trim()  || '';
  const comment = commentEl?.value.trim() || '';

  if (!author || !comment) {
    if (msgEl) { msgEl.textContent = 'Fill in both fields.'; msgEl.className = 'post-msg msg-err'; }
    return;
  }

  if (btnEl) { btnEl.disabled = true; btnEl.textContent = 'Posting…'; }

  const ok = await postReply(threadId, author, comment);

  if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Post reply'; }

  if (ok) {
    if (authorEl)  authorEl.value  = '';
    if (commentEl) commentEl.value = '';
    if (msgEl) { msgEl.textContent = 'Reply posted.'; msgEl.className = 'post-msg msg-ok'; }
    setTimeout(() => renderThreads(), 400);
  } else {
    if (msgEl) { msgEl.textContent = 'Something went wrong.'; msgEl.className = 'post-msg msg-err'; }
  }
};


/* ═══════════════════════════════════════════════════
   10. HELPERS
═══════════════════════════════════════════════════ */
function formatDate(isoString) {
  const d = new Date(isoString);
  if (isNaN(d)) return isoString;
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) + ' UTC';
}


/* ═══════════════════════════════════════════════════
   11. UI — RENDER THREADS
═══════════════════════════════════════════════════ */
async function renderThreads() {
  const threads = await fetchThreads();

  if (talkCount) {
    talkCount.textContent = threads.length ? `(${threads.length})` : '';
  }

  if (!threads.length) {
    if (threadList) threadList.innerHTML = '';
    if (emptyState) emptyState.style.display = '';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  if (threadList) {
    threadList.innerHTML = threads.map(t => `
      <div class="thread">

        <div class="thread-hd">
          ${escapeHtml(t.title)}
          <span>
            <span class="thread-date">${formatDate(t.created_at)}</span>
            ${isAdmin ? `<button class="del-btn" onclick="window.deleteThread(${t.id})" title="Delete thread">✕</button>` : ''}
          </span>
        </div>

        <div class="comment">
          <span class="tu">${escapeHtml(t.author)}</span>
          <span class="ts">${formatDate(t.created_at)}</span><br>
          ${escapeHtml(t.comment)} —
          <span class="sig">${escapeHtml(t.author)} (talk)</span>
        </div>

        ${(t.replies || []).map(r => `
          <div class="comment r1">
            <span class="tu">${escapeHtml(r.author)}</span>
            <span class="ts">${formatDate(r.created_at)}</span>
            ${isAdmin ? `<button class="del-btn" onclick="window.deleteReply(${r.id})" title="Delete reply">✕</button>` : ''}
            <br>
            ${escapeHtml(r.comment)} —
            <span class="sig">${escapeHtml(r.author)} (talk)</span>
          </div>
        `).join('')}

        <div style="padding: 6px 13px; border-top: 0.5px solid var(--border);">
          <button class="hdr-btn" style="font-size:11px;" onclick="toggleReplyForm(${t.id})">↩ Reply</button>
        </div>

        <div class="reply-form" id="reply-form-${t.id}">
          <div class="ntf-row">
            <label>Your name or handle</label>
            <input type="text" id="reply-author-${t.id}" placeholder="e.g. WikiWatchdog">
          </div>
          <div class="ntf-row">
            <label>Reply</label>
            <textarea id="reply-comment-${t.id}" placeholder="Write your reply…"></textarea>
          </div>
          <div class="ntf-actions">
            <button class="btn-post" id="reply-btn-${t.id}" onclick="submitReply(${t.id})">Post reply</button>
            <button class="btn-cancel" onclick="toggleReplyForm(${t.id})">Cancel</button>
            <span class="post-msg" id="reply-msg-${t.id}"></span>
          </div>
        </div>

      </div>
    `).join('');
  }
}


/* ═══════════════════════════════════════════════════
   12. SUBMIT NEW THREAD
═══════════════════════════════════════════════════ */
btnPost?.addEventListener('click', async () => {
  const title   = ntfTitle?.value.trim()   || '';
  const author  = ntfUser?.value.trim()    || '';
  const comment = ntfComment?.value.trim() || '';

  if (!title || !author || !comment) { setMsg('Please fill in all fields.', 'err'); return; }

  btnPost.disabled    = true;
  btnPost.textContent = 'Posting…';

  const success = await postThread(title, author, comment);

  btnPost.disabled    = false;
  btnPost.textContent = 'Post thread';

  if (success) {
    setMsg('Thread posted.', 'ok');
    resetForm();
    setTimeout(() => { clearFormMsg(); toggleForm(true); }, 900);
    await renderThreads();
  } else {
    setMsg('Something went wrong. Please try again.', 'err');
  }
});


/* ═══════════════════════════════════════════════════
   13. REALTIME SUBSCRIPTION
═══════════════════════════════════════════════════ */
if (supabaseClient) {
  supabaseClient
    .channel('talk-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'threads' }, () => renderThreads())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, () => renderThreads())
    .subscribe();
}


/* ═══════════════════════════════════════════════════
   14. INIT
═══════════════════════════════════════════════════ */
renderThreads();

// Secret admin trigger — triple click the talk notice
document.querySelector('.talk-notice')?.addEventListener('click', e => {
  if (e.detail === 3) {
    if (isAdmin) logoutAdmin();
    else loginAdmin();
  }
});
