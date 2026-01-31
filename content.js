const ZEN_LOGIC = globalThis.ZenHnLogic;
const ZEN_UTILS = globalThis.ZenHnUtils;
const ZEN_PAGES = globalThis.ZenHnPages;
const ZEN_ACTION_STORE = globalThis.ZenHnActionStore;
const ZEN_SUBMISSION_MENU = globalThis.ZenHnSubmissionMenu;
const ZEN_RANDOM = globalThis.ZenHnRandom;
const ZEN_COMMENT_COLLAPSE = globalThis.ZenHnCommentCollapse;
const ZEN_FAVORITES = globalThis.ZenHnFavorites;
const ZEN_REPLY_FORM = globalThis.ZenHnReplyForm;
const ZEN_SIDEBAR = globalThis.ZenHnSidebar;
const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ZEN_HN_SUBMISSIONS_KEY = "zenHnSubmissions";
const ZEN_RESTYLE_SUBMISSIONS = globalThis.ZenHnRestyleSubmissions;
const ZEN_BUILD_COMMENT = globalThis.ZenHnBuildCommentItem;
const ZEN_RESTYLE_FATITEM = globalThis.ZenHnRestyleFatItem;
const ZEN_RESTYLE_COMMENTS = globalThis.ZenHnRestyleComments;

document.documentElement.dataset.zenHnActive = "true";

if (!document.documentElement.dataset.zenHnSidebar) {
  document.documentElement.dataset.zenHnSidebar = "loading";
}

if (window.location.pathname === "/item") {
  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "loading";
}

const SUBMISSION_MENU_CLASS = ZEN_SUBMISSION_MENU.SUBMISSION_MENU_CLASS;
const SUBMISSION_MENU_OPEN_CLASS = ZEN_SUBMISSION_MENU.SUBMISSION_MENU_OPEN_CLASS;
const setSubmissionMenuState = ZEN_SUBMISSION_MENU.setSubmissionMenuState;
const closeAllSubmissionMenus = ZEN_SUBMISSION_MENU.closeAllSubmissionMenus;
const registerSubmissionMenuListeners = ZEN_SUBMISSION_MENU.registerSubmissionMenuListeners;

const setCollapseButtonState = ZEN_COMMENT_COLLAPSE.setCollapseButtonState;
const hideDescendantComments = ZEN_COMMENT_COLLAPSE.hideDescendantComments;
const restoreDescendantVisibility = ZEN_COMMENT_COLLAPSE.restoreDescendantVisibility;
const toggleCommentCollapse = ZEN_COMMENT_COLLAPSE.toggleCommentCollapse;

// Color mode control functions from TypeScript
const ZEN_COLOR_MODE = globalThis.ZenHnColorMode;
const ZEN_ICONS = globalThis.ZenHnIcons;

const renderIcon = ZEN_ICONS.renderIcon;

// Initialize color mode and theme from storage on startup
ZEN_COLOR_MODE.initColorMode();
ZEN_COLOR_MODE.initTheme();

// Listen for system color scheme changes
ZEN_COLOR_MODE.listenForSystemColorModeChanges();

function getOrCreateZenHnMain() {
  return globalThis.ZenHnMain.getOrCreateZenHnMain();
}

function buildSidebarNavigation() {
  return ZEN_SIDEBAR.buildSidebarNavigation();
}

function registerCommentCollapseListeners() {
  return ZEN_COMMENT_COLLAPSE.registerCommentCollapseListeners();
}

function initCommentCollapse() {
  return ZEN_COMMENT_COLLAPSE.initCommentCollapse();
}

// function buildSubnav() {
//   if (document.getElementById("zen-hn-subnav")) {
//     return true;
//   }
//
//   const subnavLinks = [
//     { href: "/front", label: "Front" },
//     { href: "/pool", label: "Pool" },
//     { href: "/invited", label: "Invited" },
//     { href: "/shownew", label: "Show New" },
//     { href: "/asknew", label: "Ask New" },
//     { href: "/best", label: "Best" },
//     { href: "/active", label: "Active" },
//     { href: "/classic", label: "Classic" },
//     { href: "/launches", label: "Launches" },
//   ];
//
//   const nav = document.createElement("nav");
//   nav.id = "zen-hn-subnav";
//   nav.className = "zen-hn-subnav";
//   nav.setAttribute("aria-label", "Secondary navigation");
//
//   const list = document.createElement("ul");
//   list.className = "zen-hn-subnav-list";
//
//   const currentPath = window.location.pathname;
//
//   subnavLinks.forEach((item) => {
//     const li = document.createElement("li");
//     li.className = "zen-hn-subnav-item";
//
//     const link = document.createElement("a");
//     link.className = "zen-hn-subnav-link";
//     link.href = item.href;
//     link.textContent = item.label;
//
//     if (currentPath === item.href) {
//       link.classList.add("is-active");
//       link.setAttribute("aria-current", "page");
//     }
//
//     li.appendChild(link);
//     list.appendChild(li);
//   });
//
//   nav.appendChild(list);
//   document.body.appendChild(nav);
//   document.documentElement.dataset.zenHnSubnav = "true";
//
//   return true;
// }

