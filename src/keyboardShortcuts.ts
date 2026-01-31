/**
 * Keyboard Shortcuts - Vim-style navigation for Zen HN
 *
 * Shortcuts:
 * - j/k: Move focus down/up through items
 * - Enter: Open comments
 * - Shift+Enter: Open story link
 * - O: Open in new tab
 * - u: Upvote
 * - f: Favorite/bookmark
 * - c: Create/submit
 * - Space: Expand/collapse comment
 * - l: Copy link
 * - g+h: Go to Home
 * - g+n: Go to Newest
 * - g+a: Go to Active (now called "front" on HN)
 * - g+b: Go to Best
 * - g+s: Go to Ask
 * - g+t: Go to Submit
 * - g+r: Random story
 * - g+p: My Profile (when logged in)
 * - g+f: My Favorites (when logged in)
 * - g+u: My Upvoted (when logged in)
 * - g+m: My Submissions (when logged in)
 * - g+c: My Comments (when logged in)
 * - /: Search (opens Algolia search palette)
 * - ?: Show help modal
 * - Escape: Clear focus / close modal
 */

import { fetchNewestItemId, resolveRandomStoryHref } from "./random";
import { toggleCommentCollapse } from "./commentCollapse";

const FOCUS_CLASS = "is-keyboard-focused";
const MODAL_ID = "zen-hn-shortcuts-modal";
const SEARCH_PALETTE_ID = "zen-hn-search-palette";
const CHORD_TIMEOUT_MS = 500;
const LAST_LIST_PAGE_KEY = "zenHnLastListPage";

// List pages that we track for Escape navigation
const LIST_PAGE_PATHS = ["/", "/news", "/newest", "/front", "/best", "/active", "/ask", "/show", "/jobs"];

let focusedItem: HTMLElement | null = null;
let pendingChord: string | null = null;
let chordTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if current page is a list page
 */
function isListPage(): boolean {
  const path = window.location.pathname;
  return LIST_PAGE_PATHS.includes(path);
}

/**
 * Store the current page as the last list page visited
 */
function storeLastListPage(): void {
  if (isListPage()) {
    try {
      sessionStorage.setItem(LAST_LIST_PAGE_KEY, window.location.href);
    } catch {
      // sessionStorage might be unavailable
    }
  }
}

/**
 * Get the last list page visited, or default to home
 */
function getLastListPage(): string {
  try {
    return sessionStorage.getItem(LAST_LIST_PAGE_KEY) || "/";
  } catch {
    return "/";
  }
}

/**
 * Navigate back to the last list page
 */
function goBackToList(): void {
  window.location.href = getLastListPage();
}

/**
 * Check if focus is in an input element where we shouldn't intercept keys
 */
function isTypingInInput(): boolean {
  const active = document.activeElement;
  if (!active) {
    return false;
  }
  const tagName = active.tagName.toLowerCase();
  if (tagName === "textarea" || tagName === "input" || tagName === "select") {
    return true;
  }
  if ((active as HTMLElement).isContentEditable) {
    return true;
  }
  return false;
}

/**
 * Get all focusable items on the page
 */
function getFocusableItems(): HTMLElement[] {
  const submissions = Array.from(
    document.querySelectorAll<HTMLElement>(".hn-submission")
  );
  const comments = Array.from(
    document.querySelectorAll<HTMLElement>(".hn-comment:not([hidden])")
  );
  return [...submissions, ...comments];
}

/**
 * Clear focus from the currently focused item
 */
function clearFocus(): void {
  if (focusedItem) {
    focusedItem.classList.remove(FOCUS_CLASS);
    focusedItem = null;
  }
}

/**
 * Set focus on an item
 */
