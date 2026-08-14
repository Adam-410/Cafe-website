# ☕ Masalsı Café — Website

A responsive, single-page website for **Masalsı Café**, a cozy neighborhood café in Istanbul. Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build step, no dependencies.

---

## Project Structure

```
masalsi-cafe/
├── index.html   # All markup and page structure
├── style.css    # Design system, styles, animations, responsive rules
├── script.js    # All interactivity (nav, tabs, lightbox, carousel, forms)
└── README.md    # This file
```

---

## CSS Architecture

The stylesheet (`style.css`) is built around a **Design Token system** in `Section 0`. Everything — colors, spacing, type sizes, radii, shadows — is a named custom property. You rarely need to touch a raw value anywhere else in the file.

### Section Map

| # | Section | What it covers |
|---|---------|----------------|
| 0 | Design Tokens | All CSS custom properties (see below) |
| 1 | Reset & Base | Box-sizing, body, links, buttons, `.sr-only`, `:focus-visible` |
| 2 | Typography | `h1`–`h3`, `em`, `.caveat`, `.section-eyebrow`, `.section-sub` |
| 3 | Container | `.container` max-width + block padding |
| 4 | Buttons | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-full` |
| 5 | Scroll Reveal | `.reveal` / `.reveal.visible` + staggered menu-card delays |
| 6 | Accessibility & Motion | `prefers-reduced-motion`, mobile parallax disable |
| 7 | Header / Nav | `.site-header`, `.navbar`, logo, nav links, underline indicator |
| 8 | Mobile Drawer | `.nav-drawer`, `.drawer-overlay`, close button, social links |
| 9 | Hero | Full-viewport section, parallax bg, eyebrow, heading, CTA group |
| 10 | Steam Animation | `@keyframes steam` on the hero badge |
| 11 | Scroll Hint | Animated scroll indicator arrow |
| 12 | Hero Keyframe | `@keyframes heroFadeIn` |
| 13 | SVG Divider | Wave divider between hero and about |
| 14 | Section Header | Shared `.section-header` utility |
| 15 | About | Two-column grid, image wrap, floating badge, text column |
| 16 | Menu | Tabs, sub-tabs, menu grid, cards, tags |
| 17 | Gallery | Masonry-style grid, `.gallery-tall`, `.gallery-wide` |
| 18 | Lightbox | Overlay, image wrap, prev/next/close buttons |
| 19 | Testimonials | Carousel cards, stars, dots |
| 20 | Hours & Map | Two-column grid, address, hours table, iframe |
| 21 | Contact | Two-column grid, form, social icons |
| 22 | Footer | Three-column grid, newsletter input, footer-bottom |
| 23 | Responsive | All `@media` breakpoints (1024 / 900 / 768 / 640px) |

---

## Design Tokens (`Section 0`)

### Color System — HSL-based

Colors are driven by **three base hue channels**. Change a hue, and every derived color updates automatically:

```css
:root {
  --hue-brand:  23;   /* Terracotta / espresso / warm browns */
  --hue-base:   37;   /* Cream backgrounds */
  --hue-accent: 75;   /* Sage green */
  --hue-danger:  6;   /* Error states */
}
```

Semantic colors are derived from those hues:

| Token | Value | Used for |
|-------|-------|----------|
| `--color-cream` | `hsl(37, 60%, 95%)` | Page background |
| `--color-cream-dark` | `hsl(37, 53%, 87%)` | Menu section bg, form inputs |
| `--color-espresso` | `hsl(23, 20%, 19%)` | Dark text, footer bg |
| `--color-brown` | `hsl(23, 34%, 33%)` | Body text, borders |
| `--color-brown-dark` | `hsl(23, 38%, 26%)` | Button hover state |
| `--color-terracotta` | `hsl(23, 53%, 54%)` | CTAs, accents, prices |
| `--color-sage` | `hsl(75, 26%, 48%)` | Vegan tags, success states |
| `--color-white` | `hsl(0, 0%, 100%)` | Card backgrounds |
| `--color-error` | `hsl(6, 63%, 46%)` | Form validation errors |

Alpha variants (`--color-terracotta-35`, `--color-cream-20`, etc.) are pre-built for shadows, overlays, and tinted backgrounds — no `rgba()` literals anywhere in the file.

### To re-theme the entire site

Change only the three hue numbers at the top of `:root`:

```css
--hue-brand:  210;  /* → blue */
--hue-base:   200;  /* → cool grey backgrounds */
--hue-accent: 140;  /* → green */
```

### Typography Scale

```css
--font-size-xs:   0.7rem    /* tags */
--font-size-sm:   0.75rem   /* small labels */
--font-size-base: 0.875rem  /* body, nav links, form labels */
--font-size-md:   0.95rem   /* buttons, sub-tabs */
--font-size-lg:   1rem      /* base body */
--font-size-xl:   1.05rem   /* about text, section-sub */
--font-size-2xl:  1.15rem   /* eyebrow labels, hero eyebrow */
--font-size-3xl:  1.2rem    /* h3, blockquote */
--font-size-4xl:  1.5rem    /* logo, stars */
--font-size-5xl:  1.8rem    /* drawer nav links */
--font-size-h2:   clamp(2rem, 4vw, 3rem)
--font-size-hero: clamp(2.8rem, 7vw, 5.5rem)
```

### Spacing Scale

```css
--space-3xs:     0.25rem   /*  4px */
--space-2xs:     0.35rem   /*  5.6px */
--space-xs:      0.5rem    /*  8px */
--space-sm:      0.75rem   /* 12px */
--space-md:      1rem      /* 16px */
--space-lg:      1.25rem   /* 20px */
--space-xl:      1.5rem    /* 24px */
--space-2xl:     2rem      /* 32px */
--space-3xl:     2.5rem    /* 40px */
--space-4xl:     3rem      /* 48px */
--space-5xl:     4rem      /* 64px */
--space-6xl:     5rem      /* 80px */
--space-section: 6rem      /* 96px — default section padding */
```

### Border Radius

```css
--radius-xs:     2px
--radius-sm:     6px
--radius-md:     12px
--radius-lg:     20px
--radius-xl:     32px
--radius-pill:   100px
--radius-circle: 50%
```

---

## Features

### Page Sections
| Anchor | Section |
|--------|---------|
| `#top` | Hero |
| `#about` | Hakkımızda (Our Story) |
| `#menu` | Menü |
| `#gallery` | Galeri |
| `#hours` | Saatler & Konum |
| `#contact` | Rezervasyon & İletişim |

