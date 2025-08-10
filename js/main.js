// منو یا اسکرول نرم برای لینک‌ها
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });

// small interactivity
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', ()=>{
  if(mobileMenu.classList.contains('hidden')) mobileMenu.classList.remove('hidden');
  else mobileMenu.classList.add('hidden');
});