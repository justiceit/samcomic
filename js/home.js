// ===========================
//  GENRE TAG CLASS
// ===========================
const genreClass = {
  "Action":      "t-action",
  "Romance":     "t-action",
  "Supernatural":"t-genre",
  "Fantasy":     "t-demo",
};

// ===========================
//  RENDER
// ===========================
function renderGrid(list) {
  const grid = document.getElementById('mangaGrid');

  grid.innerHTML = list.map(m => {
    const coverStyle = `background: linear-gradient(160deg, ${m.gradient[0]} 0%, ${m.gradient[1]} 100%)`;
    const tagsHtml = m.genres.map(g =>
      `<span class="card-tag ${genreClass[g] || 't-genre'}">${g}</span>`
    ).join('');

    return `
      <a class="manga-card" href="${m.url}">
        <div class="card-cover" style="${coverStyle}">
          ${m.cover
            ? `<img class="card-cover-img" src="${m.cover}" alt="${m.title}">`
            : `<div class="card-cover-placeholder" style="${coverStyle}">
                <div class="card-cover-kanji">${m.kanji}</div>
                <div class="card-cover-name">${m.title.split(' ')[0]}</div>
               </div>`
          }
          ${m.isNew ? '<span class="card-badge-new">New</span>' : ''}
          <div class="card-latest">${m.latestChap}</div>
        </div>
        <div class="card-info">
          <div class="card-title">${m.title}</div>
          <div class="card-tags">${tagsHtml}</div>
          <div class="card-meta">
            <span><i class="ti ti-eye"></i> ${m.views}</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

// ===========================
//  FILTER
// ===========================
function initFilter(mangaList) {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const genre = btn.dataset.genre;
      const filtered = genre === 'all'
        ? mangaList
        : mangaList.filter(m => m.genres.includes(genre));
      renderGrid(filtered);
    });
  });
}

// ===========================
//  THEME TOGGLE
// ===========================
function toggleTheme() {
  const app = document.getElementById('app');
  app.dataset.theme = app.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('manga-theme', app.dataset.theme);
}

function loadTheme() {
  const saved = localStorage.getItem('manga-theme');
  if (saved) document.getElementById('app').dataset.theme = saved;
}

// ===========================
//  LOGO FALLBACK
// ===========================
function initLogo() {
  const img      = document.getElementById('logoImg');
  const fallback = document.getElementById('logoFallback');
  img.addEventListener('error', () => {
    img.style.display      = 'none';
    fallback.style.display = 'block';
  });
}

// ===========================
//  INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initLogo();
  document.getElementById('toggleBtn').addEventListener('click', toggleTheme);

  fetch('/api/manga')
    .then(r => r.json())
    .then(data => {
      const mangaList = data.map(m => ({
        id: m.id,
        title: m.title,
        kanji: m.kanji,
        cover: m.cover_url,
        gradient: [m.gradient_from, m.gradient_to],
        genres: m.genres,
        latestChap: `Chap ${m.total_chapters}`,
        views: m.views >= 1000000
          ? (m.views / 1000000).toFixed(1) + 'M'
          : m.views >= 1000 ? (m.views / 1000).toFixed(0) + 'K' : String(m.views),
        isNew: m.update_days <= 7,
        url: `title?slug=${m.url_slug}`
      }));

      renderGrid(mangaList);
      initFilter(mangaList);
    })
    .catch(err => {
      console.error(err);
      document.getElementById('mangaGrid').innerHTML = '<p>Lỗi tải dữ liệu</p>';
    });
});