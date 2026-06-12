// ===========================
//  MANGA DATA
// ===========================
const mangaList = [
  {
    id: 1,
    title: "Futari Bus",
    cover: "https://mangadex.org/covers/25e1d17b-6a4d-4698-a4f6-bf53460c10af/0fc34ab4-a172-4db0-9cbc-893380685a58.jpg",
    kanji: "二人バス",
    gradient: ["#1a3a6e", "#1a6fd4"],
    genres: ["Romance", "Comedy", "School Life", "Slice Of Life"],
    latestChap: "Chap 29",
    views: "0",
    isNew: true,
    url: "index"
  },
  {
    id: 2,
    title: "Osananananajimi",
    cover: "https://mangadex.org/covers/8573d280-7f60-411d-b146-c97dca3c62f2/e20232c3-dca7-40f2-a51a-3e98bb850b55.jpg",
    kanji: "幼な なな なじみ",
    gradient: ["#3a1a2e", "#a0245e"],
    genres: ["Romance", "Comedy", "School Life", "Slice Of Life"],
    latestChap: "Chap 22",
    views: "0",
    isNew: true,
    url: "#"
  },
  // {
  //   id: 3,
  //   title: "Kurayami Senshi",
  //   cover: null,
  //   kanji: "暗",
  //   gradient: ["#1a1a0a", "#5a4a10"],
  //   genres: ["Action", "Fantasy"],
  //   latestChap: "Chap 210",
  //   views: "8.7M",
  //   isNew: false,
  //   url: "#"
  // },
  // {
  //   id: 4,
  //   title: "Sora no Tobira",
  //   cover: null,
  //   kanji: "空",
  //   gradient: ["#0a2a3a", "#0a7a9a"],
  //   genres: ["Supernatural", "Fantasy"],
  //   latestChap: "Chap 33",
  //   views: "1.2M",
  //   isNew: true,
  //   url: "#"
  // },
  // {
  //   id: 5,
  //   title: "Akatsuki no Hime",
  //   cover: null,
  //   kanji: "暁",
  //   gradient: ["#3a1010", "#c0302a"],
  //   genres: ["Action", "Romance"],
  //   latestChap: "Chap 98",
  //   views: "5.5M",
  //   isNew: false,
  //   url: "#"
  // },
  // {
  //   id: 6,
  //   title: "Midori no Kaze",
  //   cover: null,
  //   kanji: "緑",
  //   gradient: ["#0a2a10", "#1a8a3a"],
  //   genres: ["Romance", "Supernatural"],
  //   latestChap: "Chap 71",
  //   views: "2.3M",
  //   isNew: false,
  //   url: "#"
  // },
  // {
  //   id: 7,
  //   title: "Tetsu no Ryuu",
  //   cover: null,
  //   kanji: "竜",
  //   gradient: ["#1a1a2e", "#3a3a8e"],
  //   genres: ["Action", "Fantasy"],
  //   latestChap: "Chap 145",
  //   views: "9.1M",
  //   isNew: false,
  //   url: "#"
  // },
  // {
  //   id: 8,
  //   title: "Yuki Musume",
  //   cover: null,
  //   kanji: "雪",
  //   gradient: ["#1a2a3a", "#3a6a9a"],
  //   genres: ["Romance", "Supernatural"],
  //   latestChap: "Chap 22",
  //   views: "780K",
  //   isNew: true,
  //   url: "#"
  // },
  // {
  //   id: 9,
  //   title: "Honoo no Ken",
  //   cover: null,
  //   kanji: "炎",
  //   gradient: ["#3a1a0a", "#d0601a"],
  //   genres: ["Action", "Fantasy"],
  //   latestChap: "Chap 312",
  //   views: "18.2M",
  //   isNew: false,
  //   url: "#"
  // },
  // {
  //   id: 10,
  //   title: "Tsuki no Kagami",
  //   cover: null,
  //   kanji: "月",
  //   gradient: ["#1a1a2a", "#4a4a7a"],
  //   genres: ["Supernatural", "Romance"],
  //   latestChap: "Chap 67",
  //   views: "4.4M",
  //   isNew: false,
  //   url: "#"
  // },
];

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
function initFilter() {
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
  renderGrid(mangaList);
  initFilter();
  document.getElementById('toggleBtn').addEventListener('click', toggleTheme);
});