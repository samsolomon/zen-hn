/**
 * Main entry point for Zen HN content script.
 * This file runs last and initializes the extension.
 */

import { initColorMode, initTheme, listenForSystemColorModeChanges } from "./colorMode";
import { runSidebarWhenReady } from "./sidebar";
import { runCommentCollapseWhenReady } from "./commentCollapse";
import { initRestyle } from "./initRestyle";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";

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
