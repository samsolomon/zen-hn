/**
 * Zen HN Logic utilities
 */

export interface VoteState {
  isUpvoted: boolean;
  isDownvoted: boolean;
}

export interface MenuItem {
  label: string;
  href: string;
  action?: () => void;
}

export interface MenuItemConfig {
  href?: string;
  text?: string;
  fallback?: string;
  action?: () => void;
}

export function buildVoteHref(href: string, how?: string, baseHref?: string): string {
  if (!href) {
    return "";
  }
  try {
    const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
    const url = new URL(href, base);
    if (how) {
      url.searchParams.set("how", how);
    }
    return url.toString();
  } catch {
    return href;
  }
}

export function buildCommentHref(commentId: string, baseHref?: string): string {
  if (!commentId) {
    return "";
  }
  try {
    const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
    return new URL(`item?id=${commentId}`, base).toString();
  } catch {
    return `item?id=${commentId}`;
  }
}

export function buildItemHref(itemId: string, baseHref?: string): string {
  if (!itemId) {
    return "";
  }
  return buildCommentHref(itemId, baseHref);
}

export function resolveVoteItemId(href: string, baseHref?: string): string {
  if (!href) {
    return "";
  }
  try {
    const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
    const url = new URL(href, base);
    return url.searchParams.get("id") || "";
  } catch {
    const match = href.match(/[?&]id=(\d+)/);
    return match ? match[1] : "";
  }
}

export function resolveSubmissionCopyHref(
  commentsHref: string | undefined,
  itemId: string | undefined,
  baseHref?: string
): string {
  const href = commentsHref || (itemId ? `item?id=${itemId}` : "");
  if (!href) {
    return "";
  }
  try {
    const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

export function toggleVoteState(
  current: Partial<VoteState> | undefined,
  direction: "up" | "down"
): VoteState {
  const isUp = Boolean(current?.isUpvoted);
  const isDown = Boolean(current?.isDownvoted);
  if (direction === "up") {
    if (isUp) {
      return { isUpvoted: false, isDownvoted: false };
    }
    return { isUpvoted: true, isDownvoted: false };
  }
  if (direction === "down") {
    if (isDown) {
      return { isUpvoted: false, isDownvoted: false };
    }
    return { isUpvoted: false, isDownvoted: true };
  }
  return { isUpvoted: isUp, isDownvoted: isDown };
}

export function toggleFavoriteState(isFavorited: boolean): boolean {
  return !Boolean(isFavorited);
}

export function willFavoriteFromHref(href: string): boolean {
  if (!href) {
    return false;
  }
  return !href.includes("un=t");
}

export function buildMenuItem(config: MenuItemConfig): MenuItem | null {
  if (!config.href) {
    return null;
  }
  const trimmed = (config.text || "").trim();
  const label = trimmed
    ? `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`
    : config.fallback;
  return {
    label: label || "",
    href: config.href,
    action: config.action,
  };
}

export function buildMenuItems(items: MenuItemConfig[]): MenuItem[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map((item) => buildMenuItem(item)).filter((item): item is MenuItem => item !== null);
}

/**
 * Check if an event target is an interactive element that should prevent
 * background click handling (navigation or collapse toggle)
 */
export function isInteractiveElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) {
    return false;
  }
  return Boolean(
    target.closest("a, button, input, textarea, select, [role='button']")
  );
}

/**
 * Add a click handler to navigate to an item page when clicking the background
 */
export function addSubmissionClickHandler(
  element: HTMLElement,
  itemId: string
): void {
  if (!itemId) return;
  element.addEventListener("click", (event: MouseEvent) => {
    if (isInteractiveElement(event.target)) {
      return;
    }
    window.location.href = `/item?id=${itemId}`;
  });
}

/**
 * Add a click handler to toggle comment collapse when clicking the background
 */
export function addCommentClickHandler(
  element: HTMLElement,
  toggleFn: (el: HTMLElement) => void
): void {
  element.addEventListener("click", (event: MouseEvent) => {
    if (isInteractiveElement(event.target)) {
      return;
    }
    toggleFn(element);
  });
}

/**
 * Extract vote state from a DOM element by checking for voted arrow classes
 * @param row - DOM element containing vote arrows
 * @returns Vote state with isUpvoted and isDownvoted flags
 */
export function getVoteState(row: Element | null): VoteState {
  if (!row) {
    return { isUpvoted: false, isDownvoted: false };
  }
  const upArrow = row.querySelector(".votearrow:not(.down)");
  const downArrow = row.querySelector(".votearrow.down");
  let isUpvoted = Boolean(upArrow?.classList.contains("voted"));
  let isDownvoted = Boolean(downArrow?.classList.contains("voted"));
  if (isUpvoted && isDownvoted) {
    isDownvoted = false;
  }
  return { isUpvoted, isDownvoted };
}

/**
 * Build the next favorite href by toggling the favorite state in the URL
 * @param href - Current favorite href
 * @param willBeFavorited - Whether the item will be favorited (true) or unfavorited (false)
 * @param baseHref - Optional base URL for resolution
 * @returns Updated href with correct favorite state
 */
export function buildNextFavoriteHref(
  href: string,
  willBeFavorited: boolean,
  baseHref?: string
): string {
  if (!href) {
    return "";
  }
  try {
    const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
    const url = new URL(href, base);
    if (willBeFavorited) {
      url.searchParams.delete("un");
    } else {
      url.searchParams.set("un", "t");
    }
    return url.toString();
  } catch {
    if (willBeFavorited) {
      return href.replace(/([?&])un=t(&|$)/, "$1").replace(/[?&]$/, "");
    }
    return href.includes("un=t") ? href : `${href}${href.includes("?") ? "&" : "?"}un=t`;
  }
}

// Legacy global export for compatibility
const ZenHnLogic = {
  buildVoteHref,
  buildCommentHref,
  buildItemHref,
  resolveVoteItemId,
  resolveSubmissionCopyHref,
  toggleVoteState,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildMenuItem,
  buildMenuItems,
  isInteractiveElement,
  addSubmissionClickHandler,
  addCommentClickHandler,
  getVoteState,
  buildNextFavoriteHref,
};

(globalThis as Record<string, unknown>).ZenHnLogic = ZenHnLogic;

export default ZenHnLogic;
