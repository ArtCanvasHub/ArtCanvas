/* ── DATA ─────────────────────────────────────────────── */
const GROUPS = [
  {name:'DigitalArtists', members:'142K members', hue:140},
  {name:'FantasyArt',     members:'89K members',  hue:270},
  {name:'SciFiArtists',   members:'67K members',  hue:200},
];

const FOLLOWERS = [0,30,60,140,200,270,330,15,90,180].map(hue => ({hue}));

/* ── HELPERS ──────────────────────────────────────────── */
function drawOn(canvas, fn, ...extra) {
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

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Nav + profile avatars */
  drawOn(document.getElementById('navAv'), window.drawAvatar);
  drawOn(document.getElementById('profileAv'), window.drawAvatar);

  /* Hero banner */
  drawOn(document.getElementById('bannerC'), window.drawBanner);

  /* Followers grid */
  const wg = document.getElementById('followersGrid');
  if (wg) {
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

  /* Groups */
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

  /* Empty collection row placeholder tiles */
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

  /* Discover grid — show community art on profile home tab */
  const discoverGrid = document.getElementById('discoverGrid');
  if (discoverGrid && window.AC_WORKS && window.AC) {
    const works = window.AC_WORKS.slice(0, 9);
    const queue = works.map(w => w.id);
    works.forEach(work => {
      const card = window.AC.makeArtCard(work);
      card.addEventListener('click', e => {
        if (e.target.closest('.art-like-btn')) return;
        window.AC.openWork(work.id, queue);
      }, true);
      discoverGrid.appendChild(card);
    });
  }
});
