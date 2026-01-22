# 🚀 Adamas University Entrepreneurship Club Website

A modern, professional website for the Adamas University Entrepreneurship Club that embodies innovation, leadership, and startup culture.

![Adamas University Entrepreneurship Club Logo](assets/logo.png)

## ✨ Features

- **🎬 Automatic Hero Slider** - Full-screen image carousel with smooth transitions
- **📱 Fully Responsive** - Perfect display on mobile, tablet, and desktop
- **🎨 Professional Design** - Clean, minimal UI with strict color scheme adherence
- **⚡ Smooth Animations** - Engaging hover effects and scroll animations
- **🔍 SEO Optimized** - Semantic HTML5 and proper meta tags
- **♿ Accessible** - WCAG 2.1 compliant with ARIA labels
- **📋 Contact Form** - Client-side validation ready for backend integration

## 🎨 Color Scheme

- **Primary:** `#90c54f` (Growth, Innovation)
- **Secondary:** `#366558` (Trust, Professionalism)
- **Text & Neutrals:** Dark grey, light grey, off-white

## 📁 Project Structure

```
ECLUB/
├── index.html          # Homepage with all main sections
├── about.html          # Mission, vision, objectives, team
├── contact.html        # Contact form and FAQs
├── css/
│   └── style.css       # Complete design system
├── js/
│   └── main.js         # All JavaScript functionality
└── assets/
    ├── logo.png        # Club logo
    └── hero/           # Hero slider images
        ├── hero1.png
        ├── hero2.png
        ├── hero3.png
        └── hero4.png
```

## 🚀 Quick Start

### Local Development

1. **Clone or download the project**
   ```bash
   cd c:\Users\USER\Desktop\ECLUB
   ```

2. **Start a local server**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js (http-server):
   ```bash
   npx http-server -p 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🎯 Pages

### 🏠 Homepage (`index.html`)
- Full-screen hero with automatic image slider
- About the Club section
- Featured Event showcase
- Initiatives grid (6 programs)
- Contact form
- Footer with social links

### 📖 About Us (`about.html`)
- Mission & Vision statements
- 6 Core Objectives
- What We Offer section
- Team placeholders (6 roles)
- Join CTA

### 📧 Contact (`contact.html`)
- Enhanced contact form
- Detailed contact information
- FAQ section (6 questions)
- Campus map placeholder

## 🛠️ Customization

### Update Club Logo
Replace `assets/logo.png` with your logo (recommended: 50px height)

### Change Hero Images
Replace images in `assets/hero/` folder:
- `hero1.png`, `hero2.png`, `hero3.png`, `hero4.png`
- Recommended size: 1920x1080 or higher

### Edit Text Content
All text is in HTML files and can be easily modified:
- **Headline:** `index.html` line 72
- **Contact Info:** Search for `eclub@adamasuniversity.ac.in`
- **Team Names:** `about.html` starting line 160

### Modify Colors
Edit CSS variables in `css/style.css` (lines 9-13):
```css
--primary-color: #90c54f;
--secondary-color: #366558;
```

### Update Social Media Links
Replace `#` placeholders in footer sections with actual URLs

## 🌐 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and folder
4. Your site will be live at `username.github.io/repo-name`

### Netlify
1. Drag and drop the `ECLUB` folder to Netlify
2. Site will be deployed instantly
3. Configure custom domain if needed

### Traditional Web Host
1. Upload files via FTP/SFTP
2. Maintain folder structure
3. Set `index.html` as the default page

## 📋 Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Flexbox, Grid, Custom Properties
- **JavaScript (ES6)** - Vanilla JS, no dependencies
- **Google Fonts** - Inter & Poppins
- **Font Awesome 6.4** - Professional icons

## ✅ Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🎓 Features Implemented

### Header & Navigation
- ✅ Sticky header with scroll effect
- ✅ Mobile hamburger menu
- ✅ Active link indicators
- ✅ Smooth scrolling

### Hero Section
- ✅ Full viewport height (100vh)
- ✅ Automatic image slider (5s intervals)
- ✅ Fade transitions
- ✅ CTA buttons

### Content Sections
- ✅ About with icon highlights
- ✅ Featured event showcase
- ✅ Initiatives grid
- ✅ Contact form with validation
- ✅ Footer with social links

### Interactions
- ✅ Hover animations on cards
- ✅ Button hover effects
- ✅ Scroll-triggered animations
- ✅ Form validation

## 📞 Support & Contact

For issues or questions about this website:
- Email: eclub@adamasuniversity.ac.in
- Phone: +91 (033) 2437-9999

## 📄 License

© 2026 Adamas University Entrepreneurship Club. All rights reserved.

---

**Built with ❤️ for the Adamas University Entrepreneurship Club**

*Empowering the next generation of entrepreneurs through innovation, collaboration, and leadership development.*
