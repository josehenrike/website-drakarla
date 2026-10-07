const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
}
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mobileMenu.hidden = isOpen;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 768px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const track = document.querySelector('.carousel-track');
if (track) {
  const slides = [...track.querySelectorAll('.result-slide')];
  const dots = [...document.querySelectorAll('[data-slide]')];
  const previous = document.querySelector('#results-prev');
  const next = document.querySelector('#results-next');
  const count = document.querySelector('.carousel-count');
  let current = 0;
  function syncCarousel() {
    current = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    dots.forEach((dot, index) => {
      if (index === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    count.textContent = `${current + 1} de ${slides.length}`;
  }
  function goToSlide(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({left: current * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => goToSlide(current - 1));
  next.addEventListener('click', () => goToSlide(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));
  track.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      goToSlide(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let scrollTimer;
  track.addEventListener('scroll', () => {clearTimeout(scrollTimer); scrollTimer = setTimeout(syncCarousel, 120);}, {passive: true});
  window.addEventListener('resize', () => {track.scrollTo({left: current * track.clientWidth, behavior: 'instant'}); syncCarousel();});
  syncCarousel();
}