function runSidebarWhenReady() {
  ZEN_SIDEBAR.runSidebarWhenReady();
}

function runCommentCollapseWhenReady() {
  return ZEN_COMMENT_COLLAPSE.runCommentCollapseWhenReady();
}

if (window.location.pathname === "/item") {
  runCommentCollapseWhenReady();
}

function loadActionStore() {
  return ZEN_ACTION_STORE.loadActionStore();
}

function getStoredAction(kind, id) {
  return ZEN_ACTION_STORE.getStoredAction(kind, id);
}

function updateStoredAction(kind, id, update) {
  return ZEN_ACTION_STORE.updateStoredAction(kind, id, update);
}

const resolveFavoriteLink = ZEN_FAVORITES.resolveFavoriteLink;
const resolveStoryFavoriteLink = ZEN_FAVORITES.resolveStoryFavoriteLink;

const resolveReplyForm = ZEN_REPLY_FORM.resolveReplyForm;
const resolveReplyFormFromElement = ZEN_REPLY_FORM.resolveReplyFormFromElement;
const submitReplyWithResolved = ZEN_REPLY_FORM.submitReplyWithResolved;
const submitReply = ZEN_REPLY_FORM.submitReply;

function restyleSubmissions() {
  return ZEN_RESTYLE_SUBMISSIONS.restyleSubmissions();
}

function restyleSubmitPage() {
  return ZEN_PAGES.restyleSubmitPage();
}

function restyleUserPage() {
  return ZEN_PAGES.restyleUserPage();
}

function restyleFatItem() {
  return ZEN_RESTYLE_FATITEM.restyleFatItem();
}

function buildCommentItem(row, options = {}) {
  return ZEN_BUILD_COMMENT.buildCommentItem(row, options);
}

function restyleComments(context) {
  return ZEN_RESTYLE_COMMENTS.restyleComments(context);
}

function getCommentRows(table) {
  return ZEN_LOGIC.getCommentRows(table);
}

function getStoryRows(root) {
  if (!root) {
    return [];
  }
  const rows = Array.from(root.querySelectorAll("tr.athing"));
  return rows.filter(
    (row) => !row.classList.contains("comtr") && !row.querySelector(".comment .commtext"),
  );
}

function findCommentContext() {
  const commentTree = document.querySelector("table.comment-tree");
  if (commentTree) {
    return { root: commentTree, mode: "table" };
  }

  const itemTables = Array.from(document.querySelectorAll("table.itemlist"));
  const itemTable = itemTables.find((table) => getCommentRows(table).length > 0);
  if (itemTable) {
    return { root: itemTable, mode: "table" };
  }

  const bigboxTable = document.querySelector("tr#bigbox table");
  if (bigboxTable && getCommentRows(bigboxTable).length > 0) {
    return { root: bigboxTable, mode: "table" };
  }

  const hnMain = document.querySelector("table#hnmain");
  if (!hnMain) {
    return null;
  }
  const rows = getCommentRows(hnMain);
  if (!rows.length) {
    return null;
  }
  const insertAfter = document.querySelector("tr#bigbox") || rows[0];
  return {
    root: hnMain,
    mode: "rows",
    rows,
    insertAfter,
  };
}

function runRestyleWhenReady() {
  let attempts = 0;
  const maxAttempts = 20;
  const attempt = () => {
    if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
      return;
    }
    const context = findCommentContext();
    if (!context) {
      attempts += 1;
      if (attempts >= maxAttempts) {
        if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "loading") {
          delete document.documentElement.dataset[ZEN_HN_RESTYLE_KEY];
        }
        return;
      }
      window.requestAnimationFrame(attempt);
      return;
    }
    restyleComments(context);
  };
  attempt();
}

async function initRestyle() {
  await loadActionStore();
  buildSidebarNavigation();
  // buildSubnav();
  if (ZEN_LOGIC.isUserProfilePage()) {
    document.documentElement.dataset.zenHnUserPage = "true";
  }
  restyleSubmissions();
  restyleSubmitPage();
  restyleUserPage();
  ZEN_PAGES.restyleChangePwPage();
  restyleFatItem();
  runRestyleWhenReady();

  // Hide original HN content only if we created restyled content
  const zenHnMain = document.getElementById("zen-hn-main");
  if (zenHnMain && zenHnMain.children.length > 0) {
    const hnmain = document.getElementById("hnmain");
    const centerWrapper = hnmain?.closest("center");
    if (centerWrapper) {
      centerWrapper.style.display = "none";
    } else if (hnmain) {
      hnmain.style.display = "none";
    }
  }
}

runSidebarWhenReady();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initRestyle();
  });
} else {
  initRestyle();
}

