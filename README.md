# ☕ Masalsı Café — Website

A responsive, single-page website for **Masalsı Café**, a cozy neighborhood café in Istanbul. Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build step, no dependencies.

---

## Project Structure

```
masalsi-cafe/
├── index.html   # All markup and page structure
├── style.css    # All styles, variables, animations, responsive rules
├── script.js    # All interactivity (nav, tabs, lightbox, carousel, forms)
└── README.md    # This file
```

---

## Features

### Pages / Sections
| Anchor | Section |
|--------|---------|
| `#top` | Hero |
| `#about` | Hakkımızda (Our Story) |
| `#menu` | Menü |
| `#gallery` | Galeri |
| `#hours` | Saatler & Konum |
| `#contact` | Rezervasyon & İletişim |

### Menu Structure
The menu is organized into two main tabs with sub-categories:

**İçecekler**
- ☕ Sıcak İçecekler — Çay, Oralet, Türk Kahvesi, Nescafe, Filtre Kahve, Salep, Sıcak Çikolata, Bitki Çayı, Menengiç Kahvesi
- 🧊 Soğuk İçecekler — Pepsi/Yedigün/Ice Tea, Gazoz, Soda, Churchill, Black Bruin, Red Bull, Meyve Suyu, Ayran, Limonata, Su

**Yiyecekler**
- 🍰 Pastalar — Cheesecake, Tiramisu, Mozaik, Orman Meyveli, Yaban Mersinli, Fıstık Dünyası, Sufle ve daha fazlası
- 🥪 Tostlar — Kaşarlı, Sucuklu, Karışık, Kavurmalı Kaşarlı
- 🍽️ Ev Yemekleri — Mantı, Sarma, Börek çeşitleri, İçli Köfte, Yöresel Lezzet Tabağı
- 🍳 Diğer — Kahvaltı Tabağı, Atıştırmalık, Patates, Köfte Tabağı, Tavuk Burger
- 🥚 Menemenler — Sade, Kaşarlı, Sucuklu, Karışık, Kıymalı, Kavurmalı
- 🍳 Yumurtalar — Sade, Kaşarlı, Sucuklu, Kıymalı, Kavurmalı
- 🌯 Dönerler — Tavuk Menü

### JavaScript Modules
All JS is written as self-contained IIFEs in `script.js`:

1. **Sticky Nav** — header transitions from transparent to cream on scroll
2. **Smooth Scroll** — anchor links scroll smoothly to sections
3. **Mobile Drawer** — slide-in nav with focus trap, Escape key close, overlay dismiss
4. **Hero Parallax** — subtle background parallax, desktop only (>1024px)
5. **Scroll Reveal** — Intersection Observer fade+slide for every `.reveal` element
6. **Menu Tabs** — main tab + sub-tab system, fully ARIA-compliant, keyboard navigable
7. **Gallery Lightbox** — keyboard arrow navigation, swipe support, focus management
8. **Testimonial Carousel** — auto-rotate, pause on hover, touch swipe on mobile
9. **Contact Form** — client-side validation with inline error states and success message
10. **Newsletter Form** — submission feedback
11. **Lazy Load** — Intersection Observer hook for `[data-bg]` elements

---

## Getting Started

No build tools required. Just open the file in a browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — local dev server (avoids any CORS issues with fonts)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

---

## Customization

### Colors
All colors are CSS custom properties at the top of `style.css`:

```css
:root {
  --cream:      #FAF3E8;   /* page background */
  --brown:      #6F4E37;   /* primary */
  --terracotta: #C97B4A;   /* accent / CTAs */
  --sage:       #8A9A5B;   /* secondary accent */
  --espresso:   #3A2E27;   /* dark text */
}
```

### Fonts
Loaded from Google Fonts. Swap the `<link>` in `<head>` to change:

```
Fraunces  → headings / display
Caveat    → small accent labels (Est. 2019, eyebrow text)
Nunito    → body copy
```

### Menu Items
All menu items live in `index.html` inside the `#menu` section. Each card follows this pattern:

```html
<div class="menu-card reveal" data-category="CATEGORY_KEY">
  <div class="menu-card-body">
    <div class="menu-card-top">
      <span class="item-name">İtem Adı</span>
      <span class="item-price">₺00</span>
    </div>
    <p class="item-desc">Açıklama metni.</p>
    <div class="item-tags">
      <span class="tag tag-popular">Popüler</span>
    </div>
  </div>
</div>
```

Available tag classes: `tag-popular`, `tag-new`, `tag-vegan`, `tag-gf`

To add a new sub-tab, add a button to `.sub-tabs` with a `data-sub` value, then give the matching cards `data-category` with the same value.

### Contact Form
The form in `#contact` currently simulates submission (1.2s delay, then shows a success message). To connect it to a real backend, replace the `setTimeout` block inside `initContactForm()` in `script.js` with a `fetch()` call to your API endpoint.

### Map
The Google Maps embed in `#hours` uses a placeholder coordinate. Replace the `src` of the `<iframe>` with your real embed URL from [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started).

---

## Responsive Breakpoints

| Breakpoint | Width | Key changes |
|------------|-------|-------------|
| Mobile portrait | `≤ 640px` | 1-column menu & gallery, stacked hero CTAs, tighter padding |
| Mobile landscape | `≤ 768px` | Hamburger nav, stacked about/contact grids |
| Tablet | `≤ 900px` | 2-column menu grid, 2-column gallery |
| Tablet large | `≤ 1024px` | Hours stack, footer 2-column, parallax disabled |
| Desktop | `> 1024px` | Full 3-column menu, parallax active |

---

## Accessibility

- Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- All images have `alt` text; decorative elements are `aria-hidden`
- ARIA roles and `aria-selected` on tab/tabpanel components
- Focus trap inside the mobile drawer
- Keyboard navigation: arrow keys for tabs, Escape for drawer/lightbox
- All interactive targets are at least 44×44px
- Visible `:focus-visible` outlines on all interactive elements
- `prefers-reduced-motion` respected — all animations disabled when set

---

## Performance Notes

- Zero npm dependencies, zero build step
- Fonts loaded with `display=swap` to prevent layout shift
- Parallax only runs on desktop (`>1024px`) via `matchMedia`
- Scroll reveal uses `IntersectionObserver`, not scroll event listeners
- All animations use `transform` and `opacity` only (no layout properties)
- Images use Unsplash with explicit `w=` and `q=` params for size control

---

## License

MIT — free to use, modify, and deploy.