/* ── SHARED APP FUNCTIONALITY ─────────────────────────── */

(function () {
  /* ── HELPERS ────────────────────────────────────── */
  function drawOn(canvas, fn, ...extra) {
    const ctx = canvas.getContext('2d');
    fn(ctx, canvas.width, canvas.height, ...extra);
  }

  function getArtist(id) {
    return window.AC_ARTISTS.find(a => a.id === id) || window.AC_ARTISTS[0];
  }
  function getWork(id) {
    return window.AC_WORKS.find(w => w.id === +id);
  }

  /* ── NAV ACTIVE STATE ─────────────────────────────── */
  function initNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-page-link').forEach(a => {
      if (a.dataset.page === page) a.classList.add('active');
    });
  }

  /* ── FOLLOW TOGGLE ────────────────────────────────── */
  function initFollowButtons() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-follow-toggle, .btn-watch-hero, .wm-follow-btn');
      if (!btn) return;
      const following = btn.dataset.following === 'true';
      btn.dataset.following = !following;
      if (!following) {
        btn.textContent = 'Following';
        btn.classList.add('following');
      } else {
        btn.textContent = btn.classList.contains('wm-follow-btn') ? '+ Follow' : '+ Follow';
        btn.classList.remove('following');
      }
    });
  }

  /* ── LIKE TOGGLE ──────────────────────────────────── */
  function initLikeButtons() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.art-like-btn, .wm-like-btn');
      if (!btn) return;
      e.stopPropagation();
      const liked = btn.dataset.liked === 'true';
      btn.dataset.liked = !liked;
      btn.classList.toggle('liked', !liked);
      const countEl = btn.querySelector('.like-count');
      if (countEl) {
        const n = parseInt(countEl.textContent.replace(/,/g, ''), 10);
        countEl.textContent = (!liked ? n + 1 : n - 1).toLocaleString();
      }
    });
  }

  /* ── WORK DETAIL MODAL ────────────────────────────── */
  let modalEl = null;
  let currentWorkId = null;
  let workQueue = [];

  function buildModal() {
    const el = document.createElement('div');
    el.className = 'wm-overlay';
    el.id = 'workModal';
    el.innerHTML = `
      <div class="wm-panel" role="dialog" aria-modal="true">
        <button class="wm-close" title="Close (Esc)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <button class="wm-nav-btn wm-prev" title="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="wm-nav-btn wm-next" title="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div class="wm-body">
          <div class="wm-art-col">
            <canvas class="wm-canvas" width="600" height="800"></canvas>
          </div>

          <div class="wm-info-col">
            <div class="wm-artist-row">
              <canvas class="wm-artist-av" width="40" height="40"></canvas>
              <div class="wm-artist-meta">
                <div class="wm-artist-name"></div>
                <div class="wm-artist-tag"></div>
              </div>
              <button class="wm-follow-btn" data-following="false">+ Follow</button>
            </div>

            <div class="wm-title"></div>

            <div class="wm-stats-row">
              <span class="wm-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <span class="wm-views"></span>
              </span>
              <span class="wm-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span class="wm-like-count"></span>
              </span>
              <span class="wm-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span class="wm-comment-count"></span>
              </span>
            </div>

            <div class="wm-actions">
              <button class="wm-like-btn" data-liked="false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Like <span class="like-count">0</span>
              </button>
              <button class="wm-save-btn" data-saved="false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                Save
              </button>
              <button class="wm-share-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            </div>

            <div class="wm-tags"></div>
            <p class="wm-desc"></p>

            <div class="wm-comments-section">
              <div class="wm-comments-hd">
                Comments <span class="wm-comment-count-hd"></span>
              </div>
              <div class="wm-comments-list"></div>
              <div class="wm-comment-box">
                <canvas class="wm-comment-av" width="32" height="32"></canvas>
                <input type="text" class="wm-comment-input" placeholder="Add a comment…">
                <button class="wm-comment-send">Post</button>
              </div>
            </div>

            <div class="wm-related-section">
              <div class="wm-related-hd">More from this artist</div>
              <div class="wm-related-row"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    /* Close on overlay click */
    el.addEventListener('click', e => {
      if (e.target === el) closeModal();
    });
    el.querySelector('.wm-close').addEventListener('click', closeModal);
    el.querySelector('.wm-prev').addEventListener('click', () => navigateModal(-1));
    el.querySelector('.wm-next').addEventListener('click', () => navigateModal(1));

    /* Save toggle */
    el.querySelector('.wm-save-btn').addEventListener('click', function() {
      const saved = this.dataset.saved === 'true';
      this.dataset.saved = !saved;
      this.classList.toggle('saved', !saved);
      this.querySelector('svg').setAttribute('fill', !saved ? 'currentColor' : 'none');
    });

    /* Keyboard */
    document.addEventListener('keydown', e => {
      if (!modalEl || !modalEl.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    });

    /* Comment send */
    el.querySelector('.wm-comment-send').addEventListener('click', postComment);
    el.querySelector('.wm-comment-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') postComment();
    });

    return el;
  }

  function postComment() {
    const input = modalEl.querySelector('.wm-comment-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const list = modalEl.querySelector('.wm-comments-list');
    const c = makeCommentEl({user:'NebulaForge', text, hue:10}, true);
    list.appendChild(c);
    list.scrollTop = list.scrollHeight;
    const counts = modalEl.querySelectorAll('.wm-comment-count, .wm-comment-count-hd');
    counts.forEach(el => {
      const n = parseInt(el.textContent, 10) || 0;
      el.textContent = n + 1;
    });
  }

  function makeCommentEl(c, isNew) {
    const el = document.createElement('div');
    el.className = 'wm-comment' + (isNew ? ' wm-comment-new' : '');
    const cv = document.createElement('canvas');
    cv.width = 28; cv.height = 28;
    cv.className = 'wm-comment-user-av';
    const artist = window.AC_ARTISTS.find(a => a.name === c.user);
    drawOn(cv, window.drawWatcher, artist ? artist.seed : c.hue || 0);
    const body = document.createElement('div');
    body.className = 'wm-comment-body';
    body.innerHTML = `<span class="wm-comment-user">${c.user}</span><span class="wm-comment-text"> ${c.text}</span>`;
    el.appendChild(cv);
    el.appendChild(body);
    return el;
  }

  function openModal(workId, queue) {
    if (!modalEl) modalEl = buildModal();
    workQueue = queue || window.AC_WORKS.map(w => w.id);
    populateModal(workId);
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigateModal(dir) {
    const idx = workQueue.indexOf(currentWorkId);
    if (idx === -1) return;
    const nextIdx = (idx + dir + workQueue.length) % workQueue.length;
    populateModal(workQueue[nextIdx]);
  }

  function populateModal(workId) {
    const work = getWork(workId);
    if (!work) return;
    currentWorkId = work.id;

    const artist = getArtist(work.artistId);
    const fn = window.DRAW_FNS[work.style] || window.DRAW_FNS.space;
    const comments = (window.AC_COMMENTS && window.AC_COMMENTS[work.id]) || [];

    /* Art */
    const canvas = modalEl.querySelector('.wm-canvas');
    drawOn(canvas, fn);

    /* Artist */
    const avCanvas = modalEl.querySelector('.wm-artist-av');
    drawOn(avCanvas, window.drawWatcher, artist.seed);
    modalEl.querySelector('.wm-artist-name').textContent = artist.name;
    modalEl.querySelector('.wm-artist-tag').textContent = artist.tagline;

    /* Info */
    modalEl.querySelector('.wm-title').textContent = work.title;
    modalEl.querySelector('.wm-views').textContent = work.views;
    modalEl.querySelector('.wm-like-count').textContent = work.likes.toLocaleString();
    const commentCount = comments.length;
    modalEl.querySelectorAll('.wm-comment-count').forEach(el => el.textContent = commentCount);
    modalEl.querySelector('.wm-comment-count-hd').textContent = commentCount;
    modalEl.querySelector('.wm-desc').textContent = work.desc;

    /* Like btn count */
    const likeBtn = modalEl.querySelector('.wm-like-btn');
    likeBtn.dataset.liked = 'false';
    likeBtn.classList.remove('liked');
    likeBtn.querySelector('.like-count').textContent = work.likes.toLocaleString();

    /* Follow btn */
    const followBtn = modalEl.querySelector('.wm-follow-btn');
    followBtn.dataset.following = 'false';
    followBtn.classList.remove('following');
    followBtn.textContent = '+ Follow';

    /* Save btn */
    const saveBtn = modalEl.querySelector('.wm-save-btn');
    saveBtn.dataset.saved = 'false';
    saveBtn.classList.remove('saved');
    saveBtn.querySelector('svg').setAttribute('fill', 'none');

    /* Tags */
    const tagsEl = modalEl.querySelector('.wm-tags');
    tagsEl.innerHTML = work.tags.map(t => `<a class="wm-tag" href="#">#${t}</a>`).join('');

    /* Comments */
    const list = modalEl.querySelector('.wm-comments-list');
    list.innerHTML = '';
    comments.forEach(c => list.appendChild(makeCommentEl(c, false)));

    /* My avatar in comment box */
    const myAv = modalEl.querySelector('.wm-comment-av');
    drawOn(myAv, window.drawAvatar);

    /* Related works */
    const related = modalEl.querySelector('.wm-related-row');
    related.innerHTML = '';
    window.AC_WORKS
      .filter(w => w.artistId === work.artistId && w.id !== work.id)
      .slice(0, 4)
      .forEach(w => {
        const card = document.createElement('div');
        card.className = 'wm-related-card';
        const cv = document.createElement('canvas');
        cv.width = 120; cv.height = 160;
        const relFn = window.DRAW_FNS[w.style] || window.DRAW_FNS.space;
        drawOn(cv, relFn);
        card.appendChild(cv);
        card.addEventListener('click', () => populateModal(w.id));
        related.appendChild(card);
      });

    /* Nav arrows visibility */
    const idx = workQueue.indexOf(work.id);
    modalEl.querySelector('.wm-prev').style.opacity = workQueue.length > 1 ? '1' : '0';
    modalEl.querySelector('.wm-next').style.opacity = workQueue.length > 1 ? '1' : '0';
    void idx;
  }

  /* ── ART CARD FACTORY (shared) ──────────────────── */
  function makeArtCard(work) {
    const card = document.createElement('div');
    card.className = 'art-card';
    card.dataset.workId = work.id;

    const fn = window.DRAW_FNS[work.style] || window.DRAW_FNS.space;

    card.innerHTML = `
      <div class="art-thumb">
        <canvas width="300" height="400"></canvas>
        <div class="art-ov">
          <div class="art-ov-title">${work.title}</div>
          <div class="art-ov-stats">
            <span class="art-ov-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ${work.views}
            </span>
            <span class="art-ov-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              ${work.likes.toLocaleString()}
            </span>
          </div>
        </div>
        <button class="art-like-btn" data-liked="false" title="Like">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="like-count">${work.likes.toLocaleString()}</span>
        </button>
      </div>
      <div class="art-foot">
        <div class="art-title">${work.title}</div>
        <div class="art-artist">${getArtist(work.artistId).name}</div>
      </div>
    `;

    drawOn(card.querySelector('canvas'), fn);

    card.addEventListener('click', e => {
      if (e.target.closest('.art-like-btn')) return;
      window.AC.openWork(work.id);
    });

    return card;
  }

  /* ── PUBLIC API ─────────────────────────────────── */
  window.AC = {
    openWork(workId, queue) {
      openModal(workId, queue);
    },
    makeArtCard,
    drawOn,
    getArtist,
    getWork,
  };

  /* ── INIT ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initFollowButtons();
    initLikeButtons();
  });
})();
