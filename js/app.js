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

  /* ── TOAST ──────────────────────────────────────── */
  function showToast(msg, type) {
    let t = document.getElementById('ac-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ac-toast';
      t.className = 'ac-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'ac-toast show' + (type === 'success' ? ' ac-toast-success' : '');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ── UPLOAD MODAL ────────────────────────────────── */
  let uploadModalEl = null;

  function openUploadModal() {
    if (!uploadModalEl) {
      uploadModalEl = document.createElement('div');
      uploadModalEl.className = 'upload-ov';
      uploadModalEl.id = 'uploadModal';
      uploadModalEl.innerHTML = `
        <div class="upload-panel">
          <button class="upload-close" title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div class="upload-hd">Submit Your Art</div>
          <div class="upload-drop" id="uploadDrop">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div class="upload-drop-title">Drag &amp; drop your artwork here</div>
            <div class="upload-drop-sub">JPG, PNG, GIF, WebP, PSD · up to 30MB</div>
            <label class="upload-browse-btn">Browse Files<input type="file" accept="image/*,.psd,.ai"></label>
          </div>
          <div class="upload-fields">
            <input class="upload-field" type="text" placeholder="Title *">
            <select class="upload-field">
              <option value="">Category</option>
              <option>Digital Art</option><option>Painting</option><option>Photography</option>
              <option>Illustration</option><option>3D Art</option><option>Concept Art</option>
            </select>
            <input class="upload-field" type="text" placeholder="Tags (comma separated)">
            <textarea class="upload-field upload-textarea" placeholder="Description (optional)"></textarea>
          </div>
          <div class="upload-footer">
            <button class="upload-cancel-btn">Cancel</button>
            <button class="upload-submit-btn">Submit Work</button>
          </div>
        </div>
      `;
      document.body.appendChild(uploadModalEl);

      uploadModalEl.querySelector('.upload-close').addEventListener('click', closeUploadModal);
      uploadModalEl.querySelector('.upload-cancel-btn').addEventListener('click', closeUploadModal);
      uploadModalEl.addEventListener('click', e => { if (e.target === uploadModalEl) closeUploadModal(); });

      uploadModalEl.querySelector('.upload-submit-btn').addEventListener('click', () => {
        closeUploadModal();
        showToast('Your work has been submitted for review!', 'success');
      });

      const drop = uploadModalEl.querySelector('#uploadDrop');
      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-over'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
      drop.addEventListener('drop', e => {
        e.preventDefault(); drop.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) showToast('File ready: ' + e.dataTransfer.files[0].name, 'success');
      });
      uploadModalEl.querySelector('input[type=file]').addEventListener('change', e => {
        if (e.target.files[0]) showToast('File ready: ' + e.target.files[0].name, 'success');
      });
    }
    uploadModalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeUploadModal() {
    uploadModalEl?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── NOTIFICATION PANEL ──────────────────────────── */
  const NOTIFS = [
    {msg: 'NightVision started following you', time: '2h ago', seed: 50},
    {msg: 'DragonScale liked your comment on "Nebula Born"', time: '5h ago', seed: 80},
    {msg: 'PrismStudio added your work to their collection', time: '1d ago', seed: 30},
    {msg: 'GhostBrush replied to your comment', time: '2d ago', seed: 60},
    {msg: 'CosmicInk started following you', time: '3d ago', seed: 100},
  ];

  let notifPanelEl = null;

  function toggleNotifPanel(btn) {
    if (!notifPanelEl) {
      notifPanelEl = document.createElement('div');
      notifPanelEl.className = 'notif-panel';
      notifPanelEl.innerHTML = `
        <div class="notif-panel-hd">
          <span>Notifications</span>
          <button class="notif-mark-all">Mark all read</button>
        </div>
        <div class="notif-list">
          ${NOTIFS.map(n => `
            <div class="notif-item">
              <canvas class="notif-av" width="32" height="32" data-seed="${n.seed}"></canvas>
              <div class="notif-body">
                <div class="notif-msg">${n.msg}</div>
                <div class="notif-time">${n.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="notif-ft"><a href="#">See all notifications</a></div>
      `;
      document.body.appendChild(notifPanelEl);

      notifPanelEl.querySelectorAll('.notif-av').forEach(cv => {
        drawOn(cv, window.drawWatcher, +cv.dataset.seed);
      });
      notifPanelEl.querySelector('.notif-mark-all').addEventListener('click', () => {
        notifPanelEl.querySelectorAll('.notif-item').forEach(n => n.classList.add('read'));
      });
      document.addEventListener('click', e => {
        if (notifPanelEl.classList.contains('open') &&
            !notifPanelEl.contains(e.target) && !btn.contains(e.target)) {
          notifPanelEl.classList.remove('open');
        }
      });
    }
    const r = btn.getBoundingClientRect();
    notifPanelEl.style.top  = (r.bottom + 8) + 'px';
    notifPanelEl.style.right = (window.innerWidth - r.right) + 'px';
    notifPanelEl.classList.toggle('open');
  }

  /* ── ACCOUNT DROPDOWN ────────────────────────────── */
  let accountMenuEl = null;

  function toggleAccountMenu(avEl) {
    if (!accountMenuEl) {
      const user = window.AC_AUTH?.getUser() || {};
      const userName = user.name || 'Artist';
      const userEmail = user.isDemo ? 'Demo account' : (user.email || '');

      accountMenuEl = document.createElement('div');
      accountMenuEl.className = 'account-menu';
      accountMenuEl.innerHTML = `
        <div class="account-menu-profile">
          <div class="account-menu-av-wrap">
            ${user.picture
              ? `<img src="${user.picture}" width="36" height="36" style="border-radius:50%;object-fit:cover;width:36px;height:36px">`
              : `<canvas class="account-menu-av" width="36" height="36"></canvas>`}
          </div>
          <div>
            <div class="account-menu-name">${userName}</div>
            <div class="account-menu-sub">${userEmail}</div>
          </div>
        </div>
        <div class="account-menu-div"></div>
        <a class="account-menu-item" href="index.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          My Profile
        </a>
        <a class="account-menu-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Messages
        </a>
        <a class="account-menu-item" href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </a>
        <div class="account-menu-div"></div>
        <button class="account-menu-item account-signout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      `;
      document.body.appendChild(accountMenuEl);

      const avCv = accountMenuEl.querySelector('.account-menu-av');
      if (avCv) drawOn(avCv, window.drawAvatar);

      accountMenuEl.querySelector('.account-signout').addEventListener('click', () => {
        accountMenuEl.classList.remove('open');
        window.AC_AUTH?.signOut();
      });
      document.addEventListener('click', e => {
        if (accountMenuEl.classList.contains('open') &&
            !accountMenuEl.contains(e.target) && !avEl.contains(e.target)) {
          accountMenuEl.classList.remove('open');
        }
      });
    }
    const r = avEl.getBoundingClientRect();
    accountMenuEl.style.top  = (r.bottom + 8) + 'px';
    accountMenuEl.style.right = (window.innerWidth - r.right) + 'px';
    accountMenuEl.classList.toggle('open');
  }

  /* ── NAV ACTIVE STATE ─────────────────────────────── */
  function initNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-page-link').forEach(a => {
      a.classList.toggle('active', a.dataset.page === page);
    });
  }

  /* ── GLOBAL BUTTON WIRING ─────────────────────────── */
  function initGlobalButtons() {
    document.addEventListener('click', e => {
      /* Upload / submit */
      if (e.target.closest('.btn-submit, .empty-banner-cta, [data-action="upload"]')) {
        e.preventDefault();
        openUploadModal();
        return;
      }
      /* Shop */
      if (e.target.closest('.nav-shop')) {
        showToast('Shop coming soon!');
        return;
      }
      /* Messages */
      if (e.target.closest('.nav-icon-btn[title="Messages"]')) {
        showToast('Messages coming soon!');
        return;
      }
      /* Notifications bell */
      const bell = e.target.closest('.nav-icon-btn[title="Notifications"]');
      if (bell) { toggleNotifPanel(bell); return; }
      /* Nav avatar */
      const navAv = e.target.closest('.nav-av');
      if (navAv) { toggleAccountMenu(navAv); return; }
    });
  }

  /* ── FOLLOW TOGGLE ────────────────────────────────── */
  function initFollowButtons() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-follow-toggle, .btn-watch-hero, .wm-follow-btn');
      if (!btn) return;
      const following = btn.dataset.following === 'true';
      btn.dataset.following = String(!following);
      if (!following) {
        btn.textContent = 'Following';
        btn.classList.add('following');
      } else {
        btn.textContent = '+ Follow';
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
      btn.dataset.liked = String(!liked);
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
              <button class="wm-follow-btn btn-follow-toggle" data-following="false">+ Follow</button>
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

    el.addEventListener('click', e => { if (e.target === el) closeModal(); });
    el.querySelector('.wm-close').addEventListener('click', closeModal);
    el.querySelector('.wm-prev').addEventListener('click', () => navigateModal(-1));
    el.querySelector('.wm-next').addEventListener('click', () => navigateModal(1));

    /* Save toggle */
    el.querySelector('.wm-save-btn').addEventListener('click', function () {
      const saved = this.dataset.saved === 'true';
      this.dataset.saved = String(!saved);
      this.classList.toggle('saved', !saved);
      this.querySelector('svg').setAttribute('fill', !saved ? 'currentColor' : 'none');
      showToast(!saved ? 'Saved to your collection!' : 'Removed from collection', !saved ? 'success' : '');
    });

    /* Share */
    el.querySelector('.wm-share-btn').addEventListener('click', () => {
      const url = location.origin + location.pathname + '?work=' + (currentWorkId || '');
      try {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Share: artcanvas.io/work/' + (currentWorkId || ''), 'success');
        });
      } catch (e) {
        showToast('Share: artcanvas.io/work/' + (currentWorkId || ''), 'success');
      }
    });

    /* Keyboard nav */
    document.addEventListener('keydown', e => {
      if (!modalEl || !modalEl.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft')  navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    });

    /* Comments */
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
    const me = window.AC_AUTH?.getUser();
    list.appendChild(makeCommentEl({user: me?.name || 'Artist', text, hue: 10}, true));
    list.scrollTop = list.scrollHeight;
    modalEl.querySelectorAll('.wm-comment-count, .wm-comment-count-hd').forEach(el => {
      el.textContent = (parseInt(el.textContent, 10) || 0) + 1;
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
    populateModal(workQueue[(idx + dir + workQueue.length) % workQueue.length]);
  }

  function populateModal(workId) {
    const work = getWork(workId);
    if (!work) return;
    currentWorkId = work.id;

    const artist   = getArtist(work.artistId);
    const fn       = window.DRAW_FNS[work.style] || window.DRAW_FNS.space;
    const comments = (window.AC_COMMENTS && window.AC_COMMENTS[work.id]) || [];

    /* Art canvas */
    drawOn(modalEl.querySelector('.wm-canvas'), fn);

    /* Artist */
    drawOn(modalEl.querySelector('.wm-artist-av'), window.drawWatcher, artist.seed);
    modalEl.querySelector('.wm-artist-name').innerHTML =
      `<a href="index.html" class="wm-artist-link">${artist.name}</a>`;
    modalEl.querySelector('.wm-artist-tag').textContent = artist.tagline;

    /* Meta */
    modalEl.querySelector('.wm-title').textContent        = work.title;
    modalEl.querySelector('.wm-views').textContent        = work.views;
    modalEl.querySelector('.wm-like-count').textContent   = work.likes.toLocaleString();
    const cc = comments.length;
    modalEl.querySelectorAll('.wm-comment-count').forEach(e => e.textContent = cc);
    modalEl.querySelector('.wm-comment-count-hd').textContent = cc;
    modalEl.querySelector('.wm-desc').textContent         = work.desc;

    /* Like/save/follow reset */
    const likeBtn = modalEl.querySelector('.wm-like-btn');
    likeBtn.dataset.liked = 'false';
    likeBtn.classList.remove('liked');
    likeBtn.querySelector('.like-count').textContent = work.likes.toLocaleString();

    const followBtn = modalEl.querySelector('.wm-follow-btn');
    followBtn.dataset.following = 'false';
    followBtn.classList.remove('following');
    followBtn.textContent = '+ Follow';

    const saveBtn = modalEl.querySelector('.wm-save-btn');
    saveBtn.dataset.saved = 'false';
    saveBtn.classList.remove('saved');
    saveBtn.querySelector('svg').setAttribute('fill', 'none');

    /* Tags → browse.html */
    modalEl.querySelector('.wm-tags').innerHTML =
      work.tags.map(t => `<a class="wm-tag" href="browse.html">#${t}</a>`).join('');

    /* Comments */
    const list = modalEl.querySelector('.wm-comments-list');
    list.innerHTML = '';
    comments.forEach(c => list.appendChild(makeCommentEl(c, false)));
    drawOn(modalEl.querySelector('.wm-comment-av'), window.drawAvatar);

    /* Related works */
    const related = modalEl.querySelector('.wm-related-row');
    related.innerHTML = '';
    window.AC_WORKS
      .filter(w => w.artistId === work.artistId && w.id !== work.id)
      .slice(0, 5)
      .forEach(w => {
        const card = document.createElement('div');
        card.className = 'wm-related-card';
        card.title = w.title;
        const cv = document.createElement('canvas');
        cv.width = 120; cv.height = 160;
        drawOn(cv, window.DRAW_FNS[w.style] || window.DRAW_FNS.space);
        card.appendChild(cv);
        card.addEventListener('click', () => populateModal(w.id));
        related.appendChild(card);
      });

    /* Nav arrows */
    const show = workQueue.length > 1 ? '1' : '0';
    modalEl.querySelector('.wm-prev').style.opacity = show;
    modalEl.querySelector('.wm-next').style.opacity = show;
  }

  /* ── ART CARD FACTORY ────────────────────────────── */
  function cardDims(work) {
    if (work.id % 7 === 0) return [400, 280];
    if (work.id % 5 === 0) return [300, 300];
    return [300, 400];
  }

  function makeArtCard(work) {
    const card = document.createElement('div');
    card.className = 'art-card';
    card.dataset.workId = work.id;

    const artist = getArtist(work.artistId);
    const fn = window.DRAW_FNS[work.style] || window.DRAW_FNS.space;
    const [cw, ch] = cardDims(work);

    const cv = document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    drawOn(cv, fn);
    card.appendChild(cv);

    const ov = document.createElement('div');
    ov.className = 'art-card-ov';

    const top = document.createElement('div');
    top.className = 'art-card-ov-top';
    const likeBtn = document.createElement('button');
    likeBtn.className = 'art-like-btn';
    likeBtn.dataset.liked = 'false';
    likeBtn.title = 'Like';
    likeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    top.appendChild(likeBtn);
    ov.appendChild(top);

    const btm = document.createElement('div');
    btm.className = 'art-card-ov-btm';

    const title = document.createElement('div');
    title.className = 'art-card-title';
    title.textContent = work.title;

    const authorRow = document.createElement('div');
    authorRow.className = 'art-card-author';

    const avCv = document.createElement('canvas');
    avCv.width = 18; avCv.height = 18;
    avCv.className = 'art-card-av';
    drawOn(avCv, window.drawWatcher, artist.seed);

    const nameEl = document.createElement('a');
    nameEl.className = 'art-card-author-name';
    nameEl.textContent = artist.name;
    nameEl.href = 'index.html';

    const statEl = document.createElement('span');
    statEl.className = 'art-card-stat';
    statEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ${work.likes.toLocaleString()}`;

    authorRow.appendChild(avCv);
    authorRow.appendChild(nameEl);
    authorRow.appendChild(statEl);

    btm.appendChild(title);
    btm.appendChild(authorRow);
    ov.appendChild(btm);
    card.appendChild(ov);

    card.addEventListener('click', e => {
      if (e.target.closest('.art-like-btn') || e.target.closest('.art-card-author-name')) return;
      window.AC.openWork(work.id);
    });

    return card;
  }

  /* ── PUBLIC API ─────────────────────────────────── */
  window.AC = {
    openWork(workId, queue) { openModal(workId, queue); },
    makeArtCard,
    drawOn,
    getArtist,
    getWork,
    showToast,
    openUploadModal,
  };

  /* ── INIT ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initFollowButtons();
    initLikeButtons();
    initGlobalButtons();
  });
})();
