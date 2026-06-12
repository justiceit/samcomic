// ===========================
//  STATE
// ===========================
let sortAsc = false;
let currentQuery = '';
let chaptersData = [];

// ===========================
//  RENDER CHAPTERS
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
//  HELPERS
// ===========================
function formatViews(v) {
  if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
  if (v >= 1000) return (v / 1000).toFixed(0) + 'K';
  return String(v);
}

function formatUpdated(d) {
  const days = Math.floor((new Date() - new Date(d)) / 86400000);
  if (days === 0) return 'hôm nay';
  if (days === 1) return 'hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days/7)} tuần trước`;
  if (days < 365) return `${Math.floor(days/30)} tháng trước`;
  return `${Math.floor(days/365)} năm trước`;
}

function statusVN(s) {
  return { ongoing: 'Đang tiến hành', complete: 'Hoàn thành', paused: 'Tạm ngưng' }[s] || s;
}

const genreTagClass = {
  'Action': 't-action', 'Shounen': 't-action',
  'Romance': 't-action', 'Comedy': 't-action',
  'Supernatural': 't-genre', 'Adventure': 't-genre',
  'Fantasy': 't-demo', 'Dark Fantasy': 't-demo',
  'School Life': 't-genre', 'Slice Of Life': 't-genre',
};

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

      // Title tab
      document.title = `${manga.title} - Samcomic`;

      // Cover
      const coverArt = document.getElementById('coverArt');
      if (manga.cover_url) {
        coverArt.style.backgroundImage = `url(${manga.cover_url})`;
        coverArt.style.backgroundSize = 'cover';
        coverArt.style.backgroundPosition = 'center';
        document.getElementById('coverKanji').style.display = 'none';
        document.getElementById('coverSub').style.display = 'none';
      } else {
        coverArt.style.background = `linear-gradient(160deg, ${manga.gradient_from}, ${manga.gradient_to})`;
        document.getElementById('coverKanji').textContent = manga.kanji || '';
        document.getElementById('coverSub').textContent = manga.title.split(' ')[0].toUpperCase();
      }

      // Hero info
      document.getElementById('mangaTitle').textContent = manga.title;
      document.getElementById('mangaAlt').textContent = manga.kanji || '';
      document.getElementById('mangaDesc').textContent = manga.description || '';

      // Tags
      document.getElementById('mangaTags').innerHTML = (manga.genres || []).map(g =>
        `<span class="tag ${genreTagClass[g] || 't-genre'}">${g}</span>`
      ).join('');

      // Meta
      document.getElementById('metaAuthor').textContent = manga.author || '—';
      document.getElementById('metaArtist').textContent = manga.artist || '—';
      document.getElementById('metaPublisher').textContent = manga.publisher || '—';
      document.getElementById('metaStatusText').textContent = statusVN(manga.status);
      document.getElementById('metaChapters').textContent = `${manga.total_chapters} chương`;
      document.getElementById('metaYear').textContent = manga.release_year || '—';

      // Stats bar
      document.getElementById('statChapters').textContent = manga.total_chapters;
      document.getElementById('statViews').textContent = formatViews(manga.views);
      document.getElementById('statFavorites').textContent = formatViews(manga.favorites || 0);
      document.getElementById('statRating').textContent = manga.rating;
      document.getElementById('statUpdated').textContent = formatUpdated(manga.updated_at);

      // Chapters
      chaptersData = chapters.map(c => ({
        num: c.chapter_num,
        title: c.title,
        date: new Date(c.published_at).toLocaleDateString('vi-VN'),
        views: formatViews(c.views),
        isNew: (new Date() - new Date(c.published_at)) / 86400000 <= 7
      }));

      applySort();

      // Search
      document.getElementById('chapSearch').addEventListener('input', (e) => {
        currentQuery = e.target.value;
        applySort();
      });

      // Sort
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