### Menu Structure
**İçecekler**
- ☕ Sıcak — Çay, Oralet, Türk Kahvesi, Nescafe, Filtre Kahve, Salep, Sıcak Çikolata, Bitki Çayı, Menengiç Kahvesi
- 🧊 Soğuk — Pepsi/Yedigün/Ice Tea, Gazoz, Soda, Churchill, Black Bruin, Red Bull, Meyve Suyu, Ayran, Limonata, Su

**Yiyecekler**
- 🍰 Pastalar — Cheesecake, Tiramisu, Mozaik, Orman Meyveli, Yaban Mersinli, Fıstık Dünyası, Sufle, Albenili Fıstıklı Doro
- 🥪 Tostlar — Kaşarlı, Sucuklu, Karışık, Kavurmalı Kaşarlı
- 🍽️ Ev Yemekleri — Mantı, Sarma, Börek çeşitleri, İçli Köfte, Yöresel Lezzet Tabağı
- 🍳 Diğer — Kahvaltı Tabağı, Atıştırmalık, Patates, Köfte Tabağı, Tavuk Burger
- 🥚 Menemenler — Sade, Kaşarlı, Sucuklu, Karışık, Kıymalı, Kavurmalı
- 🍳 Yumurtalar — Sade, Kaşarlı, Sucuklu, Kıymalı, Kavurmalı
- 🌯 Dönerler — Tavuk Menü

