// Dynamic Blog System - Loads articles from JSON file
class BlogManager {
  constructor() {
    this.articles = [];
    this.loadingElement = document.getElementById('loadingState');
    this.errorElement = document.getElementById('errorState');
    this.container = document.getElementById('articlesContainer');
    this.countElement = document.getElementById('articleCount');
    
    this.init();
  }

  async init() {
    try {
      await this.loadArticles();
      this.renderArticles();
      this.updateStats();
    } catch (error) {
      this.showError();
      console.error('Error initializing blog:', error);
    }
  }

  async loadArticles() {
    try {
      // اضافه کردن timestamp برای جلوگیری از کش شدن فایل توسط گیت‌هاب
          const response = await fetch(`articles.json?v=${new Date().getTime()}`);  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.articles = await response.json();
      
      // Sort articles by date (newest first)
      this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
      
    } catch (error) {
      console.error('Error loading articles:', error);
      throw error;
    }
  }

  showLoading() {
    this.loadingElement.classList.remove('hidden');
    this.errorElement.classList.add('hidden');
  }

  hideLoading() {
    this.loadingElement.classList.add('hidden');
  }

  showError() {
    this.loadingElement.classList.add('hidden');
    this.errorElement.classList.remove('hidden');
    this.container.innerHTML = '';
  }

  renderArticles() {
    this.hideLoading();
    
    if (this.articles.length === 0) {
      this.container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-neutral-400">هنوز مقاله‌ای منتشر نشده است.</p>
        </div>
      `;
      return;
    }

    const articlesHTML = this.articles.map(article => this.createArticleHTML(article)).join('');
    this.container.innerHTML = articlesHTML;
    
    // Initialize fade-in animations
    this.initAnimations();  
  }

  createArticleHTML(article) {
    const tagsHTML = article.tags ? 
      article.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    
    const summary = article.summary || this.truncateText(article.content, 150);
    const iconSVG = this.getIconSVG(article.category || 'general');

    return `
      <article class="card-link fade-in">
        <a href="article.html?id=${article.id}" class="card block group">
          <div class="flex flex-col h-full">
            <div class="mb-4">
              <div class="flex items-center gap-3 mb-3">
                <div class="card-icon">
                  ${iconSVG}
                </div>
                <div class="text-xs text-red-400">${this.formatDate(article.date)}</div>
              </div>
              <h3 class="text-xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors duration-300">${article.title}</h3>
              <p class="text-neutral-400 text-sm leading-7">${summary}</p>
            </div>
            <div class="mt-auto">
              ${tagsHTML ? `<div class="flex flex-wrap gap-2 mb-4">${tagsHTML}</div>` : ''}
              <div class="flex items-center justify-between">
                <div class="text-sm text-neutral-500">خواندن مقاله</div>
                <svg class="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  getIconSVG(category) {
    const icons = {
      'ai': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>`,
      'computer-vision': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`,
      'robotics': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>`,
      'general': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`
    };
    
    return `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[category] || icons.general}</svg>`;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const persianMonths = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    
    const year = date.getFullYear();
    const month = persianMonths[date.getMonth()];
    const day = date.getDate();
    
    return `${year}/${month}/${day}`;
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  updateStats() {
    const count = this.articles.length;
    const countText = count === 0 ? '۰ مقاله فنی' : 
                     count === 1 ? '۱ مقاله فنی' : 
                     count < 10 ? `۰${count} مقاله فنی` : `${count} مقاله فنی`;
    
    this.countElement.textContent = countText;
  }

  initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('show');
          }, index * 150);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
      fadeObserver.observe(element);
    });
  }
}

// Global function for retry button
function loadArticles() {
  window.blogManager.init();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.blogManager = new BlogManager();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogManager;
}