function setFocus(item: HTMLElement): void {
  clearFocus();
  focusedItem = item;
  focusedItem.classList.add(FOCUS_CLASS);
  focusedItem.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Move focus up or down through items
 */
function moveFocus(direction: "up" | "down"): void {
  const items = getFocusableItems();
  if (!items.length) {
    return;
  }

  if (!focusedItem) {
    // Focus first/last item if none focused
    const targetItem = direction === "down" ? items[0] : items[items.length - 1];
    setFocus(targetItem);
    return;
  }

  const currentIndex = items.indexOf(focusedItem);
  if (currentIndex === -1) {
    setFocus(items[0]);
    return;
  }

  const nextIndex =
    direction === "down"
      ? Math.min(currentIndex + 1, items.length - 1)
      : Math.max(currentIndex - 1, 0);

  if (nextIndex !== currentIndex) {
    setFocus(items[nextIndex]);
  }
}

/**
 * Open the focused item's story link (the actual article URL)
 */
function openStoryLink(newTab: boolean): void {
  if (!focusedItem) {
    return;
  }

  // For submissions, find the title link
  const titleLink = focusedItem.querySelector<HTMLAnchorElement>(
    ".hn-submission-title"
  );
  if (titleLink) {
    if (newTab) {
      window.open(titleLink.href, "_blank");
    } else {
      window.location.href = titleLink.href;
    }
  }
}

/**
 * Open the focused item's comment thread
 */
function openFocusedItem(newTab: boolean): void {
  if (!focusedItem) {
    return;
  }

  // For submissions, find the comments link
  const commentsLink = focusedItem.querySelector<HTMLAnchorElement>(
    ".hn-submission-comments"
  );
  if (commentsLink) {
    if (newTab) {
      window.open(commentsLink.href, "_blank");
    } else {
      window.location.href = commentsLink.href;
    }
    return;
  }

  // For comments, find the permalink in the age element
  const ageLink = focusedItem.querySelector<HTMLAnchorElement>(
    ".hn-comment-age a, .age a"
  );
  if (ageLink) {
    if (newTab) {
      window.open(ageLink.href, "_blank");
    } else {
      window.location.href = ageLink.href;
    }
  }
}

/**
 * Trigger upvote on the focused item
 */
function upvoteFocusedItem(): void {
  if (!focusedItem) {
    return;
  }

  const upvoteButton = focusedItem.querySelector<HTMLButtonElement>(
    '.icon-button[aria-label="Upvote"]'
  );
  if (upvoteButton && !upvoteButton.hidden) {
    upvoteButton.click();
  }
}

/**
 * Trigger bookmark/save on the focused item
 */
function bookmarkFocusedItem(): void {
  if (!focusedItem) {
    return;
  }

  const bookmarkButton = focusedItem.querySelector<HTMLButtonElement>(
    '.icon-button[aria-label="Favorite"]'
  );
  if (bookmarkButton) {
    bookmarkButton.click();
  }
}

/**
 * Copy link for the focused item
 */
function copyLinkFocusedItem(): void {
  if (!focusedItem) {
    return;
  }

  const copyButton = focusedItem.querySelector<HTMLButtonElement>(
    '.icon-button[aria-label="Copy link"]'
  );
  if (copyButton) {
    copyButton.click();
  }
}

/**
 * Navigate to random story
 */
async function goToRandomStory(): Promise<void> {
  const newestId = await fetchNewestItemId();
  const randomHref = await resolveRandomStoryHref(newestId);
  if (randomHref) {
    window.location.href = randomHref;
  } else if (newestId) {
    window.location.href = `item?id=${newestId}`;
  } else {
    window.location.href = "/newest";
  }
}

/**
 * Get the logged-in user's username
 */
function getLoggedInUsername(): string | null {
  const meLink = document.querySelector<HTMLAnchorElement>("a#me");
  return meLink?.textContent?.trim() || null;
}

/**
 * Execute a chord shortcut (g+X)
 */
function executeChordShortcut(key: string): boolean {
  const routes: Record<string, string> = {
    h: "/",
    n: "/newest",
    a: "/front", // "Active" is now "front" on HN
    b: "/best",
    s: "/ask",
    t: "/submit",
  };

  const lowerKey = key.toLowerCase();

  // Random story
  if (lowerKey === "r") {
    goToRandomStory();
    return true;
  }

  // User page shortcuts (require logged-in user)
  const username = getLoggedInUsername();
  if (username) {
    const userRoutes: Record<string, string> = {
      p: `/user?id=${username}`,
      f: `/favorites?id=${username}`,
      u: `/upvoted?id=${username}`,
      m: `/submitted?id=${username}`,
      c: `/threads?id=${username}`,
    };
    const userRoute = userRoutes[lowerKey];
    if (userRoute) {
      window.location.href = userRoute;
      return true;
    }
  }

  const route = routes[lowerKey];
  if (route) {
    window.location.href = route;
    return true;
  }
  return false;
}

/**
 * Clear any pending chord
 */
function clearPendingChord(): void {
  if (chordTimer) {
    clearTimeout(chordTimer);
    chordTimer = null;
  }
  pendingChord = null;
}

/**
 * Check if help modal is open
 */
function isHelpModalOpen(): boolean {
  return document.getElementById(MODAL_ID) !== null;
}

/**
 * Close the help modal
 */
function closeHelpModal(): void {
  const modal = document.getElementById(MODAL_ID);
  if (modal) {
    modal.remove();
  }
}

/**
 * Check if search palette is open
 */
function isSearchPaletteOpen(): boolean {
  return document.getElementById(SEARCH_PALETTE_ID) !== null;
}

/**
 * Close the search palette
 */
function closeSearchPalette(): void {
  const palette = document.getElementById(SEARCH_PALETTE_ID);
  if (palette) {
    palette.remove();
  }
}

/**
 * Handle search submission
 */
function handleSearchSubmit(query: string): void {
  if (query.trim()) {
    window.location.href = `https://hn.algolia.com/?query=${encodeURIComponent(query.trim())}`;
  }
}

/**
 * Show the search palette
 */
function showSearchPalette(): void {
  if (isSearchPaletteOpen()) {
    closeSearchPalette();
    return;
  }

  const palette = document.createElement("div");
  palette.id = SEARCH_PALETTE_ID;
  palette.className = "zen-hn-search-palette";
  palette.setAttribute("role", "dialog");
  palette.setAttribute("aria-label", "Search Hacker News");

  const backdrop = document.createElement("div");
  backdrop.className = "zen-hn-search-backdrop";
  backdrop.addEventListener("click", closeSearchPalette);

  const content = document.createElement("div");
  content.className = "zen-hn-search-content";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "zen-hn-search-input";
  input.placeholder = "Search Hacker News...";
  input.setAttribute("aria-label", "Search query");

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit(input.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSearchPalette();
    }
  });

  content.appendChild(input);
  palette.appendChild(backdrop);
  palette.appendChild(content);
  document.body.appendChild(palette);

  // Focus the input
  input.focus();
}

