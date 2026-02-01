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
 * - g+f+c: My Favorite Comments (when logged in)
 * - g+u: My Upvoted (when logged in)
 * - g+u+c: My Upvoted Comments (when logged in)
 * - g+m: My Submissions (when logged in)
 * - g+c: My Comments (when logged in)
 * - /: Search (opens Algolia search palette)
 * - ?: Show help modal
 * - Escape: Clear focus / close modal
 */

import { fetchNewestItemId, resolveRandomStoryHref } from "./random";
import { toggleCommentCollapse } from "./commentCollapse";
import { renderIcon } from "./icons";
import { createModal, isModalOpen, closeModal } from "./modal";

const FOCUS_CLASS = "is-keyboard-focused";
const MODAL_ID = "zen-hn-shortcuts-modal";
const MODAL_TITLE_ID = "zen-hn-shortcuts-title";
const SEARCH_PALETTE_ID = "zen-hn-search-palette";
const SEARCH_TITLE_ID = "zen-hn-search-title";
const CHORD_TIMEOUT_MS = 500;
const LAST_LIST_PAGE_KEY = "zenHnLastListPage";

// Store the element that triggered the search palette for focus restoration
let searchPaletteTrigger: HTMLElement | null = null;

// List pages that we track for Escape navigation
const LIST_PAGE_PATHS = ["/", "/news", "/newest", "/front", "/best", "/active", "/ask", "/show", "/jobs"];

let focusedItem: HTMLElement | null = null;
let pendingChord: string | null = null;
let chordTimer: ReturnType<typeof setTimeout> | null = null;

// Chords that can be extended with a third key (e.g., g+f can become g+f+c)
const EXTENDABLE_CHORDS = ["f", "u"];

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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  focusedItem.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
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
 * Also works on item pages to open the fatitem title link
 */
function openStoryLink(newTab: boolean): void {
  let titleLink: HTMLAnchorElement | null = null;

  // If there's a focused item, find its title link
  if (focusedItem) {
    titleLink = focusedItem.querySelector<HTMLAnchorElement>(
      ".hn-submission-title"
    );
  }

  // If no focused item or no link found, try the fatitem title (item pages)
  if (!titleLink) {
    titleLink = document.querySelector<HTMLAnchorElement>(".hn-fatitem-title");
  }

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

const LOGGED_IN_USERNAME_KEY = "zenHnLoggedInUsername";

/**
 * Get the logged-in user's username
 * Falls back to localStorage for pages without the header (like /about)
 */
function getLoggedInUsername(): string | null {
  const meLink = document.querySelector<HTMLAnchorElement>("a#me");
  if (meLink) {
    const username = meLink.textContent?.trim() || null;
    if (username) {
      // Cache for pages without header
      try {
        localStorage.setItem(LOGGED_IN_USERNAME_KEY, username);
      } catch {
        // Ignore storage errors
      }
      return username;
    }
  }

  // Fallback to cached username
  try {
    return localStorage.getItem(LOGGED_IN_USERNAME_KEY);
  } catch {
    return null;
  }
}

/**
 * Execute a chord shortcut (g+X)
 * Returns "executed" if the chord was executed, "extendable" if it can be extended with a third key, or "none" if not recognized
 */
function executeChordShortcut(key: string): "executed" | "extendable" | "none" {
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
    return "executed";
  }

  // User page shortcuts (require logged-in user)
  const username = getLoggedInUsername();
  if (username) {
    // Check if this is an extendable chord (f or u)
    if (EXTENDABLE_CHORDS.includes(lowerKey)) {
      return "extendable";
    }

    const userRoutes: Record<string, string> = {
      p: `/user?id=${username}`,
      m: `/submitted?id=${username}`,
      c: `/threads?id=${username}`,
    };
    const userRoute = userRoutes[lowerKey];
    if (userRoute) {
      window.location.href = userRoute;
      return "executed";
    }
  }

  const route = routes[lowerKey];
  if (route) {
    window.location.href = route;
    return "executed";
  }
  return "none";
}

