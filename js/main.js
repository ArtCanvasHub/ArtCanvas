/* ── PROFILE PAGE ──────────────────────────────────────── */

const JOURNAL_ENTRIES = [
  {
    title: 'Six months on ArtCanvas — what I learned',
    excerpt: 'When I first joined this platform I had no idea what to expect. Six months later and I\'ve grown more as an artist than in the previous two years combined. The feedback here is honest, specific, and kind in a way that\'s genuinely rare on the internet...',
    date: 'Sep 28, 2026',
    comments: 24,
    likes: 87,
  },
  {
    title: 'My workflow for the Nebula series',
    excerpt: 'A lot of people have asked me how I approach the deep-space pieces. The short answer is: slowly. I usually spend the first session just laying down color temperature blocks — deciding where the cold light comes from and where the warm cores sit...',
    date: 'Aug 14, 2026',
    comments: 31,
    likes: 142,
  },
  {
    title: 'Commissions are OPEN — full details inside',
    excerpt: 'After a three-month wait list, I\'m opening up 5 commission slots this month. Taking concept art, character design, and environment pieces. Starting price is $80 for a sketch with one revision round...',
    date: 'Jul 5, 2026',
    comments: 58,
    likes: 213,
  },
];
const GROUPS = [
  {name:'DigitalArtists', members:'142K members', hue:140},
  {name:'FantasyArt',     members:'89K members',  hue:270},
  {name:'SciFiArtists',   members:'67K members',  hue:200},
];

const FOLLOWERS = [0,30,60,140,200,270,330,15,90,180].map(hue => ({hue}));

function drawOn(canvas, fn, ...extra) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  fn(ctx, canvas.width, canvas.height, ...extra);
}

/* ── TAB SWITCHING ────────────────────────────────────── */
document.querySelectorAll('.tbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tbtn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

/* ── FILTER BUTTONS ───────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.grid-filter').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── HERO STAT LINKS ──────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.hs-link[data-stat]');
  if (!btn) return;
  const stat = btn.dataset.stat;
  if (stat === 'watchers') {
    document.getElementById('followersGrid')?.scrollIntoView({behavior: 'smooth', block: 'center'});
  } else if (stat === 'deviations') {
    document.querySelector('[data-tab="gallery"]')?.click();
    window.scrollTo({top: 0, behavior: 'smooth'});
  } else if (stat === 'favourites') {
    document.querySelector('[data-tab="favourites"]')?.click();
    window.scrollTo({top: 0, behavior: 'smooth'});
  } else if (stat === 'following') {
    window.AC?.showToast('Following feed coming soon!');
  }
});

/* ── JOURNAL + WRITE ENTRY ────────────────────────────── */
document.addEventListener('click', e => {
  if (e.target.closest('.empty-cta[href]')) return;
  const btn = e.target.closest('button.empty-cta:not([data-action])');
  if (btn && btn.textContent.includes('Entry')) {
    window.AC?.showToast('Journal editor coming soon!');
  }
});

/* ── SPOTLIGHT PIN ────────────────────────────────────── */
document.addEventListener('click', e => {
  if (e.target.closest('.spotlight-pin-btn')) {
    window.AC?.showToast('Pin feature coming soon — upload a work first!');
  }
});

/* ── TAB ACTION BUTTONS ───────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.tab-act-btn');
  if (!btn) return;
  const title = btn.getAttribute('title') || '';
  if (title.includes('More')) {
    window.AC?.showToast('More options coming soon!');
  } else if (title.includes('message')) {
    window.AC?.showToast('Messages coming soon!');
  }
});

/* ── PORTFOLIO SORT ───────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.sort-btn');
  if (!btn) return;
  window.AC?.showToast('Sorting available once you upload works.');
});

/* ── NEW COLLECTION ───────────────────────────────────── */
document.addEventListener('click', e => {
  if (e.target.closest('.collection-add-btn')) {
    window.AC?.showToast('Create collections after uploading your first work!');
  }
});

/* ── NAV SEARCH (index.html) ──────────────────────────── */
document.querySelector('.srch input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    location.href = 'browse.html?q=' + encodeURIComponent(e.target.value.trim());
  }
});

