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

  function makeArtistRow(a, btnLabel) {
    const item = document.createElement('div');
    item.className = 'featured-artist-row';
    const cv = document.createElement('canvas');
    cv.width = 40; cv.height = 40;
    drawOn(cv, window.drawWatcher, a.seed);
    item.innerHTML = `
      <div class="fa-av"></div>
      <div class="fa-info">
        <div class="fa-name"><a href="index.html">${a.name}</a></div>
        <div class="fa-followers">${a.followers} followers</div>
      </div>
      <button class="btn-follow-toggle" data-following="false">${btnLabel}</button>
    `;
    item.querySelector('.fa-av').appendChild(cv);
    return item;
  }

  /* ── FEATURED ARTISTS SIDEBAR ──────────────────── */
  const featEl = document.getElementById('featuredArtists');
  if (window.AC_ARTISTS && window.AC_ARTISTS.length > 0) {
    window.AC_ARTISTS.slice(0, 6).forEach(a => featEl.appendChild(makeArtistRow(a, 'Watch')));
  } else {
    featEl.innerHTML = `
      <div style="padding:12px 0;color:var(--fg3);font-size:12px;line-height:1.6">
        No featured artists yet.<br>
        <a href="#" style="color:var(--acc)">Be the first to upload</a>
      </div>`;
  }

  /* ── SUGGESTED ARTISTS ──────────────────────────── */
  const suggestedEl = document.getElementById('suggestedArtists');
  if (suggestedEl && window.AC_ARTISTS && window.AC_ARTISTS.length > 6) {
    window.AC_ARTISTS.slice(6, 9).forEach(a => suggestedEl.appendChild(makeArtistRow(a, 'Watch')));
  }

  /* ── GRID MANAGEMENT ───────────────────────────── */
  let activeCategory = 'all';
  let activeSort     = 'popular';
  let searchQuery    = '';
  let activeTag      = '';
  let displayCount   = 12;

  /* Read search query from URL param */
  const urlQ = new URLSearchParams(location.search).get('q');
  if (urlQ) {
    searchQuery = urlQ;
    document.getElementById('searchInput').value = urlQ;
  }

  function getFilteredWorks() {
    let works = [...(window.AC_WORKS || [])];
    if (activeCategory !== 'all') {
      works = works.filter(w => w.category === activeCategory);
    }
    if (activeTag) {
      const tag = activeTag.toLowerCase();
      works = works.filter(w =>
        w.tags.some(t => t.includes(tag)) ||
        w.style.includes(tag) ||
        w.category.includes(tag)
      );
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

  /* ── SIDEBAR TAG CHIPS ──────────────────────────────── */
  document.querySelectorAll('.tchip').forEach(chip => {
    chip.addEventListener('click', e => {
      e.preventDefault();
      const text = chip.textContent.trim().toLowerCase().replace(/\s+/g, '');
      activeTag = text === 'all' ? '' : text;
      displayCount = 12;
      document.querySelectorAll('.tchip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderGrid();
    });
  });

  /* Follow in featured artists sidebar */
  document.addEventListener('click', e => {
    const btn = e.target.closest('#featuredArtists .btn-follow-toggle');
    if (btn) {
      const following = btn.dataset.following === 'true';
      btn.dataset.following = String(!following);
      btn.textContent = !following ? 'Watching' : 'Watch';
      btn.classList.toggle('following', !following);
    }
  });

  /* ── BROWSE ACTION BAR ──────────────────────────────── */
  document.querySelectorAll('.browse-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();
      if (text.includes('Daily Challenge')) {
        window.AC.showToast('Daily Challenge coming soon!');
      } else if (text.includes('AI Art')) {
        window.AC.showToast('AI Art generator coming soon!');
      } else if (text.includes('Sell')) {
        window.AC.showToast('Marketplace coming soon!');
      } else {
        window.AC.openUploadModal();
      }
    });
  });

  /* ── EXPLORE STRIPS (above main grid) ────────────────── */
  function renderExploreStrips() {
    const main = document.querySelector('.browse-main');
    if (!main || document.getElementById('exploreStrips')) return;
    const container = document.createElement('div');
    container.id = 'exploreStrips';
    const strips = [
      { title: 'Popular This Week', works: [...window.AC_WORKS].sort((a, b) => b.likes - a.likes).slice(0, 10) },
      { title: 'New Deviations', works: [...window.AC_WORKS].sort((a, b) => b.id - a.id).slice(0, 10) },
    ];
    strips.forEach(strip => {
      const sec = document.createElement('div');
      sec.className = 'sec';
      const hd = document.createElement('div');
      hd.className = 'sec-hd-row';
      hd.innerHTML = `<span class="sec-hd-label">${strip.title}</span><a class="sec-see-all" href="browse.html">See All</a>`;
      sec.appendChild(hd);
      const scroll = document.createElement('div');
      scroll.className = 'hscroll';
      strip.works.forEach(work => {
        const card = document.createElement('div');
        card.className = 'hscroll-card';
        const artist = window.AC.getArtist(work.artistId);
        const fn = window.DRAW_FNS[work.style] || window.DRAW_FNS.space;
        const cv = document.createElement('canvas');
        cv.width = 200; cv.height = 130;
        drawOn(cv, fn);
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
        card.addEventListener('click', () => window.AC.openWork(work.id));
        scroll.appendChild(card);
      });
      sec.appendChild(scroll);
      container.appendChild(sec);
    });
    const divider = document.createElement('div');
    divider.className = 'explore-divider';
    divider.innerHTML = `<span>All Deviations</span>`;
    container.appendChild(divider);
    main.insertBefore(container, main.firstChild);
  }

  /* Initial render */
  renderGrid();
});