/**
 * Show the help modal
 */
function showHelpModal(): void {
  if (isHelpModalOpen()) {
    closeHelpModal();
    return;
  }

  const shortcuts = [
    { key: "j / k / ↓ / ↑", action: "Move focus down / up" },
    { key: "Enter", action: "Open comments" },
    { key: "Shift + Enter", action: "Open story link" },
    { key: "O", action: "Open comments in new tab" },
    { key: "u", action: "Upvote" },
    { key: "f", action: "Favorite / bookmark" },
    { key: "c", action: "Create / submit" },
    { key: "Space", action: "Expand / collapse comment" },
    { key: "l", action: "Copy link" },
    { key: "g h", action: "Go to Home" },
    { key: "g n", action: "Go to Newest" },
    { key: "g a", action: "Go to Active" },
    { key: "g b", action: "Go to Best" },
    { key: "g s", action: "Go to Ask" },
    { key: "g t", action: "Go to Submit" },
    { key: "g r", action: "Random story" },
    { key: "g p", action: "My Profile" },
    { key: "g f", action: "My Favorites" },
    { key: "g u", action: "My Upvoted" },
    { key: "g m", action: "My Submissions" },
    { key: "g c", action: "My Comments" },
    { key: "/", action: "Search" },
    { key: "?", action: "Show this help" },
    { key: "Esc", action: "Back / clear focus / close" },
  ];

  const modal = document.createElement("div");
  modal.id = MODAL_ID;
  modal.className = "zen-hn-shortcuts-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-label", "Keyboard shortcuts");

  const backdrop = document.createElement("div");
  backdrop.className = "zen-hn-shortcuts-backdrop";
  backdrop.addEventListener("click", closeHelpModal);

  const content = document.createElement("div");
  content.className = "zen-hn-shortcuts-content";

  const header = document.createElement("div");
  header.className = "zen-hn-shortcuts-header";

  const title = document.createElement("h2");
  title.className = "zen-hn-shortcuts-title";
  title.textContent = "Keyboard Shortcuts";

  const closeButton = document.createElement("button");
  closeButton.className = "zen-hn-shortcuts-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.innerHTML = "×";
  closeButton.addEventListener("click", closeHelpModal);

  header.appendChild(title);
  header.appendChild(closeButton);
  content.appendChild(header);

  const list = document.createElement("div");
  list.className = "zen-hn-shortcuts-list";

  shortcuts.forEach(({ key, action }) => {
    const row = document.createElement("div");
    row.className = "zen-hn-shortcuts-row";

    const keyEl = document.createElement("div");
    keyEl.className = "zen-hn-shortcuts-key";

    // Split keys and wrap each in a kbd element
    const keys = key.split(" / ");
    keys.forEach((k, i) => {
      if (i > 0) {
        keyEl.appendChild(document.createTextNode(" / "));
      }
      // Handle chord shortcuts (e.g., "g h")
      const parts = k.trim().split(" ");
      parts.forEach((part, j) => {
        if (j > 0) {
          keyEl.appendChild(document.createTextNode(" "));
        }
        const kbd = document.createElement("kbd");
        kbd.textContent = part;
        keyEl.appendChild(kbd);
      });
    });

    const actionEl = document.createElement("div");
    actionEl.className = "zen-hn-shortcuts-action";
    actionEl.textContent = action;

    row.appendChild(keyEl);
    row.appendChild(actionEl);
    list.appendChild(row);
  });

  content.appendChild(list);
  modal.appendChild(backdrop);
  modal.appendChild(content);
  document.body.appendChild(modal);

  // Focus the close button for accessibility
  closeButton.focus();
}

