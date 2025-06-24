const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 5000); 

const animatedElements = document.querySelectorAll('.animate-ready');

function animateOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  animatedElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add('animate-visible');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);


const searchInput = document.getElementById('searchInput');
const catalogItems = document.querySelectorAll('.catalog-item');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    catalogItems.forEach(item => {
      const subject = item.textContent.toLowerCase();
      item.style.display = subject.includes(query) ? 'block' : 'none';
    });
  });
}

const sortByLevel = (ascending = true) => {
  const catalog = document.querySelector('.catalog');
  const itemsArray = Array.from(catalogItems);

  itemsArray.sort((a, b) => {
    const levelA = a.dataset.level || '';
    const levelB = b.dataset.level || '';

    return ascending
      ? levelA.localeCompare(levelB)
      : levelB.localeCompare(levelA);
  });

  itemsArray.forEach(item => catalog.appendChild(item));
};

const nextBtn = document.querySelector('.next-slide');
const prevBtn = document.querySelector('.prev-slide');

if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });
}

const sortSelect = document.getElementById('sortSelect');

if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    const catalog = document.querySelector('.catalog');
    const itemsArray = Array.from(catalogItems);

    if (sortBy) {
      itemsArray.sort((a, b) => {
        const aVal = a.dataset[sortBy]?.toLowerCase() || '';
        const bVal = b.dataset[sortBy]?.toLowerCase() || '';
        return aVal.localeCompare(bVal);
      });
      itemsArray.forEach(item => catalog.appendChild(item));
    }
  });
}


const itemsPerPage = 2;
const paginationContainer = document.getElementById('pagination');

function showPage(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  catalogItems.forEach((item, index) => {
    item.style.display = index >= start && index < end ? '' : 'none';
  });

  document.querySelectorAll('.pagination button').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.textContent) === page) btn.classList.add('active');
  });
}

function setupPagination() {
  const pageCount = Math.ceil(catalogItems.length / itemsPerPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === 1) btn.classList.add('active');
    btn.addEventListener('click', () => showPage(i));
    paginationContainer.appendChild(btn);
  }

  showPage(1);
}

function updatePaginationAfterSearch() {
  const visibleItems = Array.from(catalogItems).filter(item => item.style.display !== 'none');
  const totalVisible = visibleItems.length;

  const pageCount = Math.ceil(totalVisible / itemsPerPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === 1) btn.classList.add('active');
    btn.addEventListener('click', () => {
      visibleItems.forEach((item, index) => {
        item.style.display = (index >= (i - 1) * itemsPerPage && index < i * itemsPerPage) ? '' : 'none';
      });

      document.querySelectorAll('.pagination button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    paginationContainer.appendChild(btn);
  }

  // Показываем первую страницу по умолчанию
  visibleItems.forEach((item, index) => {
    item.style.display = index < itemsPerPage ? '' : 'none';
  });
}

window.addEventListener('load', setupPagination);

// Обновляем пагинацию при поиске
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    catalogItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });

    updatePaginationAfterSearch();
  });
}

  const mainImage = document.querySelector('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnails img');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImage.src = thumb.src;
    });
  });

  const reviewForm = document.getElementById('reviewForm');
  const nameInput = document.getElementById('nameInput');
  const messageInput = document.getElementById('messageInput');
  const reviewsList = document.getElementById('reviewsList');

  const STORAGE_KEY = 'ege-math-reviews';

  function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    reviewsList.innerHTML = '';

    reviews.forEach(({ name, message }) => {
      const div = document.createElement('div');
      div.classList.add('review');
      div.innerHTML = `<strong>${name}</strong><p>${message}</p>`;
      reviewsList.appendChild(div);
    });
  }

  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) return;

    const newReview = { name, message };
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    reviews.push(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

    nameInput.value = '';
    messageInput.value = '';
    loadReviews();
  });

  window.addEventListener('DOMContentLoaded', loadReviews);

  