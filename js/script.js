// ===========================
//  STATE
// ===========================
let sortAsc = false;
let currentQuery = '';
let chaptersData = [];

// ===========================
//  RENDER
// ===========================
function renderChapters(list) {
  const el = document.getElementById('chapList');

  if (!list.length) {
    el.innerHTML = '<div class="empty-msg">Không tìm thấy chương nào.</div>';
    return;
  }

  el.innerHTML = list.map(c => `
    <a class="chapter-item${c.isNew ? ' is-new' : ''}" href="#">
      <span class="chap-num">Chap ${c.num}</span>
      <span class="chap-title">${c.title}</span>
      ${c.isNew ? '<span class="chap-new">New</span>' : ''}
      <span class="chap-views">
        <i class="ti ti-eye" aria-hidden="true" style="font-size:12px"></i>${c.views}
      </span>
      <span class="chap-date">${c.date}</span>
    </a>
  `).join('');
}

// ===========================
//  FILTER & SORT
// ===========================
function applySort() {
  const filtered = chaptersData.filter(c =>
    c.title.toLowerCase().includes(currentQuery.toLowerCase()) ||
    String(c.num).includes(currentQuery)
  );
  filtered.sort((a, b) => sortAsc ? a.num - b.num : b.num - a.num);
  renderChapters(filtered);
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

  const slug = new URLSearchParams(window.location.search).get('slug');

  fetch(`/api/title?slug=${slug}`)
    .then(r => r.json())
    .then(data => {
      const { manga, chapters } = data;

      // Cập nhật thông tin manga
      document.title = `${manga.title} - Samcomic`;
      document.querySelector('.manga-title').textContent = manga.title;
      document.querySelector('.manga-alt').textContent = manga.kanji || '';
      document.querySelector('.desc-text').textContent = manga.description || '';

      // Map chapters
      chaptersData = chapters.map(c => ({
        num: c.chapter_num,
        title: c.title,
        date: new Date(c.published_at).toLocaleDateString('vi-VN'),
        views: c.views >= 1000 ? (c.views / 1000).toFixed(0) + 'K' : String(c.views),
        isNew: (new Date() - new Date(c.published_at)) / 86400000 <= 7
      }));

      applySort();

      // Search
      document.getElementById('chapSearch').addEventListener('input', (e) => {
        currentQuery = e.target.value;
        applySort();
      });

      // Sort toggle
      document.getElementById('sortBtn').addEventListener('click', () => {
        sortAsc = !sortAsc;
        document.getElementById('sortLabel').textContent = sortAsc ? 'Cũ nhất' : 'Mới nhất';
        applySort();
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById('chapList').innerHTML = '<div class="empty-msg">Lỗi tải dữ liệu</div>';
    });
});