/*!
 * WIOS — iOS-Style UI Framework | wios.js v1.0
 * Handles: theme, tabs, modals, drawers, sheets, toasts, dropdowns, sidebar scroll-spy
 */
(function (global) {
  'use strict';

  /* ─── Theme ─────────────────────────────────────────────── */
  const THEME_KEY = 'wios-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY)
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    // If color manager is already initialized, save current + load new palette
    if (typeof onThemeSwitch === 'function' && document.getElementById('gcm-panel')) {
      onThemeSwitch(theme);
    }
    document.documentElement.setAttribute('data-wios-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update any toggle labels / icons
    document.querySelectorAll('[data-wios-theme-label]').forEach(el => {
      el.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    });
    document.querySelectorAll('[data-wios-theme-icon]').forEach(icon => {
      icon.innerHTML = theme === 'dark'
        ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
        : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-wios-theme') || getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ─── Tabs ───────────────────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll('[data-wios-tabs]').forEach(tabGroup => {
      tabGroup.querySelectorAll('[data-wios-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.wiosTab;
          // Deactivate all tabs in this group
          tabGroup.querySelectorAll('[data-wios-tab]').forEach(t => t.classList.remove('wios-active'));
          tab.classList.add('wios-active');
          // Hide/show panels
          const panelGroup = tab.closest('[data-wios-tab-group]') || document;
          panelGroup.querySelectorAll('[data-wios-panel]').forEach(panel => {
            panel.style.display = panel.dataset.wiosPanel === target ? '' : 'none';
          });
        });
      });
    });

    // Pill tabs (no data-wios-tabs, just .wios-tab inside .wios-tabs)
    document.querySelectorAll('.wios-tabs').forEach(bar => {
      bar.querySelectorAll('.wios-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          bar.querySelectorAll('.wios-tab').forEach(t => t.classList.remove('wios-active'));
          tab.classList.add('wios-active');
        });
      });
    });

    // Underline tabs
    document.querySelectorAll('.wios-tabs-underline').forEach(bar => {
      bar.querySelectorAll('.wios-tab-underline').forEach(tab => {
        tab.addEventListener('click', () => {
          bar.querySelectorAll('.wios-tab-underline').forEach(t => t.classList.remove('wios-active'));
          tab.classList.add('wios-active');
        });
      });
    });
  }

  /* ─── Modal ──────────────────────────────────────────────── */
  function openModal(id) {
    const backdrop = document.getElementById(id);
    if (!backdrop) return;
    backdrop.classList.add('wios-open');
    document.body.style.overflow = 'hidden';
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(id); }, { once: true });
  }

  function closeModal(id) {
    const backdrop = document.getElementById(id);
    if (!backdrop) return;
    backdrop.classList.remove('wios-open');
    document.body.style.overflow = '';
  }

  function initModals() {
    document.querySelectorAll('[data-wios-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.wiosModalOpen));
    });
    document.querySelectorAll('[data-wios-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.wiosModalClose));
    });
    // ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.wios-modal-backdrop.wios-open').forEach(el => {
          el.classList.remove('wios-open');
          document.body.style.overflow = '';
        });
      }
    });
  }

  /* ─── Drawer ─────────────────────────────────────────────── */
  function openDrawer(id) {
    const el = document.getElementById(id);
    const backdrop = document.querySelector(`[data-wios-drawer-backdrop="${id}"]`);
    if (el) el.classList.add('wios-open');
    if (backdrop) {
      backdrop.classList.add('wios-open');
      backdrop.addEventListener('click', () => closeDrawer(id), { once: true });
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(id) {
    const el = document.getElementById(id);
    const backdrop = document.querySelector(`[data-wios-drawer-backdrop="${id}"]`);
    if (el) el.classList.remove('wios-open');
    if (backdrop) backdrop.classList.remove('wios-open');
    document.body.style.overflow = '';
  }

  function initDrawers() {
    document.querySelectorAll('[data-wios-drawer-open]').forEach(btn => {
      btn.addEventListener('click', () => openDrawer(btn.dataset.wiosDrawerOpen));
    });
    document.querySelectorAll('[data-wios-drawer-close]').forEach(btn => {
      btn.addEventListener('click', () => closeDrawer(btn.dataset.wiosDrawerClose));
    });
  }

  /* ─── Bottom Sheet ───────────────────────────────────────── */
  function openSheet(id) {
    const el = document.getElementById(id);
    const backdrop = document.querySelector(`[data-wios-sheet-backdrop="${id}"]`);
    if (el) el.classList.add('wios-open');
    if (backdrop) {
      backdrop.classList.add('wios-open');
      backdrop.addEventListener('click', () => closeSheet(id), { once: true });
    }
    document.body.style.overflow = 'hidden';
  }

  function closeSheet(id) {
    const el = document.getElementById(id);
    const backdrop = document.querySelector(`[data-wios-sheet-backdrop="${id}"]`);
    if (el) el.classList.remove('wios-open');
    if (backdrop) backdrop.classList.remove('wios-open');
    document.body.style.overflow = '';
  }

  function initSheets() {
    document.querySelectorAll('[data-wios-sheet-open]').forEach(btn => {
      btn.addEventListener('click', () => openSheet(btn.dataset.wiosSheetOpen));
    });
    document.querySelectorAll('[data-wios-sheet-close]').forEach(btn => {
      btn.addEventListener('click', () => closeSheet(btn.dataset.wiosSheetClose));
    });
  }

  /* ─── Toast ──────────────────────────────────────────────── */
  let toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'wios-toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  const TOAST_ICONS = {
    primary: 'ℹ',
    success: '✓',
    warning: '!',
    danger:  '✕',
  };

  function toast(options) {
    if (typeof options === 'string') options = { message: options };
    const {
      message = '',
      subtitle = '',
      type = 'primary',
      duration = 3500,
    } = options;

    const container = getToastContainer();
    const el = document.createElement('div');
    el.className = `wios-toast wios-toast-${type}`;

    const icon = TOAST_ICONS[type] || TOAST_ICONS.primary;
    el.innerHTML = `
      <span class="wios-toast-icon">${icon}</span>
      <div>
        <div class="wios-toast-msg">${message}</div>
        ${subtitle ? `<div class="wios-toast-sub">${subtitle}</div>` : ''}
      </div>
    `;
    container.appendChild(el);

    // Auto dismiss
    const dismiss = () => {
      el.classList.add('wios-toast-out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };
    const timer = setTimeout(dismiss, duration);
    el.addEventListener('click', () => { clearTimeout(timer); dismiss(); });

    return { dismiss };
  }

  /* ─── Dropdown ───────────────────────────────────────────── */
  function initDropdowns() {
    document.querySelectorAll('[data-wios-dropdown]').forEach(trigger => {
      const menuId = trigger.dataset.wiosDropdown;
      const menu   = document.getElementById(menuId);
      if (!menu) return;

      trigger.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('wios-open');
        // Close all others
        document.querySelectorAll('.wios-dropdown-menu.wios-open').forEach(m => m.classList.remove('wios-open'));
        if (!isOpen) menu.classList.add('wios-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.wios-dropdown-menu.wios-open').forEach(m => m.classList.remove('wios-open'));
    });
  }

  /* ─── Progress Bar ───────────────────────────────────────── */
  function setProgress(selector, value) {
    const bar = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!bar) return;
    const clamped = Math.min(100, Math.max(0, value));
    bar.style.width = clamped + '%';
    bar.setAttribute('aria-valuenow', clamped);
  }

  /* ─── Copy to clipboard helper ───────────────────────────── */
  function copyText(text, btnEl) {
    navigator.clipboard.writeText(text).then(() => {
      if (btnEl) {
        const orig = btnEl.textContent;
        btnEl.textContent = 'Copied!';
        setTimeout(() => { btnEl.textContent = orig; }, 2000);
      }
    });
  }

  /* ─── Scroll-spy for sidebar ─────────────────────────────── */
  function initScrollSpy(options = {}) {
    const {
      navSelector     = '.docs-nav-link',
      sectionSelector = '[data-wios-section]',
      activeClass     = 'docs-active',
      scrollRoot      = null,
      threshold       = 0.2,
    } = options;

    const links    = document.querySelectorAll(navSelector);
    const sections = document.querySelectorAll(sectionSelector);
    if (!links.length || !sections.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle(activeClass, l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold, root: scrollRoot });

    sections.forEach(s => obs.observe(s));
  }

  /* ─── Toggle API (public helper) ────────────────────────── */
  function toggleOpen(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('wios-open');
  }

  /* ─── Init ───────────────────────────────────────────────── */
  function init(options = {}) {
    // Apply stored / preferred theme
    applyTheme(getTheme());

    // Wire up theme toggle triggers
    document.querySelectorAll('[data-wios-toggle-theme]').forEach(el => {
      el.addEventListener('click', toggleTheme);
    });

    initTabs();
    initModals();
    initDrawers();
    initSheets();
    initDropdowns();

    // Scroll-spy (only if sidebar present)
    if (document.querySelector('.docs-nav-link')) {
      initScrollSpy(options.scrollSpy || {});
    }
  }

  /* ─── Auto-init on DOM ready ─────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

  /* ─── Public API ─────────────────────────────────────────── */
  global.WIOS = {
    init,
    toggleTheme,
    applyTheme,
    getTheme,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    openSheet,
    closeSheet,
    toast,
    setProgress,
    copyText,
    toggleOpen,
    initScrollSpy,
  };


  
  /* ─── Global Color Manager ───────────────────────────────── */

  const GCM_KEY_LIGHT = 'wios-gc-theme-light';
  const GCM_KEY_DARK  = 'wios-gc-theme-dark';

  // Default values per theme
  const GCM_DEFAULTS = {
    light: {
      '--gc-primary':      '#007aff',
      '--gc-secondary':    '#5856d6',
      '--gc-success':      '#34c759',
      '--gc-danger':       '#ff3b30',
      '--gc-warning':      '#ff9500',
      '--gc-info':         '#2997ff',
      '--gc-bg-main':      '#f5f5f7',
      '--gc-bg-section':   '#f0f0f5',
      '--gc-bg-card':      '#ffffff',
      '--gc-text-heading': '#1d1d1f',
      '--gc-text-body':    '#3c3c43',
      '--gc-text-muted':   '#6e6e73',
      '--gc-text-inverse': '#ffffff',
    },
    dark: {
      '--gc-primary':      '#0a84ff',
      '--gc-secondary':    '#5e5ce6',
      '--gc-success':      '#30d158',
      '--gc-danger':       '#ff453a',
      '--gc-warning':      '#ffd60a',
      '--gc-info':         '#64d2ff',
      '--gc-bg-main':      '#000000',
      '--gc-bg-section':   '#1c1c1e',
      '--gc-bg-card':      '#2c2c2e',
      '--gc-text-heading': '#ffffff',
      '--gc-text-body':    '#e5e5ea',
      '--gc-text-muted':   '#aeaeb2',
      '--gc-text-inverse': '#000000',
    },
  };

  function activeTheme() {
    return document.documentElement.getAttribute('data-wios-theme') || 'light';
  }

  function storageKey(theme) {
    return theme === 'dark' ? GCM_KEY_DARK : GCM_KEY_LIGHT;
  }

  // Apply a single color variable (and any linked --wios-* aliases)
  function applyGCVar(varName, hex, aliases) {
    document.documentElement.style.setProperty(varName, hex);
    if (aliases) {
      aliases.split(' ').forEach(a => {
        if (a.trim()) document.documentElement.style.setProperty(a.trim(), hex);
      });
    }
    const swEl = document.getElementById('sw-' + varName.replace('--', ''));
    const hxEl = document.getElementById('hx-' + varName.replace('--', ''));
    const cpEl = document.getElementById('cp-' + varName.replace('--', ''));
    if (swEl) swEl.style.background = hex;
    if (hxEl) hxEl.textContent = hex.toUpperCase();
    if (cpEl) cpEl.value = hex;
  }

  function applyThemeColors(colors) {
    Object.entries(colors).forEach(([varName, hex]) => {
      const cp = document.getElementById('cp-' + varName.replace('--', ''));
      const aliases = cp ? cp.dataset.also : '';
      applyGCVar(varName, hex, aliases);
    });
  }

  function getCurrentColors() {
    const out = {};
    const defaults = GCM_DEFAULTS[activeTheme()];
    Object.keys(defaults).forEach(varName => {
      const cp = document.getElementById('cp-' + varName.replace('--', ''));
      out[varName] = cp ? cp.value : defaults[varName];
    });
    return out;
  }

  function loadStoredColors(theme) {
    try {
      const raw = localStorage.getItem(storageKey(theme));
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
  }

  function saveColors(colors, theme) {
    localStorage.setItem(storageKey(theme), JSON.stringify(colors));
  }

  // Update the theme badge text in the panel header
  function updateGCMBadge(theme) {
    const badge = document.getElementById('gcm-theme-badge');
    if (!badge) return;
    badge.textContent = theme === 'dark' ? '● Dark' : '● Light';
    badge.dataset.theme = theme;
  }

  // Called by applyTheme() — saves current colors for the OLD theme,
  // then loads + applies colors for the NEW theme
  function onThemeSwitch(newTheme) {
    const oldTheme = newTheme === 'dark' ? 'light' : 'dark';
    // Save current picker state under old theme key
    saveColors(getCurrentColors(), oldTheme);
    // Load new theme colors (stored or defaults)
    const colors = loadStoredColors(newTheme) || { ...GCM_DEFAULTS[newTheme] };
    applyThemeColors(colors);
    updateGCMBadge(newTheme);
  }

  function initColorManager() {
    const theme = activeTheme();
    const colors = loadStoredColors(theme) || { ...GCM_DEFAULTS[theme] };
    applyThemeColors(colors);
    updateGCMBadge(theme);

    // Wire up all color pickers
    document.querySelectorAll('.docs-cm-picker').forEach(input => {
      input.addEventListener('input', () => {
        const hex = input.value;
        const varName = input.dataset.var;
        const aliases = input.dataset.also || '';
        applyGCVar(varName, hex, aliases);
        saveColors(getCurrentColors(), activeTheme());
      });
    });

    // Reset button — resets to defaults for active theme
    const resetBtn = document.getElementById('gcm-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const defaults = { ...GCM_DEFAULTS[activeTheme()] };
        applyThemeColors(defaults);
        saveColors(defaults, activeTheme());
      });
    }
  }

  function saveThemeJSON() {
    const theme = activeTheme();
    const colors = getCurrentColors();
    const payload = { theme, colors };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'wios-theme-' + theme + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadThemeJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target.result);
          // Support both new format { theme, colors } and legacy flat format
          const colors = parsed.colors || parsed;
          applyThemeColors(colors);
          saveColors(colors, activeTheme());
        } catch(err) {
          alert('Invalid JSON theme file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function exportThemeHTML() {
    const colors = getCurrentColors();
    const varBlock = Object.entries(colors)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WIOS Theme Snapshot</title>
  <style>
    /* ── Injected Global Color System ── */
    :root {
${varBlock}
    }
    /* Resets */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif; background: var(--gc-bg-main); color: var(--gc-text-body); padding: 2rem; }
    h1,h2,h3 { color: var(--gc-text-heading); margin-bottom: 0.5rem; }
    p { color: var(--gc-text-body); margin-bottom: 1rem; }
    .muted { color: var(--gc-text-muted); }
    .inverse { color: var(--gc-text-inverse); background: var(--gc-text-heading); padding: 2px 8px; border-radius: 4px; }
    .swatch-grid { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.5rem 0; }
    .swatch { width: 80px; text-align: center; }
    .swatch-block { width: 100%; height: 60px; border-radius: 10px; border: 1px solid rgba(0,0,0,.1); margin-bottom: 6px; }
    .swatch-name { font-size: 0.65rem; font-weight: 600; }
    .btn-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.5rem 0; }
    .btn { padding: 0.5rem 1.25rem; border-radius: 999px; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; color: #fff; }
    .section { background: var(--gc-bg-section); padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; }
    .card { background: var(--gc-bg-card); padding: 1rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  </style>
</head>
<body>
  <h1>WIOS Theme Snapshot</h1>
  <p class="muted">Exported on ${new Date().toLocaleString()}</p>

  <div class="section">
    <h2>Brand Colors</h2>
    <div class="swatch-grid">
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-primary)"></div><div class="swatch-name">Primary</div></div>
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-secondary)"></div><div class="swatch-name">Secondary</div></div>
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-success)"></div><div class="swatch-name">Success</div></div>
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-danger)"></div><div class="swatch-name">Danger</div></div>
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-warning)"></div><div class="swatch-name">Warning</div></div>
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-info)"></div><div class="swatch-name">Info</div></div>
    </div>
    <div class="btn-row">
      <button class="btn" style="background:var(--gc-primary)">Primary</button>
      <button class="btn" style="background:var(--gc-secondary)">Secondary</button>
      <button class="btn" style="background:var(--gc-success)">Success</button>
      <button class="btn" style="background:var(--gc-danger)">Danger</button>
      <button class="btn" style="background:var(--gc-warning)">Warning</button>
      <button class="btn" style="background:var(--gc-info)">Info</button>
    </div>
  </div>

  <div class="section">
    <h2>Backgrounds &amp; Cards</h2>
    <div class="swatch-grid">
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-bg-main);border:1px solid rgba(0,0,0,.12)"></div><div class="swatch-name">Main</div></div>
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-bg-section);border:1px solid rgba(0,0,0,.12)"></div><div class="swatch-name">Section</div></div>
      <div class="swatch"><div class="swatch-block" style="background:var(--gc-bg-card);border:1px solid rgba(0,0,0,.12)"></div><div class="swatch-name">Card</div></div>
    </div>
    <div class="card"><p>This is a card using <strong>--gc-bg-card</strong> as background.</p></div>
  </div>

  <div class="section">
    <h2>Typography</h2>
    <h1 style="color:var(--gc-text-heading)">Heading H1</h1>
    <h2 style="color:var(--gc-text-heading)">Heading H2</h2>
    <h3 style="color:var(--gc-text-heading)">Heading H3</h3>
    <p>Body text using <strong>--gc-text-body</strong>.</p>
    <p class="muted">Muted text using <strong>--gc-text-muted</strong>.</p>
    <p><span class="inverse">Inverse text on dark background</span></p>
  </div>

  <div class="section">
    <h2>CSS Variables</h2>
    <pre style="font-size:0.75rem;background:var(--gc-bg-card);padding:1rem;border-radius:8px;overflow-x:auto;color:var(--gc-text-body)">:root {\n${varBlock}\n}</pre>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'wios-theme-snapshot.html';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ─── Extend Public API ──────────────────────────────────── */
  global.WIOS.saveThemeJSON  = saveThemeJSON;
  global.WIOS.loadThemeJSON  = loadThemeJSON;
  global.WIOS.exportThemeHTML = exportThemeHTML;
  global.WIOS.getCurrentColors = getCurrentColors;
  global.WIOS.applyThemeColors = applyThemeColors;

  /* ─── Auto-init color manager on DOM ready ───────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initColorManager);
  } else {
    initColorManager();
  }

})(window);
