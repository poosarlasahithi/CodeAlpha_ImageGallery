/**
 * ══════════════════════════════════════════════════════════════════
 *  IMAGE GALLERY — script.js
 *  Premium Photography Gallery — Vanilla JavaScript
 *  Author: Sahithi | Built with pure HTML, CSS & JavaScript
 * ══════════════════════════════════════════════════════════════════
 *
 *  Modules:
 *   1.  Loading Screen
 *   2.  Custom Cursor
 *   3.  Scroll Progress Bar
 *   4.  Navbar Behavior (hide/show on scroll + glass)
 *   5.  Particle Canvas
 *   6.  Hero Parallax & Mouse Effect
 *   7.  Scroll Reveal Animations (AOS-style, no library)
 *   8.  Gallery — Lazy Loading
 *   9.  Gallery — Category Filter
 *   10. Gallery — Debounced Search
 *   11. Gallery — Lightbox (prev/next, keyboard, download, fullscreen)
 *   12. Gallery — Favorites (localStorage)
 *   13. Gallery — Load More
 *   14. Stats Counter Animation
 *   15. Contact Form Validation
 *   16. Hamburger / Mobile Menu
 *   17. Theme Toggle (dark/light, localStorage)
 *   18. Back-to-Top Button
 *   19. Smooth scroll for nav links
 *   20. Active nav highlight on scroll
 */

'use strict';

/* ─── Utility helpers ───────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

/* ══════════════════════════════════════════════════════════════════
   1. LOADING SCREEN
   ══════════════════════════════════════════════════════════════════ */
(function initLoader() {
  const screen = $('#loading-screen');
  const bar    = $('#loader-bar');
  if (!screen) return;

  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 18;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';

    if (progress === 100) {
      clearInterval(tick);
      setTimeout(() => {
        screen.classList.add('hidden');
        // Kick off reveal animations once loaded
        triggerScrollReveal();
      }, 400);
    }
  }, 120);
})();


/* (cursor removed — using native arrow cursor) */



/* ══════════════════════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR
   ══════════════════════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  const update = () => {
    const doc  = document.documentElement;
    const max  = doc.scrollHeight - doc.clientHeight;
    const pct  = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ══════════════════════════════════════════════════════════════════
   4. NAVBAR BEHAVIOR
   ══════════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  let lastY = 0;

  const update = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    // Hide navbar when scrolling down fast; show when scrolling up
    if (y > lastY + 5 && y > 300) {
      nav.classList.add('hidden-nav');
    } else if (y < lastY - 5 || y < 100) {
      nav.classList.remove('hidden-nav');
    }
    lastY = y;
  };
  window.addEventListener('scroll', update, { passive: true });
})();


/* ══════════════════════════════════════════════════════════════════
   5. PARTICLE CANVAS
   ══════════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = ['#00E5FF', '#7C3AED', '#38BDF8', '#FF4D6D'][Math.floor(Math.random() * 4)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', debounce(resize, 200));
  resize();

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  };
  loop();
})();


/* ══════════════════════════════════════════════════════════════════
   6. HERO PARALLAX & MOUSE EFFECT
   ══════════════════════════════════════════════════════════════════ */
