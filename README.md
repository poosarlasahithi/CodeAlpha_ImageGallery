# ◈ Aperture — Premium Photography Gallery

> A production-quality, feature-rich image gallery built with **pure HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no dependencies, just clean code.

![Aperture Banner](https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80)

---

## 🚀 Live Preview

Open `index.html` directly in your browser — **no build step required**.

---

## ✨ Features

### Core Features
| Feature | Description |
|---|---|
| 🖼 **Masonry Grid** | Responsive CSS Grid with variable-height cards (Pinterest-style) |
| 🔍 **Live Search** | Debounced search by title & category — updates instantly |
| 🏷 **Category Filters** | 10 categories with smooth animated transitions |
| 💡 **Lightbox** | Full-screen image viewer with prev/next, keyboard, swipe |
| ♡ **Favorites** | Heart each image; persisted in `localStorage` |
| 📥 **Download** | Direct download from inside the lightbox |
| ⛶ **Fullscreen** | Native fullscreen API integration |

### UI / UX
| Feature | Description |
|---|---|
| 🌑 **Dark / Light Mode** | Smooth toggle, respects OS preference, saved to `localStorage` |
| 🎯 **Custom Cursor** | Glowing cursor with gallery-aware hover states |
| ✨ **Particle Canvas** | Floating particles animated with `requestAnimationFrame` |
| 🌊 **Hero Parallax** | Scroll + mouse-tilt parallax on the hero section |
| 📜 **Scroll Reveal** | AOS-style reveal animations without any library |
| 📊 **Animated Counters** | Eased counting animation triggered on viewport entry |
| 🍔 **Hamburger Menu** | Animated mobile nav with overlay |
| ↑ **Back to Top** | Pulsing button with smooth scroll |
| ═ **Scroll Progress** | Gradient progress bar at the top of the page |
| ⏳ **Loading Screen** | Logo animation + progress bar |

### Performance
| Feature | Description |
|---|---|
| 🦥 **Lazy Loading** | `IntersectionObserver`-based image lazy loading |
| ⚡ **Debounced Search** | Prevents excessive DOM updates |
| 🎞 **rAF Animations** | All animations use `requestAnimationFrame` |
| 📱 **Responsive Design** | 4-col → 2-col → 1-col at breakpoints |

### Accessibility
- Semantic HTML5 (`<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels on all interactive elements
- `aria-live` regions for dynamic content
- Keyboard navigation (Tab, Arrow keys, Escape)
- `:focus-visible` focus rings
- `prefers-color-scheme` detection

---

## 📁 Folder Structure

```
ImageGallery/
│
├── index.html        ← Main HTML (semantic, accessible)
├── style.css         ← All styling (CSS Variables, Grid, Animations)
├── script.js         ← All JavaScript (20 modules, ~500 lines)
│
└── README.md         ← This file
```

> **Note:** Images are loaded directly from [Unsplash](https://unsplash.com) via CDN URLs — no local image files needed.

---

## 🎨 Design System

### Color Palette
```css
--bg-primary:    #050816   /* Deep space navy */
--bg-secondary:  #0B1120   /* Dark navy */
--bg-tertiary:   #111827   /* Charcoal */
--accent-cyan:   #00E5FF   /* Electric cyan */
--accent-purple: #7C3AED   /* Royal purple */
--accent-pink:   #FF4D6D   /* Rose red */
--accent-blue:   #38BDF8   /* Sky blue */
```

### Typography
- **Outfit** — headings, UI elements (Google Fonts)
- **Poppins** — logo, stats, key labels (Google Fonts)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `←` `→` | Previous / Next image in lightbox |
| `Esc` | Close lightbox |
| `Tab` | Navigate interactive elements |

---

## 🛠 Technologies Used

- **HTML5** — Semantic markup, ARIA attributes
- **CSS3** — Custom Properties, Grid, Flexbox, Keyframes, Backdrop-Filter
- **JavaScript (ES6+)** — IntersectionObserver, requestAnimationFrame, localStorage, Canvas API

---

## 💡 JavaScript Modules

1. Loading Screen (progress animation)
2. Custom Cursor (mouse tracking + states)
3. Scroll Progress Bar
4. Navbar (hide/show + glass effect)
5. Particle Canvas (Canvas 2D API)
6. Hero Parallax + Mouse Tilt
7. Scroll Reveal (no library, IntersectionObserver)
8. Lazy Loading (IntersectionObserver)
9. Gallery Filter (category buttons)
10. Debounced Search
11. Lightbox (fullscreen, swipe, keyboard)
12. Favorites (localStorage)
13. Load More / Collapse
14. Animated Counters (eased rAF)
15. Contact Form Validation
16. Hamburger / Mobile Menu
17. Theme Toggle (dark/light)
18. Back to Top
19. Smooth Scroll
20. Active Nav Highlight

---

## 📸 Image Categories

`Nature` · `Mountains` · `Cars` · `Architecture` · `Animals` · `Travel` · `Food` · `Technology` · `People`

## 📄 License

This project was developed as part of the CodeAlpha Frontend Development Internship for educational purposes.

##🌐 Live Demo 
🚀 Try the App: vercel: https://code-alpha-image-gallery-virid.vercel.app/

##📂 GitHub Repository

 https://github.com/poosarlasahithi/CodeAlpha_ImageGallery
---

## 👩‍💻 Author

**Poosarla Sahithi** — Frontend Developer Intern  
Built as part of the **CodeAlpha** Internship Program

GitHub: https://github.com/poosarlasahithi
LinkedIn: www.linkedin.com/in/sahithi-poosarla-48667a371


