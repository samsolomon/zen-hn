/**
 * External Site Escape - Listen for Escape key on external sites to return to HN
 *
 * This script is dynamically injected on external sites when the user enables
 * the "Escape to return" feature.
 *
 * The Escape-to-return feature only works until the user interacts with the page.
 * This makes it a "quick peek" feature - Escape returns you to HN only if you
 * haven't engaged with the external content yet.
 */

/**
 * Check if focus is in an input element where we shouldn't intercept keys
 */
export function isTypingInInput(activeElement: Element | null): boolean {
  if (!activeElement) {
    return false;
  }
  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === "textarea" || tagName === "input" || tagName === "select") {
    return true;
  }
  if ((activeElement as HTMLElement).isContentEditable) {
    return true;
  }
  return false;
}

/**
 * Determine if the Escape key should trigger navigation back to HN
 */
export function shouldNavigateBack(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey">,
  hasInteracted: boolean,
  activeElement: Element | null
): boolean {
  // Only handle Escape key
  if (event.key !== "Escape") {
    return false;
  }

  // Skip if user has already interacted with the page
  if (hasInteracted) {
    return false;
  }

  // Skip if typing in an input
  if (isTypingInInput(activeElement)) {
    return false;
  }

  // Skip if modifier keys are pressed
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return false;
  }

  return true;
}

/**
 * Determine if a keydown event should mark the page as interacted
 */
export function shouldMarkAsInteracted(key: string): boolean {
  return key !== "Escape";
}

// =============================================================================
// Runtime initialization (only runs when injected as content script)
// =============================================================================

// Guard against running in non-browser environments (e.g., Node.js tests)
// Also check for chrome.runtime since it may be undefined on chrome:// pages
if (typeof document !== "undefined" && typeof chrome !== "undefined" && chrome.runtime) {
  // Track whether user has interacted with the page
  let hasInteracted = false;

  /**
   * Mark the page as interacted - disables Escape-to-return
   */
  function markAsInteracted(): void {
    hasInteracted = true;
  }

  // Listen for user interactions that indicate engagement with the page
  // Using { once: true } since we only need to detect the first interaction
  document.addEventListener("click", markAsInteracted, { once: true });
  document.addEventListener("focusin", markAsInteracted, { once: true });
  document.addEventListener(
    "keydown",
    (e) => {
      if (shouldMarkAsInteracted(e.key)) {
        markAsInteracted();
      }
    },
    { once: true }
  );

  /**
   * Handle keydown events for Escape key
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (shouldNavigateBack(event, hasInteracted, document.activeElement)) {
      chrome.runtime.sendMessage({ type: "escapeToHN" });
    }
  }

  // Register the event listener
  document.addEventListener("keydown", handleKeyDown);
}
