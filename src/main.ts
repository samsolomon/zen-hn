/**
 * Main entry point for Zen HN content script.
 * This file runs last and initializes the extension.
 */

import { initColorMode, initTheme, listenForSystemColorModeChanges } from "./colorMode";
import { runSidebarWhenReady } from "./sidebar";
import { runCommentCollapseWhenReady } from "./commentCollapse";
import { initRestyle } from "./initRestyle";

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
  document.documentElement.dataset.zenHnEnabled = "true";

  // Show zen-hn elements
  const zenMain = document.getElementById("zen-hn-main");
  if (zenMain) {
    zenMain.style.display = "";
  }
  const zenSidebar = document.getElementById("zen-hn-sidebar");
  if (zenSidebar) {
    zenSidebar.style.display = "";
  }

  // Hide original HN content
  const hnmain = document.getElementById("hnmain");
  const centerWrapper = hnmain?.closest("center") as HTMLElement | null;
  if (centerWrapper) {
    centerWrapper.style.display = "none";
  } else if (hnmain) {
    hnmain.style.display = "none";
  }
}

function disableExtension(): void {
  document.documentElement.dataset.zenHnEnabled = "false";

  // Hide zen-hn elements
  const zenMain = document.getElementById("zen-hn-main");
  if (zenMain) {
    zenMain.style.display = "none";
  }
  const zenSidebar = document.getElementById("zen-hn-sidebar");
  if (zenSidebar) {
    zenSidebar.style.display = "none";
  }

  // Show original HN content
  const hnmain = document.getElementById("hnmain");
  const centerWrapper = hnmain?.closest("center") as HTMLElement | null;
  if (centerWrapper) {
    centerWrapper.style.display = "";
  } else if (hnmain) {
    hnmain.style.display = "";
  }
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

  // Set initial enabled state
  document.documentElement.dataset.zenHnEnabled = enabled ? "true" : "false";

  // Listen for toggle messages from background script
  listenForToggle();

  if (!enabled) {
    // Extension is disabled, don't initialize
    return;
  }

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

// Start initialization
init();