### JavaScript Modules (`script.js`)
All JS is written as self-contained IIFEs:

1. **Sticky Nav** — header transitions from transparent to cream on scroll
2. **Smooth Scroll** — anchor links scroll smoothly to sections
3. **Mobile Drawer** — slide-in nav with focus trap, Escape key, overlay dismiss, `menu-open` class on header
4. **Hero Parallax** — desktop only (`>1024px`), disabled via `matchMedia` on mobile
5. **Scroll Reveal** — Intersection Observer fade+slide for every `.reveal` element
6. **Menu Tabs** — main tab + sub-tab system, fully ARIA-compliant, keyboard navigable
7. **Gallery Lightbox** — keyboard arrow navigation, swipe support, focus management
8. **Testimonial Carousel** — auto-rotate, pause on hover, touch swipe on mobile
9. **Contact Form** — client-side validation, error states, success message
10. **Newsletter Form** — submission feedback
11. **Lazy Load** — Intersection Observer hook for `[data-bg]` elements

---

## Getting Started

No build tools required:

```bash
# Open directly
open index.html

# Or run a local server
npx serve .
python3 -m http.server 8000
```

---

## Customization

### Re-theme with one change

The entire site re-themes by editing the three hue variables at the top of `style.css`:

```css
--hue-brand:  23;   /* change this number */
--hue-base:   37;   /* change this number */
--hue-accent: 75;   /* change this number */
```

### Add or edit menu items

Each card in `index.html` follows this pattern:

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

To add a new sub-category: add a `<button class="sub-tab" data-sub="KEY">` to `.sub-tabs`, then give cards `data-category="KEY"`.

### Connect the contact form

Replace the `setTimeout` block in `initContactForm()` in `script.js` with a real `fetch()` call to your endpoint.

### Update the map

Replace the `<iframe src="...">` in `#hours` with your embed URL from [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started).

---

## Responsive Breakpoints

| Breakpoint | Width | Key changes |
|------------|-------|-------------|
| Mobile portrait | `≤ 640px` | 1-col menu/gallery, stacked hero CTAs, hero height `68svh` |
| Mobile | `≤ 768px` | Hamburger nav, stacked about/contact, hero height `68svh` |
| Tablet medium | `≤ 900px` | 2-col menu/gallery, contact stacks to 1-col |
| Tablet large | `≤ 1024px` | Hours stack, footer 2-col, parallax disabled |
| Desktop | `> 1024px` | 3-col menu, full parallax, all multi-column layouts |

---

## Accessibility

- Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- All images have `alt` text; decorative elements are `aria-hidden`
- ARIA roles, `aria-selected`, `aria-controls`, `aria-labelledby` on tab components
- `aria-hidden` / `aria-expanded` managed on drawer open/close
- Focus trap inside the mobile drawer; `Escape` key closes drawer and lightbox
- Keyboard navigation: arrow keys for tabs, arrow keys for lightbox
- All interactive targets ≥ 44×44px
- Visible `:focus-visible` rings using `--color-terracotta`
- `prefers-reduced-motion`: all animations and transitions disabled

---

## Performance Notes

- Zero npm dependencies, zero build step
- Fonts loaded with `display=swap`
- Parallax only runs on desktop (`>1024px`) via `matchMedia`; transform reset on resize
- Scroll reveal uses `IntersectionObserver` — no scroll event listeners
- All animations use `transform` and `opacity` only (compositor-only, no layout reflow)
- Hero image loaded via CSS `background-image`; Unsplash URLs use `w=` and `q=` params for size control
- Mobile hero uses `height: 68svh` (`svh` = small viewport height, accounts for browser chrome)

---

## License

MIT — free to use, modify, and deploy.