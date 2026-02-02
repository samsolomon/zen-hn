/**
 * Action Store - Persists user actions (votes, favorites) across page loads
 *
 * Uses chrome.storage.local to store actions per user, allowing vote/favorite
 * state to persist even when HN doesn't reflect the state in the DOM.
 */

declare const chrome: {
  storage?: {
    local?: {
      get: (
        keys: Record<string, unknown>,
        callback: (result: Record<string, unknown>) => void
      ) => void;
      set: (items: Record<string, unknown>, callback?: () => void) => void;
    };
  };
  runtime?: {
    lastError?: { message: string };
  };
};

export const ACTION_STORE_KEY = "zenHnActions";
export const ACTION_STORE_VERSION = 1;
export const ACTION_STORE_DEBOUNCE_MS = 250;

export type VoteDirection = "up" | "down";

export interface ActionItem {
  vote?: VoteDirection;
  favorite?: boolean;
  updatedAt?: number;
}

export interface UserActionBucket {
  stories: Record<string, ActionItem>;
  comments: Record<string, ActionItem>;
}

export interface ActionStore {
  version: number;
  byUser: Record<string, UserActionBucket>;
}

export type ActionKind = "stories" | "comments";

export interface ActionUpdate {
  vote?: VoteDirection | null;
  favorite?: boolean | null;
}

let actionStore: ActionStore | null = null;
let actionStoreLoadPromise: Promise<ActionStore> | null = null;
let actionStoreSaveTimer: ReturnType<typeof setTimeout> | null = null;

function getDefaultActionStore(): ActionStore {
  return { version: ACTION_STORE_VERSION, byUser: {} };
}

function normalizeActionStore(raw: unknown): ActionStore {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return getDefaultActionStore();
  }
  const obj = raw as Record<string, unknown>;
  const version = Number(obj.version);
  if (version !== ACTION_STORE_VERSION) {
    return getDefaultActionStore();
  }
  if (!obj.byUser || typeof obj.byUser !== "object" || Array.isArray(obj.byUser)) {
    return getDefaultActionStore();
  }
  return { version: ACTION_STORE_VERSION, byUser: obj.byUser as Record<string, UserActionBucket> };
}

export function loadActionStore(): Promise<ActionStore> {
  if (actionStoreLoadPromise) {
    return actionStoreLoadPromise;
  }
  actionStoreLoadPromise = new Promise((resolve) => {
    if (!globalThis.chrome?.storage?.local) {
      actionStore = getDefaultActionStore();
      resolve(actionStore);
      return;
    }
    chrome.storage.local.get({ [ACTION_STORE_KEY]: null }, (result) => {
      if (chrome.runtime?.lastError) {
        // Extension context invalidated (e.g., extension reloaded/disabled)
        actionStore = getDefaultActionStore();
        resolve(actionStore);
        return;
      }
      const raw = result ? result[ACTION_STORE_KEY] : null;
      actionStore = normalizeActionStore(raw);
      resolve(actionStore);
    });
  });
  return actionStoreLoadPromise;
}

function scheduleActionStoreSave(): void {
  if (!globalThis.chrome?.storage?.local || !actionStore) {
    return;
  }
  if (actionStoreSaveTimer) {
    globalThis.clearTimeout(actionStoreSaveTimer);
  }
  actionStoreSaveTimer = globalThis.setTimeout(() => {
    actionStoreSaveTimer = null;
    chrome.storage.local.set({ [ACTION_STORE_KEY]: actionStore }, () => {
      if (chrome.runtime?.lastError) {
        console.error("[ZenHN] Error saving action store:", chrome.runtime.lastError);
      }
    });
  }, ACTION_STORE_DEBOUNCE_MS);
}

function getHrefParams(href: string): URLSearchParams {
  try {
    const url = new URL(href, "https://news.ycombinator.com");
    return url.searchParams;
  } catch {
    return new URLSearchParams();
  }
}

export function getCurrentUserKey(): string {
  const meLink = document.querySelector("a#me");
  const headerLink = document.querySelector("span.pagetop a[href^='user?id=']");
  const link = meLink || headerLink;
  if (!link) {
    return "anonymous";
  }
  const href = link.getAttribute("href") || "";
  const params = getHrefParams(href);
  const fromHref = params.get("id") || "";
  const fromText = link.textContent?.trim() || "";
  return fromHref || fromText || "anonymous";
}

interface UserActionBucketResult {
  username: string;
  bucket: UserActionBucket;
}

function getUserActionBucket(): UserActionBucketResult {
  if (!actionStore) {
    actionStore = getDefaultActionStore();
  }
  const username = getCurrentUserKey();
  if (!actionStore.byUser[username]) {
    actionStore.byUser[username] = { stories: {}, comments: {} };
  }
  return { username, bucket: actionStore.byUser[username] };
}

export function getStoredAction(kind: ActionKind, id: string): ActionItem | null {
  if (!actionStore || !id) {
    return null;
  }
  const { bucket } = getUserActionBucket();
  return bucket?.[kind]?.[id] || null;
}

export function updateStoredAction(kind: ActionKind, id: string, update: ActionUpdate): void {
  if (!actionStore || !id || !update) {
    return;
  }
  const { bucket } = getUserActionBucket();
  const current = bucket?.[kind]?.[id] || {};
  const next: ActionItem = { ...current };

  if (Object.prototype.hasOwnProperty.call(update, "vote")) {
    if (update.vote === "up" || update.vote === "down") {
      next.vote = update.vote;
    } else {
      delete next.vote;
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, "favorite")) {
    if (update.favorite === true) {
      next.favorite = true;
    } else {
      delete next.favorite;
    }
  }

  if (!next.vote && !next.favorite) {
    if (bucket?.[kind]) {
      delete bucket[kind][id];
      if (Object.keys(bucket[kind]).length === 0) {
        delete bucket[kind];
      }
    }
  } else {
    next.updatedAt = Date.now();
    if (!bucket[kind]) {
      bucket[kind] = {};
    }
    bucket[kind][id] = next;
  }
  scheduleActionStoreSave();
}

export function isActionStoreLoaded(): boolean {
  return actionStore !== null;
}

export function getActionStore(): ActionStore | null {
  return actionStore;
}
