/**
 * Main entry point for Zen HN content script.
 * This file runs last and initializes the extension.
 */

import { initColorMode, initTheme, listenForSystemColorModeChanges } from "./colorMode";
import { runSidebarWhenReady } from "./sidebar";
import { runCommentCollapseWhenReady } from "./commentCollapse";
import { initRestyle } from "./initRestyle";
import { registerKeyboardShortcuts } from "./keyboardShortcuts";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ENABLED_STORAGE_KEY = "zenHnEnabled";

async function getEnabled(): Promise<boolean> {
  if (!chrome?.storage?.local) {
    return true; // Default to enabled if storage not available
  }
  const result = await chrome.storage.local.get(ENABLED_STORAGE_KEY);
  return result[ENABLED_STORAGE_KEY] !== false;
}

function enableExtension(): void {
  // CSS handles showing/hiding based on this attribute
  document.documentElement.dataset.zenHnEnabled = "true";
}

function disableExtension(): void {
  // CSS handles showing/hiding based on this attribute
  document.documentElement.dataset.zenHnEnabled = "false";
}

function listenForToggle(): void {
  if (!chrome?.runtime?.onMessage) {
    return;
  }
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "zenHnToggle") {
      if (message.enabled) {
        enableExtension();
      } else {
        disableExtension();
      }
    }
  });
}

async function init(): Promise<void> {
  const enabled = await getEnabled();

  // Set initial enabled state (CSS uses this to show/hide UI)
  document.documentElement.dataset.zenHnEnabled = enabled ? "true" : "false";

  // Listen for toggle messages from background script
  listenForToggle();

  // Always initialize - CSS controls visibility based on enabled state
  // Mark extension as active
  document.documentElement.dataset.zenHnActive = "true";

  // Set loading states for UI elements
  if (!document.documentElement.dataset.zenHnSidebar) {
    document.documentElement.dataset.zenHnSidebar = "loading";
  }

  if (window.location.pathname === "/item") {
    document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "loading";
  }

  // Initialize color mode and theme from storage on startup
  initColorMode();
  initTheme();

  // Listen for system color scheme changes
  listenForSystemColorModeChanges();

  // Run comment collapse early on item pages
  if (window.location.pathname === "/item") {
    runCommentCollapseWhenReady();
  }

  // Initialize sidebar
  runSidebarWhenReady();

  // Initialize restyling when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initRestyle();
    });
  } else {
    initRestyle();
  }
}

// Register keyboard shortcuts immediately (no need to wait for async init)
registerKeyboardShortcuts();

// Start initialization
init();