(function initHeroParallax() {
  const heroContent = $('#hero-content');
  const hero = $('#hero');
  if (!heroContent || !hero) return;

  // Parallax on scroll
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroH = hero.offsetHeight;
    if (y < heroH) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity   = 1 - (y / (heroH * 0.8));
    }
  }, { passive: true });

  // Mouse tilt
  if (!window.matchMedia('(hover: hover)').matches) return;
  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const nx = ((e.clientX - left) / width  - 0.5) * 16;
    const ny = ((e.clientY - top)  / height - 0.5) * 10;
    heroContent.style.transform = `perspective(1000px) rotateX(${-ny}deg) rotateY(${nx}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
})();


/* ══════════════════════════════════════════════════════════════════
   7. SCROLL REVEAL ANIMATIONS (no external library)
   ══════════════════════════════════════════════════════════════════ */
function triggerScrollReveal() {
  const targets = $$('.reveal-on-scroll, .gallery-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    // Stagger gallery items
    if (el.classList.contains('gallery-item')) {
      el.style.transitionDelay = (i % 8) * 0.06 + 's';
    }
    io.observe(el);
  });
}
// Called once loading screen ends


/* ══════════════════════════════════════════════════════════════════
   8. LAZY LOADING
   ══════════════════════════════════════════════════════════════════ */
(function initLazyLoading() {
  const imgs = $$('img.lazy');
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all immediately
    imgs.forEach(img => loadImage(img));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => io.observe(img));
})();

function loadImage(img) {
  const src = img.dataset.src;
  if (!src) return;
  const tmp = new Image();
  tmp.onload = () => {
    img.src = src;
    img.classList.add('loaded');
  };
  tmp.onerror = () => {
    // Graceful fallback — keep placeholder
    img.classList.add('loaded');
  };
  tmp.src = src;
}


/* ══════════════════════════════════════════════════════════════════
   9. GALLERY — CATEGORY FILTER
   ══════════════════════════════════════════════════════════════════ */
let currentFilter = 'all';
let currentSearch = '';

const allItems   = $$('.gallery-item');
const noResults  = $('#no-results');

function applyGalleryFilter() {
  let count = 0;

  allItems.forEach(item => {
    const cat   = (item.dataset.category || '').toLowerCase();
    const title = (item.dataset.title    || '').toLowerCase();
    const matchCat    = currentFilter === 'all' || cat === currentFilter;
    const matchSearch = !currentSearch || title.includes(currentSearch) || cat.includes(currentSearch);
    const visible = matchCat && matchSearch;

    item.classList.toggle('hidden-item', !visible);
    item.classList.toggle('visible-item', visible);

    if (visible) {
      count++;
      // Reveal freshly shown items
      item.style.transitionDelay = '0s';
      item.classList.add('revealed');
    }
  });

  // No results message
  if (noResults) noResults.hidden = count > 0;

  // Update search count
  const countEl = $('#search-count');
  if (countEl) {
    countEl.textContent = currentSearch
      ? `${count} result${count !== 1 ? 's' : ''} found for "${currentSearch}"`
      : '';
  }
}

(function initFilter() {
  const filterBtns = $$('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilter = btn.dataset.filter;
      applyGalleryFilter();
    });
  });
})();


/* ══════════════════════════════════════════════════════════════════
   10. GALLERY — SEARCH (debounced)
   ══════════════════════════════════════════════════════════════════ */
(function initSearch() {
  const input = $('#search-input');
  const clear = $('#search-clear');
  if (!input) return;

  const doSearch = debounce(() => {
    currentSearch = input.value.trim().toLowerCase();
    clear.hidden = !currentSearch;
    applyGalleryFilter();
  }, 250);

  input.addEventListener('input', doSearch);

  if (clear) {
    clear.addEventListener('click', () => {
      input.value = '';
      currentSearch = '';
      clear.hidden = true;
      applyGalleryFilter();
      input.focus();
    });
  }
})();


/* ══════════════════════════════════════════════════════════════════
   11. LIGHTBOX
   ══════════════════════════════════════════════════════════════════ */
(function initLightbox() {
  const lightbox    = $('#lightbox');
  const lbImg       = $('#lightbox-img');
  const lbClose     = $('#lightbox-close');
  const lbPrev      = $('#lb-prev');
  const lbNext      = $('#lb-next');
  const lbTitle     = $('#lb-title');
  const lbBadge     = $('#lb-badge');
  const lbCounter   = $('#lb-counter');
  const lbBackdrop  = $('#lightbox-backdrop');
  const lbLoader    = $('#lightbox-loader');
  const lbFavBtn    = $('#lb-fav-btn');
  const lbDownload  = $('#lb-download');
  const lbFullscreen = $('#lb-fullscreen');
  if (!lightbox) return;

  let visibleItems  = [];  // currently visible (filtered) items
  let currentIndex  = 0;
  let isOpen        = false;

  // Build visible items list from currently visible gallery items
  function buildVisibleList() {
    visibleItems = allItems.filter(item => !item.classList.contains('hidden-item'));
  }

  // Open lightbox at given index
  function openLightbox(index) {
    buildVisibleList();
    if (!visibleItems.length) return;
    currentIndex = Math.max(0, Math.min(index, visibleItems.length - 1));
    isOpen = true;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    updateLightboxSlide();
  }

  // Update content
  function updateLightboxSlide() {
    const item  = visibleItems[currentIndex];
    if (!item) return;

    const card  = item.querySelector('.gallery-card');
    const src   = item.querySelector('img')?.dataset.src || item.querySelector('img')?.src;
    const title = item.dataset.title   || '';
    const cat   = item.dataset.category || '';
    const id    = currentIndex; // use index as unique id key

    // Show loader
    if (lbLoader) lbLoader.classList.remove('hidden');
    lbImg.style.opacity = '0';

    const tmp = new Image();
    tmp.onload = () => {
      lbImg.src = src;
      lbImg.alt = `${title} — ${cat} photography`;
      if (lbLoader) lbLoader.classList.add('hidden');
      lbImg.style.opacity = '1';
    };
    tmp.onerror = () => {
      lbImg.src = src; // attempt anyway
      if (lbLoader) lbLoader.classList.add('hidden');
      lbImg.style.opacity = '1';
    };
    tmp.src = src;

    if (lbTitle)   lbTitle.textContent = title;
    if (lbBadge)   lbBadge.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (lbCounter) lbCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;

    // Download link
    if (lbDownload) {
      lbDownload.href = src;
      lbDownload.setAttribute('download', `${title.replace(/\s+/g, '_')}.jpg`);
    }

    // Sync favorite button
    syncFavBtn(lbFavBtn, getLbId());
  }

  function getLbId() {
    const item = visibleItems[currentIndex];
    return item ? (item.querySelector('.favorite-btn')?.dataset.id || `lb_${currentIndex}`) : null;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    isOpen = false;
    if (document.fullscreenElement) document.exitFullscreen();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxSlide();
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxSlide();
  }

  // Bind buttons
  if (lbClose)    lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)     lbPrev.addEventListener('click', showPrev);
  if (lbNext)     lbNext.addEventListener('click', showNext);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!isOpen) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Touch / swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? showNext() : showPrev(); }
  }, { passive: true });

  // Fullscreen
  if (lbFullscreen) {
    lbFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        lightbox.requestFullscreen?.().catch(() => {});
        lbFullscreen.textContent = '⊠';
      } else {
        document.exitFullscreen?.();
        lbFullscreen.textContent = '⛶';
      }
    });
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) lbFullscreen.textContent = '⛶';
    });
  }

  // Favorite toggle in lightbox
  if (lbFavBtn) {
    lbFavBtn.addEventListener('click', () => {
      const id = getLbId();
      if (!id) return;
      toggleFavorite(id);
      syncFavBtn(lbFavBtn, id);
      // Also sync the card button
      const cardBtn = $(`[data-id="${id}"]`);
      if (cardBtn) syncFavBtn(cardBtn, id);
    });
  }

  // Open from gallery cards
  $$('.gallery-item').forEach((item, idx) => {
    const card    = item.querySelector('.gallery-card');
    const viewBtn = item.querySelector('.view-btn');

    const open = (e) => {
      e.stopPropagation();
      buildVisibleList();
      const visIdx = visibleItems.indexOf(item);
      if (visIdx >= 0) openLightbox(visIdx);
    };

    card?.addEventListener('click', open);
    viewBtn?.addEventListener('click', open);
  });

  // Expose for external use (e.g., keyboard)
  window.GalleryLightbox = { open: openLightbox, close: closeLightbox };
})();


/* ══════════════════════════════════════════════════════════════════
   12. FAVORITES — localStorage
   ══════════════════════════════════════════════════════════════════ */
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('aperture_favs') || '[]'); }
  catch { return []; }
}
function saveFavorites(favs) {
  try { localStorage.setItem('aperture_favs', JSON.stringify(favs)); } catch {}
}
function isFavorited(id) { return getFavorites().includes(id); }
function toggleFavorite(id) {
  const favs = getFavorites();
  const idx  = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else           favs.push(id);
  saveFavorites(favs);
  return idx < 0; // true = added
}
function syncFavBtn(btn, id) {
  if (!btn || !id) return;
  const fav = isFavorited(id);
  btn.classList.toggle('favorited', fav);
  btn.textContent = fav ? '♥' : '♡';
  btn.setAttribute('aria-label', fav ? 'Remove from favorites' : 'Add to favorites');
  btn.setAttribute('title', fav ? 'Remove from favorites' : 'Favorite');
}

// Init card favorite buttons
(function initFavorites() {
  $$('.gallery-item .favorite-btn').forEach(btn => {
    const id = btn.dataset.id;
    syncFavBtn(btn, id);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(id);
      syncFavBtn(btn, id);
      // Also sync lightbox btn if same image is open
      const lbFav = $('#lb-fav-btn');
      if (lbFav) {
        const lbId = $('#lb-title')?.textContent;
        // We match by data-id cross-reference
        syncFavBtn(lbFav, id);
      }

      // Heart burst animation
      const heart = document.createElement('span');
      heart.textContent = '♥';
      heart.style.cssText = `
        position:absolute; pointer-events:none; font-size:1.5rem;
        color:var(--accent-pink); z-index:100;
        animation:heartBurst 0.7s ease forwards;
        left:${btn.offsetLeft}px; top:${btn.offsetTop}px;
      `;
      btn.parentElement.style.position = 'relative';
      btn.parentElement.appendChild(heart);
      setTimeout(() => heart.remove(), 700);
    });
  });

  // Inject heart burst keyframe once
  if (!document.getElementById('heart-burst-style')) {
    const style = document.createElement('style');
    style.id = 'heart-burst-style';
    style.textContent = `
      @keyframes heartBurst {
        0%   { opacity:1; transform:scale(1) translateY(0); }
        50%  { opacity:1; transform:scale(1.8) translateY(-12px); }
        100% { opacity:0; transform:scale(1.2) translateY(-24px); }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ══════════════════════════════════════════════════════════════════
   13. GALLERY — LOAD MORE (simulate pagination)
   ══════════════════════════════════════════════════════════════════ */
(function initLoadMore() {
  const btn = $('#load-more-btn');
  if (!btn) return;

  // For demo purposes — toggles between showing 12 and all items
  const INITIAL_VISIBLE = 12;
  let expanded = false;

  // Initially hide items beyond 12
  allItems.forEach((item, i) => {
    if (i >= INITIAL_VISIBLE) {
      item.dataset.loadMore = 'hidden';
      item.style.display = 'none';
    }
  });

  btn.addEventListener('click', () => {
    expanded = !expanded;
    allItems.forEach((item, i) => {
      if (i >= INITIAL_VISIBLE) {
        if (expanded) {
          item.style.display = '';
          item.dataset.loadMore = 'visible';
          // Animate in
          setTimeout(() => {
            item.classList.add('revealed');
          }, (i - INITIAL_VISIBLE) * 50);
        } else {
          item.style.display = 'none';
          item.classList.remove('revealed');
          item.dataset.loadMore = 'hidden';
        }
      }
    });

    btn.innerHTML = expanded
      ? 'Show Less <span>↑</span>'
      : 'Load More Images <span>↓</span>';

    if (!expanded) {
      // Scroll back to gallery top
      $('#gallery')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();


/* ══════════════════════════════════════════════════════════════════
   14. STATISTICS COUNTER ANIMATION
   ══════════════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = $$('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 2200;
    const start    = performance.now();

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════════════════════════════
   15. CONTACT FORM VALIDATION
   ══════════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form    = $('#contact-form');
  if (!form) return;

  const nameEl  = $('#contact-name');
  const emailEl = $('#contact-email');
  const msgEl   = $('#contact-message');
  const submit  = $('#form-submit-btn');
  const success = $('#form-success');

  const nameErr  = $('#name-error');
  const emailErr = $('#email-error');
  const msgErr   = $('#message-error');

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const setError = (input, errEl, msg) => {
    if (errEl) errEl.textContent = msg;
    input.classList.toggle('error', !!msg);
    return !!msg;
  };

  function validate() {
    let hasError = false;
    hasError = setError(nameEl,  nameErr,  !nameEl.value.trim() ? 'Please enter your full name.' : '') || hasError;
    hasError = setError(emailEl, emailErr, !validateEmail(emailEl.value.trim()) ? 'Please enter a valid email address.' : '') || hasError;
    hasError = setError(msgEl,   msgErr,   !msgEl.value.trim() ? 'Please write a message.' : '') || hasError;
    return !hasError;
  }

  // Live validation on blur
  [nameEl, emailEl, msgEl].forEach(el => {
    el?.addEventListener('blur', () => {
      if (el === nameEl)  setError(nameEl,  nameErr,  !nameEl.value.trim() ? 'Please enter your full name.' : '');
      if (el === emailEl) setError(emailEl, emailErr, !validateEmail(emailEl.value.trim()) ? 'Please enter a valid email address.' : '');
      if (el === msgEl)   setError(msgEl,   msgErr,   !msgEl.value.trim() ? 'Please write a message.' : '');
    });
    el?.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        if (el === nameEl  && el.value.trim()) setError(nameEl, nameErr, '');
        if (el === emailEl && validateEmail(el.value.trim())) setError(emailEl, emailErr, '');
        if (el === msgEl   && el.value.trim()) setError(msgEl, msgErr, '');
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate submission
    const origText = submit.innerHTML;
    submit.innerHTML = '<span class="btn-text">Sending…</span>';
    submit.disabled = true;

    setTimeout(() => {
      submit.innerHTML = origText;
      submit.disabled = false;
      form.reset();
      if (success) { success.hidden = false; setTimeout(() => success.hidden = true, 5000); }
    }, 1800);
  });
})();


/* ══════════════════════════════════════════════════════════════════
   16. HAMBURGER / MOBILE MENU
   ══════════════════════════════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ══════════════════════════════════════════════════════════════════
   17. THEME PICKER (5 themes + localStorage)
   ══════════════════════════════════════════════════════════════════ */
(function initThemePicker() {
  const THEMES = [
    { id: 'dark-modern',   label: 'Dark Modern'   },
    { id: 'light-minimal', label: 'Light Minimal'  },
    { id: 'neon-cyberpunk',label: 'Neon Cyberpunk' },
    { id: 'nature',        label: 'Nature'         },
    { id: 'sunset',        label: 'Sunset'         },
  ];

  const wrapper    = $('#theme-picker-wrapper');
  const toggleBtn  = $('#theme-toggle');
  const panel      = $('#theme-panel');
  const dotEl      = $('#theme-toggle-dot');
  const labelEl    = $('#theme-toggle-label');
  const options    = $$('.theme-option');
  const body       = document.body;

  if (!wrapper || !toggleBtn || !panel) return;

  /* --- Apply a theme ----------------------------------------------- */
  function applyTheme(themeId, persist = true) {
    // Validate
    const valid = THEMES.find(t => t.id === themeId);
    if (!valid) themeId = 'dark-modern';

    // Set attribute (CSS variable blocks key off this)
    body.setAttribute('data-theme', themeId);

    // Update button label
    if (labelEl) labelEl.textContent = valid ? valid.label : 'Dark Modern';

    // Update active states on option buttons
    options.forEach(opt => {
      const isActive = opt.dataset.theme === themeId;
      opt.classList.toggle('active', isActive);
      opt.setAttribute('aria-selected', isActive);
    });

    // Save
    if (persist) localStorage.setItem('gallery_theme', themeId);

    // ARIA on trigger
    toggleBtn.setAttribute('aria-label', `Theme: ${valid ? valid.label : themeId}. Click to change.`);
  }

  /* --- Toggle panel ------------------------------------------------- */
  function openPanel() {
    wrapper.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
  }
  function closePanel() {
    wrapper.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    wrapper.classList.contains('open') ? closePanel() : openPanel();
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!wrapper.contains(e.target)) closePanel();
  });

  // Keyboard: Escape closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && wrapper.classList.contains('open')) {
      closePanel();
      toggleBtn.focus();
    }
  });

  // Option click
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      applyTheme(opt.dataset.theme);
      closePanel();
      toggleBtn.focus();
    });
  });

  /* --- Load saved / OS preference ---------------------------------- */
  const saved = localStorage.getItem('gallery_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark-modern' : 'light-minimal');
  applyTheme(initial, false); // don't re-save on load
})();


