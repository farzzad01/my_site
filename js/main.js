// منو یا اسکرول نرم برای لینک‌ها
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });

// gallery interactivity
const galleryTrack = document.querySelector('.gallery-track');
let isPaused = false;

if (galleryTrack) {
  galleryTrack.addEventListener('mouseenter', () => {
    galleryTrack.style.animationPlayState = 'paused';
  });

  galleryTrack.addEventListener('mouseleave', () => {
    galleryTrack.style.animationPlayState = 'running';
  });

  // touch support for mobile
  let startX = 0;
  let scrollLeft = 0;

  galleryTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - galleryTrack.offsetLeft;
    scrollLeft = galleryTrack.scrollLeft;
    galleryTrack.style.animationPlayState = 'paused';
  });

  galleryTrack.addEventListener('touchmove', (e) => {
    if (!startX) return;
    const x = e.touches[0].pageX - galleryTrack.offsetLeft;
    const walk = (x - startX) * 2;
    galleryTrack.scrollLeft = scrollLeft - walk;
  });

  galleryTrack.addEventListener('touchend', () => {
    startX = 0;
    galleryTrack.style.animationPlayState = 'running';
  });
}

// animate progress bars on scroll
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    if (width) {
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 500);
    }
  });
}

// intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.id === 'stats') {
        animateProgressBars();
      }
    }
  });
}, observerOptions);

// observe stats section
const statsSection = document.getElementById('stats');
if (statsSection) {
  observer.observe(statsSection);
}

// small interactivity
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', ()=>{
  if(mobileMenu.classList.contains('hidden')) mobileMenu.classList.remove('hidden');
  else mobileMenu.classList.add('hidden');
});