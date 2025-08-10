// Fade-in on scroll
const previewSection = document.getElementById('project-preview');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      previewSection.classList.add('opacity-100');
      previewSection.classList.remove('opacity-0');
    }
  });
}, { threshold: 0.2 });

observer.observe(previewSection);