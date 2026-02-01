/**
 * Screen reader announcer for status updates
 * Creates a visually hidden live region that announces actions to assistive technology
 */

const ANNOUNCER_ID = "zen-hn-announcer";

/**
 * Create the live region announcer element
 * Should be called once during initialization
 */
export function createAnnouncer(): void {
  if (document.getElementById(ANNOUNCER_ID)) {
    return;
  }

  const announcer = document.createElement("div");
  announcer.id = ANNOUNCER_ID;
  announcer.className = "sr-only";
  announcer.setAttribute("aria-live", "polite");
  announcer.setAttribute("aria-atomic", "true");
  announcer.setAttribute("role", "status");

  // Append to body when available
  if (document.body) {
    document.body.appendChild(announcer);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(announcer);
    });
  }
}

/**
 * Announce a message to screen readers
 * @param message - The message to announce
 */
export function announce(message: string): void {
  const announcer = document.getElementById(ANNOUNCER_ID);
  if (!announcer) {
    return;
  }

  // Clear and set with a small delay to ensure the announcement is made
  // even if the same message is announced twice in a row
  announcer.textContent = "";
  requestAnimationFrame(() => {
    announcer.textContent = message;
  });
}
