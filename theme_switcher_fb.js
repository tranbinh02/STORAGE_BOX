// ==UserScript==
// @name         Theme Switcher FB
// @namespace    * 
// @version      1.0.0
// @description  Chuyển đổi màu sắc tùy thích cho fb
// @author       Binh
// @match        *://www.facebook.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // ─── Inject CSS ───────────────────────────────────────────────────────────────
  GM_addStyle(`
/**
 * Distracted Work Site - Theme Definitions
 * CSS custom properties per theme, applied via data-style attribute on <body>.
 * Sourced from the distracted.work extension's shared/themes.css.
 */

/* === Classic (default) === */
/* ── Map Facebook blue vars → theme accent ──────────────────────────── */

/* Helper: mỗi theme override các biến FB dùng màu xanh */
body[data-style="classic"], body:not([data-style]) {
  --fb-accent: #4361ee;
}
body[data-style="new-york"]    { --fb-accent: #326891; }
body[data-style="nord"]        { --fb-accent: #5e81ac; }
body[data-style="catppuccin"]  { --fb-accent: #1e66f5; }
body[data-style="tokyo-night"] { --fb-accent: #34548a; }
body[data-style="molokai"].light { --fb-accent: #f92672; }
body[data-style="molokai"].dark  { --fb-accent: #a6e22e; }
body[data-style="dracula"]     { --fb-accent: #bd93f9; }
body[data-style="solarized"]   { --fb-accent: #268bd2; }
body[data-style="gruvbox"].light { --fb-accent: #d65d0e; }
body[data-style="gruvbox"].dark  { --fb-accent: #fe8019; }
body[data-style="one-dark"].light { --fb-accent: #4078f2; }
body[data-style="one-dark"].dark  { --fb-accent: #61afef; }
body[data-style="rose-pine"]   { --fb-accent: #907aa9; }
body[data-style="synthwave-84"] { --fb-accent: #ff7edb; }
body[data-style="everforest"].light { --fb-accent: #8da101; }
body[data-style="everforest"].dark  { --fb-accent: #a7c080; }
body[data-style="kanagawa"]    { --fb-accent: #957fb8; }
body[data-style="ayu"].light   { --fb-accent: #ff9940; }
body[data-style="ayu"].dark    { --fb-accent: #ffb454; }
body[data-style="palenight"]   { --fb-accent: #82aaff; }
body[data-style="horizon"].light { --fb-accent: #da103f; }
body[data-style="horizon"].dark  { --fb-accent: #e95678; }

/* Apply --fb-accent vào tất cả biến xanh của FB */
body {
  --primary-button-background:              var(--fb-accent);
  --cursor:                                 var(--fb-accent);
  --fb-logo:                                var(--fb-accent);
  --fb-wordmark:                            var(--fb-accent);
  --blue-link:                              var(--fb-accent);
  --story-unseen:                           var(--fb-accent);
  --reaction-like:                          var(--fb-accent);
  --text-input-active-text:                 var(--fb-accent);
  --toggle-active-icon:                     var(--fb-accent);
  --toggle-active-text:                     var(--fb-accent);
  --primary-deemphasized-button-icon:       var(--fb-accent);
  --primary-deemphasized-button-text:       var(--fb-accent);
  --progress-ring-blue-foreground:          var(--fb-accent);
  /* Các biến dùng màu xanh ở dạng alpha — tạo lại từ accent */
  --text-highlight:               color-mix(in srgb, var(--fb-accent) 20%, transparent);
  --progress-ring-blue-background:color-mix(in srgb, var(--fb-accent) 20%, transparent);
  --toggle-active-background:     color-mix(in srgb, var(--fb-accent) 15%, transparent);
  --hosted-view-selected-state:   color-mix(in srgb, var(--fb-accent) 10%, #fff);
  --new-notification-background:  color-mix(in srgb, var(--fb-accent) 10%, #fff);
  --primary-deemphasized-button-background: color-mix(in srgb, var(--fb-accent) 12%, #fff);
}

/* Smooth theme transitions */
body, .info-box, .media-frame, .steps li::before, .btn-primary, .site-footer {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
    /* Theme FAB */
    .theme-fab-container {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 1000;
    }
    .theme-fab-btn {
      width: 48px; height: 48px; border-radius: 50%; border: none;
      color: #fff; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, box-shadow 0.15s, background-color 0.2s;
    }
    .theme-fab-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    }
    .theme-fab-panel {
      position: absolute; bottom: 60px; right: 0;
      background: var(--card-bg, #fff); border: 1px solid var(--card-border, #e0e0e0);
      border-radius: 16px; padding: 1rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      opacity: 0; transform: translateY(8px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      min-width: 220px;
    }
    .theme-fab-panel.open {
      opacity: 1; transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .theme-mode-row {
      display: flex; gap: 0.25rem; margin-bottom: 0.75rem;
    }
    .theme-mode-btn {
      flex: 1; padding: 0.4rem; border: 1px solid var(--divider, #e0e0e0);
      border-radius: 8px; background: transparent; color: var(--text, #333);
      font-size: 0.8rem; font-weight: 600; cursor: pointer;
      transition: background-color 0.15s, border-color 0.15s;
    }
    .theme-mode-btn.active {
      background: var(--accent, #4361ee); color: #fff;
      border-color: var(--accent, #4361ee);
    }
    .theme-swatch-grid {
      display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.4rem;
    }
    .theme-swatch {
      width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent;
      cursor: pointer; transition: transform 0.15s, border-color 0.15s;
      padding: 0; position: relative;
    }
    .theme-swatch:hover { transform: scale(1.15); }
    .theme-swatch:hover::after {
      content: attr(title);
      position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
      background: var(--text, #333); color: var(--bg, #fff);
      font-size: 0.7rem; font-weight: 600; white-space: nowrap;
      padding: 0.2rem 0.5rem; border-radius: 4px;
      margin-bottom: 4px; pointer-events: none;
    }
    .theme-swatch.active {
      border-color: var(--text, #333);
      box-shadow: 0 0 0 2px var(--bg, #fff);
    }

    /* Fade-in animation */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `);

  // ─── Data ────────────────────────────────────────────────────────────────────
  var THEMES = [
    { id: 'classic',     name: 'Classic',     accent: '#4361ee' },
    { id: 'new-york',    name: 'New York',    accent: '#326891' },
    { id: 'nord',        name: 'Nord',        accent: '#5e81ac' },
    { id: 'catppuccin',  name: 'Catppuccin',  accent: '#1e66f5' },
    { id: 'tokyo-night', name: 'Tokyo Night', accent: '#34548a' },
    { id: 'molokai',     name: 'Molokai',     accent: '#f92672' },
    { id: 'dracula',     name: 'Dracula',     accent: '#bd93f9' },
    { id: 'solarized',   name: 'Solarized',   accent: '#268bd2' },
    { id: 'gruvbox',     name: 'Gruvbox',     accent: '#d65d0e' },
    { id: 'one-dark',    name: 'One Dark',    accent: '#4078f2' },
    { id: 'rose-pine',   name: 'Rosé Pine',   accent: '#907aa9' },
    { id: 'synthwave-84',name: "Synthwave '84",accent: '#ff7edb' },
    { id: 'everforest',  name: 'Everforest',  accent: '#8da101' },
    { id: 'kanagawa',    name: 'Kanagawa',    accent: '#957fb8' },
    { id: 'ayu',         name: 'Ayu',         accent: '#ff9940' },
    { id: 'palenight',   name: 'Palenight',   accent: '#82aaff' },
    { id: 'horizon',     name: 'Horizon',     accent: '#da103f' }
  ];

  var MODES = ['auto', 'light', 'dark'];

  // ─── Storage (GM_getValue / GM_setValue thay cho cookie) ─────────────────────
  function loadPrefs() {
    var raw = GM_getValue('dw-theme', 'auto|classic');
    var parts = raw.split('|');
    return { mode: parts[0] || 'auto', style: parts[1] || 'classic' };
  }

  function savePrefs(mode, style) {
    GM_setValue('dw-theme', mode + '|' + style);
  }

  // ─── Theme logic ──────────────────────────────────────────────────────────────
  function resolveMode(mode) {
    if (mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  }

  function applyTheme(mode, style) {
    var resolved = resolveMode(mode);
    document.body.className = document.body.className
      .replace(/\b(light|dark)\b/g, '').trim();
    document.body.classList.add(resolved);
    if (style && style !== 'classic') {
      document.body.setAttribute('data-style', style);
    } else {
      document.body.removeAttribute('data-style');
    }
  }

  function saveAndApply(mode, style) {
    currentMode = mode;
    currentStyle = style;
    savePrefs(mode, style);
    applyTheme(mode, style);
    updateFABState();
  }

  // ─── State ────────────────────────────────────────────────────────────────────
  var prefs = loadPrefs();
  var currentMode  = prefs.mode;
  var currentStyle = prefs.style;

  // Apply trước khi DOM sẵn sàng để tránh flash
  if (document.body) {
    applyTheme(currentMode, currentStyle);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      applyTheme(currentMode, currentStyle);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (currentMode === 'auto') applyTheme(currentMode, currentStyle);
  });

  // ─── FAB UI ──────────────────────────────────────────────────────────────────
  var fabPanel = null;
  var fabBtn   = null;
  var isOpen   = false;

  function updateFABState() {
    if (!fabPanel) return;

    fabPanel.querySelectorAll('[data-mode]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === currentMode);
    });

    fabPanel.querySelectorAll('[data-style]').forEach(function (sw) {
      var active = sw.getAttribute('data-style') === currentStyle;
      sw.classList.toggle('active', active);
      sw.setAttribute('aria-checked', active ? 'true' : 'false');
    });

    if (fabBtn) {
      var theme = THEMES.find(function (t) { return t.id === currentStyle; });
      fabBtn.style.backgroundColor = theme ? theme.accent : '#4361ee';
    }
  }

  function togglePanel() {
    isOpen = !isOpen;
    fabPanel.classList.toggle('open', isOpen);
    fabBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closePanel() {
    isOpen = false;
    fabPanel.classList.remove('open');
    fabBtn.setAttribute('aria-expanded', 'false');
  }

  function buildFAB() {
    var container = document.createElement('div');
    container.className = 'theme-fab-container';

    // FAB button
    fabBtn = document.createElement('button');
    fabBtn.className = 'theme-fab-btn';
    fabBtn.setAttribute('aria-label', 'Change theme');
    fabBtn.setAttribute('aria-expanded', 'false');
    fabBtn.setAttribute('aria-controls', 'theme-panel');
    fabBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="6.5" cy="12" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.7 1.7-1.5 0-.4-.2-.7-.4-1-.2-.3-.3-.6-.3-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z"/></svg>';
    fabBtn.addEventListener('click', togglePanel);

    // Panel
    fabPanel = document.createElement('div');
    fabPanel.className = 'theme-fab-panel';
    fabPanel.id = 'theme-panel';

    // Mode buttons
    var modeRow = document.createElement('div');
    modeRow.className = 'theme-mode-row';
    MODES.forEach(function (mode) {
      var btn = document.createElement('button');
      btn.className = 'theme-mode-btn';
      btn.setAttribute('data-mode', mode);
      btn.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
      btn.addEventListener('click', function () {
        saveAndApply(mode, currentStyle);
      });
      modeRow.appendChild(btn);
    });
    fabPanel.appendChild(modeRow);

    // Theme swatches
    var grid = document.createElement('div');
    grid.className = 'theme-swatch-grid';
    grid.setAttribute('role', 'radiogroup');
    grid.setAttribute('aria-label', 'Theme style');
    THEMES.forEach(function (theme) {
      var swatch = document.createElement('button');
      swatch.className = 'theme-swatch';
      swatch.setAttribute('data-style', theme.id);
      swatch.setAttribute('role', 'radio');
      swatch.setAttribute('aria-label', theme.name);
      swatch.setAttribute('aria-checked', 'false');
      swatch.setAttribute('title', theme.name);
      swatch.style.backgroundColor = theme.accent;
      swatch.addEventListener('click', function () {
        saveAndApply(currentMode, theme.id);
      });
      grid.appendChild(swatch);
    });
    fabPanel.appendChild(grid);

    container.appendChild(fabPanel);
    container.appendChild(fabBtn);
    document.body.appendChild(container);

    updateFABState();

    document.addEventListener('click', function (e) {
      if (isOpen && !container.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
        fabBtn.focus();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', buildFAB);
})();
