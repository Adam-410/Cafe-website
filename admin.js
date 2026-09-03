/**
 * Masalsı Café — admin.js
 * Comprehensive logic for the Admin Dashboard
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const CMS = window.MasalsiCMS;
  if (!CMS) {
    console.error('CMS data layer not loaded');
    return;
  }

  /* ──────────────── SUBCATEGORY DEFINITIONS ──────────────── */
  const SUBCATS = {
    drinks: [
      { id: 'sicak', label: 'Sıcak İçecekler' },
      { id: 'soguk', label: 'Soğuk İçecekler' }
    ],
    food: [
      { id: 'pastalar', label: 'Pastalar' },
      { id: 'evyemekleri', label: 'Ev Yemekleri' },
      { id: 'tostlar', label: 'Tostlar' },
      { id: 'menemenler', label: 'Menemenler' },
      { id: 'yumurtalar', label: 'Yumurtalar' },
      { id: 'donerler', label: 'Döner & Fast Food' },
      { id: 'diger', label: 'Diğer Lezzetler' }
    ]
  };

  /* ──────────────── DOM ELEMENTS ──────────────── */
  const authScreen = document.getElementById('auth-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const authForm = document.getElementById('auth-form');
  const authPinInput = document.getElementById('auth-pin');
  const authError = document.getElementById('auth-error');
  const btnLogout = document.getElementById('btn-logout');

  const navButtons = document.querySelectorAll('.dash-nav-btn');
  const panels = document.querySelectorAll('.dash-panel');
  const topbarTitle = document.getElementById('topbar-title');
  const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
  const dashSidebar = document.getElementById('dash-sidebar');

  const toastContainer = document.getElementById('toast-container');

  // Modals
  const modalMenuItem = document.getElementById('modal-menu-item');
  const modalGalleryItem = document.getElementById('modal-gallery-item');
  const modalConfirmDelete = document.getElementById('modal-confirm-delete');
  const modalConfirmReset = document.getElementById('modal-confirm-reset');

  let pendingDeleteAction = null;

  /* ──────────────── TOAST NOTIFICATIONS ──────────────── */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`
      : type === 'error'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 320);
    }, 3200);
  }

  /* ──────────────── AUTHENTICATION ──────────────── */
  function checkAuth() {
    if (CMS.isAdminAuthenticated()) {
      authScreen.style.display = 'none';
      dashboardScreen.style.display = 'flex';
      initDashboard();
    } else {
      authScreen.style.display = 'flex';
      dashboardScreen.style.display = 'none';
      authPinInput.focus();
    }
  }

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const enteredPin = authPinInput.value.trim();
    const submitBtn = authForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Giriş Yapılıyor...';
    }

    try {
      const isValid = await CMS.verifyAdminPin(enteredPin);
      if (isValid) {
        authError.textContent = '';
        CMS.setAdminSession(true);
        checkAuth();
        showToast('Hoş geldiniz! Yönetim paneli açıldı.', 'success');
      } else {
        authError.textContent = 'Hatalı PIN kodu! Tekrar deneyin.';
        authPinInput.value = '';
        authPinInput.focus();
      }
    } catch (err) {
      authError.textContent = 'Doğrulama hatası oluştu.';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Giriş Yap';
      }
    }
  });

  btnLogout.addEventListener('click', () => {
    CMS.setAdminSession(false);
    showToast('Çıkış yapıldı.', 'info');
    checkAuth();
  });

  /* ──────────────── MODAL HELPERS ──────────────── */
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      const modal = document.getElementById(modalId);
      if (modal && typeof modal.close === 'function') {
        modal.close();
      }
    });
  });

  /* ──────────────── NAVIGATION TABS ──────────────── */
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.dataset.target;

      navButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        topbarTitle.textContent = btn.querySelector('span:last-child').textContent;
      }

      // Close mobile drawer if open
      dashSidebar.classList.remove('open');
    });
  });

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', () => {
      dashSidebar.classList.toggle('open');
    });
  }

  /* ──────────────── 1. MENU MANAGEMENT ──────────────── */
  let currentCategoryFilter = 'all';
  let currentSearchQuery = '';

  const menuAdminGrid = document.getElementById('menu-admin-grid');
  const statTotalItems = document.getElementById('stat-total-items');
  const statDrinksItems = document.getElementById('stat-drinks-items');
  const statFoodsItems = document.getElementById('stat-foods-items');
  const menuSearchInput = document.getElementById('menu-search-input');
  const categoryFilters = document.getElementById('menu-category-filters');
  const btnAddMenuItem = document.getElementById('btn-add-menu-item');

  // Add / Edit Modal Elements
  const formMenuItem = document.getElementById('form-menu-item');
  const modalMenuItemTitle = document.getElementById('modal-menu-item-title');
  const menuItemId = document.getElementById('menu-item-id');
  const menuItemName = document.getElementById('menu-item-name');
  const menuItemPrice = document.getElementById('menu-item-price');
  const menuItemTag = document.getElementById('menu-item-tag');
  const menuItemMainCat = document.getElementById('menu-item-main-cat');
  const menuItemSubCat = document.getElementById('menu-item-sub-cat');
  const menuItemDesc = document.getElementById('menu-item-desc');
  const menuItemImgPreview = document.getElementById('menu-item-img-preview');
  const menuItemImgUrl = document.getElementById('menu-item-img-url');
  const menuItemImgFile = document.getElementById('menu-item-img-file');

  function populateSubCats(mainCat, selectedSub = null) {
    menuItemSubCat.innerHTML = '';
    const list = SUBCATS[mainCat] || [];
    list.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.label;
      if (selectedSub && selectedSub === item.id) opt.selected = true;
      menuItemSubCat.appendChild(opt);
    });
  }

  menuItemMainCat.addEventListener('change', () => {
    populateSubCats(menuItemMainCat.value);
  });

  // Image preview helper
  menuItemImgUrl.addEventListener('input', () => {
    menuItemImgPreview.src = menuItemImgUrl.value || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200';
  });

  menuItemImgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        menuItemImgPreview.src = evt.target.result;
        menuItemImgUrl.value = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  function renderMenuAdmin() {
    const data = CMS.getSiteData();
    const items = data.menu || [];

    // Update stats
    statTotalItems.textContent = items.length;
    statDrinksItems.textContent = items.filter((i) => i.mainCategory === 'drinks').length;
    statFoodsItems.textContent = items.filter((i) => i.mainCategory === 'food').length;

    // Filter items
    const filtered = items.filter((item) => {
      // Category filter
      let matchCat = true;
      if (currentCategoryFilter === 'drinks') matchCat = item.mainCategory === 'drinks';
      else if (currentCategoryFilter === 'food') matchCat = item.mainCategory === 'food';
      else if (currentCategoryFilter !== 'all') matchCat = item.subCategory === currentCategoryFilter;

      // Search filter
      let matchSearch = true;
      if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        matchSearch = (item.name && item.name.toLowerCase().includes(q)) ||
                      (item.desc && item.desc.toLowerCase().includes(q));
      }

      return matchCat && matchSearch;
    });

    menuAdminGrid.innerHTML = '';

    if (filtered.length === 0) {
      menuAdminGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); color: var(--color-brown-muted);">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto var(--space-xs); display: block;" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-2xs); color: var(--color-espresso);">Ürün bulunamadı</p>
          <p style="font-size: 0.9rem;">Filtreleri temizleyebilir veya yeni ürün ekleyebilirsiniz.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'menu-item-admin-card';

      // Find subcategory label
      let subCatLabel = item.subCategory;
      for (const group of Object.values(SUBCATS)) {
        const found = group.find((s) => s.id === item.subCategory);
        if (found) { subCatLabel = found.label; break; }
      }

      card.innerHTML = `
        <div class="item-thumb-box">
          <img src="${item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200'}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="item-info">
          <div class="item-info-top">
            <span class="item-title" title="${item.name}">${item.name}</span>
            <span class="item-price-tag">${item.price}</span>
          </div>
          <p class="item-desc-text">${item.desc}</p>
          <div class="item-meta-row">
            <div>
              <span class="cat-badge">${subCatLabel}</span>
              ${item.tag ? `<span class="tag-badge">${item.tag}</span>` : ''}
            </div>
            <div class="item-actions">
              <button class="icon-btn btn-edit-item" data-id="${item.id}" title="Düzenle">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="icon-btn delete btn-delete-item" data-id="${item.id}" title="Sil">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
      menuAdminGrid.appendChild(card);
    });

    // Attach edit and delete handlers
    menuAdminGrid.querySelectorAll('.btn-edit-item').forEach((btn) => {
      btn.addEventListener('click', () => openEditMenuItem(btn.dataset.id));
    });

    menuAdminGrid.querySelectorAll('.btn-delete-item').forEach((btn) => {
      btn.addEventListener('click', () => promptDeleteMenuItem(btn.dataset.id));
    });
  }

  // Filter pills
  categoryFilters.querySelectorAll('.filter-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryFilters.querySelectorAll('.filter-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.dataset.filter;
      renderMenuAdmin();
    });
  });

  menuSearchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();
    renderMenuAdmin();
  });

  // Add Item Click
  btnAddMenuItem.addEventListener('click', () => {
    modalMenuItemTitle.textContent = 'Yeni Ürün Ekle';
    menuItemId.value = '';
    formMenuItem.reset();
    populateSubCats('drinks');
    menuItemImgPreview.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200';
    modalMenuItem.showModal();
  });

  // Edit Item
  function openEditMenuItem(id) {
    const data = CMS.getSiteData();
    const item = (data.menu || []).find((i) => i.id === id);
    if (!item) return;

    modalMenuItemTitle.textContent = 'Ürünü Düzenle';
    menuItemId.value = item.id;
    menuItemName.value = item.name;
    menuItemPrice.value = item.price;
    menuItemTag.value = item.tag || '';
    menuItemDesc.value = item.desc;
    menuItemMainCat.value = item.mainCategory;

    populateSubCats(item.mainCategory, item.subCategory);

    menuItemImgUrl.value = item.image || '';
    menuItemImgPreview.src = item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200';
    menuItemImgFile.value = '';

    modalMenuItem.showModal();
  }

  // Save Item
  formMenuItem.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = CMS.getSiteData();
    const id = menuItemId.value.trim();

    // Price normalize
    let rawPrice = menuItemPrice.value.trim();
    if (!rawPrice.startsWith('₺')) {
      rawPrice = `₺${rawPrice}`;
    }

    const itemPayload = {
      id: id || `item-${Date.now()}`,
      name: menuItemName.value.trim(),
      price: rawPrice,
      desc: menuItemDesc.value.trim(),
      tag: menuItemTag.value.trim(),
      mainCategory: menuItemMainCat.value,
      subCategory: menuItemSubCat.value,
      image: menuItemImgUrl.value.trim() || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200'
    };

    if (id) {
      // Edit
      const index = data.menu.findIndex((i) => i.id === id);
      if (index !== -1) data.menu[index] = itemPayload;
      showToast(`"${itemPayload.name}" güncellendi.`, 'success');
    } else {
      // Add
      data.menu.push(itemPayload);
      showToast(`"${itemPayload.name}" menüye eklendi.`, 'success');
    }

    CMS.saveSiteData(data);
    modalMenuItem.close();
    renderMenuAdmin();
  });

  // Delete Item
  function promptDeleteMenuItem(id) {
    const data = CMS.getSiteData();
    const item = (data.menu || []).find((i) => i.id === id);
    if (!item) return;

    document.getElementById('confirm-delete-message').textContent = `"${item.name}" ürününü menüden silmek istediğinize emin misiniz?`;
    pendingDeleteAction = () => {
      data.menu = data.menu.filter((i) => i.id !== id);
      CMS.saveSiteData(data);
      showToast(`"${item.name}" silindi.`, 'info');
      renderMenuAdmin();
    };

    modalConfirmDelete.showModal();
  }

  document.getElementById('btn-confirm-delete-action').addEventListener('click', () => {
    if (typeof pendingDeleteAction === 'function') {
      pendingDeleteAction();
      pendingDeleteAction = null;
    }
    modalConfirmDelete.close();
  });

  /* ──────────────── 2. CONTACT & HOURS MANAGEMENT ──────────────── */
  const formContact = document.getElementById('form-contact-settings');
  const contactPhone = document.getElementById('contact-phone');
  const contactEmail = document.getElementById('contact-email');
  const contactAddress = document.getElementById('contact-address');
  const contactInstagram = document.getElementById('contact-instagram');
  const contactFacebook = document.getElementById('contact-facebook');
  const contactDirections = document.getElementById('contact-directions');
  const contactMapEmbed = document.getElementById('contact-map-embed');
  const mapPreviewIframe = document.getElementById('map-preview-iframe');
  const hoursTableBody = document.getElementById('hours-table-body');
  const btnAddHoursRow = document.getElementById('btn-add-hours-row');

  function renderContactAdmin() {
    const data = CMS.getSiteData();
    const c = data.contact || {};

    contactPhone.value = c.phone || '';
    contactEmail.value = c.email || '';
    contactAddress.value = c.address || '';
    contactInstagram.value = c.instagram || '';
    contactFacebook.value = c.facebook || '';
    contactDirections.value = c.directionsUrl || '';
    contactMapEmbed.value = c.mapEmbedUrl || '';

    if (c.mapEmbedUrl) {
      mapPreviewIframe.src = c.mapEmbedUrl;
    }

    renderHoursRows(c.hours || []);
  }

  function renderHoursRows(hoursList) {
    hoursTableBody.innerHTML = '';
    hoursList.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="text" class="hour-days" value="${row.days}" placeholder="Örn: Pazartesi – Cuma" style="width: 100%;" /></td>
        <td><input type="text" class="hour-time" value="${row.time}" placeholder="Örn: 08:00 – 01:00" style="width: 100%;" /></td>
        <td><button type="button" class="icon-btn delete btn-remove-hour" data-index="${index}" title="Kaldır"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></td>
      `;
      hoursTableBody.appendChild(tr);
    });

    hoursTableBody.querySelectorAll('.btn-remove-hour').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.closest('tr').remove();
      });
    });
  }

  btnAddHoursRow.addEventListener('click', () => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="hour-days" placeholder="Örn: Pazar" style="width: 100%;" /></td>
      <td><input type="text" class="hour-time" placeholder="Örn: 09:00 – 23:00" style="width: 100%;" /></td>
      <td><button type="button" class="icon-btn delete btn-remove-hour" title="Kaldır"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></td>
    `;
    tr.querySelector('.btn-remove-hour').addEventListener('click', () => tr.remove());
    hoursTableBody.appendChild(tr);
  });

  contactMapEmbed.addEventListener('input', () => {
    mapPreviewIframe.src = contactMapEmbed.value.trim();
  });

  formContact.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = CMS.getSiteData();

    // Extract hours table rows
    const updatedHours = [];
    hoursTableBody.querySelectorAll('tr').forEach((tr) => {
      const days = tr.querySelector('.hour-days')?.value.trim();
      const time = tr.querySelector('.hour-time')?.value.trim();
      if (days && time) {
        updatedHours.push({ days, time });
      }
    });

    data.contact = {
      phone: contactPhone.value.trim(),
      email: contactEmail.value.trim(),
      address: contactAddress.value.trim(),
      instagram: contactInstagram.value.trim(),
      facebook: contactFacebook.value.trim(),
      directionsUrl: contactDirections.value.trim(),
      mapEmbedUrl: contactMapEmbed.value.trim(),
      hours: updatedHours
    };

    CMS.saveSiteData(data);
    showToast('İletişim ve çalışma saatleri kaydedildi!', 'success');
  });

  /* ──────────────── 3. IMAGES & GALLERY MANAGEMENT ──────────────── */
  // Hero Image
  const heroImgPreview = document.getElementById('hero-img-preview');
  const heroImgUrl = document.getElementById('hero-img-url');
  const heroImgFile = document.getElementById('hero-img-file');
  const btnSaveHeroImage = document.getElementById('btn-save-hero-image');

  // About Image
  const aboutImgPreview = document.getElementById('about-img-preview');
  const aboutImgUrl = document.getElementById('about-img-url');
  const aboutImgFile = document.getElementById('about-img-file');
  const btnSaveAboutImage = document.getElementById('btn-save-about-image');

  // Gallery
  const galleryAdminGrid = document.getElementById('gallery-admin-grid');
  const btnAddGalleryItem = document.getElementById('btn-add-gallery-item');
  const formGalleryItem = document.getElementById('form-gallery-item');
  const galleryItemId = document.getElementById('gallery-item-id');
  const galleryItemLabel = document.getElementById('gallery-item-label');
  const galleryItemSpan = document.getElementById('gallery-item-span');
  const galleryItemImgPreview = document.getElementById('gallery-item-img-preview');
  const galleryItemImgUrl = document.getElementById('gallery-item-img-url');
  const galleryItemImgFile = document.getElementById('gallery-item-img-file');

  function renderImagesAdmin() {
    const data = CMS.getSiteData();

    // Hero
    heroImgPreview.src = data.hero.bgImage || '';
    heroImgUrl.value = data.hero.bgImage || '';

    // About
    aboutImgPreview.src = data.about.image || '';
    aboutImgUrl.value = data.about.image || '';

    // Gallery
    renderGalleryAdmin();
  }

  heroImgUrl.addEventListener('input', () => {
    heroImgPreview.src = heroImgUrl.value;
  });

  heroImgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        heroImgPreview.src = evt.target.result;
        heroImgUrl.value = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  btnSaveHeroImage.addEventListener('click', () => {
    const data = CMS.getSiteData();
    data.hero.bgImage = heroImgUrl.value.trim();
    CMS.saveSiteData(data);
    showToast('Giriş (Hero) arka plan görseli güncellendi!', 'success');
  });

  aboutImgUrl.addEventListener('input', () => {
    aboutImgPreview.src = aboutImgUrl.value;
  });

  aboutImgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        aboutImgPreview.src = evt.target.result;
        aboutImgUrl.value = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  btnSaveAboutImage.addEventListener('click', () => {
    const data = CMS.getSiteData();
    data.about.image = aboutImgUrl.value.trim();
    CMS.saveSiteData(data);
    showToast('Hakkımızda görseli güncellendi!', 'success');
  });

  // Gallery render
  function renderGalleryAdmin() {
    const data = CMS.getSiteData();
    const items = data.gallery || [];
    galleryAdminGrid.innerHTML = '';

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'gallery-admin-card';
      const spanLabel = item.span === 'tall' ? 'Dikey (Tall)' : item.span === 'wide' ? 'Geniş (Wide)' : 'Normal';

      card.innerHTML = `
        <img src="${item.url}" alt="${item.label}" loading="lazy" />
        <div class="gallery-admin-body">
          <p class="gallery-admin-caption">${item.label}</p>
          <div class="gallery-admin-footer">
            <span class="cat-badge">${spanLabel}</span>
            <div>
              <button class="icon-btn delete btn-delete-gal" data-id="${item.id}" title="Sil">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
      galleryAdminGrid.appendChild(card);
    });

    galleryAdminGrid.querySelectorAll('.btn-delete-gal').forEach((btn) => {
      btn.addEventListener('click', () => {
        promptDeleteGalleryItem(btn.dataset.id);
      });
    });
  }

  btnAddGalleryItem.addEventListener('click', () => {
    formGalleryItem.reset();
    galleryItemId.value = '';
    galleryItemImgPreview.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400';
    galleryItemImgUrl.value = '';
    modalGalleryItem.showModal();
  });

  galleryItemImgUrl.addEventListener('input', () => {
    galleryItemImgPreview.src = galleryItemImgUrl.value || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400';
  });

  galleryItemImgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        galleryItemImgPreview.src = evt.target.result;
        galleryItemImgUrl.value = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  formGalleryItem.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = CMS.getSiteData();
    data.gallery = data.gallery || [];

    const newPhoto = {
      id: `gal-${Date.now()}`,
      url: galleryItemImgUrl.value.trim(),
      label: galleryItemLabel.value.trim(),
      span: galleryItemSpan.value
    };

    if (!newPhoto.url) {
      showToast('Lütfen bir görsel URL\'si girin veya fotoğraf yükleyin.', 'error');
      return;
    }

    data.gallery.push(newPhoto);
    CMS.saveSiteData(data);
    showToast('Yeni fotoğraf galeriye eklendi!', 'success');
    modalGalleryItem.close();
    renderGalleryAdmin();
  });

  function promptDeleteGalleryItem(id) {
    const data = CMS.getSiteData();
    const item = (data.gallery || []).find((i) => i.id === id);
    if (!item) return;

    document.getElementById('confirm-delete-message').textContent = `"${item.label}" fotoğrafını galeriden kaldırmak istediğinize emin misiniz?`;
    pendingDeleteAction = () => {
      data.gallery = data.gallery.filter((i) => i.id !== id);
      CMS.saveSiteData(data);
      showToast('Fotoğraf galeriden silindi.', 'info');
      renderGalleryAdmin();
    };

    modalConfirmDelete.showModal();
  }

  /* ──────────────── 4. TEXTS & STORY MANAGEMENT ──────────────── */
  const formTexts = document.getElementById('form-texts-settings');
  const heroEyebrow = document.getElementById('hero-eyebrow');
  const heroBadge = document.getElementById('hero-badge');
  const heroTitleMain = document.getElementById('hero-title-main');
  const heroTitleAccent = document.getElementById('hero-title-accent');
  const heroTagline = document.getElementById('hero-tagline');

  const aboutEyebrow = document.getElementById('about-eyebrow');
  const aboutBadgeYear = document.getElementById('about-badge-year');
  const aboutHeadingMain = document.getElementById('about-heading-main');
  const aboutHeadingAccent = document.getElementById('about-heading-accent');
  const aboutP1 = document.getElementById('about-p1');
  const aboutP2 = document.getElementById('about-p2');
  const aboutP3 = document.getElementById('about-p3');

  function renderTextsAdmin() {
    const data = CMS.getSiteData();

    // Hero
    heroEyebrow.value = data.hero.eyebrow || '';
    heroBadge.value = data.hero.badgeText || '';
    heroTitleMain.value = data.hero.titleMain || '';
    heroTitleAccent.value = data.hero.titleAccent || '';
    heroTagline.value = data.hero.tagline || '';

    // About
    aboutEyebrow.value = data.about.eyebrow || '';
    aboutBadgeYear.value = data.about.badgeYear || '';
    aboutHeadingMain.value = data.about.headingMain || '';
    aboutHeadingAccent.value = data.about.headingAccent || '';

    const paras = data.about.paragraphs || [];
    aboutP1.value = paras[0] || '';
    aboutP2.value = paras[1] || '';
    aboutP3.value = paras[2] || '';
  }

  formTexts.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = CMS.getSiteData();

    data.hero.eyebrow = heroEyebrow.value.trim();
    data.hero.badgeText = heroBadge.value.trim();
    data.hero.titleMain = heroTitleMain.value.trim();
    data.hero.titleAccent = heroTitleAccent.value.trim();
    data.hero.tagline = heroTagline.value.trim();

    data.about.eyebrow = aboutEyebrow.value.trim();
    data.about.badgeYear = aboutBadgeYear.value.trim();
    data.about.headingMain = aboutHeadingMain.value.trim();
    data.about.headingAccent = aboutHeadingAccent.value.trim();

    data.about.paragraphs = [
      aboutP1.value.trim(),
      aboutP2.value.trim(),
      aboutP3.value.trim()
    ].filter(Boolean);

    CMS.saveSiteData(data);
    showToast('Site metinleri başarıyla güncellendi!', 'success');
  });

  /* ──────────────── 5. SETTINGS & BACKUP ──────────────── */
  const formChangePin = document.getElementById('form-change-pin');
  const currentPin = document.getElementById('current-pin');
  const newPin = document.getElementById('new-pin');
  const confirmNewPin = document.getElementById('confirm-new-pin');

  const btnExportBackup = document.getElementById('btn-export-backup');
  const btnQuickExport = document.getElementById('btn-quick-export');
  const fileImportBackup = document.getElementById('file-import-backup');
  const btnTriggerReset = document.getElementById('btn-trigger-reset');
  const btnConfirmResetAction = document.getElementById('btn-confirm-reset-action');

  formChangePin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formChangePin.querySelector('button[type="submit"]');

    if (submitBtn) submitBtn.disabled = true;

    try {
      const isValidCurrent = await CMS.verifyAdminPin(currentPin.value.trim());
      if (!isValidCurrent) {
        showToast('Mevcut PIN hatalı!', 'error');
        return;
      }
      if (newPin.value.trim() !== confirmNewPin.value.trim()) {
        showToast('Yeni PIN tekrarları eşleşmiyor!', 'error');
        return;
      }
      await CMS.setAdminPin(newPin.value.trim());
      formChangePin.reset();
      showToast('Yönetici PIN kodu şifreli olarak başarıyla güncellendi!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  btnExportBackup.addEventListener('click', () => {
    CMS.exportSiteData();
    showToast('Yedek JSON dosyası indirildi.', 'success');
  });

  if (btnQuickExport) {
    btnQuickExport.addEventListener('click', () => {
      CMS.exportSiteData();
      showToast('Yedek JSON dosyası indirildi.', 'success');
    });
  }

  fileImportBackup.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const importedData = JSON.parse(evt.target.result);
        if (!importedData.menu || !importedData.contact) {
          throw new Error('Geçersiz yedek dosyası yapısı.');
        }
        CMS.saveSiteData(importedData);
        showToast('Yedek veriler başarıyla geri yüklendi!', 'success');
        initDashboard();
      } catch (err) {
        showToast(`Yükleme hatası: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
    fileImportBackup.value = '';
  });

  btnTriggerReset.addEventListener('click', () => {
    modalConfirmReset.showModal();
  });

  btnConfirmResetAction.addEventListener('click', () => {
    CMS.resetSiteData();
    modalConfirmReset.close();
    showToast('Site fabrika ayarlarına döndürüldü.', 'info');
    initDashboard();
  });

  /* ──────────────── INITIALIZE ALL DASHBOARD SECTIONS ──────────────── */
  function initDashboard() {
    renderMenuAdmin();
    renderContactAdmin();
    renderImagesAdmin();
    renderTextsAdmin();
  }

  // Initial check on load
  checkAuth();
});
