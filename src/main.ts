/**
 * Main entry point for Zen HN content script.
 * This file runs last and initializes the extension.
 */

// Inject critical styles synchronously at module load (before any async)
// This prevents FOUC by applying system preference immediately and hiding body
(function injectCriticalStyles() {
  const style = document.createElement("style");
  style.id = "zen-hn-critical";

  // Detect system dark mode preference synchronously
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.documentElement.classList.add("dark-theme");
  }

  // Hide body until extension is ready (prevents FOUC)
  style.textContent = `
    html:not([data-zen-hn-ready="true"]) body {
      visibility: hidden !important;
    }
  `;
  // Append to documentElement since head may not exist yet at document_start
  (document.head || document.documentElement).appendChild(style);
})();

import { initColorMode, initTheme, initFontFamily, initFontSize, listenForSystemColorModeChanges } from "./colorMode";
import { runSidebarWhenReady } from "./sidebar";
import { runCommentCollapseWhenReady } from "./commentCollapse";
import { runUserSubnavWhenReady } from "./pages";
import { initRestyle } from "./initRestyle";
import { registerKeyboardShortcuts } from "./keyboardShortcuts";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ENABLED_STORAGE_KEY = "zenHnEnabled";

/**
 * Inject @font-face rules with proper extension URLs
 * CSS can't use relative paths in content scripts, so we inject these dynamically
 */
function injectFontFaces(): void {
  if (!chrome?.runtime?.getURL) return;

  const interUrl = chrome.runtime.getURL("dist/fonts/Inter-Variable.woff2");
  const plexRegularUrl = chrome.runtime.getURL("dist/fonts/IBMPlexSans-Regular.woff2");
  const plexMediumUrl = chrome.runtime.getURL("dist/fonts/IBMPlexSans-Medium.woff2");
  const literataUrl = chrome.runtime.getURL("dist/fonts/Literata-Variable.woff2");
  const frauncesUrl = chrome.runtime.getURL("dist/fonts/Fraunces-Variable.woff2");
  const recursiveUrl = chrome.runtime.getURL("dist/fonts/Recursive-Variable.woff2");
  const outfitUrl = chrome.runtime.getURL("dist/fonts/Outfit-Variable.woff2");

  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      src: url('${interUrl}') format('woff2');
      font-weight: 100 900;
      font-display: swap;
    }
    @font-face {
      font-family: 'IBM Plex Sans';
      src: url('${plexRegularUrl}') format('woff2');
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: 'IBM Plex Sans';
      src: url('${plexMediumUrl}') format('woff2');
      font-weight: 500;
      font-display: swap;
    }
    @font-face {
      font-family: 'Literata';
      src: url('${literataUrl}') format('woff2');
      font-weight: 200 900;
      font-display: swap;
    }
    @font-face {
      font-family: 'Fraunces';
      src: url('${frauncesUrl}') format('woff2');
      font-weight: 100 900;
      font-display: swap;
    }
    @font-face {
      font-family: 'Recursive';
      src: url('${recursiveUrl}') format('woff2');
      font-weight: 300 1000;
      font-display: swap;
    }
    @font-face {
      font-family: 'Outfit';
      src: url('${outfitUrl}') format('woff2');
      font-weight: 100 900;
      font-display: swap;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}

async function getEnabled(): Promise<boolean> {
  if (!chrome?.storage?.local) {
    return true; // Default to enabled if storage not available
  }
  const result = await chrome.storage.local.get(ENABLED_STORAGE_KEY);
  return result[ENABLED_STORAGE_KEY] !== false;
}

function listenForToggle(): void {
  if (!chrome?.runtime?.onMessage) {
    return;
  }
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "zenHnToggle") {
      // Reload the page to ensure clean state
      window.location.reload();
    }
  });
}

async function init(): Promise<void> {
  const enabled = await getEnabled();

  // Set initial enabled state (CSS uses this to show/hide UI)
  document.documentElement.dataset.zenHnEnabled = enabled ? "true" : "false";

  // Listen for toggle messages from background script
  listenForToggle();

  // EXIT EARLY if disabled - do not modify the DOM at all
  if (!enabled) {
    // Unhide body and clean up critical styles
    document.documentElement.dataset.zenHnReady = "true";
    document.getElementById("zen-hn-critical")?.remove();
    return;
  }

  // Mark extension as active
  document.documentElement.dataset.zenHnActive = "true";

  // Inject font-face rules with extension URLs
  injectFontFaces();

  // Set loading states for UI elements
  if (!document.documentElement.dataset.zenHnSidebar) {
    document.documentElement.dataset.zenHnSidebar = "loading";
  }

  if (window.location.pathname === "/item") {
    document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "loading";
  }

  // Initialize color mode, theme, and font family from storage on startup
  initColorMode();
  initTheme();
  initFontFamily();
  initFontSize();

  // Listen for system color scheme changes
  listenForSystemColorModeChanges();

  // Run comment collapse early on item pages
  if (window.location.pathname === "/item") {
    runCommentCollapseWhenReady();
  }

  // Initialize sidebar and user subnav early to prevent flash
  runSidebarWhenReady();
  runUserSubnavWhenReady();

  // Initialize restyling when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initRestyle();
    });
  } else {
    initRestyle();
  }

  // Mark as ready (unhides body) and clean up critical styles
  document.documentElement.dataset.zenHnReady = "true";
  document.getElementById("zen-hn-critical")?.remove();
}

// Register keyboard shortcuts immediately (no need to wait for async init)
registerKeyboardShortcuts();

// Start initialization
init();
