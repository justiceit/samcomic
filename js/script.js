// ===========================
//  DATA
// ===========================
const chapters = [
  { num: 187, title: "Lời thì thầm cuối cùng",              date: "03/06/2026", views: "48K",  isNew: true  },
  { num: 186, title: "Ranh giới giữa hai thế giới",          date: "27/05/2026", views: "71K",  isNew: true  },
  { num: 185, title: "Kẻ phản bội trong bóng tối",           date: "20/05/2026", views: "89K",  isNew: false },
  { num: 184, title: "Ngọn lửa thanh tẩy",                   date: "13/05/2026", views: "95K",  isNew: false },
  { num: 183, title: "Di sản của Shinigami đầu tiên",        date: "06/05/2026", views: "102K", isNew: false },
  { num: 182, title: "Hợp đồng máu",                         date: "29/04/2026", views: "88K",  isNew: false },
  { num: 181, title: "Đêm không trăng",                      date: "22/04/2026", views: "76K",  isNew: false },
  { num: 180, title: "Cổng địa ngục mở ra",                  date: "15/04/2026", views: "93K",  isNew: false },
  { num: 179, title: "Tiếng gọi từ cõi âm",                  date: "08/04/2026", views: "81K",  isNew: false },
  { num: 178, title: "Kiếm ma hiện hình",                    date: "01/04/2026", views: "87K",  isNew: false },
  { num: 177, title: "Người canh gác linh hồn",              date: "25/03/2026", views: "79K",  isNew: false },
  { num: 176, title: "Bức tường giữa sự sống và cái chết",   date: "18/03/2026", views: "84K",  isNew: false },
  { num: 175, title: "Ký ức bị phong ấn",                    date: "11/03/2026", views: "91K",  isNew: false },
  { num: 174, title: "Sức mạnh thức tỉnh",                   date: "04/03/2026", views: "97K",  isNew: false },
  { num: 173, title: "Trận chiến dưới vực thẳm",             date: "25/02/2026", views: "88K",  isNew: false },
];

// ===========================
//  STATE
// ===========================
let sortAsc     = false;
let currentQuery = '';

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
  const filtered = chapters.filter(c =>
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
  if (saved) {
    document.getElementById('app').dataset.theme = saved;
  }
}

// ===========================
//  LOGO FALLBACK
// ===========================
function initLogo() {
  const img      = document.getElementById('logoImg');
  const fallback = document.getElementById('logoFallback');

  img.addEventListener('error', () => {
    img.style.display     = 'none';
    fallback.style.display = 'block';
  });
}

// ===========================
//  INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initLogo();

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

  // Theme toggle
  document.getElementById('toggleBtn').addEventListener('click', toggleTheme);

  // Initial render
  applySort();
});