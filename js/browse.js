/* ── BROWSE PAGE LOGIC ────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  /* Auth check — redirects to login.html if not signed in */
  const user = window.AC_AUTH?.requireAuth();
  if (!user) return;

  const drawOn = window.AC.drawOn;

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

  /* ── FEATURED ARTISTS SIDEBAR ──────────────────── */
  const featEl = document.getElementById('featuredArtists');
  if (window.AC_ARTISTS && window.AC_ARTISTS.length > 0) {
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
  } else {
    featEl.innerHTML = `
      <div style="padding:12px 0;color:var(--fg3);font-size:12px;line-height:1.6">
        No featured artists yet.<br>
        <a href="#" style="color:var(--acc)">Be the first to upload</a>
      </div>`;
  }

  /* ── GRID MANAGEMENT ───────────────────────────── */
  let activeCategory = 'all';
  let activeSort     = 'popular';
  let searchQuery    = '';
  let displayCount   = 12;

  function getFilteredWorks() {
    let works = [...(window.AC_WORKS || [])];
    if (activeCategory !== 'all') {
      works = works.filter(w => w.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      works = works.filter(w =>
        w.title.toLowerCase().includes(q) ||
        (window.AC.getArtist(w.artistId)?.name || '').toLowerCase().includes(q) ||
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
    const works   = getFilteredWorks();
    const visible = works.slice(0, displayCount);
    const queue   = visible.map(w => w.id);

    grid.innerHTML = '';

    if (visible.length === 0) {
      const isFiltered = activeCategory !== 'all' || searchQuery;
      grid.innerHTML = `
        <div style="grid-column:1/-1">
          <div class="empty-box" style="margin:40px auto;max-width:420px">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="44" height="44">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div class="empty-title">${isFiltered ? 'No works found' : 'No works yet'}</div>
            <div class="empty-sub">${isFiltered
              ? 'Try a different category or search term.'
              : 'ArtCanvas is brand new! Be the first artist to share your work with the community.'
            }</div>
            ${isFiltered ? '' : `
              <button class="empty-cta" data-action="upload" style="margin-top:16px">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M12 5v14m-7-7h14"/></svg>
                Submit Your First Work
              </button>`}
          </div>
        </div>`;
      document.getElementById('loadMoreBtn').style.display = 'none';
      return;
    }

    visible.forEach(work => {
      const card = window.AC.makeArtCard(work);
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
