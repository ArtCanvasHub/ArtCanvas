/* ── PROFILE PAGE ──────────────────────────────────────── */
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
  if (stat === 'followers') {
    document.getElementById('followersGrid')?.scrollIntoView({behavior: 'smooth', block: 'center'});
  } else if (stat === 'works') {
    document.querySelector('[data-tab="portfolio"]')?.click();
    window.scrollTo({top: 0, behavior: 'smooth'});
  } else if (stat === 'liked') {
    document.querySelector('[data-tab="liked"]')?.click();
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
    location.href = 'browse.html';
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
  const aboutJoin   = document.getElementById('aboutJoinDate');
  const aboutDetailJoin = document.getElementById('aboutDetailJoin');
  const aboutDetailEmail = document.getElementById('aboutDetailEmail');

  const firstName = user.given_name || user.name.split(' ')[0];
  const joinDate  = new Date().toLocaleDateString('en-US', {month:'long', year:'numeric'});

  if (heroName)   heroName.textContent = user.name;
  if (heroHandle) heroHandle.innerHTML = `${user.name} <span class="hero-badge">✦</span>`;
  if (heroTag)    heroTag.textContent  = user.email ? user.email.split('@')[0] + ' on ArtCanvas' : 'New member on ArtCanvas';
  if (heroMember) heroMember.textContent = '✦ New member';
  if (aboutHd)    aboutHd.textContent = `About ${firstName}`;
  if (aboutBio)   aboutBio.textContent = `Welcome to ArtCanvas, ${firstName}! Upload your first work to get started.`;
  if (aboutFullBio) aboutFullBio.textContent = `Hi, I'm ${user.name}. I just joined ArtCanvas and I'm excited to share my art with the community!`;
  if (aboutJoin)   aboutJoin.textContent = joinDate;
  if (aboutDetailJoin) aboutDetailJoin.textContent = `Member since ${joinDate}`;
  if (aboutDetailEmail) aboutDetailEmail.textContent = user.isDemo ? 'Demo account' : user.email;

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
    if (heroFollowers) heroFollowers.textContent = displayArtists.length + ' Followers';
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