/* ══════════════════════════════════════════════════════════════════
   18. BACK TO TOP BUTTON
   ══════════════════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < 400;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ══════════════════════════════════════════════════════════════════
   19. SMOOTH SCROLL FOR NAV LINKS
   ══════════════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ══════════════════════════════════════════════════════════════════
   20. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ══════════════════════════════════════════════════════════════════ */
(function initActiveNavHighlight() {
  const sections = $$('section[id], footer[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive
            ? 'var(--accent-cyan)'
            : '';
          if (isActive) {
            link.style.color = 'var(--accent-cyan)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });

  sections.forEach(sec => io.observe(sec));
})();


/* ══════════════════════════════════════════════════════════════════
   INIT — Apply gallery on first load
   ══════════════════════════════════════════════════════════════════ */
// Make all items visible to start (filter + load-more handle visibility)
document.addEventListener('DOMContentLoaded', () => {
  applyGalleryFilter();
});

console.log(
  '%c◈ IMAGE GALLERY%c Loaded Successfully ✓\n%cBuilt with HTML, CSS & Vanilla JavaScript',
  'color:#00E5FF;font-size:1.2rem;font-weight:700;',
  'color:#7C3AED;font-size:1.2rem;font-weight:700;',
  'color:#A0AEC0;font-size:0.85rem;'
);
