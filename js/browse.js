/* ── BROWSE PAGE LOGIC ────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const drawOn = window.AC.drawOn;

  /* Nav avatar */
  drawOn(document.getElementById('navAv'), window.drawAvatar);

  /* ── FEATURED ARTISTS SIDEBAR ──────────────────── */
  const featEl = document.getElementById('featuredArtists');
  window.AC_ARTISTS.slice(0, 6).forEach(a => {
    const item = document.createElement('div');
    item.className = 'featured-artist-row';
    const cv = document.createElement('canvas');
    cv.width = 38; cv.height = 38;
    drawOn(cv, window.drawWatcher, a.seed);
    item.innerHTML = `
      <div class="fa-av"></div>
      <div class="fa-info">
        <div class="fa-name"><a href="index.html">${a.name}</a></div>
        <div class="fa-tag">${a.tagline}</div>
        <div class="fa-followers">${a.followers} followers</div>
      </div>
      <button class="btn-follow-toggle" data-following="false">Follow</button>
    `;
    item.querySelector('.fa-av').appendChild(cv);
    featEl.appendChild(item);
  });

  /* ── GRID MANAGEMENT ───────────────────────────── */
  let activeCategory = 'all';
  let activeSort = 'popular';
  let searchQuery = '';
  let displayCount = 12;

  function getFilteredWorks() {
    let works = [...window.AC_WORKS];

    if (activeCategory !== 'all') {
      works = works.filter(w => w.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      works = works.filter(w =>
        w.title.toLowerCase().includes(q) ||
        window.AC.getArtist(w.artistId).name.toLowerCase().includes(q) ||
        w.tags.some(t => t.includes(q))
      );
    }
    if (activeSort === 'popular') {
      works.sort((a, b) => b.likes - a.likes);
    } else if (activeSort === 'new') {
      works.sort((a, b) => b.id - a.id);
    } else if (activeSort === 'trending') {
      works.sort((a, b) => {
        const va = parseFloat(a.views) * (a.views.includes('K') ? 1000 : 1);
        const vb = parseFloat(b.views) * (b.views.includes('K') ? 1000 : 1);
        return vb - va;
      });
    }
    return works;
  }

  function renderGrid() {
    const grid = document.getElementById('browseGrid');
    const works = getFilteredWorks();
    const visible = works.slice(0, displayCount);
    const queue = visible.map(w => w.id);

    grid.innerHTML = '';

    if (visible.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1">
          <div class="empty-box">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div class="empty-title">No works found</div>
            <div class="empty-sub">Try a different category or search term.</div>
          </div>
        </div>`;
      document.getElementById('loadMoreBtn').style.display = 'none';
      return;
    }

    visible.forEach(work => {
      const card = window.AC.makeArtCard(work);
      /* Override click to use filtered queue for prev/next */
      card.addEventListener('click', e => {
        if (e.target.closest('.art-like-btn')) return;
        window.AC.openWork(work.id, queue);
      }, true);
      grid.appendChild(card);
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.style.display = works.length > displayCount ? 'inline-flex' : 'none';
  }

  /* Load more */
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    displayCount += 8;
    renderGrid();
  });

  /* Category filter */
  document.getElementById('browseCats').addEventListener('click', e => {
    const pill = e.target.closest('.cat-pill');
    if (!pill) return;
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.cat;
    displayCount = 12;
    renderGrid();
  });

  /* Sort */
  document.querySelectorAll('.sort-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSort = btn.dataset.sort;
      displayCount = 12;
      renderGrid();
    });
  });

  /* Search */
  let searchTimer;
  document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = e.target.value.trim();
      displayCount = 12;
      renderGrid();
    }, 250);
  });

  /* Initial render */
  renderGrid();
});
