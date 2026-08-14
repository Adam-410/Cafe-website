/* ============================================================
   Masalsı Café — script.js
   Vanilla JS — no dependencies
   ============================================================ */

'use strict';

/* ──────────────── UTILITY ──────────────── */

/**
 * Returns true if the user prefers reduced motion.
 */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ──────────────── 1. STICKY NAV ──────────────── */
(function initStickyNav() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ──────────────── 2. SMOOTH ANCHOR SCROLLING ──────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });
})();

/* ──────────────── 3. MOBILE DRAWER ──────────────── */
(function initMobileDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const overlay   = document.getElementById('drawer-overlay');
  const closeBtn  = document.getElementById('drawer-close');

  if (!hamburger || !drawer) return;

  const siteHeader = document.querySelector('.site-header');

  const openDrawer = () => {
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (siteHeader) siteHeader.classList.add('menu-open');
    closeBtn.focus();
  };

  const closeDrawer = () => {
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (siteHeader) siteHeader.classList.remove('menu-open');
    hamburger.focus();
  };

  hamburger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close drawer on nav link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });

  // Trap focus inside drawer when open
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = drawer.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

/* ──────────────── 4. HERO PARALLAX ──────────────── */
(function initHeroParallax() {
  if (prefersReducedMotion()) return;

  const bg = document.querySelector('.hero-bg');
  if (!bg) return;

  // Only apply parallax on desktop (>1024px) — matches CSS disable rule
  const desktopMQ = window.matchMedia('(min-width: 1025px)');

  const onScroll = () => {
    if (!desktopMQ.matches) return; // skip on tablet/mobile
    bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  };

  // Reset transform when switching to mobile
  desktopMQ.addEventListener('change', () => {
    if (!desktopMQ.matches) bg.style.transform = '';
  });

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ──────────────── 5. INTERSECTION OBSERVER — SCROLL REVEAL ──────────────── */
(function initScrollReveal() {
  if (prefersReducedMotion()) {
    // Make all reveals instantly visible
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ──────────────── 6. MENU TABS & SUB-TABS ──────────────── */
(function initMenuTabs() {

  /* ---- Main tabs (İçecekler / Yiyecekler) ---- */
  const mainTabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels   = document.querySelectorAll('.tab-panel');

  mainTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      mainTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel) activePanel.classList.add('active');

      // Reset sub-tab to first in new panel
      if (activePanel) {
        const firstSub = activePanel.querySelector('.sub-tab');
        if (firstSub) firstSub.click();
      }
    });

    // Keyboard navigation for tab list
    btn.addEventListener('keydown', e => {
      const tabs = [...mainTabBtns];
      const idx  = tabs.indexOf(e.currentTarget);
      if (e.key === 'ArrowRight') { tabs[(idx + 1) % tabs.length].focus(); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { tabs[(idx - 1 + tabs.length) % tabs.length].focus(); e.preventDefault(); }
    });
  });

  /* ---- Sub-tabs ---- */
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const subBtns = panel.querySelectorAll('.sub-tab');
    const cards   = panel.querySelectorAll('.menu-card');
    const io      = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );

    const showCategory = (category) => {
      cards.forEach(card => {
        const match = card.dataset.category === category;
        card.style.display = match ? '' : 'none';

        // Re-trigger reveal animation for newly shown cards
        if (match && !prefersReducedMotion()) {
          card.classList.remove('visible');
          // Small delay so the Observer sees them entering viewport
          requestAnimationFrame(() => io.observe(card));
        }
      });
    };

    subBtns.forEach(sub => {
      sub.addEventListener('click', () => {
        subBtns.forEach(s => s.classList.remove('active'));
        sub.classList.add('active');
        showCategory(sub.dataset.sub);
      });
    });

    // Activate the first sub-tab by default
    if (subBtns.length > 0) subBtns[0].click();
  });
})();

/* ──────────────── 7. GALLERY LIGHTBOX ──────────────── */
(function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');
  const galleryItems = [...document.querySelectorAll('.gallery-item[data-src]')];

  if (!lightbox || galleryItems.length === 0) return;

  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const item = galleryItems[index];
    lbImg.src = item.dataset.src || '';
    lbImg.alt = item.getAttribute('aria-label') || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };

  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    galleryItems[currentIndex]?.focus();
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

/* ──────────────── 8. TESTIMONIALS CAROUSEL ──────────────── */
(function initTestimonialsCarousel() {
  const cards   = [...document.querySelectorAll('.testimonial-card')];
  const dots    = [...document.querySelectorAll('.dot')];
  const carousel = document.getElementById('testimonials-carousel');
  if (cards.length === 0) return;

  let current  = 0;
  let timer    = null;

  const goTo = (index) => {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-current', 'false');

    current = (index + cards.length) % cards.length;

    cards[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-current', 'true');
  };

  const startAutoPlay = () => {
    if (prefersReducedMotion()) return;
    timer = setInterval(() => goTo(current + 1), 5000);
  };

  const stopAutoPlay = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      stopAutoPlay();
      startAutoPlay(); // restart timer after manual interaction
    });
  });

  // Pause on hover
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  // Touch/swipe support for mobile
  let touchStartX = 0;
  if (carousel) {
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        stopAutoPlay();
        startAutoPlay();
      }
    }, { passive: true });
  }

  startAutoPlay();
})();

/* ──────────────── 9. CONTACT FORM ──────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  const validateField = (field) => {
    const val = field.value.trim();
    let valid = true;

    if (field.required && !val) valid = false;
    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) valid = false;

    field.classList.toggle('error', !valid);
    return valid;
  };

  // Validate on blur
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    let allValid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) return;

    // Simulate submission
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Gönderiliyor…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Rezervasyon Yap';
      if (success) {
        success.hidden = false;
        setTimeout(() => { success.hidden = true; }, 6000);
      }
    }, 1200);
  });
})();

/* ──────────────── 10. NEWSLETTER FORM ──────────────── */
(function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) return;

    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = '✓';
    input.value = '';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Katıl';
    }, 3000);
  });
})();

/* ──────────────── 11. LAZY LOAD IMAGES ──────────────── */
(function initLazyImages() {
  // All background images in menu cards and gallery already load via CSS.
  // For any <img> tags added later, use native lazy loading (already in markup).
  // This observer handles CSS background images by toggling a class:
  const lazyBgs = document.querySelectorAll('[data-bg]');
  if (lazyBgs.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url(${el.dataset.bg})`;
        io.unobserve(el);
      }
    });
  }, { rootMargin: '200px' });

  lazyBgs.forEach(el => io.observe(el));
})();
