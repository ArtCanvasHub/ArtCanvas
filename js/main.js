/* ── DATA ─────────────────────────────────────────────── */
const GALLERY = [
  {title:'Void Walker',     views:'14.2K', favs:'923',  artist:'NebulaForge', style:'space'},
  {title:'Ancient Grove',   views:'9.1K',  favs:'541',  artist:'NebulaForge', style:'forest'},
  {title:'Neon District',   views:'21.7K', favs:'1.4K', artist:'NebulaForge', style:'neon'},
  {title:'Flow State',      views:'6.3K',  favs:'298',  artist:'NebulaForge', style:'flow'},
  {title:'Portrait Study',  views:'11.0K', favs:'876',  artist:'NebulaForge', style:'portrait'},
  {title:'Dragon Epoch',    views:'18.4K', favs:'2.1K', artist:'NebulaForge', style:'dragon'},
  {title:'Crystal Spire',   views:'7.8K',  favs:'412',  artist:'NebulaForge', style:'crystal'},
  {title:'Mecha Risen',     views:'15.6K', favs:'1.1K', artist:'NebulaForge', style:'mecha'},
  {title:'Ember Fade',      views:'5.2K',  favs:'187',  artist:'NebulaForge', style:'fire'},
];

const FAVS = [
  {title:'Midnight Rain',   views:'8.3K',  favs:'620',  artist:'NightVision', style:'forest'},
  {title:'Bloom Protocol',  views:'12.1K', favs:'934',  artist:'DarkFlower',  style:'neon'},
  {title:'Prism Break',     views:'4.9K',  favs:'271',  artist:'NeonDreamer', style:'crystal'},
  {title:'Tidal Surge',     views:'17.2K', favs:'1.3K', artist:'WaveArt',     style:'flow'},
  {title:'Phantom Layer',   views:'9.7K',  favs:'558',  artist:'GhostBrush',  style:'space'},
  {title:'Scale & Fire',    views:'22.3K', favs:'3.1K', artist:'DragonScale', style:'dragon'},
];

const FOLDERS = [
  {name:'All',        count:'142 deviations', style:'space'},
  {name:'Featured',   count:'18 deviations',  style:'dragon'},
  {name:'Sci-Fi',     count:'56 deviations',  style:'mecha'},
  {name:'Fantasy',    count:'38 deviations',  style:'crystal'},
  {name:'Characters', count:'30 deviations',  style:'portrait'},
];

const GROUPS = [
  {name:'DigitalArtists', members:'142K members', hue:140},
  {name:'FantasyArt',     members:'89K members',  hue:270},
  {name:'SciFiArtists',   members:'67K members',  hue:200},
];

const WATCHERS = [0,30,60,140,200,270,330,15,90,180].map(hue => ({hue}));

/* ── ICON SVG STRINGS ─────────────────────────────────── */
const ICO_EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const ICO_HEART = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

/* ── HELPERS ──────────────────────────────────────────── */
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function drawOn(canvas, fn, ...extra) {
  const ctx = canvas.getContext('2d');
  fn(ctx, canvas.width, canvas.height, ...extra);
}

/* ── CARD BUILDERS ────────────────────────────────────── */
function makeArtCard(art) {
  const card = document.createElement('div');
  card.className = 'art-card';
  const fn = window.DRAW_FNS[art.style] || window.DRAW_FNS.space;
  card.innerHTML = `
    <div class="art-thumb">
      <canvas width="300" height="400"></canvas>
      <div class="art-ov">
        <div class="art-ov-title">${art.title}</div>
        <div class="art-ov-stats">
          <span class="art-ov-stat">${ICO_EYE} ${art.views}</span>
          <span class="art-ov-stat">${ICO_HEART} ${art.favs}</span>
        </div>
      </div>
    </div>
    <div class="art-foot">
      <div class="art-title">${art.title}</div>
      <div class="art-artist">${art.artist}</div>
    </div>`;
  drawOn(card.querySelector('canvas'), fn);
  return card;
}

function makeHscrollCard(art) {
  const card = document.createElement('div');
  card.className = 'hscroll-card';
  const fn = window.DRAW_FNS[art.style] || window.DRAW_FNS.space;
  card.innerHTML = `
    <canvas width="190" height="254"></canvas>
    <div class="hscroll-card-ov">
      <div class="hscroll-card-ov-title">${art.title}</div>
      <div class="hscroll-card-ov-stats">
        <span class="hscroll-card-ov-stat">${ICO_EYE} ${art.views}</span>
        <span class="hscroll-card-ov-stat">${ICO_HEART} ${art.favs}</span>
      </div>
    </div>`;
  drawOn(card.querySelector('canvas'), fn);
  return card;
}

function makeFolderCard(folder, idx) {
  const card = document.createElement('div');
  card.className = 'folder-card' + (idx === 0 ? ' active' : '');
  const fn = window.DRAW_FNS[folder.style] || window.DRAW_FNS.space;
  card.innerHTML = `
    <canvas width="148" height="111"></canvas>
    <div class="folder-name">
      ${folder.name}
      <span class="folder-count">${folder.count}</span>
    </div>`;
  drawOn(card.querySelector('canvas'), fn);
  return card;
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

  /* Latest Deviations (horizontal scroll) */
  const latestRow = document.getElementById('latestRow');
  GALLERY.slice(0, 7).forEach(art => latestRow.appendChild(makeHscrollCard(art)));

  /* Featured grid (home tab) */
  const featGrid = document.getElementById('featGrid');
  GALLERY.slice(0, 6).forEach(art => featGrid.appendChild(makeArtCard(art)));

  /* Gallery grid (gallery tab) */
  const gg = document.getElementById('galleryGrid');
  GALLERY.forEach(art => gg.appendChild(makeArtCard(art)));

  /* Favourites grid */
  const fg = document.getElementById('favsGrid');
  FAVS.forEach(art => fg.appendChild(makeArtCard(art)));

  /* Folder row */
  const folderRow = document.getElementById('folderRow');
  FOLDERS.forEach((f, i) => folderRow.appendChild(makeFolderCard(f, i)));

  /* Watchers */
  const wg = document.getElementById('watchersGrid');
  WATCHERS.forEach((w, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'wav';
    const cv = document.createElement('canvas');
    cv.width = 40; cv.height = 40;
    drawOn(cv, window.drawWatcher, i * 137 + w.hue);
    wrap.appendChild(cv);
    wg.appendChild(wrap);
  });

  /* Groups */
  const gr = document.getElementById('grpRow');
  GROUPS.forEach(g => {
    const item = document.createElement('div');
    item.className = 'grp-item';
    const cv = document.createElement('canvas');
    cv.width = 34; cv.height = 34;
    drawOn(cv, window.drawGroupIcon, g.hue);
    item.innerHTML = `<div class="grp-ico"></div><div><div class="grp-name">${g.name}</div><div class="grp-sub">${g.members}</div></div>`;
    item.querySelector('.grp-ico').appendChild(cv);
    gr.appendChild(item);
  });
});
