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

      e.preventDefault();

      const executeScroll = () => {
        if (targetId === '#top') {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
          return;
        }

        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        }
      };

      // Defer scroll dispatch slightly after drawer unlock & layout recalculation
      requestAnimationFrame(() => {
        setTimeout(executeScroll, 30);
      });
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
    
    // Prevent focus jump from cancelling scroll position
    hamburger.focus({ preventScroll: true });
  };

  hamburger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });

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

let refreshMenuCategoryFilter = () => {};
let refreshLightbox = () => {};

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
  refreshMenuCategoryFilter = () => {
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
            requestAnimationFrame(() => io.observe(card));
          } else if (match) {
            card.classList.add('visible');
          }
        });
      };

      subBtns.forEach(sub => {
        sub.onclick = () => {
          subBtns.forEach(s => s.classList.remove('active'));
          sub.classList.add('active');
          showCategory(sub.dataset.sub);
        };
      });

      // Maintain active sub-tab or default to first
      const activeSub = panel.querySelector('.sub-tab.active') || subBtns[0];
      if (activeSub) {
        activeSub.classList.add('active');
        showCategory(activeSub.dataset.sub);
      }
    });
  };

  refreshMenuCategoryFilter();
})();

/* ──────────────── 7. GALLERY LIGHTBOX ──────────────── */
(function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');

  if (!lightbox) return;

  let currentIndex = 0;
  let galleryItems = [];

  const openLightbox = (index) => {
    currentIndex = index;
    const item = galleryItems[index];
    if (!item) return;
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
    if (galleryItems.length === 0) return;
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  };

  const showNext = () => {
    if (galleryItems.length === 0) return;
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  };

  refreshLightbox = () => {
    galleryItems = [...document.querySelectorAll('.gallery-item[data-src]')];
    galleryItems.forEach((item, index) => {
      item.onclick = () => openLightbox(index);
    });
  };

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

  refreshLightbox();
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

/* ──────────────── 12. DYNAMIC CMS HYDRATION ──────────────── */
(function initCMSHydration() {
  if (!window.MasalsiCMS) return;

  function hydrateFromCMS() {
    const data = window.MasalsiCMS.getSiteData();
    if (!data) return;

    /* 1. Hero */
    if (data.hero) {
      const bg = document.querySelector('.hero-bg');
      if (bg && data.hero.bgImage) {
        bg.style.backgroundImage = `linear-gradient(to bottom, hsl(var(--hue-brand) 20% 19% / 0.62) 0%, hsl(var(--hue-brand) 20% 19% / 0.40) 60%, hsl(var(--hue-brand) 20% 19% / 0.70) 100%), url('${data.hero.bgImage}')`;
      }
      const eyebrow = document.querySelector('.hero-eyebrow');
      if (eyebrow && data.hero.eyebrow) eyebrow.textContent = data.hero.eyebrow;

      const heading = document.querySelector('.hero-heading');
      if (heading && (data.hero.titleMain || data.hero.titleAccent)) {
        heading.innerHTML = `${data.hero.titleMain || ''}<br /><em>${data.hero.titleAccent || ''}</em>`;
      }

      const tagline = document.querySelector('.hero-tagline');
      if (tagline && data.hero.tagline) tagline.textContent = data.hero.tagline;

      const badge = document.querySelector('.hero-badge .badge-text');
      if (badge && data.hero.badgeText) badge.textContent = data.hero.badgeText;
    }

    /* 2. About */
    if (data.about) {
      const aboutImg = document.querySelector('.about-image');
      if (aboutImg && data.about.image) {
        aboutImg.style.backgroundImage = `url('${data.about.image}')`;
      }
      const badgeYear = document.querySelector('.about-image-badge .caveat');
      if (badgeYear && data.about.badgeYear) badgeYear.textContent = data.about.badgeYear;

      const badgeLabel = document.querySelector('.about-image-badge span:last-child');
      if (badgeLabel && data.about.badgeLabel) badgeLabel.textContent = data.about.badgeLabel;

      const aboutEyebrow = document.querySelector('.about-text .section-eyebrow');
      if (aboutEyebrow && data.about.eyebrow) aboutEyebrow.textContent = data.about.eyebrow;

      const aboutHeading = document.querySelector('.about-text h2');
      if (aboutHeading && (data.about.headingMain || data.about.headingAccent)) {
        aboutHeading.innerHTML = `${data.about.headingMain || ''}<br /><em>${data.about.headingAccent || ''}</em>`;
      }

      const aboutParas = document.querySelectorAll('.about-text p');
      if (data.about.paragraphs && data.about.paragraphs.length > 0) {
        data.about.paragraphs.forEach((pText, i) => {
          if (aboutParas[i]) aboutParas[i].textContent = pText;
        });
      }
    }

    /* 3. Menu */
    if (Array.isArray(data.menu)) {
      const drinksGrid = document.querySelector('#panel-drinks .menu-grid');
      const foodGrid = document.querySelector('#panel-food .menu-grid');

      if (drinksGrid) drinksGrid.innerHTML = '';
      if (foodGrid) foodGrid.innerHTML = '';

      data.menu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card reveal';
        card.dataset.category = item.subCategory;
        card.innerHTML = `
          <img class="menu-card-thumb" src="${item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200'}" alt="${item.name}" loading="lazy" />
          <div class="menu-card-body">
            <div class="menu-card-top">
              <span class="item-name">${item.name}</span>
              <span class="item-price">${item.price}</span>
            </div>
            <p class="item-desc">${item.desc}</p>
            ${item.tag ? `<div class="item-tags"><span class="tag tag-new">${item.tag}</span></div>` : ''}
          </div>
        `;

        if (item.mainCategory === 'drinks' && drinksGrid) {
          drinksGrid.appendChild(card);
        } else if (item.mainCategory === 'food' && foodGrid) {
          foodGrid.appendChild(card);
        }
      });

      if (typeof refreshMenuCategoryFilter === 'function') {
        refreshMenuCategoryFilter();
      }
    }

    /* 4. Gallery */
    if (Array.isArray(data.gallery)) {
      const galleryGrid = document.querySelector('.gallery-grid');
      if (galleryGrid) {
        galleryGrid.innerHTML = '';
        data.gallery.forEach(item => {
          const btn = document.createElement('button');
          btn.className = `gallery-item reveal visible ${item.span === 'tall' ? 'gallery-tall' : item.span === 'wide' ? 'gallery-wide' : ''}`;
          btn.dataset.src = item.url;
          btn.setAttribute('aria-label', item.label || 'Galeri Fotoğrafı');
          btn.setAttribute('role', 'listitem');
          btn.style.backgroundImage = `url('${item.url}')`;
          btn.innerHTML = `<img src="${item.url}" alt="${item.label || 'Galeri Fotoğrafı'}" loading="lazy" referrerpolicy="no-referrer" />`;
          galleryGrid.appendChild(btn);
        });

        if (typeof refreshLightbox === 'function') {
          refreshLightbox();
        }
      }
    }

    /* 5. Contact & Hours */
    if (data.contact) {
      const c = data.contact;

      const phoneLink = document.querySelector('.hours-address a[href^="tel:"]');
      if (phoneLink && c.phone) {
        phoneLink.href = `tel:${c.phone.replace(/[^0-9+]/g, '')}`;
        phoneLink.textContent = c.phone;
      }

      const emailLink = document.querySelector('.hours-address a[href^="mailto:"]');
      if (emailLink && c.email) {
        emailLink.href = `mailto:${c.email}`;
        emailLink.textContent = c.email;
      }

      const addressP = document.querySelector('.hours-address p:first-child');
      if (addressP && c.address) {
        addressP.innerHTML = `📍 ${c.address.replace(/\n/g, '<br />')}`;
      }

      const hoursTbody = document.querySelector('.hours-table tbody');
      if (hoursTbody && Array.isArray(c.hours)) {
        hoursTbody.innerHTML = '';
        c.hours.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${row.days}</td><td>${row.time}</td>`;
          hoursTbody.appendChild(tr);
        });
      }

      const directionsBtn = document.querySelector('.hours-text a.btn-primary');
      if (directionsBtn && c.directionsUrl) {
        directionsBtn.href = c.directionsUrl;
      }

      const mapIframe = document.querySelector('.hours-map iframe');
      if (mapIframe && c.mapEmbedUrl) {
        mapIframe.src = c.mapEmbedUrl;
      }

      const instaLink = document.querySelector('.social-icons a[aria-label="Instagram"]');
      if (instaLink && c.instagram) instaLink.href = c.instagram;

      const fbLink = document.querySelector('.social-icons a[aria-label="Facebook"]');
      if (fbLink && c.facebook) fbLink.href = c.facebook;

      const drawerInsta = document.querySelector('.drawer-socials a[aria-label="Instagram"]');
      if (drawerInsta && c.instagram) drawerInsta.href = c.instagram;

      const drawerFb = document.querySelector('.drawer-socials a[aria-label="Facebook"]');
      if (drawerFb && c.facebook) drawerFb.href = c.facebook;
    }
  }

  // Hydrate on load
  hydrateFromCMS();

  // Real-time synchronization
  window.addEventListener('masalsi_data_updated', () => hydrateFromCMS());
  window.addEventListener('storage', (e) => {
    if (e.key === 'masalsi_cafe_cms_data') {
      hydrateFromCMS();
    }
  });

  /* ──────────────── HIDDEN PRIVATE ADMIN SHORTCUTS ──────────────── */
  // 1. Keyboard shortcut: Alt + A or Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if ((e.altKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
      e.preventDefault();
      window.location.href = 'yonetim-girisi.html';
    }
  });

  // 2. Secret click: Triple click footer copyright within 1.5 seconds
  const footerSecret = document.getElementById('footer-secret-admin');
  if (footerSecret) {
    let clickCount = 0;
    let clickTimer = null;
    footerSecret.style.cursor = 'default';
    footerSecret.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
        window.location.href = 'yonetim-girisi.html';
      } else {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 1500);
      }
    });
  }
})();
