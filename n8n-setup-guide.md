# راهنمای پیاده‌سازی سیستم بلاگ پویا با n8n

## فایل‌های ایجاد شده:

1. **blog-dynamic.html** - نسخه جدید بلاگ که از JSON بارگذاری می‌کند
2. **js/blog-dynamic.js** - مدیریت بارگذاری پویای مقالات
3. **articles.json** - دیتابیس JSON شامل تمام مقالات

## مراحل پیاده‌سازی n8n:

### ۱. ایجاد Workflow در n8n

برای ایجاد یک مقاله جدید، Workflow زیر را در n8n بسازید:

#### نودهای مورد نیاز:

1. **Schedule Trigger**
   - نوع: Cron Trigger
   - تنظیم: `0 9 * * *` (هر روز ساعت 9 صبح)

2. **OpenAI Node** (تولید محتوا)
   - Model: GPT-4
   - Prompt: Persian prompt for blog article generation
   - Output: Article content

3. **GitHub Node** (خواندن articles.json)
   - Action: Get File
   - Repository: your-repo
   - Path: articles.json
   - Branch: main

4. **Code Node** (پردازش JSON)
   - JavaScript code to add new article to existing array
   - Generate new ID, format date, add category/tags

5. **GitHub Node** (Commit تغییرات)
   - Action: Update File
   - Repository: your-repo
   - Path: articles.json
   - Message: "Add new blog article via n8n"

### ۲. کد JavaScript برای Code Node:

```javascript
// Get existing articles from previous node
const existingArticles = $('GitHub').first().json.content;

// Parse JSON content
const articles = JSON.parse(existingArticles);

// Generate new article data
const newArticle = {
  id: articles.length + 1,
  title: $json.title,
  content: $json.content,
  summary: $json.summary,
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  category: $json.category || 'general',
  tags: $json.tags || [],
  url: `blog-article-${articles.length + 1}.html`,
  readingTime: $json.readingTime || '5 min'
};

// Add to array
articles.push(newArticle);

// Sort by date (newest first)
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

return {
  json: articles,
  jsonString: JSON.stringify(articles, null, 2)
};
```

### ۳. تنظیمات GitHub:

**Personal Access Token نیاز دارید:**
1. GitHub Settings → Developer settings → Personal access tokens
2. scopes: `repo`, `user:email`
3. Token را در GitHub node وارد کنید

### ۴. کد OpenAI Prompt:

```
شما یک نویسنده فنی حرفه‌ای هستید. یک مقاله جدید برای بلاگ ایجاد کنید:

موضوع: {topic}
تکنولوژی‌های اصلی: {technologies}
سطح دشواری: {difficulty}

مطابق این ساختار پاسخ دهید:
{
  "title": "عنوان جذاب فارسی",
  "content": "محتوای کامل مقاله",
  "summary": "خلاصه ۲-۳ خطی",
  "category": "ai|computer-vision|robotics|general",
  "tags": ["tag1", "tag2", "tag3"],
  "readingTime": "6 min"
}

قوانین:
- مقاله باید ۸۰۰-۱۲۰۰ کلمه باشد
- سبک فنی و آموزشی
- شامل چالش‌ها و راهکارها
- زبان فارسی ساده و روان
```

### ۵. تست Workflow:

1. Workflow را فعال کنید
2. Manual trigger کنید
3. بررسی کنید که articles.json آپدیت می‌شود
4. سایت را باز کنید و مقاله جدید نمایش داده می‌شود

### ۶. بهبودهای اضافی:

#### اضافه کردن Auto-Deployment:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          echo "Deploying to GitHub Pages..."
          # Upload to GitHub Pages
```

#### Content Moderation:
قبل از Commit کردن، یک Manual Approval step اضافه کنید:

1. **Manual Approval Node** (قبل از GitHub commit)
2. Reviewer می‌تواند مقاله را تایید یا رد کند
3. در صورت تایید، آپدیت انجام می‌شود

#### Analytics Tracking:
مقالات خوانده شده را Track کنید:

```javascript
// در blog-dynamic.js
trackArticleView(articleId) {
  // Send to Google Analytics or custom tracking
  gtag('event', 'article_view', {
    'article_title': article.title,
    'article_id': article.id
  });
}
```

## مزایای این سیستم:

✅ **هزینه کمتر**: رایگان با GitHub Pages
✅ **سرعت بالا**: Static site با JSON
✅ **مقیاس‌پذیری**: می‌توانید حجم زیادی مقاله اضافه کنید
✅ **کنترل کامل**: ساختار و فرمت دلخواه
✅ **SEO-Friendly**: همه محتوا در JSON قابل ایندکس

## معایب:

⚠️ **حجم فایل**: با زیاد شدن مقالات، JSON سنگین می‌شود
⚠️ **پیچیدگی**: نیاز به تنظیم n8n و GitHub
⚠️ **بدون Admin Panel**: برای مدیریت دستی پیچیده

## راه‌حل برای مشکلات:

**اگر articles.json خیلی بزرگ شد:**
- Pagination در Frontend
- فایل جداگانه برای مقالات قدیمی
- Search indexing با Elasticsearch

**برای مدیریت بهتر:**
- اضافه کردن Admin Panel با React
- استفاده از Netlify CMS
- یا Sanity.io با Static export