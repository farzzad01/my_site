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

// contact form handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'در حال ارسال...';
    submitBtn.disabled = true;

    try {
      // Send to Telegram bot (you'll need to set up a bot and get the token/chat_id)
      const telegramMessage = `
📋 درخواست همکاری جدید

👤 نام: ${formData.name}
📧 ایمیل: ${formData.email}
📱 تلفن: ${formData.phone || 'مشخص نشده'}
🎯 نوع همکاری: ${formData.service}
💬 پیام: ${formData.message}

⏰ زمان: ${new Date().toLocaleString('fa-IR')}
      `;

      // For now, we'll use a simple approach - you can integrate with your backend
      // This is a placeholder - you'll need to implement actual sending
      console.log('Form data:', formData);
      console.log('Telegram message:', telegramMessage);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      formMessage.className = 'mt-4 text-sm text-green-400';
      formMessage.textContent = '✅ درخواست شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.';
      formMessage.classList.remove('hidden');

      // Reset form
      contactForm.reset();

    } catch (error) {
      console.error('Error sending form:', error);
      formMessage.className = 'mt-4 text-sm text-red-400';
      formMessage.textContent = '❌ خطا در ارسال درخواست. لطفاً دوباره تلاش کنید یا مستقیماً با ما تماس بگیرید.';
      formMessage.classList.remove('hidden');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// small interactivity
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', ()=>{
  if(mobileMenu.classList.contains('hidden')) mobileMenu.classList.remove('hidden');
  else mobileMenu.classList.add('hidden');
});