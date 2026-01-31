const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ZEN_COLOR_MODE = globalThis.ZenHnColorMode;
const ZEN_SIDEBAR = globalThis.ZenHnSidebar;
const ZEN_COMMENT_COLLAPSE = globalThis.ZenHnCommentCollapse;
const ZEN_INIT_RESTYLE = globalThis.ZenHnInitRestyle;

document.documentElement.dataset.zenHnActive = "true";

if (!document.documentElement.dataset.zenHnSidebar) {
  document.documentElement.dataset.zenHnSidebar = "loading";
}

if (window.location.pathname === "/item") {
  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "loading";
}

// Initialize color mode and theme from storage on startup
ZEN_COLOR_MODE.initColorMode();
ZEN_COLOR_MODE.initTheme();

// Listen for system color scheme changes
ZEN_COLOR_MODE.listenForSystemColorModeChanges();

// Run comment collapse early on item pages
if (window.location.pathname === "/item") {
  ZEN_COMMENT_COLLAPSE.runCommentCollapseWhenReady();
}

// Initialize sidebar
ZEN_SIDEBAR.runSidebarWhenReady();

// Initialize restyling when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    ZEN_INIT_RESTYLE.initRestyle();
  });
} else {
  ZEN_INIT_RESTYLE.initRestyle();
}
