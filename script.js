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
