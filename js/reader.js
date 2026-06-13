let pages = [];
let currentPage = 0;
let mode = 'scroll'; // 'scroll' | 'page'

// ===========================
//  THEME
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
//  MODE
// ===========================
function setMode(m) {
  mode = m;
  localStorage.setItem('reader-mode', m);

  document.getElementById('readerScroll').style.display = m === 'scroll' ? 'block' : 'none';
  document.getElementById('readerPage').style.display   = m === 'page'   ? 'flex'  : 'none';

  document.getElementById('modeScroll').classList.toggle('active', m === 'scroll');
  document.getElementById('modePage').classList.toggle('active', m === 'page');

  if (m === 'page') renderPageMode();
}

// ===========================
//  SCROLL MODE
// ===========================
function renderScrollMode() {
  document.getElementById('scrollPages').innerHTML = pages.map(p =>
    `<img src="${p.image_url}" alt="Trang ${p.page_num}" loading="lazy">`
  ).join('');
}

// ===========================
//  PAGE MODE
// ===========================
function renderPageMode() {
  if (!pages.length) return;
  const p = pages[currentPage];
  document.getElementById('pageImg').src = p.image_url;
  document.getElementById('pageCounter').textContent = `${currentPage + 1} / ${pages.length}`;
  document.getElementById('prevBtn').disabled = currentPage === 0;
  document.getElementById('nextBtn').disabled = currentPage === pages.length - 1;
}

function goToPage(n) {
  if (n < 0 || n >= pages.length) return;
  currentPage = n;
  renderPageMode();
}

// ===========================
//  INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  document.getElementById('toggleBtn').addEventListener('click', toggleTheme);

  // Mode buttons
  document.getElementById('modeScroll').addEventListener('click', () => setMode('scroll'));
  document.getElementById('modePage').addEventListener('click', () => setMode('page'));

  // Restore mode
  const savedMode = localStorage.getItem('reader-mode') || 'scroll';
  
  // Nav buttons
  document.getElementById('prevBtn').addEventListener('click', () => goToPage(currentPage - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goToPage(currentPage + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (mode !== 'page') return;
    if (e.key === 'ArrowRight') goToPage(currentPage + 1);
    if (e.key === 'ArrowLeft')  goToPage(currentPage - 1);
  });

  // Fetch data
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get('chapter_id');
  const slug = params.get('slug');

  fetch(`/api/reader?chapter_id=${chapterId}`)
    .then(r => r.json())
    .then(data => {
      pages = data;
      const first = data[0];

      // Navbar
      document.title = `Chap ${first.chapter_num} - ${first.manga_title} - Samcomic`;
      document.getElementById('mangaTitleNav').textContent = first.manga_title;
      document.getElementById('backBtn').href = `title?slug=${first.url_slug}`;
      document.getElementById('chapterNav').textContent = `Chap ${first.chapter_num}${first.chapter_title ? ' — ' + first.chapter_title : ''}`;

      // Render
      renderScrollMode();
      setMode(savedMode);
    })
    .catch(err => {
      console.error(err);
    });
});