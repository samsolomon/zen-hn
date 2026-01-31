/**
 * Keyboard Shortcuts - Vim-style navigation for Zen HN
 *
 * Shortcuts:
 * - j/k: Move focus down/up through items
 * - Enter/o: Open focused item
 * - O: Open in new tab
 * - u: Upvote
 * - s: Save/bookmark
 * - c: Go to comments (list) / collapse (comment page)
 * - l: Copy link
 * - r: Random story
 * - g+h: Go to Home
 * - g+n: Go to Newest
 * - g+a: Go to Active (now called "front" on HN)
 * - g+b: Go to Best
 * - g+s: Go to Ask
 * - g+t: Go to Submit
 * - ?: Show help modal
 * - Escape: Clear focus / close modal
 */

import { handleRandomItemClick } from "./random";
import { toggleCommentCollapse } from "./commentCollapse";

const FOCUS_CLASS = "is-keyboard-focused";
const MODAL_ID = "zen-hn-shortcuts-modal";
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
 * Check if current page is an item/comment page
 */
function isItemPage(): boolean {
  return window.location.pathname === "/item";
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
 * Go to comments or collapse comment
 */
function handleCommentsAction(): void {
  // On comment pages, collapse the focused comment
  if (focusedItem?.classList.contains("hn-comment")) {
    toggleCommentCollapse(focusedItem);
    return;
  }

  // On list pages, go to comments for the focused submission
  if (focusedItem) {
    const commentsLink = focusedItem.querySelector<HTMLAnchorElement>(
      ".hn-submission-comments"
    );
    if (commentsLink) {
      window.location.href = commentsLink.href;
    }
  }
}

/**
 * Navigate to random story
 */
async function goToRandomStory(): Promise<void> {
  // Create a fake event for the random handler
  const fakeEvent = {
    preventDefault: () => {},
    currentTarget: document.createElement("a"),
  } as unknown as Event;
  await handleRandomItemClick(fakeEvent);
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

  const route = routes[key.toLowerCase()];
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
 * Show the help modal
 */
function showHelpModal(): void {
  if (isHelpModalOpen()) {
    closeHelpModal();
    return;
  }

  const shortcuts = [
    { key: "j / k / ↓ / ↑", action: "Move focus down / up" },
    { key: "Enter / o", action: "Open comments" },
    { key: "O", action: "Open comments in new tab" },
    { key: "u", action: "Upvote" },
    { key: "s", action: "Save / bookmark" },
    { key: "c", action: "Comments / collapse" },
    { key: "l", action: "Copy link" },
    { key: "r", action: "Random story" },
    { key: "g h", action: "Go to Home" },
    { key: "g n", action: "Go to Newest" },
    { key: "g a", action: "Go to Active" },
    { key: "g b", action: "Go to Best" },
    { key: "g s", action: "Go to Ask" },
    { key: "g t", action: "Go to Submit" },
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

  const key = event.key;

  // Handle escape key
  if (key === "Escape") {
    clearPendingChord();
    if (isHelpModalOpen()) {
      closeHelpModal();
      return;
    }
    if (focusedItem) {
      clearFocus();
      return;
    }
    // Navigate back to list page if on an item page
    if (isItemPage()) {
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

  // Don't process shortcuts if modal is open (except Escape and ?)
  if (isHelpModalOpen()) {
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

  // Open item
  if (key === "Enter" || key === "o") {
    if (focusedItem) {
      event.preventDefault();
      openFocusedItem(false);
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

  if (key === "s") {
    if (focusedItem) {
      event.preventDefault();
      bookmarkFocusedItem();
    }
    return;
  }

  if (key === "c") {
    if (focusedItem) {
      event.preventDefault();
      handleCommentsAction();
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

  // Random story
  if (key === "r") {
    event.preventDefault();
    goToRandomStory();
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