/**
 * Execute the default action for an extendable chord (when no third key is pressed)
 */
function executeExtendableChordDefault(chord: string): void {
  const username = getLoggedInUsername();
  if (!username) return;

  const routes: Record<string, string> = {
    f: `/favorites?id=${username}`,
    u: `/upvoted?id=${username}`,
  };
  const route = routes[chord];
  if (route) {
    window.location.href = route;
  }
}

/**
 * Execute a three-key chord (g+X+Y)
 */
function executeThreeKeyChord(secondKey: string, thirdKey: string): boolean {
  const username = getLoggedInUsername();
  if (!username) return false;

  const lowerSecond = secondKey.toLowerCase();
  const lowerThird = thirdKey.toLowerCase();

  // g+f+c -> Favorite Comments, g+u+c -> Upvoted Comments
  if (lowerThird === "c") {
    const routes: Record<string, string> = {
      f: `/favorites?id=${username}&comments=t`,
      u: `/upvoted?id=${username}&comments=t`,
    };
    const route = routes[lowerSecond];
    if (route) {
      window.location.href = route;
      return true;
    }
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
  return isModalOpen(MODAL_ID);
}

/**
 * Close the help modal
 */
function closeHelpModal(): void {
  closeModal(MODAL_ID);
}

/**
 * Check if search palette is open
 */
function isSearchPaletteOpen(): boolean {
  return document.getElementById(SEARCH_PALETTE_ID) !== null;
}

/**
 * Close the search palette and restore focus
 */
function closeSearchPalette(): void {
  const palette = document.getElementById(SEARCH_PALETTE_ID);
  if (palette) {
    palette.remove();
    // Restore focus to the element that triggered the palette
    if (searchPaletteTrigger && document.body.contains(searchPaletteTrigger)) {
      searchPaletteTrigger.focus();
    }
    searchPaletteTrigger = null;
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
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * Create a focus trap for modal dialogs
 */
function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== "Tab") {
    return;
  }

  const focusable = getFocusableElements(container);
  if (!focusable.length) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
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

  // Store the trigger element for focus restoration
  searchPaletteTrigger = document.activeElement as HTMLElement | null;

  const palette = document.createElement("div");
  palette.id = SEARCH_PALETTE_ID;
  palette.className = "zen-hn-search-palette";
  palette.setAttribute("role", "dialog");
  palette.setAttribute("aria-modal", "true");
  palette.setAttribute("aria-labelledby", SEARCH_TITLE_ID);

  const backdrop = document.createElement("div");
  backdrop.className = "zen-hn-search-backdrop";
  backdrop.addEventListener("click", closeSearchPalette);

  const content = document.createElement("div");
  content.className = "zen-hn-search-content";

  // Add visually hidden title for screen readers
  const title = document.createElement("h2");
  title.id = SEARCH_TITLE_ID;
  title.className = "sr-only";
  title.textContent = "Search Hacker News";
  content.appendChild(title);

  const input = document.createElement("input");
  input.type = "search";
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

  // Add focus trap
  palette.addEventListener("keydown", (e: KeyboardEvent) => {
    trapFocus(palette, e);
  });

  content.appendChild(input);
  palette.appendChild(backdrop);
  palette.appendChild(content);
  if (!document.body) return;
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
    { key: "o / Shift + Enter", action: "Open story link" },
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
    { key: "g f c", action: "My Favorite Comments" },
    { key: "g u", action: "My Upvoted" },
    { key: "g u c", action: "My Upvoted Comments" },
    { key: "g m", action: "My Submissions" },
    { key: "g c", action: "My Comments" },
    { key: "/", action: "Search" },
    { key: "?", action: "Show this help" },
    { key: "Esc", action: "Back / clear focus / close" },
  ];

  // Create modal using generic modal component
  const { content, close } = createModal({
    id: MODAL_ID,
    className: "zen-hn-shortcuts-modal",
    titleId: MODAL_TITLE_ID,
    closeOnBackdrop: true,
    closeOnEscape: true,
    focusTrap: true,
    restoreFocus: true,
  });

  // Build modal content
  const header = document.createElement("div");
  header.className = "zen-hn-shortcuts-header";

  const title = document.createElement("h2");
  title.id = MODAL_TITLE_ID;
  title.className = "zen-hn-shortcuts-title";
  title.textContent = "Keyboard Shortcuts";

  const closeButton = document.createElement("button");
  closeButton.className = "zen-hn-button-icon-ghost zen-hn-shortcuts-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.innerHTML = renderIcon("x");
  closeButton.addEventListener("click", close);

  header.appendChild(title);
  header.appendChild(closeButton);
  content.appendChild(header);

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "zen-hn-shortcuts-search";
  searchInput.placeholder = "Filter shortcuts...";
  searchInput.setAttribute("aria-label", "Filter shortcuts");
  content.appendChild(searchInput);

  const list = document.createElement("div");
  list.className = "zen-hn-shortcuts-list";

  const rows: { element: HTMLElement; key: string; action: string }[] = [];

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
      // Handle chord shortcuts (e.g., "g h") and modifier combos (e.g., "Shift + Enter")
      const parts = k.trim().split(" ");
      parts.forEach((part, j) => {
        if (j > 0) {
          keyEl.appendChild(document.createTextNode(" "));
        }
        // Don't wrap "+" in kbd
        if (part === "+") {
          keyEl.appendChild(document.createTextNode("+"));
        } else {
          const kbd = document.createElement("kbd");
          kbd.textContent = part;
          keyEl.appendChild(kbd);
        }
      });
    });

    const actionEl = document.createElement("div");
    actionEl.className = "zen-hn-shortcuts-action";
    actionEl.textContent = action;

    row.appendChild(keyEl);
    row.appendChild(actionEl);
    list.appendChild(row);
    rows.push({ element: row, key: key.toLowerCase(), action: action.toLowerCase() });
  });

  // Filter shortcuts based on search input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    rows.forEach(({ element, key, action }) => {
      const matches = query === "" || key.includes(query) || action.includes(query);
      element.style.display = matches ? "" : "none";
    });
  });

  // Prevent keyboard shortcuts from firing while typing in search
  searchInput.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Escape") {
      if (searchInput.value) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
      } else {
        close();
      }
    }
  });

  content.appendChild(list);

  // Focus the search input for immediate filtering (use rAF to ensure DOM is ready)
  requestAnimationFrame(() => {
    searchInput.focus();
  });
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

  // Handle three-key chord shortcuts (g+f+c, g+u+c)
  if (pendingChord && pendingChord.startsWith("g") && pendingChord.length === 2) {
    event.preventDefault();
    const secondKey = pendingChord[1];
    clearPendingChord();
    if (!executeThreeKeyChord(secondKey, key)) {
      // Third key didn't match, execute the default two-key chord
      executeExtendableChordDefault(secondKey);
    }
    return;
  }

  // Handle two-key chord shortcuts
  if (pendingChord === "g") {
    event.preventDefault();
    const result = executeChordShortcut(key);
    if (result === "extendable") {
      // This chord can be extended with a third key
      pendingChord = "g" + key.toLowerCase();
      if (chordTimer) clearTimeout(chordTimer);
      chordTimer = setTimeout(() => {
        const chord = pendingChord;
        clearPendingChord();
        if (chord && chord.length === 2) {
          executeExtendableChordDefault(chord[1]);
        }
      }, CHORD_TIMEOUT_MS);
      return;
    }
    clearPendingChord();
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

  // o to open story link (also works on item pages)
  if (key === "o") {
    event.preventDefault();
    openStoryLink(false);
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