/* ── SET AVATAR (img or canvas) ───────────────────────── */
function setAvatar(el, user, size) {
  if (!el) return;
  if (user.picture) {
    const img = document.createElement('img');
    img.src = user.picture;
    img.width = size; img.height = size;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit';
    img.onerror = () => drawOn(el.tagName === 'CANVAS' ? el : el.querySelector('canvas'), window.drawAvatar);
    if (el.tagName === 'CANVAS') {
      el.parentNode.replaceChild(img, el);
    } else {
      el.innerHTML = '';
      el.appendChild(img);
    }
  } else {
    const cv = el.tagName === 'CANVAS' ? el : el.querySelector('canvas');
    if (cv) drawOn(cv, window.drawAvatar);
  }
}

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Auth check — redirects to login.html if not signed in */
  const user = window.AC_AUTH?.requireAuth();
  if (!user) return;

  /* ── Hero banner ──────────────────────────────── */
  drawOn(document.getElementById('bannerC'), window.drawBanner);

  /* ── Populate profile from Google user data ─── */
  const heroName    = document.getElementById('heroName');
  const heroHandle  = document.getElementById('heroHandle');
  const heroTag     = document.getElementById('heroTag');
  const heroMember  = document.getElementById('heroMember');
  const aboutHd     = document.getElementById('aboutCardHd');
  const aboutBio    = document.getElementById('aboutBio');
  const aboutFullBio = document.getElementById('aboutFullBio');
  const aboutJoin         = document.getElementById('aboutJoinDate');
  const aboutCardDuration = document.getElementById('aboutCardDuration');
  const aboutCardLocation = document.getElementById('aboutCardLocation');
  const aboutDetailJoin   = document.getElementById('aboutDetailJoin');
  const aboutDetailEmail  = document.getElementById('aboutDetailEmail');
  const aboutQfJoinDate   = document.getElementById('aboutQfJoinDate');
  const aboutQfLocation   = document.getElementById('aboutQfLocation');
  const aboutQfDuration   = document.getElementById('aboutQfDuration');
  const aboutPronouns     = document.getElementById('aboutPronouns');

  const firstName  = user.given_name || user.name.split(' ')[0];
  const now        = new Date();
  const joinDate   = now.toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'});
  const joinShort  = now.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
  /* Compute duration — demo account is "new", real Google users keep their join time */
  const daysOnSite = 0; /* new signup */
  const durationStr = daysOnSite === 0 ? 'New Deviant'
    : daysOnSite < 30  ? `Deviant for ${daysOnSite} days`
    : daysOnSite < 365 ? `Deviant for ${Math.floor(daysOnSite/30)} months`
    : `Deviant for ${Math.floor(daysOnSite/365)} year${Math.floor(daysOnSite/365) > 1 ? 's' : ''}`;

  if (heroName)   heroName.textContent = user.name;
  if (heroHandle) heroHandle.innerHTML = `${user.name} <span class="hero-badge">✦</span>`;
  if (heroTag)    heroTag.textContent  = user.email ? user.email.split('@')[0] + ' on ArtCanvasHub' : 'New Deviant on ArtCanvasHub';
  if (heroMember) heroMember.textContent = '✦ New Deviant';
  if (aboutHd)    aboutHd.textContent = `About ${firstName}`;
  if (aboutBio)   aboutBio.textContent = `Welcome to ArtCanvas, ${firstName}! Upload your first work to get started.`;
  if (aboutFullBio) aboutFullBio.textContent = `Hi, I'm ${user.name}. I just joined ArtCanvas and I'm excited to share my art with the community!`;
  if (aboutJoin)         aboutJoin.textContent         = joinShort;
  if (aboutCardDuration) aboutCardDuration.textContent = durationStr;
  if (aboutDetailJoin)   aboutDetailJoin.textContent   = `Joined ${joinDate}`;
  if (aboutDetailEmail)  aboutDetailEmail.textContent  = user.isDemo ? 'Demo account' : user.email;
  if (aboutQfJoinDate)   aboutQfJoinDate.textContent   = joinShort;
  if (aboutQfDuration)   aboutQfDuration.textContent   = durationStr;
  /* pronouns: demo = They/Them; Google users = not set by default */
  if (aboutPronouns)     aboutPronouns.textContent     = user.isDemo ? 'They / Them' : '';
  if (aboutCardLocation) aboutCardLocation.textContent = 'Location not set';

  /* ── Avatars ────────────────────────────────── */
  setAvatar(document.getElementById('profileAv'), user, 64);

  /* Nav avatar */
  const navAvEl = document.getElementById('navAv');
  if (user.picture && navAvEl) {
    const img = document.createElement('img');
    img.src = user.picture;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
    img.onerror = () => drawOn(navAvEl, window.drawAvatar);
    navAvEl.parentNode.replaceChild(img, navAvEl);
  } else if (navAvEl) {
    drawOn(navAvEl, window.drawAvatar);
  }

  /* ── Followers grid (use real artists) ─────── */
  const wg = document.getElementById('followersGrid');
  const followersCount = document.getElementById('followersCount');
  if (wg && window.AC_ARTISTS && window.AC_ARTISTS.length > 0) {
    const displayArtists = window.AC_ARTISTS.slice(0, 16);
    if (followersCount) followersCount.textContent = displayArtists.length;
    displayArtists.forEach(a => {
      const wrap = document.createElement('div');
      wrap.className = 'wav';
      wrap.title = a.name;
      const cv = document.createElement('canvas');
      cv.width = 40; cv.height = 40;
      drawOn(cv, window.drawWatcher, a.seed);
      wrap.appendChild(cv);
      wg.appendChild(wrap);
    });
    /* update hero follower count */
    const heroFollowers = document.getElementById('heroFollowers');
    if (heroFollowers) heroFollowers.textContent = displayArtists.length + ' Watchers';
  } else {
    FOLLOWERS.forEach((w, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'wav';
      const cv = document.createElement('canvas');
      cv.width = 40; cv.height = 40;
      drawOn(cv, window.drawWatcher, i * 137 + w.hue);
      wrap.appendChild(cv);
      wg.appendChild(wrap);
    });
  }

  /* ── Community strip on Home tab ───────────── */
  const homeMain = document.querySelector('.home-main');
  if (homeMain && window.AC_WORKS && window.AC_WORKS.length > 0) {
    const strip = document.createElement('div');
    strip.className = 'sec';
    strip.innerHTML = `
      <div class="sec-hd-row">
        <span class="sec-hd-label">Trending in the Community</span>
        <a class="sec-see-all" href="browse.html">See All</a>
      </div>
      <div class="hscroll" id="communityStrip"></div>
    `;
    homeMain.insertBefore(strip, homeMain.firstChild);
    const scroll = document.getElementById('communityStrip');
    const topWorks = [...window.AC_WORKS].sort((a, b) => b.likes - a.likes).slice(0, 10);
    topWorks.forEach(work => {
      const artist = window.AC_ARTISTS.find(a => a.id === work.artistId) || window.AC_ARTISTS[0];
      const fn = window.DRAW_FNS[work.style] || window.DRAW_FNS.space;
      const card = document.createElement('div');
      card.className = 'hscroll-card';
      const cv = document.createElement('canvas');
      cv.width = 160; cv.height = 213;
      window._artSeed = work.id; drawOn(cv, fn); window._artSeed = 0;
      cv.style.filter = `hue-rotate(${(work.id * 137) % 360}deg) saturate(${85 + (work.id * 23 % 35)}%)`;
      card.appendChild(cv);
      const ov = document.createElement('div');
      ov.className = 'hscroll-card-ov';
      ov.innerHTML = `
        <div class="hscroll-card-ov-title">${work.title}</div>
        <div class="hscroll-card-ov-stat">
          <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${work.likes.toLocaleString()} · ${artist.name}
        </div>
      `;
      card.appendChild(ov);
      card.addEventListener('click', () => window.AC?.openWork(work.id));
      scroll.appendChild(card);
    });
  }

  /* ── Replace "Latest Deviations" empty state with demo works ─── */
  if (window.AC_WORKS && window.AC_WORKS.length > 0) {
    const latestHd = [...document.querySelectorAll('.sec-hd-label')].find(el => el.textContent.trim() === 'Latest Deviations');
    if (latestHd) {
      const sec = latestHd.closest('.sec');
      const emptyEl = sec && sec.querySelector('.empty-banner');
      if (emptyEl) {
        const scroll = document.createElement('div');
        scroll.className = 'hscroll';
        const recentWorks = [...window.AC_WORKS].sort((a, b) => b.id - a.id).slice(0, 10);
        recentWorks.forEach(work => {
          const fn = window.DRAW_FNS[work.style] || window.DRAW_FNS.space;
          const card = document.createElement('div');
          card.className = 'hscroll-card';
          const cv = document.createElement('canvas');
          cv.width = 160; cv.height = 213;
          window._artSeed = work.id; drawOn(cv, fn); window._artSeed = 0;
          cv.style.filter = `hue-rotate(${(work.id * 137) % 360}deg) saturate(${85 + (work.id * 23 % 35)}%)`;
          card.appendChild(cv);
          const ov = document.createElement('div');
          ov.className = 'hscroll-card-ov';
          ov.innerHTML = `<div class="hscroll-card-ov-title">${work.title}</div>`;
          card.appendChild(ov);
          card.addEventListener('click', () => window.AC?.openWork(work.id));
          scroll.appendChild(card);
        });
        emptyEl.replaceWith(scroll);
        const hdRow = sec.querySelector('.sec-hd-row');
        if (hdRow && !hdRow.querySelector('.sec-see-all')) {
          const sa = document.createElement('a');
          sa.className = 'sec-see-all'; sa.href = 'browse.html'; sa.textContent = 'Browse All';
          hdRow.appendChild(sa);
        }
      }
    }

    /* Hide Spotlight empty state — only show when user has pinned work */
    const spotlightSec = [...document.querySelectorAll('.sec-hd-label')].find(el => el.textContent.trim() === 'Spotlight');
    if (spotlightSec) {
      const sec = spotlightSec.closest('.sec');
      if (sec && sec.querySelector('.spotlight-empty')) sec.style.display = 'none';
    }
  }

  /* ── Populate Liked tab with recent works ─── */
  const likedPanel = document.getElementById('tab-favourites');
  if (likedPanel && window.AC_WORKS && window.AC_WORKS.length > 0) {
    likedPanel.innerHTML = '';
    const gallery = document.createElement('div');
    gallery.className = 'gallery-page';
    const hd = document.createElement('div');
    hd.className = 'sec-hd-row';
    hd.style.marginBottom = '14px';
    hd.innerHTML = `<span class="sec-hd-label">Favourites</span><span style="font-size:12px;color:var(--fg3)">Deviations you\'ve favourited</span>`;
    gallery.appendChild(hd);
    const grid = document.createElement('div');
    grid.className = 'g-grid';
    const likedWorks = [...window.AC_WORKS].sort(() => 0.5 - Math.random()).slice(0, 12);
    const queue = likedWorks.map(w => w.id);
    likedWorks.forEach(work => {
      const card = window.AC.makeArtCard(work);
      card.addEventListener('click', e => {
        if (e.target.closest('.art-like-btn') || e.target.closest('.art-card-author-name')) return;
        window.AC.openWork(work.id, queue);
      }, true);
      grid.appendChild(card);
    });
    gallery.appendChild(grid);
    likedPanel.appendChild(gallery);
  }

  /* ── Who to Watch ───────────────────────────── */
  const whoToWatch = document.getElementById('whoToWatch');
  if (whoToWatch && window.AC_ARTISTS && window.AC_ARTISTS.length > 0) {
    window.AC_ARTISTS.slice(10, 14).forEach(a => {
      const item = document.createElement('div');
      item.className = 'wtw-row';
      const cv = document.createElement('canvas');
      cv.width = 34; cv.height = 34;
      drawOn(cv, window.drawWatcher, a.seed);
      item.innerHTML = `
        <div class="wtw-av"></div>
        <div class="wtw-info">
          <div class="wtw-name">${a.name}</div>
          <div class="wtw-sub">${a.followers} followers</div>
        </div>
        <button class="btn-follow-toggle wtw-btn" data-following="false">Watch</button>
      `;
      item.querySelector('.wtw-av').appendChild(cv);
      whoToWatch.appendChild(item);
    });
  }

  /* ── Groups ─────────────────────────────────── */
  const gr = document.getElementById('grpRow');
  if (gr) {
    GROUPS.forEach(g => {
      const item = document.createElement('div');
      item.className = 'grp-item';
      const cv = document.createElement('canvas');
      cv.width = 34; cv.height = 34;
      drawOn(cv, window.drawGroupIcon, g.hue);
      const ico = document.createElement('div');
      ico.className = 'grp-ico';
      ico.appendChild(cv);
      const info = document.createElement('div');
      info.innerHTML = `<div class="grp-name">${g.name}</div><div class="grp-sub">${g.members}</div>`;
      item.appendChild(ico);
      item.appendChild(info);
      gr.appendChild(item);
    });
  }

  /* ── Journal entries ────────────────────────── */
  const journalList = document.getElementById('journalList');
  if (journalList) {
    JOURNAL_ENTRIES.forEach(entry => {
      const el = document.createElement('div');
      el.className = 'journal-entry';
      el.innerHTML = `
        <div class="journal-entry-hd">${entry.title}</div>
        <div class="journal-entry-meta">
          <span>${entry.date}</span>
          <span class="journal-meta-sep">·</span>
          <span>${entry.comments} Comments</span>
          <span class="journal-meta-sep">·</span>
          <span>${entry.likes} Likes</span>
        </div>
        <p class="journal-entry-excerpt">${entry.excerpt}</p>
        <div class="journal-entry-footer">
          <button class="journal-like-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${entry.likes}
          </button>
          <button class="journal-comment-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            ${entry.comments}
          </button>
          <a class="journal-read-more" href="#">Read More →</a>
        </div>
      `;
      /* Like toggle */
      const likeBtn = el.querySelector('.journal-like-btn');
      let liked = false;
      likeBtn.addEventListener('click', () => {
        liked = !liked;
        likeBtn.classList.toggle('liked', liked);
        likeBtn.querySelector('svg').setAttribute('fill', liked ? 'currentColor' : 'none');
        const n = parseInt(likeBtn.textContent.trim(), 10);
        likeBtn.lastChild.textContent = ' ' + (liked ? n + 1 : n - 1);
      });
      el.querySelector('.journal-comment-btn').addEventListener('click', () => {
        window.AC?.showToast('Journal comments coming soon!');
      });
      el.querySelector('.journal-read-more').addEventListener('click', e => {
        e.preventDefault();
        window.AC?.showToast('Full journal posts coming soon!');
      });
      journalList.appendChild(el);
    });
  }

  /* ── Profile comments ─────────────────────── */
  const profileCommentsList = document.getElementById('profileCommentsList');
  const pcFormAv = document.getElementById('pcFormAv');
  if (pcFormAv) drawOn(pcFormAv, window.drawAvatar);
  if (profileCommentsList) {
    const PC_COMMENTS = [
      { user: 'DragonScale', text: 'Love your work! The nebula pieces are absolutely stunning.', time: '2 days ago', seed: 80 },
      { user: 'GhostBrush', text: 'Just followed! Looking forward to seeing more from you.', time: '5 days ago', seed: 60 },
      { user: 'CosmicInk', text: 'Your color palette is gorgeous. Keep it up!', time: '1 week ago', seed: 40 },
    ];
    PC_COMMENTS.forEach(c => {
      const el = document.createElement('div');
      el.className = 'pc-comment';
      const cv = document.createElement('canvas');
      cv.width = 32; cv.height = 32;
      cv.className = 'pc-comment-av';
      drawOn(cv, window.drawWatcher, c.seed);
      const body = document.createElement('div');
      body.className = 'pc-comment-body';
      body.innerHTML = `<div><span class="pc-comment-user">${c.user}</span><span class="pc-comment-text"> ${c.text}</span></div><div class="pc-comment-meta">${c.time}</div>`;
      el.appendChild(cv);
      el.appendChild(body);
      profileCommentsList.appendChild(el);
    });
  }
  const pcSend = document.getElementById('pcCommentSend');
  const pcInput = document.getElementById('pcCommentInput');
  function postProfileComment() {
    if (!pcInput || !pcInput.value.trim()) return;
    const text = pcInput.value.trim();
    pcInput.value = '';
    const el = document.createElement('div');
    el.className = 'pc-comment pc-comment-new';
    const cv = document.createElement('canvas');
    cv.width = 32; cv.height = 32;
    cv.className = 'pc-comment-av';
    drawOn(cv, window.drawAvatar);
    const body = document.createElement('div');
    body.className = 'pc-comment-body';
    body.innerHTML = `<div><span class="pc-comment-user">${user.name || 'You'}</span><span class="pc-comment-text"> ${text}</span></div><div class="pc-comment-meta">just now</div>`;
    el.appendChild(cv);
    el.appendChild(body);
    profileCommentsList.insertBefore(el, profileCommentsList.firstChild);
  }
  pcSend?.addEventListener('click', postProfileComment);
  pcInput?.addEventListener('keydown', e => { if (e.key === 'Enter') postProfileComment(); });

  /* ── Collection row ─────────────────────────── */
  const collectionRow = document.getElementById('collectionRow');
  if (collectionRow) {
    const addCollBtn = document.createElement('button');
    addCollBtn.className = 'collection-add-btn';
    addCollBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M12 5v14m-7-7h14"/></svg>
      New Collection
    `;
    collectionRow.appendChild(addCollBtn);
  }
});