/**
 * Handle keydown events
 */
function handleKeyDown(event: KeyboardEvent): void {
  // Skip if typing in an input
  if (isTypingInInput()) {
    return;
  }

  // Skip if modifier keys are pressed (allow browser shortcuts like Cmd+R)
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  const key = event.key;

  // Handle escape key
  if (key === "Escape") {
    clearPendingChord();
    if (isSearchPaletteOpen()) {
      closeSearchPalette();
      return;
    }
    if (isHelpModalOpen()) {
      closeHelpModal();
      return;
    }
    if (focusedItem) {
      clearFocus();
      return;
    }
    // Navigate back to list page if not already on a list page
    if (!isListPage()) {
      goBackToList();
      return;
    }
    return;
  }

  // Handle help modal toggle
  if (key === "?") {
    event.preventDefault();
    showHelpModal();
    return;
  }

  // Handle search palette toggle
  if (key === "/") {
    event.preventDefault();
    showSearchPalette();
    return;
  }

  // Don't process shortcuts if modal is open (except Escape, ?, and /)
  if (isHelpModalOpen() || isSearchPaletteOpen()) {
    return;
  }

  // Handle chord shortcuts
  if (pendingChord === "g") {
    event.preventDefault();
    clearPendingChord();
    executeChordShortcut(key);
    return;
  }

  // Start a chord
  if (key === "g") {
    event.preventDefault();
    pendingChord = "g";
    chordTimer = setTimeout(() => {
      clearPendingChord();
    }, CHORD_TIMEOUT_MS);
    return;
  }

  // Navigation
  if (key === "j" || key === "ArrowDown") {
    event.preventDefault();
    moveFocus("down");
    return;
  }

  if (key === "k" || key === "ArrowUp") {
    event.preventDefault();
    moveFocus("up");
    return;
  }

  // Open item (Shift+Enter opens story link, Enter opens comments)
  if (key === "Enter") {
    if (focusedItem) {
      event.preventDefault();
      if (event.shiftKey) {
        openStoryLink(false);
      } else {
        openFocusedItem(false);
      }
    }
    return;
  }

  if (key === "O") {
    if (focusedItem) {
      event.preventDefault();
      openFocusedItem(true);
    }
    return;
  }

  // Actions
  if (key === "u") {
    if (focusedItem) {
      event.preventDefault();
      upvoteFocusedItem();
    }
    return;
  }

  if (key === "f") {
    if (focusedItem) {
      event.preventDefault();
      bookmarkFocusedItem();
    }
    return;
  }

  // c to go to submit page
  if (key === "c") {
    event.preventDefault();
    window.location.href = "/submit";
    return;
  }

  // Spacebar to expand/collapse comments
  if (key === " ") {
    if (focusedItem?.classList.contains("hn-comment")) {
      event.preventDefault();
      toggleCommentCollapse(focusedItem);
    }
    return;
  }

  if (key === "l") {
    if (focusedItem) {
      event.preventDefault();
      copyLinkFocusedItem();
    }
    return;
  }

}

/**
 * Register keyboard shortcuts
 */
export function registerKeyboardShortcuts(): void {
  // Store current page if it's a list page (for Escape navigation)
  storeLastListPage();
  document.addEventListener("keydown", handleKeyDown);
}

/**
 * Unregister keyboard shortcuts (for cleanup)
 */
export function unregisterKeyboardShortcuts(): void {
  document.removeEventListener("keydown", handleKeyDown);
  clearFocus();
  clearPendingChord();
  closeHelpModal();
}
