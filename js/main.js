const GALLERY = [
  {title:'Void Walker',    views:'14.2K', favs:'923',  artist:'YourUsername', style:'space'},
  {title:'Forest Specter', views:'8.7K',  favs:'534',  artist:'YourUsername', style:'forest'},
  {title:'Neon District',  views:'21.3K', favs:'1.4K', artist:'YourUsername', style:'neon'},
  {title:'Cascade Dreams', views:'6.1K',  favs:'388',  artist:'YourUsername', style:'flow'},
  {title:'Soul Fragment',  views:'11.9K', favs:'762',  artist:'YourUsername', style:'portrait'},
  {title:'Ancient Wing',   views:'18.5K', favs:'1.1K', artist:'YourUsername', style:'dragon'},
  {title:'Crystal Depths', views:'5.3K',  favs:'317',  artist:'YourUsername', style:'crystal'},
  {title:'Iron Protocol',  views:'16.7K', favs:'989',  artist:'YourUsername', style:'mecha'},
  {title:'Ember Tide',     views:'9.4K',  favs:'601',  artist:'YourUsername', style:'fire'},
];

const FAVS = [
  {title:'Starlight Echo', views:'32.1K', favs:'2.4K', artist:'NightVision',  style:'space'},
  {title:'Shadow Bloom',   views:'14.8K', favs:'891',  artist:'DarkFlower',   style:'forest'},
  {title:'Pulse City',     views:'27.3K', favs:'1.8K', artist:'NeonDreamer',  style:'neon'},
  {title:'Flux',           views:'9.2K',  favs:'423',  artist:'WaveArt',      style:'flow'},
  {title:'Silent Watcher', views:'18.4K', favs:'1.2K', artist:'GhostBrush',   style:'portrait'},
  {title:'Sky Titan',      views:'41.7K', favs:'3.1K', artist:'DragonScale',  style:'dragon'},
];

const GROUPS = [
  {name:'DigitalArtists', members:'142K members', hue:140},
  {name:'FantasyArt',     members:'89K members',  hue:270},
  {name:'SciFiArtists',   members:'67K members',  hue:200},
];

function makeCard(art) {
  const card = document.createElement('div');
  card.className = 'art-card';
  card.innerHTML = `
    <div class="art-thumb">
      <canvas width="300" height="300"></canvas>
      <div class="art-ov">
        <div class="art-ov-title">${art.title}</div>
        <div class="art-ov-row">
          <span class="art-ov-stat">👁 ${art.views}</span>
          <span class="art-ov-stat">♥ ${art.favs}</span>
        </div>
      </div>
    </div>
    <div class="art-foot">
      <div class="art-title">${art.title}</div>
      <div class="art-artist">${art.artist}</div>
    </div>`;
  const canvas = card.querySelector('canvas');
  window.DRAW_FNS[art.style](canvas.getContext('2d'), 300, 300);
  return card;
}

// Tabs
document.querySelectorAll('.tbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tbtn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'favourites' && !document.getElementById('favsGrid').children.length) {
      const g = document.getElementById('favsGrid');
      FAVS.forEach(art => g.appendChild(makeCard(art)));
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  // Banner
  window.drawBanner(document.getElementById('bannerC').getContext('2d'), 1200, 280);
  // Avatars
  window.drawAvatar(document.getElementById('profAv').getContext('2d'), 176, 176);
  window.drawAvatar(document.getElementById('navAv').getContext('2d'), 68, 68);
  // Featured
  window.DRAW_FNS.space(document.getElementById('featC').getContext('2d'), 480, 360);
  // Gallery
  const gg = document.getElementById('galleryGrid');
  GALLERY.forEach(art => gg.appendChild(makeCard(art)));
  // Watchers
  const wg = document.getElementById('watchersGrid');
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div'); d.className = 'wav';
    const c = document.createElement('canvas'); c.width = 80; c.height = 80;
    window.drawWatcher(c.getContext('2d'), 80, 80, i * 17 + 3);
    d.appendChild(c); wg.appendChild(d);
  }
  // Groups
  const gr = document.getElementById('grpRow');
  GROUPS.forEach(grp => {
    const d = document.createElement('div'); d.className = 'grp-item';
    const ico = document.createElement('div'); ico.className = 'grp-ico';
    const c = document.createElement('canvas'); c.width = 64; c.height = 64;
    window.drawGroupIcon(c.getContext('2d'), 64, 64, grp.hue);
    ico.appendChild(c);
    const info = document.createElement('div');
    info.innerHTML = `<div class="grp-name">${grp.name}</div><div class="grp-sub">${grp.members}</div>`;
    d.appendChild(ico); d.appendChild(info); gr.appendChild(d);
  });
});
