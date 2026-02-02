export interface VoteState {
  isUpvoted: boolean;
  isDownvoted: boolean;
}

export interface MenuItem {
  label: string;
  href: string;
  action?: string;
}

interface BuildMenuItemInput {
  href?: string | null;
  text?: string | null;
  fallback?: string;
  action?: string;
}

const DEFAULT_BASE_HREF = "https://news.ycombinator.com/";

function getBaseHref(baseHref?: string | null): string {
  return baseHref || globalThis.location?.href || DEFAULT_BASE_HREF;
}

export function buildVoteHref(href: string | null | undefined, how?: string | null, baseHref?: string | null): string {
  if (!href) {
    return "";
  }
  try {
    const base = getBaseHref(baseHref);
    const url = new URL(href, base);
    if (how) {
      url.searchParams.set("how", how);
    }
    return url.toString();
  } catch {
    return href;
  }
}

export function buildCommentHref(commentId: string | null | undefined, baseHref?: string | null): string {
  if (!commentId) {
    return "";
  }
  try {
    const base = getBaseHref(baseHref);
    return new URL(`item?id=${commentId}`, base).toString();
  } catch {
    return `item?id=${commentId}`;
  }
}

export function buildItemHref(itemId: string | null | undefined, baseHref?: string | null): string {
  if (!itemId) {
    return "";
  }
  return buildCommentHref(itemId, baseHref);
}

export function resolveVoteItemId(href: string | null | undefined, baseHref?: string | null): string {
  if (!href) {
    return "";
  }
  try {
    const base = getBaseHref(baseHref);
    const url = new URL(href, base);
    return url.searchParams.get("id") || "";
  } catch {
    const match = href.match(/[?&]id=(\d+)/);
    return match ? match[1] : "";
  }
}

export function resolveSubmissionCopyHref(commentsHref?: string | null, itemId?: string | null, baseHref?: string | null): string {
  const href = commentsHref || (itemId ? `item?id=${itemId}` : "");
  if (!href) {
    return "";
  }
  try {
    const base = getBaseHref(baseHref);
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

export function toggleVoteState(current: VoteState | null | undefined, direction: "up" | "down"): VoteState {
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

export function toggleFavoriteState(isFavorited: boolean | null | undefined): boolean {
  return !Boolean(isFavorited);
}

export function willFavoriteFromHref(href: string | null | undefined): boolean {
  if (!href) {
    return false;
  }
  return !href.includes("un=t");
}

export function buildMenuItem(input: BuildMenuItemInput): MenuItem | null {
  const { href, text, fallback, action } = input;
  if (!href) {
    return null;
  }
  const trimmed = (text || "").trim();
  const label = trimmed
    ? `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`
    : fallback;
  return {
    label: label || "",
    href,
    action,
  };
}

export function buildMenuItems(items: BuildMenuItemInput[] | null | undefined): MenuItem[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map((item) => buildMenuItem(item)).filter((item): item is MenuItem => item !== null);
}

export function getVoteState(row: Element | null | undefined): VoteState {
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

export function buildNextFavoriteHref(href: string | null | undefined, willBeFavorited: boolean, baseHref?: string | null): string {
  if (!href) {
    return "";
  }
  try {
    const base = getBaseHref(baseHref);
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

export function resolveHrefWithBase(href: string | null | undefined, baseHref?: string | null): string {
  if (!href) {
    return "";
  }
  try {
    const base = getBaseHref(baseHref);
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

export function isUserProfilePage(): boolean {
  const op = document.documentElement?.getAttribute("op") || "";
  if (op.toLowerCase() === "user") {
    return true;
  }
  return globalThis.location?.pathname === "/user";
}

export function getIndentLevelFromRow(row: Element | null | undefined): number {
  if (!row) {
    return 0;
  }
  const indentImg = row.querySelector("td.ind img");
  const indentWidth = Number.parseInt(indentImg?.getAttribute("width") || "0", 10) || 0;
  return Math.round(indentWidth / 40) || 0;
}

export function getIndentLevelFromItem(item: HTMLElement | null | undefined): number {
  if (!item) {
    return 0;
  }
  return Number.parseInt(item.dataset?.indentLevel || "0", 10) || 0;
}

export function getCommentId(row: Element | null | undefined, comhead: Element | null | undefined): string {
  if (!row) {
    return "";
  }
  const link = comhead?.querySelector("a[href^='item?id=']")
    || row.querySelector("a[href^='item?id=']");
  if (!link) {
    return "";
  }
  const href = link.getAttribute("href") || "";
  const queryStart = href.indexOf("?");
  if (queryStart === -1) {
    return "";
  }
  const params = new URLSearchParams(href.slice(queryStart + 1));
  return params.get("id") || "";
}

export function getReplyHref(row: Element | null | undefined, comhead: Element | null | undefined): string {
  if (!row) {
    return "";
  }
  const linkByHref = row.querySelector("a[href^='reply?id=']");
  const linkByText = comhead
    ? Array.from(comhead.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "reply";
      })
    : null;
  const link = linkByHref || linkByText;
  return link?.getAttribute("href") || "";
}

function isInteractiveElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) {
    return false;
  }
  const tagName = element.tagName.toLowerCase();
  if (tagName === "a" || tagName === "button" || tagName === "input" || tagName === "select" || tagName === "textarea") {
    return true;
  }
  if (element.getAttribute("role") === "button") {
    return true;
  }
  return false;
}

export function addSubmissionClickHandler(element: HTMLElement, itemId: string | null | undefined): void {
  if (!itemId) return;
  element.addEventListener("click", (event: MouseEvent) => {
    if (isInteractiveElement(event.target)) {
      return;
    }
    globalThis.location!.href = `/item?id=${itemId}`;
  });
}

export function addCommentClickHandler(element: HTMLElement, toggleFn: (el: HTMLElement) => void): void {
  element.addEventListener("click", (event: MouseEvent) => {
    if (isInteractiveElement(event.target)) {
      return;
    }
    // Skip collapse if user is selecting text
    if (window.getSelection()?.toString()) {
      return;
    }
    toggleFn(element);
  });
}

export function getCommentRows(table: Element | null): HTMLTableRowElement[] {
  if (!table) {
    return [];
  }
  const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>("tr.athing"));
  return rows.filter(
    (row) => row.classList.contains("comtr") || row.querySelector(".comment .commtext")
  );
}
