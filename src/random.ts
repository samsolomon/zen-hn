export const RANDOM_ITEM_MAX_ATTEMPTS = 6;

interface ZenLogic {
  buildItemHref(itemId: string, baseHref: string): string;
}

declare const ZEN_LOGIC: ZenLogic;

export function parseItemIdFromHref(href: string): string {
  if (!href) {
    return "";
  }
  const match = href.match(/item\?id=(\d+)/);
  return match ? match[1] : "";
}

function parseItemIdFromDocument(doc: Document): string {
  const itemLink = doc.querySelector("a[href^='item?id=']");
  if (!itemLink) {
    return "";
  }
  const href = itemLink.getAttribute("href") ?? "";
  return parseItemIdFromHref(href);
}

export function parseMaxId(maxId: string): number | null {
  const max = Number.parseInt(maxId || "", 10);
  if (!Number.isFinite(max) || max < 1) {
    return null;
  }
  return max;
}

export async function fetchNewestItemId(): Promise<string> {
  try {
    const response = await fetch("/newest", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) {
      return "";
    }
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    return parseItemIdFromDocument(doc);
  } catch {
    return "";
  }
}

export function resolveHrefWithBase(href: string, baseHref?: string): string {
  if (!href) {
    return "";
  }
  try {
    const base =
      baseHref ?? globalThis.location?.href ?? "https://news.ycombinator.com/";
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

async function resolveStoryHrefFromItem(itemId: number): Promise<string> {
  if (!itemId) {
    return "";
  }
  try {
    const response = await fetch(`item?id=${itemId}`, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) {
      return "";
    }
    const html = await response.text();
    if (/No such item/i.test(html)) {
      return "";
    }
    const doc = new DOMParser().parseFromString(html, "text/html");
    const onStoryHref =
      doc.querySelector(".onstory a")?.getAttribute("href") ?? "";
    if (onStoryHref) {
      return resolveHrefWithBase(onStoryHref, response.url);
    }
    const storyHref =
      ZEN_LOGIC.buildItemHref(String(itemId), response.url) ??
      `item?id=${itemId}`;
    return resolveHrefWithBase(storyHref, response.url);
  } catch {
    return "";
  }
}

export async function resolveRandomStoryHref(maxId: string): Promise<string> {
  const max = parseMaxId(maxId);
  if (max === null) {
    return "";
  }
  const maxString = String(max);
  for (let attempt = 0; attempt < RANDOM_ITEM_MAX_ATTEMPTS; attempt += 1) {
    const candidate = Math.floor(Math.random() * max) + 1;
    const storyHref = await resolveStoryHrefFromItem(candidate);
    if (storyHref) {
      return storyHref;
    }
  }
  return ZEN_LOGIC.buildItemHref(maxString, window.location.href) ||
    `item?id=${maxString}`;
}

export async function handleRandomItemClick(event: Event): Promise<void> {
  event.preventDefault();
  const link = event.currentTarget;
  if (!(link instanceof HTMLElement)) {
    return;
  }
  if (link.dataset.randomPending === "true") {
    return;
  }
  link.dataset.randomPending = "true";
  link.setAttribute("aria-busy", "true");
  try {
    const newestId = await fetchNewestItemId();
    const randomHref = await resolveRandomStoryHref(newestId);
    if (!randomHref && !newestId) {
      window.location.href = "/newest";
      return;
    }
    const fallbackHref = newestId
      ? ZEN_LOGIC.buildItemHref(newestId, window.location.href) ||
        `item?id=${newestId}`
      : "/newest";
    const targetHref = randomHref || fallbackHref;
    window.location.href = targetHref;
  } finally {
    delete link.dataset.randomPending;
    link.removeAttribute("aria-busy");
  }
}
