/**
 * Utility functions for Zen HN
 */

/**
 * Convert text to sentence case (first letter uppercase, rest lowercase)
 * @param text - The text to convert
 * @returns Sentence case version of the text
 */
export function toSentenceCase(text: string): string {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return "";
  }
  const lower = trimmed.toLowerCase();
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

/**
 * Normalize an item ID to a valid positive integer string
 * @param value - The value to normalize (may be string, number, or undefined)
 * @returns Normalized ID string, or empty string if invalid
 */
export function normalizeItemId(value: unknown): string {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return "";
  }
  return String(parsed);
}

/**
 * Extract URL search params from an href string
 * @param href - The href string to parse
 * @returns URLSearchParams object (empty if no query string)
 */
export function getHrefParams(href: string): URLSearchParams {
  if (!href) {
    return new URLSearchParams();
  }
  const queryStart = href.indexOf("?");
  if (queryStart === -1) {
    return new URLSearchParams();
  }
  return new URLSearchParams(href.slice(queryStart + 1));
}

/**
 * Check if a link should be treated as the HN home link in the sidebar
 * @param href - The href attribute of the link
 * @param text - The text content of the link
 * @returns True if this is a home/news link
 */
export function isHomeSidebarLink(href: string, text: string): boolean {
  const normalized = (href || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  if (normalized === "/" || normalized === "news" || normalized === "/news") {
    return true;
  }
  if (normalized.startsWith("news?")) {
    return true;
  }
  return text?.trim().toLowerCase() === "hacker news" && normalized === "news";
}

/**
 * Remove parentheses from text nodes within an element
 * Removes empty text nodes after stripping, or updates content if text remains
 * @param element - The element whose text nodes to process
 */
export function stripParenTextNodes(element: Element | null): void {
  if (!element) {
    return;
  }
  const nodes = Array.from(element.childNodes);
  nodes.forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) {
      return;
    }
    const nextText = node.textContent?.replace(/[()]/g, "").trim() || "";
    if (!nextText) {
      node.remove();
      return;
    }
    node.textContent = nextText;
  });
}

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnUtils = {
  toSentenceCase,
  normalizeItemId,
  getHrefParams,
  isHomeSidebarLink,
  stripParenTextNodes,
};
