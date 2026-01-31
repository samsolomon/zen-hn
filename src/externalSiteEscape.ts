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
    // Any key except Escape counts as interaction
    if (e.key !== "Escape") {
      markAsInteracted();
    }
  },
  { once: true }
);

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
 * Handle keydown events for Escape key
 */
function handleKeyDown(event: KeyboardEvent): void {
  // Only handle Escape key
  if (event.key !== "Escape") {
    return;
  }

  // Skip if user has already interacted with the page
  if (hasInteracted) {
    return;
  }

  // Skip if typing in an input
  if (isTypingInInput()) {
    return;
  }

  // Skip if modifier keys are pressed
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  // Send message to background script to navigate back
  chrome.runtime.sendMessage({ type: "escapeToHN" });
}

// Register the event listener
document.addEventListener("keydown", handleKeyDown);
