const PHOSPHOR_SVGS = {
  "arrow-fat-up":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M229.66,114.34l-96-96a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,32,128H72v80a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16V128h40a8,8,0,0,0,5.66-13.66ZM176,112a8,8,0,0,0-8,8v88H88V120a8,8,0,0,0-8-8H51.31L128,35.31,204.69,112Z\"/></svg>",
  "arrow-fat-down":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M231.39,132.94A8,8,0,0,0,224,128H184V48a16,16,0,0,0-16-16H88A16,16,0,0,0,72,48v80H32a8,8,0,0,0-5.66,13.66l96,96a8,8,0,0,0,11.32,0l96-96A8,8,0,0,0,231.39,132.94ZM128,220.69,51.31,144H80a8,8,0,0,0,8-8V48h80v88a8,8,0,0,0,8,8h28.69Z\"/></svg>",
  "bookmark-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z\"/></svg>",
  "share-fat":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z\"/></svg>",
  "link-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z\"/></svg>",
  "check-circle":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,145.37l50.34-50.34a8,8,0,0,1,11.32,11.32Z\"/></svg>",
  "caret-down":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z\"/></svg>",
  "dots-three":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,104a24,24,0,1,0,24,24A24,24,0,0,0,128,104Zm-64,0a24,24,0,1,0,24,24A24,24,0,0,0,64,104Zm128,0a24,24,0,1,0,24,24A24,24,0,0,0,192,104Z\"/></svg>",
};

const ZEN_LOGIC = globalThis.ZenHnLogic;
const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ZEN_HN_SUBMISSIONS_KEY = "zenHnSubmissions";
const ACTION_STORE_KEY = "zenHnActions";
const ACTION_STORE_VERSION = 1;
const ACTION_STORE_DEBOUNCE_MS = 250;

let actionStore = null;
let actionStoreLoadPromise = null;
let actionStoreSaveTimer = null;

document.documentElement.dataset.zenHnActive = "true";

if (window.location.pathname === "/item") {
  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "loading";
}

function registerIcon(name, svg) {
  if (!name || !svg) {
    return;
  }
  PHOSPHOR_SVGS[name] = svg;
}

function renderIcon(name) {
  return PHOSPHOR_SVGS[name] || "";
}

const SUBMISSION_MENU_CLASS = "hn-submission-menu";
const SUBMISSION_MENU_OPEN_CLASS = "is-open";
let submissionMenuHandlersRegistered = false;

function setSubmissionMenuState(menu, isOpen) {
  if (!menu) {
    return;
  }
  menu.classList.toggle(SUBMISSION_MENU_OPEN_CLASS, isOpen);
  const button = menu.querySelector(".hn-menu-button");
  if (button) {
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

function closeAllSubmissionMenus(exceptMenu) {
  const openMenus = document.querySelectorAll(
    `.${SUBMISSION_MENU_CLASS}.${SUBMISSION_MENU_OPEN_CLASS}`,
  );
  openMenus.forEach((menu) => {
    if (menu === exceptMenu) {
      return;
    }
    setSubmissionMenuState(menu, false);
  });
}

function registerSubmissionMenuListeners() {
  if (submissionMenuHandlersRegistered) {
    return;
  }
  submissionMenuHandlersRegistered = true;
  document.addEventListener("click", (event) => {
    const openMenus = document.querySelectorAll(
      `.${SUBMISSION_MENU_CLASS}.${SUBMISSION_MENU_OPEN_CLASS}`,
    );
    if (!openMenus.length) {
      return;
    }
    openMenus.forEach((menu) => {
      if (menu.contains(event.target)) {
        return;
      }
      setSubmissionMenuState(menu, false);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    closeAllSubmissionMenus();
  });
}

function getIndentLevelFromRow(row) {
  if (!row) {
    return 0;
  }
  const indentImg = row.querySelector("td.ind img");
  const indentWidth = Number.parseInt(indentImg?.getAttribute("width") || "0", 10) || 0;
  return Math.round(indentWidth / 40) || 0;
}

function getIndentLevelFromItem(item) {
  return Number.parseInt(item?.dataset.indentLevel || "0", 10) || 0;
}

function setCollapseButtonState(button, isCollapsed, hasChildren) {
  if (!button) {
    return;
  }
  const targetLabel = hasChildren ? "thread" : "comment";
  button.classList.toggle("is-collapsed", isCollapsed);
  button.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  button.setAttribute(
    "aria-label",
    isCollapsed ? `Expand ${targetLabel}` : `Collapse ${targetLabel}`,
  );
}

function hideDescendantComments(item) {
  const baseLevel = getIndentLevelFromItem(item);
  let sibling = item.nextElementSibling;
  while (sibling && sibling.classList.contains("hn-comment")) {
    const level = getIndentLevelFromItem(sibling);
    if (level <= baseLevel) {
      break;
    }
    sibling.hidden = true;
    sibling = sibling.nextElementSibling;
  }
}

function restoreDescendantVisibility(item) {
  const baseLevel = getIndentLevelFromItem(item);
  let sibling = item.nextElementSibling;
  const collapsedStack = [];
  while (sibling && sibling.classList.contains("hn-comment")) {
    const level = getIndentLevelFromItem(sibling);
    if (level <= baseLevel) {
      break;
    }
    while (collapsedStack.length && level <= collapsedStack[collapsedStack.length - 1]) {
      collapsedStack.pop();
    }
    const isHiddenByAncestor = collapsedStack.length > 0;
    sibling.hidden = isHiddenByAncestor;
    const isCollapsed = sibling.dataset.collapsed === "true";
    if (!isHiddenByAncestor && isCollapsed) {
      collapsedStack.push(level);
    }
    sibling = sibling.nextElementSibling;
  }
}

function toggleCommentCollapse(item) {
  const isCollapsed = item.dataset.collapsed === "true";
  const nextCollapsed = !isCollapsed;
  item.dataset.collapsed = nextCollapsed ? "true" : "false";
  const hasChildren = item.dataset.hasChildren === "true";
  const collapseButton = item.querySelector(".hn-collapse-button");
  setCollapseButtonState(collapseButton, nextCollapsed, hasChildren);
  if (nextCollapsed) {
    hideDescendantComments(item);
  } else {
    restoreDescendantVisibility(item);
  }
}

function getHrefParams(href) {
  if (!href) {
    return new URLSearchParams();
  }
  const queryStart = href.indexOf("?");
  if (queryStart === -1) {
    return new URLSearchParams();
  }
  return new URLSearchParams(href.slice(queryStart + 1));
}

function getDefaultActionStore() {
  return { version: ACTION_STORE_VERSION, byUser: {} };
}

function normalizeActionStore(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return getDefaultActionStore();
  }
  const version = Number(raw.version);
  if (version !== ACTION_STORE_VERSION) {
    return getDefaultActionStore();
  }
  if (!raw.byUser || typeof raw.byUser !== "object" || Array.isArray(raw.byUser)) {
    return getDefaultActionStore();
  }
  return { version: ACTION_STORE_VERSION, byUser: raw.byUser };
}

function loadActionStore() {
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
      const raw = result ? result[ACTION_STORE_KEY] : null;
      actionStore = normalizeActionStore(raw);
      resolve(actionStore);
    });
  });
  return actionStoreLoadPromise;
}

function scheduleActionStoreSave() {
  if (!globalThis.chrome?.storage?.local || !actionStore) {
    return;
  }
  if (actionStoreSaveTimer) {
    globalThis.clearTimeout(actionStoreSaveTimer);
  }
  actionStoreSaveTimer = globalThis.setTimeout(() => {
    actionStoreSaveTimer = null;
    chrome.storage.local.set({ [ACTION_STORE_KEY]: actionStore });
  }, ACTION_STORE_DEBOUNCE_MS);
}

function getCurrentUserKey() {
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

function getUserActionBucket() {
  if (!actionStore) {
    actionStore = getDefaultActionStore();
  }
  const username = getCurrentUserKey();
  if (!actionStore.byUser[username]) {
    actionStore.byUser[username] = { stories: {}, comments: {} };
  }
  return { username, bucket: actionStore.byUser[username] };
}

function getStoredAction(kind, id) {
  if (!actionStore || !id) {
    return null;
  }
  const { bucket } = getUserActionBucket();
  return bucket?.[kind]?.[id] || null;
}

function updateStoredAction(kind, id, update) {
  if (!actionStore || !id || !update) {
    return;
  }
  const { bucket } = getUserActionBucket();
  const current = bucket?.[kind]?.[id] || {};
  const next = { ...current };
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

function getCommentId(row, comhead) {
  const link = comhead?.querySelector("a[href^='item?id=']")
    || row.querySelector("a[href^='item?id=']");
  if (!link) {
    return "";
  }
  const href = link.getAttribute("href") || "";
  const params = getHrefParams(href);
  return params.get("id") || "";
}

function getReplyHref(row, comhead) {
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

function getVoteState(row) {
  const upArrow = row.querySelector(".votearrow:not(.down)");
  const downArrow = row.querySelector(".votearrow.down");
  let isUpvoted = Boolean(upArrow?.classList.contains("voted"));
  let isDownvoted = Boolean(downArrow?.classList.contains("voted"));
  if (isUpvoted && isDownvoted) {
    isDownvoted = false;
  }
  return { isUpvoted, isDownvoted };
}

async function copyTextToClipboard(text) {
  if (!text) {
    return false;
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall through to legacy copy.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (error) {
    success = false;
  }
  document.body.removeChild(textarea);
  return success;
}

async function resolveReplyForm(replyHref) {
  if (!replyHref) {
    return null;
  }
  const response = await fetch(replyHref, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const form = doc.querySelector("form");
  if (!form) {
    return null;
  }
  const action = form.getAttribute("action") || "";
  const method = (form.getAttribute("method") || "post").toUpperCase();
  const inputs = Array.from(form.querySelectorAll("input[name]"));
  const fields = {};
  inputs.forEach((input) => {
    fields[input.name] = input.value || "";
  });
  const textName = form.querySelector("textarea[name]")?.getAttribute("name") || "text";
  const actionUrl = new URL(action || response.url, response.url).toString();
  return {
    actionUrl,
    method,
    fields,
    textName,
  };
}

function resolveReplyFormFromElement(form) {
  if (!form) {
    return null;
  }
  const action = form.getAttribute("action") || "";
  const method = (form.getAttribute("method") || "post").toUpperCase();
  const inputs = Array.from(form.querySelectorAll("input[name]"));
  const fields = {};
  inputs.forEach((input) => {
    fields[input.name] = input.value || "";
  });
  const textName = form.querySelector("textarea[name]")?.getAttribute("name") || "text";
  const actionUrl = new URL(action || window.location.href, window.location.href).toString();
  return {
    actionUrl,
    method,
    fields,
    textName,
  };
}

async function submitReplyWithResolved(resolved, text) {
  if (!resolved) {
    return { ok: false };
  }
  const payload = new URLSearchParams({
    ...resolved.fields,
    [resolved.textName]: text,
  });
  let response = null;
  if (resolved.method === "GET") {
    const url = new URL(resolved.actionUrl);
    payload.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    response = await fetch(url.toString(), {
      credentials: "same-origin",
      cache: "no-store",
    });
  } else {
    response = await fetch(resolved.actionUrl, {
      method: resolved.method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      credentials: "same-origin",
      cache: "no-store",
    });
  }
  return {
    ok: response?.ok,
    status: response?.status,
  };
}

async function submitReply(replyHref, text) {
  try {
    const resolved = await resolveReplyForm(replyHref);
    if (!resolved) {
      return { ok: false };
    }
    return await submitReplyWithResolved(resolved, text);
  } catch (error) {
    return { ok: false };
  }
}


async function resolveFavoriteLink(commentId) {
  if (!commentId) {
    return null;
  }
  const response = await fetch(`item?id=${commentId}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const comheads = Array.from(doc.querySelectorAll(".comhead"));
  const targetComhead = comheads.find((head) =>
    head.querySelector(`a[href^='item?id=${commentId}']`),
  );
  const comhead = targetComhead || comheads[0];
  if (!comhead) {
    return null;
  }
  const linkById = comhead.querySelector("a[href^='fave?id='], a[id^='fav_'], a[id^='fave_']");
  const linkByText = Array.from(comhead.querySelectorAll("a")).find((link) => {
    const text = link.textContent?.trim().toLowerCase();
    return text === "favorite" || text === "unfavorite";
  });
  const link = linkById || linkByText;
  if (!link) {
    return null;
  }
  const text = link.textContent?.trim().toLowerCase() || "";
  const href = link.getAttribute("href") || "";
  return {
    href,
    isFavorited: text === "unfavorite" || href.includes("un=t"),
  };
}

async function resolveStoryFavoriteLink(itemId) {
  if (!itemId) {
    return null;
  }
  const response = await fetch(`item?id=${itemId}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const fatitem = doc.querySelector("table.fatitem");
  const subtext = fatitem?.querySelector(".subtext");
  if (!subtext) {
    return null;
  }
  const linkById = subtext.querySelector("a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']");
  const linkByText = Array.from(subtext.querySelectorAll("a")).find((link) => {
    const text = link.textContent?.trim().toLowerCase();
    return text === "favorite" || text === "unfavorite";
  });
  const link = linkById || linkByText;
  if (!link) {
    return null;
  }
  const text = link.textContent?.trim().toLowerCase() || "";
  const href = link.getAttribute("href") || "";
  return {
    href,
    isFavorited: text === "unfavorite" || href.includes("un=t"),
  };
}



function buildNextFavoriteHref(href, willBeFavorited) {
  if (!href) {
    return "";
  }
  try {
    const url = new URL(href, window.location.href);
    if (willBeFavorited) {
      url.searchParams.delete("un");
    } else {
      url.searchParams.set("un", "t");
    }
    return url.toString();
  } catch (error) {
    if (willBeFavorited) {
      return href.replace(/([?&])un=t(&|$)/, "$1").replace(/[?&]$/, "");
    }
    return href.includes("un=t") ? href : `${href}${href.includes("?") ? "&" : "?"}un=t`;
  }
}

function stripParenTextNodes(element) {
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

function toSentenceCase(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return "";
  }
  const lower = trimmed.toLowerCase();
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

function isUserProfilePage() {
  const op = document.documentElement.getAttribute("op") || "";
  if (op.toLowerCase() === "user") {
    return true;
  }
  return window.location.pathname === "/user";
}

function restyleSubmissions() {
  if (isUserProfilePage()) {
    return;
  }
  const bigboxRow = document.querySelector("tr#bigbox");
  const itemList = document.querySelector("table.itemlist");
  const bigboxTable = bigboxRow?.querySelector("table");
  const sourceTable = itemList || bigboxTable;
  if (!sourceTable || sourceTable.dataset[ZEN_HN_SUBMISSIONS_KEY] === "true") {
    return;
  }

  if (document.querySelector("table.comment-tree")) {
    return;
  }

  const rows = getStoryRows(sourceTable);
  if (!rows.length) {
    return;
  }

  const mode = itemList ? "itemlist" : "bigbox";
  const container = document.createElement("div");
  container.className = "hn-submissions";
  registerSubmissionMenuListeners();

  rows.forEach((row) => {
    const titleLine = row.querySelector(".titleline");
    const titleLink = titleLine?.querySelector("a")
      || row.querySelector("a.storylink")
      || row.querySelector("a.titlelink")
      || row.querySelector("a");
    if (!titleLink) {
      return;
    }

    const item = document.createElement("div");
    item.className = "hn-submission";
    const itemId = row.getAttribute("id") || "";

    const rankText = row.querySelector(".rank")?.textContent?.trim() || "";
    const rank = document.createElement("div");
    rank.className = "hn-submission-rank";
    rank.textContent = rankText;
    if (!rankText) {
      rank.classList.add("is-empty");
    }

    const subtextRow = row.nextElementSibling;
    const subtext = subtextRow?.querySelector(".subtext");

    const { isUpvoted } = getVoteState(row);
    let isUpvotedState = isUpvoted;
    let upvoteLink = row.querySelector("a[id^='up_']");
    let unvoteLink = row.querySelector("a[id^='un_'], a[href*='how=un']");
    if (!upvoteLink && subtextRow) {
      upvoteLink = subtextRow.querySelector("a[id^='up_']");
    }
    if (!upvoteLink && subtext) {
      upvoteLink = Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text === "upvote" || text === "vote";
      });
    }
    if (!unvoteLink && subtextRow) {
      unvoteLink = subtextRow.querySelector("a[id^='un_'], a[href*='how=un']");
    }
    if (!unvoteLink && subtext) {
      unvoteLink = Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text === "unvote";
      });
    }
    const upvoteHref = upvoteLink?.getAttribute("href") || "";
    const unvoteHref = unvoteLink?.getAttribute("href") || "";
    const voteItemId = ZEN_LOGIC.resolveVoteItemId(upvoteHref || unvoteHref, window.location.href);
    const effectiveItemId = voteItemId || itemId;
    if (effectiveItemId) {
      item.dataset.itemId = effectiveItemId;
    }
    const storedStoryAction = effectiveItemId
      ? getStoredAction("stories", effectiveItemId)
      : null;

    const hasVoteLinks = Boolean(upvoteLink || unvoteLink);
    const storedVote = storedStoryAction?.vote;
    const domUpvoted = isUpvoted || Boolean(unvoteLink);
    if (hasVoteLinks && effectiveItemId) {
      if (domUpvoted && storedVote !== "up") {
        updateStoredAction("stories", effectiveItemId, { vote: "up" });
      }
    }
    if (!domUpvoted && !hasVoteLinks && storedVote === "up") {
      isUpvotedState = true;
    } else if (domUpvoted) {
      isUpvotedState = true;
    }

    const body = document.createElement("div");
    body.className = "hn-submission-body";

    const titleRow = document.createElement("div");
    titleRow.className = "hn-submission-titleline";
    const titleClone = titleLink.cloneNode(true);
    titleClone.classList.add("hn-submission-title");
    titleRow.appendChild(titleClone);
    body.appendChild(titleRow);

    const meta = document.createElement("div");
    meta.className = "hn-submission-meta";

    const appendMetaItem = (node, className) => {
      if (!node) {
        return;
      }
      const clone = node.cloneNode(true);
      if (className) {
        clone.classList.add(className);
      }
      if (className === "hn-submission-site" || clone.classList.contains("sitebit")) {
        stripParenTextNodes(clone);
      }
      meta.appendChild(clone);
    };

    const score = subtext?.querySelector(".score");
    const hnuser = subtext?.querySelector(".hnuser");
    const age = subtext?.querySelector(".age");
    const sitebit = titleLine?.querySelector(".sitebit");
    const commentsLink = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase() || "";
          return text.includes("comment") || text.includes("discuss");
        })
      : null;
    const hideLinkByHref = subtext?.querySelector("a[href^='hide?id='], a[href^='unhide?id=']");
    const hideLinkByText = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase() || "";
          return text === "hide" || text === "unhide";
        })
      : null;
    const hideLink = hideLinkByHref || hideLinkByText;
    const flagLinkByHref = subtext?.querySelector(
      "a[href^='flag?id='], a[href^='unflag?id='], a[id^='flag_']",
    );
    const flagLinkByText = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase() || "";
          return text === "flag" || text === "unflag";
        })
      : null;
    const flagLink = flagLinkByHref || flagLinkByText;

    appendMetaItem(score, "hn-submission-score");
    appendMetaItem(hnuser, "hn-submission-user");
    appendMetaItem(age, "hn-submission-age");
    appendMetaItem(commentsLink, "hn-submission-comments");
    appendMetaItem(sitebit, "hn-submission-site");

    const actions = document.createElement("div");
    actions.className = "hn-comment-actions hn-submission-actions";

    const upvoteButton = document.createElement("button");
    upvoteButton.className = "icon-button";
    upvoteButton.type = "button";
    upvoteButton.setAttribute("aria-label", "Upvote");
    upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
    upvoteButton.innerHTML = renderIcon("arrow-fat-up");
    if (isUpvotedState) {
      upvoteButton.classList.add("is-active");
    }
    if (upvoteLink || isUpvotedState) {
      upvoteButton.addEventListener("click", (event) => {
        const voteHref = isUpvotedState
          ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
          : upvoteHref;
        if (!voteHref) {
          return;
        }
        event.preventDefault();
        fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
        isUpvotedState = !isUpvotedState;
        if (effectiveItemId) {
          updateStoredAction("stories", effectiveItemId, { vote: isUpvotedState ? "up" : null });
        }
        upvoteButton.classList.toggle("is-active", isUpvotedState);
        upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
      });
    } else {
      upvoteButton.hidden = true;
    }

    const favoriteLinkById = subtext?.querySelector(
      "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']",
    );
    const favoriteLinkByText = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase();
          return text === "favorite" || text === "unfavorite";
        })
      : null;
    const favoriteLink = favoriteLinkById || favoriteLinkByText;
    const favoriteText = favoriteLink?.textContent?.trim().toLowerCase() || "";
    const storedFavorite = storedStoryAction?.favorite;
    const hasFavoriteSignal = Boolean(favoriteLink);
    let isFavorited = favoriteText === "unfavorite";
    if (!hasFavoriteSignal && storedFavorite === true) {
      isFavorited = true;
    }
    if (hasFavoriteSignal && effectiveItemId) {
      if (isFavorited && storedFavorite !== true) {
        updateStoredAction("stories", effectiveItemId, { favorite: true });
      } else if (!isFavorited && storedFavorite === true) {
        updateStoredAction("stories", effectiveItemId, { favorite: false });
      }
    }
    let favoriteHref = favoriteLink?.getAttribute("href") || "";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = "icon-button";
    bookmarkButton.type = "button";
    bookmarkButton.setAttribute("aria-label", "Favorite");
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    bookmarkButton.innerHTML = renderIcon("bookmark-simple");
    if (isFavorited) {
      bookmarkButton.classList.add("is-active");
    }
    bookmarkButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const wasFavorited = isFavorited;
      isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      if (effectiveItemId) {
        updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
      }
      if (!favoriteHref && effectiveItemId) {
        bookmarkButton.disabled = true;
        const resolved = await resolveStoryFavoriteLink(effectiveItemId);
        bookmarkButton.disabled = false;
        if (!resolved?.href) {
          isFavorited = wasFavorited;
          bookmarkButton.classList.toggle("is-active", isFavorited);
          bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
          if (effectiveItemId) {
            updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
          }
          return;
        }
        favoriteHref = resolved.href;
      }
      if (!favoriteHref) {
        isFavorited = wasFavorited;
        bookmarkButton.classList.toggle("is-active", isFavorited);
        bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
        if (effectiveItemId) {
          updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
        }
        return;
      }
      await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
      isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      if (effectiveItemId) {
        updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
      }
      favoriteHref = buildNextFavoriteHref(favoriteHref, !isFavorited);
    });

    const linkButton = document.createElement("button");
    linkButton.className = "icon-button";
    linkButton.type = "button";
    linkButton.setAttribute("aria-label", "Copy link");
    const linkIconSwap = document.createElement("span");
    linkIconSwap.className = "icon-swap";
    linkIconSwap.innerHTML = `
      <span class="icon-default">${renderIcon("link-simple")}</span>
      <span class="icon-success">${renderIcon("check-circle")}</span>
    `;
    linkButton.appendChild(linkIconSwap);
    let copyResetTimer = null;
    linkButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const commentsHref = commentsLink?.getAttribute("href") || "";
      const targetHref = ZEN_LOGIC.resolveSubmissionCopyHref(
        commentsHref,
        effectiveItemId,
        window.location.href,
      ) || window.location.href;
      const copied = await copyTextToClipboard(targetHref);
      if (copied) {
        if (copyResetTimer) {
          window.clearTimeout(copyResetTimer);
        }
        linkButton.classList.add("is-copied");
        linkButton.classList.add("is-active");
        copyResetTimer = window.setTimeout(() => {
          linkButton.classList.remove("is-copied");
          linkButton.classList.remove("is-active");
          copyResetTimer = null;
        }, 1500);
      }
    });

    actions.appendChild(upvoteButton);
    actions.appendChild(bookmarkButton);
    actions.appendChild(linkButton);

    const extraLinks = [];
    if (subtext) {
      const ageLink = age?.querySelector("a");
      const excludedLinks = new Set([
        hnuser,
        ageLink,
        commentsLink,
        favoriteLink,
        upvoteLink,
        unvoteLink,
        hideLink,
        flagLink,
      ]);
      extraLinks.push(
        ...Array.from(subtext.querySelectorAll("a")).filter(
          (link) => !excludedLinks.has(link),
        ),
      );
    }

    const hideHref = hideLink?.getAttribute("href") || "";
    const flagHref = flagLink?.getAttribute("href") || "";
    const menuItems = ZEN_LOGIC.buildMenuItems([
      {
        href: hideHref,
        text: hideLink?.textContent,
        fallback: "Hide",
        action: "hide",
      },
      {
        href: flagHref,
        text: flagLink?.textContent,
        fallback: "Flag",
        action: "flag",
      },
    ]);
    const extraMenuItems = extraLinks
      .map((link) => {
        const href = link.getAttribute("href") || "";
        if (!href) {
          return null;
        }
        const label = toSentenceCase(link.textContent);
        if (!label) {
          return null;
        }
        return {
          label,
          href,
          action: "extra",
        };
      })
      .filter((item) => item?.href && item.label);
    menuItems.push(...extraMenuItems);

    const menuWrapper = document.createElement("div");
    menuWrapper.className = SUBMISSION_MENU_CLASS;

    const menuButton = document.createElement("button");
    menuButton.className = "icon-button hn-menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "More actions");
    menuButton.setAttribute("aria-haspopup", "menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = renderIcon("dots-three");

    const menuDropdown = document.createElement("div");
    menuDropdown.className = "hn-submission-menu-dropdown";
    menuDropdown.setAttribute("role", "menu");

    if (!menuItems.length) {
      menuButton.disabled = true;
    }

    menuItems.forEach((menuItem) => {
      const itemButton = document.createElement("button");
      itemButton.className = "hn-submission-menu-item";
      itemButton.type = "button";
      itemButton.setAttribute("role", "menuitem");
      itemButton.textContent = menuItem.label;
      itemButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmissionMenuState(menuWrapper, false);
        if (menuItem.action === "hide") {
          item.remove();
        }
        if (menuItem.href) {
          fetch(menuItem.href, { credentials: "same-origin", cache: "no-store" });
        }
      });
      menuDropdown.appendChild(itemButton);
    });

    menuButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (menuButton.disabled) {
        return;
      }
      const isOpen = menuWrapper.classList.contains(SUBMISSION_MENU_OPEN_CLASS);
      if (!isOpen) {
        closeAllSubmissionMenus(menuWrapper);
      }
      const nextOpen = !isOpen;
      setSubmissionMenuState(menuWrapper, nextOpen);
    });

    menuDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    menuWrapper.appendChild(menuButton);
    menuWrapper.appendChild(menuDropdown);
    actions.appendChild(menuWrapper);

    const subRow = document.createElement("div");
    subRow.className = "hn-submission-sub";
    if (meta.childNodes.length) {
      subRow.appendChild(meta);
    }
    subRow.appendChild(actions);
    body.appendChild(subRow);

    item.appendChild(rank);
    item.appendChild(body);
    container.appendChild(item);
  });

  const moreLink = sourceTable.querySelector("a.morelink");
  if (moreLink) {
    const moreContainer = document.createElement("div");
    moreContainer.className = "hn-submissions-more";
    moreContainer.appendChild(moreLink.cloneNode(true));
    container.appendChild(moreContainer);
  }

  sourceTable.dataset[ZEN_HN_SUBMISSIONS_KEY] = "true";
  sourceTable.insertAdjacentElement("beforebegin", container);
  sourceTable.style.display = "none";
}

function restyleFatItem() {
  const fatitem = document.querySelector("table.fatitem");
  if (!fatitem || fatitem.dataset.zenHnRestyled === "true") {
    return;
  }

  const commentRow = getFatItemCommentRow(fatitem);
  if (commentRow) {
    const wrapper = document.createElement("div");
    wrapper.className = "hn-fatitem is-comment";
    const replyForm = fatitem.querySelector("form textarea[name='text']")?.closest("form");
    const replyResolved = resolveReplyFormFromElement(replyForm);
    const commentItem = buildCommentItem(commentRow, {
      indentLevel: 0,
      hasChildren: false,
      showOnStory: true,
      replyResolved,
    });
    if (!commentItem) {
      return;
    }
    wrapper.appendChild(commentItem);
    fatitem.dataset.zenHnRestyled = "true";
    fatitem.insertAdjacentElement("beforebegin", wrapper);
    fatitem.style.display = "none";
    return;
  }

  const titleLink = fatitem.querySelector(".titleline a")
    || fatitem.querySelector("a.storylink")
    || fatitem.querySelector("a.titlelink");
  if (!titleLink) {
    return;
  }

  const subtext = fatitem.querySelector(".subtext");
  const toptext = fatitem.querySelector(".toptext");
  const hnuser = subtext?.querySelector(".hnuser");
  const score = subtext?.querySelector(".score");
  const age = subtext?.querySelector(".age");
  const sitebit = fatitem.querySelector(".titleline .sitebit");
  const commentsLink = subtext
    ? Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text.includes("comment") || text.includes("discuss");
      })
    : null;

  const itemId = new URLSearchParams(window.location.search).get("id") || "";
  const storedStoryAction = getStoredAction("stories", itemId);
  const { isUpvoted } = getVoteState(fatitem);
  let isUpvotedState = isUpvoted;

  const wrapper = document.createElement("div");
  wrapper.className = "hn-fatitem";

  const title = titleLink.cloneNode(true);
  title.classList.add("hn-fatitem-title");
  wrapper.appendChild(title);

  const subRow = document.createElement("div");
  subRow.className = "hn-fatitem-sub";

  const meta = document.createElement("div");
  meta.className = "hn-fatitem-meta";

  const appendMetaItem = (node, className) => {
    if (!node) {
      return;
    }
    const clone = node.cloneNode(true);
    if (clone.classList?.contains("hnuser")) {
      clone.classList.remove("hnuser");
      clone.classList.add("hn-fatitem-user");
    }
    if (className) {
      clone.classList.add(className);
    }
    if (className === "hn-fatitem-site" || clone.classList.contains("sitebit")) {
      stripParenTextNodes(clone);
    }
    meta.appendChild(clone);
  };

  appendMetaItem(score);
  appendMetaItem(hnuser);
  appendMetaItem(age);
  appendMetaItem(commentsLink, "hn-fatitem-comments");
  appendMetaItem(sitebit, "hn-fatitem-site");

  const actions = document.createElement("div");
  actions.className = "hn-comment-actions hn-fatitem-actions";

  const upvoteLink = fatitem.querySelector("a[id^='up_']");
  const unvoteLink = fatitem.querySelector("a[id^='un_'], a[href*='how=un']");
  const upvoteHref = upvoteLink?.getAttribute("href") || "";
  const unvoteHref = unvoteLink?.getAttribute("href") || "";

  const hasVoteLinks = Boolean(upvoteLink || unvoteLink);
  const storedVote = storedStoryAction?.vote;
  const domUpvoted = isUpvoted || Boolean(unvoteLink);
  if (hasVoteLinks && itemId) {
    if (domUpvoted && storedVote !== "up") {
      updateStoredAction("stories", itemId, { vote: "up" });
    }
  }
  if (!domUpvoted && storedVote === "up") {
    isUpvotedState = true;
  } else if (domUpvoted) {
    isUpvotedState = true;
  }

  const upvoteButton = document.createElement("button");
  upvoteButton.className = "icon-button";
  upvoteButton.type = "button";
  upvoteButton.setAttribute("aria-label", "Upvote");
  upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
  upvoteButton.innerHTML = renderIcon("arrow-fat-up");
  if (isUpvotedState) {
    upvoteButton.classList.add("is-active");
  }
  if (upvoteLink || isUpvotedState) {
    upvoteButton.addEventListener("click", (event) => {
      const voteHref = isUpvotedState
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
        : upvoteHref;
      if (!voteHref) {
        return;
      }
      event.preventDefault();
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      isUpvotedState = !isUpvotedState;
      if (itemId) {
        updateStoredAction("stories", itemId, { vote: isUpvotedState ? "up" : null });
      }
      upvoteButton.classList.toggle("is-active", isUpvotedState);
      upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
    });
  } else {
    upvoteButton.hidden = true;
  }

  const favoriteLinkById = fatitem.querySelector(
    "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']",
  );
  const favoriteLinkByText = subtext
    ? Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "favorite" || text === "unfavorite";
      })
    : null;
  const favoriteLink = favoriteLinkById || favoriteLinkByText;
  const favoriteText = favoriteLink?.textContent?.trim().toLowerCase() || "";
  const storedFavorite = storedStoryAction?.favorite;
  const hasFavoriteSignal = Boolean(favoriteLink);
  let isFavorited = favoriteText === "unfavorite";
  if (!hasFavoriteSignal && storedFavorite === true) {
    isFavorited = true;
  }
  if (hasFavoriteSignal && itemId) {
    if (isFavorited && storedFavorite !== true) {
      updateStoredAction("stories", itemId, { favorite: true });
    } else if (!isFavorited && storedFavorite === true) {
      updateStoredAction("stories", itemId, { favorite: false });
    }
  }
  let favoriteHref = favoriteLink?.getAttribute("href") || "";

  const bookmarkButton = document.createElement("button");
  bookmarkButton.className = "icon-button";
  bookmarkButton.type = "button";
  bookmarkButton.setAttribute("aria-label", "Favorite");
  bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
  bookmarkButton.innerHTML = renderIcon("bookmark-simple");
  if (isFavorited) {
    bookmarkButton.classList.add("is-active");
  }
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const wasFavorited = isFavorited;
    isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (itemId) {
      updateStoredAction("stories", itemId, { favorite: isFavorited });
    }
    if (!favoriteHref && itemId) {
      bookmarkButton.disabled = true;
      const resolved = await resolveStoryFavoriteLink(itemId);
      bookmarkButton.disabled = false;
      if (!resolved?.href) {
        isFavorited = wasFavorited;
        bookmarkButton.classList.toggle("is-active", isFavorited);
        bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
        if (itemId) {
          updateStoredAction("stories", itemId, { favorite: isFavorited });
        }
        return;
      }
      favoriteHref = resolved.href;
    }
    if (!favoriteHref) {
      isFavorited = wasFavorited;
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      if (itemId) {
        updateStoredAction("stories", itemId, { favorite: isFavorited });
      }
      return;
    }
    await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
    isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (itemId) {
      updateStoredAction("stories", itemId, { favorite: isFavorited });
    }
    favoriteHref = buildNextFavoriteHref(favoriteHref, !isFavorited);
  });

  const linkButton = document.createElement("button");
  linkButton.className = "icon-button";
  linkButton.type = "button";
  linkButton.setAttribute("aria-label", "Copy link");
  const linkIconSwap = document.createElement("span");
  linkIconSwap.className = "icon-swap";
  linkIconSwap.innerHTML = `
    <span class="icon-default">${renderIcon("link-simple")}</span>
    <span class="icon-success">${renderIcon("check-circle")}</span>
  `;
  linkButton.appendChild(linkIconSwap);
  let copyResetTimer = null;
  linkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const itemHref = ZEN_LOGIC.buildItemHref(itemId, window.location.href);
    const targetHref = itemHref || window.location.href;
    const copied = await copyTextToClipboard(targetHref);
    if (copied) {
      if (copyResetTimer) {
        window.clearTimeout(copyResetTimer);
      }
      linkButton.classList.add("is-copied");
      linkButton.classList.add("is-active");
      copyResetTimer = window.setTimeout(() => {
        linkButton.classList.remove("is-copied");
        linkButton.classList.remove("is-active");
        copyResetTimer = null;
      }, 1500);
    }
  });

  const replyButton = document.createElement("button");
  replyButton.className = "icon-button is-flipped";
  replyButton.type = "button";
  replyButton.setAttribute("aria-label", "Reply");
  replyButton.innerHTML = renderIcon("share-fat");
  const replyForm = document.querySelector("form textarea[name='text']")?.closest("form");
  const replyLink = document.querySelector("a[href^='reply?id='], a[href^='addcomment?id=']");
  const replyResolved = resolveReplyFormFromElement(replyForm);
  const hasReplyTarget = Boolean(replyResolved || replyLink);
  if (!hasReplyTarget) {
    replyButton.disabled = true;
  }

  actions.appendChild(upvoteButton);
  actions.appendChild(bookmarkButton);
  actions.appendChild(linkButton);
  actions.appendChild(replyButton);

  if (toptext) {
    const toptextClone = toptext.cloneNode(true);
    toptextClone.classList.add("hn-fatitem-toptext");
    wrapper.appendChild(toptextClone);
  }

  subRow.appendChild(meta);
  subRow.appendChild(actions);

  const replyContainer = document.createElement("div");
  replyContainer.className = "hn-reply is-hidden";
  const replyTextarea = document.createElement("textarea");
  replyTextarea.className = "hn-reply-textarea";
  replyTextarea.setAttribute("aria-label", "Reply");
  const closeReply = () => {
    replyContainer.classList.add("is-hidden");
  };
  replyTextarea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    replySubmitButton.click();
  });
  const replySubmitButton = document.createElement("button");
  replySubmitButton.className = "hn-reply-button";
  replySubmitButton.type = "button";
  replySubmitButton.textContent = "Reply";
  const cancelButton = document.createElement("button");
  cancelButton.className = "hn-reply-cancel";
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    closeReply();
  });
  if (!hasReplyTarget) {
    replyTextarea.disabled = true;
    replySubmitButton.disabled = true;
    cancelButton.disabled = true;
  }
  replySubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const replyText = replyTextarea.value.trim();
    if (!replyText) {
      replyTextarea.focus();
      return;
    }
    replySubmitButton.disabled = true;
    replyTextarea.disabled = true;
    let result = { ok: false };
    try {
      if (replyResolved) {
        result = await submitReplyWithResolved(replyResolved, replyText);
      } else if (replyLink) {
        result = await submitReply(replyLink.getAttribute("href") || "", replyText);
      }
    } finally {
      replySubmitButton.disabled = false;
      replyTextarea.disabled = false;
    }
    if (result.ok) {
      replyTextarea.value = "";
      closeReply();
      return;
    }
  });
  const replyActions = document.createElement("div");
  replyActions.className = "hn-reply-actions";
  replyActions.appendChild(replySubmitButton);
  replyActions.appendChild(cancelButton);
  replyContainer.appendChild(replyTextarea);
  replyContainer.appendChild(replyActions);

  if (hasReplyTarget) {
    replyButton.addEventListener("click", (event) => {
      event.preventDefault();
      const isHidden = replyContainer.classList.toggle("is-hidden");
      if (!isHidden) {
        replyTextarea.focus();
      }
    });
  }

  wrapper.appendChild(subRow);
  wrapper.appendChild(replyContainer);

  fatitem.dataset.zenHnRestyled = "true";
  fatitem.insertAdjacentElement("beforebegin", wrapper);
  fatitem.style.display = "none";
}

function buildCommentItem(row, options = {}) {
  if (!row) {
    return null;
  }

  const {
    indentLevel: indentOverride,
    hasChildren: hasChildrenOverride,
    showOnStory = false,
    replyResolved = null,
    replyHref: replyHrefOverride,
  } = options;

  const cell = row.querySelector("td.default");
  if (!cell) {
    return null;
  }

  const user = row.querySelector(".comhead .hnuser")?.textContent?.trim() || "";
  const timestamp = row.querySelector(".comhead .age a")?.textContent?.trim() || "";
  const comhead = row.querySelector(".comhead");
  const textHtml = row.querySelector(".commtext")?.innerHTML || "";
  const upvoteLink = row.querySelector("a[id^='up_']");
  const downvoteLink = row.querySelector("a[id^='down_']");
  const unvoteLink = row.querySelector("a[id^='un_'], a[href*='how=un']");
  const upvoteHref = upvoteLink?.getAttribute("href") || "";
  const downvoteHref = downvoteLink?.getAttribute("href") || "";
  const unvoteHref = unvoteLink?.getAttribute("href") || "";
  const favoriteLinkById = row.querySelector(
    "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']",
  );
  const favoriteLinkByText = comhead
    ? Array.from(comhead.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "favorite" || text === "unfavorite";
      })
    : null;
  const favoriteLink = favoriteLinkById || favoriteLinkByText;
  const commentId = getCommentId(row, comhead);
  const replyHref = replyHrefOverride ?? getReplyHref(row, comhead);
  const storedCommentAction = getStoredAction("comments", commentId);
  let { isUpvoted, isDownvoted } = getVoteState(row);
  const hasVoteLinks = Boolean(upvoteLink || downvoteLink || unvoteLink);
  const storedVote = storedCommentAction?.vote;
  if (hasVoteLinks && commentId) {
    if (isUpvoted && storedVote !== "up") {
      updateStoredAction("comments", commentId, { vote: "up" });
    } else if (isDownvoted && storedVote !== "down") {
      updateStoredAction("comments", commentId, { vote: "down" });
    }
  }
  if (!isUpvoted && !isDownvoted && storedVote) {
    isUpvoted = storedVote === "up";
    isDownvoted = storedVote === "down";
  }
  const favoriteText = favoriteLink?.textContent?.trim().toLowerCase() || "";
  const storedFavorite = storedCommentAction?.favorite;
  const hasFavoriteSignal = Boolean(favoriteLink);
  let isFavorited = favoriteText === "unfavorite";
  if (!hasFavoriteSignal && storedFavorite === true) {
    isFavorited = true;
  }
  if (hasFavoriteSignal && commentId) {
    if (isFavorited && storedFavorite !== true) {
      updateStoredAction("comments", commentId, { favorite: true });
    } else if (!isFavorited && storedFavorite === true) {
      updateStoredAction("comments", commentId, { favorite: false });
    }
  }

  const indentLevel = Number.isFinite(indentOverride)
    ? indentOverride
    : getIndentLevelFromRow(row);
  const hasChildren = typeof hasChildrenOverride === "boolean"
    ? hasChildrenOverride
    : false;

  const item = document.createElement("div");
  item.className = "hn-comment";
  item.classList.add(`level-${indentLevel}`);
  item.style.setProperty("--indent-level", String(indentLevel));
  item.dataset.indentLevel = String(indentLevel);
  item.dataset.collapsed = "false";
  item.dataset.hasChildren = hasChildren ? "true" : "false";

  const header = document.createElement("div");
  header.className = "hn-comment-header";

  const collapseButton = document.createElement("button");
  collapseButton.className = "icon-button hn-collapse-button";
  collapseButton.type = "button";
  collapseButton.innerHTML = renderIcon("caret-down");
  setCollapseButtonState(collapseButton, false, hasChildren);
  collapseButton.addEventListener("click", () => {
    toggleCommentCollapse(item);
  });

  const meta = document.createElement("div");
  meta.className = "hn-comment-meta";
  if (comhead) {
    meta.classList.add("has-comhead");
    meta.appendChild(comhead.cloneNode(true));
    if (showOnStory) {
      const onStoryLink = comhead.querySelector(".onstory a");
      if (onStoryLink) {
        const onStory = document.createElement("span");
        onStory.className = "hn-comment-onstory";
        onStory.appendChild(onStoryLink.cloneNode(true));
        meta.appendChild(onStory);
      }
    }
  } else {
    meta.textContent = [user, timestamp].filter(Boolean).join(" • ");
  }

  const actions = document.createElement("div");
  actions.className = "hn-comment-actions";

  const upvoteButton = document.createElement("button");
  upvoteButton.className = "icon-button";
  upvoteButton.type = "button";
  upvoteButton.setAttribute("aria-label", "Upvote");
  upvoteButton.setAttribute("aria-pressed", isUpvoted ? "true" : "false");
  upvoteButton.innerHTML = renderIcon("arrow-fat-up");
  if (isUpvoted) {
    upvoteButton.classList.add("is-active");
  }
  if (upvoteLink || isUpvoted) {
    upvoteButton.addEventListener("click", (event) => {
      const voteHref = isUpvoted
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
        : upvoteHref;
      if (!voteHref) {
        return;
      }
      event.preventDefault();
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      const nextState = ZEN_LOGIC.toggleVoteState(
        { isUpvoted, isDownvoted },
        "up",
      );
      isUpvoted = nextState.isUpvoted;
      isDownvoted = nextState.isDownvoted;
      if (commentId) {
        updateStoredAction("comments", commentId, {
          vote: isUpvoted ? "up" : isDownvoted ? "down" : null,
        });
      }
      upvoteButton.classList.toggle("is-active", isUpvoted);
      upvoteButton.setAttribute("aria-pressed", isUpvoted ? "true" : "false");
      downvoteButton.classList.toggle("is-active", isDownvoted);
      downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
    });
  } else {
    upvoteButton.hidden = true;
  }

  const downvoteButton = document.createElement("button");
  downvoteButton.className = "icon-button";
  downvoteButton.type = "button";
  downvoteButton.setAttribute("aria-label", "Downvote");
  downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
  downvoteButton.innerHTML = renderIcon("arrow-fat-down");
  if (isDownvoted) {
    downvoteButton.classList.add("is-active");
  }
  if (downvoteLink || isDownvoted) {
    downvoteButton.addEventListener("click", (event) => {
      const voteHref = isDownvoted
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(downvoteHref, "un", window.location.href))
        : downvoteHref;
      if (!voteHref) {
        return;
      }
      event.preventDefault();
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      const nextState = ZEN_LOGIC.toggleVoteState(
        { isUpvoted, isDownvoted },
        "down",
      );
      isUpvoted = nextState.isUpvoted;
      isDownvoted = nextState.isDownvoted;
      if (commentId) {
        updateStoredAction("comments", commentId, {
          vote: isUpvoted ? "up" : isDownvoted ? "down" : null,
        });
      }
      downvoteButton.classList.toggle("is-active", isDownvoted);
      downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
      upvoteButton.classList.toggle("is-active", isUpvoted);
      upvoteButton.setAttribute("aria-pressed", isUpvoted ? "true" : "false");
    });
  } else {
    downvoteButton.hidden = true;
  }

  const bookmarkButton = document.createElement("button");
  bookmarkButton.className = "icon-button";
  bookmarkButton.type = "button";
  bookmarkButton.setAttribute("aria-label", "Favorite");
  bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
  bookmarkButton.innerHTML = renderIcon("bookmark-simple");
  if (isFavorited) {
    bookmarkButton.classList.add("is-active");
  }
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const wasFavorited = isFavorited;
    isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (commentId) {
      updateStoredAction("comments", commentId, { favorite: isFavorited });
    }
    let favoriteHref = favoriteLink?.getAttribute("href") || "";
    if (!favoriteHref) {
      bookmarkButton.disabled = true;
      const resolved = await resolveFavoriteLink(commentId);
      bookmarkButton.disabled = false;
      if (!resolved?.href) {
        isFavorited = wasFavorited;
        bookmarkButton.classList.toggle("is-active", isFavorited);
        bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
        if (commentId) {
          updateStoredAction("comments", commentId, { favorite: isFavorited });
        }
        return;
      }
      favoriteHref = resolved.href;
    }
    await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
    isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (commentId) {
      updateStoredAction("comments", commentId, { favorite: isFavorited });
    }
  });

  const shareButton = document.createElement("button");
  shareButton.className = "icon-button is-flipped";
  shareButton.type = "button";
  shareButton.setAttribute("aria-label", "Reply");
  shareButton.innerHTML = renderIcon("share-fat");
  let replyContainer = null;
  shareButton.addEventListener("click", () => {
    if (replyContainer) {
      const isHidden = replyContainer.classList.toggle("is-hidden");
      if (!isHidden) {
        replyContainer.querySelector("textarea")?.focus();
      }
    }
  });

  const linkButton = document.createElement("button");
  linkButton.className = "icon-button";
  linkButton.type = "button";
  linkButton.setAttribute("aria-label", "Copy link");
  const linkIconSwap = document.createElement("span");
  linkIconSwap.className = "icon-swap";
  linkIconSwap.innerHTML = `
    <span class="icon-default">${renderIcon("link-simple")}</span>
    <span class="icon-success">${renderIcon("check-circle")}</span>
  `;
  linkButton.appendChild(linkIconSwap);
  let copyResetTimer = null;
  linkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const commentHref = ZEN_LOGIC.buildCommentHref(commentId, window.location.href);
    if (!commentHref) {
      return;
    }
    const copied = await copyTextToClipboard(commentHref);
    if (copied) {
      if (copyResetTimer) {
        window.clearTimeout(copyResetTimer);
      }
      linkButton.classList.add("is-copied");
      linkButton.classList.add("is-active");
      copyResetTimer = window.setTimeout(() => {
        linkButton.classList.remove("is-copied");
        linkButton.classList.remove("is-active");
        copyResetTimer = null;
      }, 1500);
    }
  });

  actions.appendChild(upvoteButton);
  actions.appendChild(downvoteButton);
  actions.appendChild(bookmarkButton);
  actions.appendChild(linkButton);
  actions.appendChild(shareButton);

  header.appendChild(collapseButton);
  header.appendChild(meta);
  header.appendChild(actions);

  const text = document.createElement("div");
  text.className = "hn-comment-text";
  text.innerHTML = textHtml;

  replyContainer = document.createElement("div");
  replyContainer.className = "hn-reply is-hidden";
  const replyTextarea = document.createElement("textarea");
  replyTextarea.className = "hn-reply-textarea";
  replyTextarea.setAttribute("aria-label", "Reply");
  const closeReply = () => {
    replyContainer.classList.add("is-hidden");
  };
  replyTextarea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    replyButton.click();
  });
  const replyButton = document.createElement("button");
  replyButton.className = "hn-reply-button";
  replyButton.type = "button";
  replyButton.textContent = "Reply";
  const cancelButton = document.createElement("button");
  cancelButton.className = "hn-reply-cancel";
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    closeReply();
  });
  const hasReplyTarget = Boolean(replyResolved || replyHref);
  if (!hasReplyTarget) {
    replyTextarea.disabled = true;
    replyButton.disabled = true;
    cancelButton.disabled = true;
  }
  replyButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const replyText = replyTextarea.value.trim();
    if (!replyText) {
      replyTextarea.focus();
      return;
    }
    if (!hasReplyTarget) {
      return;
    }
    replyButton.disabled = true;
    replyTextarea.disabled = true;
    let result = { ok: false };
    try {
      if (replyResolved) {
        result = await submitReplyWithResolved(replyResolved, replyText);
      } else if (replyHref) {
        result = await submitReply(replyHref, replyText);
      }
    } finally {
      replyButton.disabled = false;
      replyTextarea.disabled = false;
    }
    if (result.ok) {
      replyTextarea.value = "";
      closeReply();
      return;
    }
  });
  const replyActions = document.createElement("div");
  replyActions.className = "hn-reply-actions";
  replyActions.appendChild(replyButton);
  replyActions.appendChild(cancelButton);
  replyContainer.appendChild(replyTextarea);
  replyContainer.appendChild(replyActions);

  item.appendChild(header);
  item.appendChild(text);
  item.appendChild(replyContainer);
  return item;
}

function restyleComments(context) {
  if (!context?.root) {
    return;
  }

  if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return;
  }

  const existingLists = document.querySelectorAll("#hn-comment-list");
  existingLists.forEach((list) => {
    const wrapperRow = list.closest("tr[data-zen-hn-comment-row='true']");
    if (wrapperRow) {
      wrapperRow.remove();
      return;
    }
    list.remove();
  });

  const container = document.createElement("div");
  container.id = "hn-comment-list";

  const rows = context.rows || getCommentRows(context.root);
  if (!rows.length) {
    if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "loading") {
      delete document.documentElement.dataset[ZEN_HN_RESTYLE_KEY];
    }
    return;
  }

  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  rows.forEach((row, index) => {
    const indentLevel = getIndentLevelFromRow(row);
    const nextIndentLevel = getIndentLevelFromRow(rows[index + 1]);
    const hasChildren = nextIndentLevel > indentLevel;
    const item = buildCommentItem(row, { indentLevel, hasChildren });
    if (!item) {
      return;
    }
    container.appendChild(item);
  });

  const moreLink = context.root.querySelector("a.morelink");
  if (moreLink) {
    const moreContainer = document.createElement("div");
    moreContainer.className = "hn-comment-more";
    const moreAnchor = moreLink.cloneNode(true);
    moreContainer.appendChild(moreAnchor);
    container.appendChild(moreContainer);
  }

  if (context.mode === "rows") {
    const insertAfter = context.insertAfter?.closest("tr") || rows[0];
    if (!insertAfter) {
      return;
    }
    const containerRow = document.createElement("tr");
    containerRow.dataset.zenHnCommentRow = "true";
    const containerCell = document.createElement("td");
    const cellCount = insertAfter.children.length || 1;
    if (cellCount > 1) {
      containerCell.colSpan = cellCount;
    }
    containerCell.appendChild(container);
    containerRow.appendChild(containerCell);
    insertAfter.insertAdjacentElement("afterend", containerRow);

    const rowsToHide = new Set(rows);
    rows.forEach((row) => {
      const spacer = row.nextElementSibling;
      if (spacer?.classList.contains("spacer")) {
        rowsToHide.add(spacer);
      }
    });
    if (moreLink) {
      const moreRow = moreLink.closest("tr");
      if (moreRow) {
        rowsToHide.add(moreRow);
        const moreSpacer = moreRow.previousElementSibling;
        if (moreSpacer?.classList.contains("morespace")) {
          rowsToHide.add(moreSpacer);
        }
      }
    }
    rowsToHide.forEach((row) => {
      row.style.display = "none";
    });
    return;
  }

  context.root.insertAdjacentElement("afterend", container);
  context.root.style.display = "none";
}

function getCommentRows(table) {
  const rows = Array.from(table.querySelectorAll("tr.athing"));
  return rows.filter(
    (row) => row.classList.contains("comtr") || row.querySelector(".comment .commtext"),
  );
}

function getFatItemCommentRow(fatitem) {
  if (!fatitem) {
    return null;
  }
  const commentContent = fatitem.querySelector(".comment .commtext, .commtext");
  const rowFromContent = commentContent?.closest("tr");
  if (rowFromContent) {
    return rowFromContent;
  }
  return getCommentRows(fatitem)[0] || null;
}

function getStoryRows(root) {
  if (!root) {
    return [];
  }
  const rows = Array.from(root.querySelectorAll("tr.athing"));
  return rows.filter(
    (row) => !row.classList.contains("comtr") && !row.querySelector(".comment .commtext"),
  );
}

function findCommentContext() {
  const commentTree = document.querySelector("table.comment-tree");
  if (commentTree) {
    return { root: commentTree, mode: "table" };
  }

  const itemTables = Array.from(document.querySelectorAll("table.itemlist"));
  const itemTable = itemTables.find((table) => getCommentRows(table).length > 0);
  if (itemTable) {
    return { root: itemTable, mode: "table" };
  }

  const bigboxTable = document.querySelector("tr#bigbox table");
  if (bigboxTable && getCommentRows(bigboxTable).length > 0) {
    return { root: bigboxTable, mode: "table" };
  }

  const hnMain = document.querySelector("table#hnmain");
  if (!hnMain) {
    return null;
  }
  const rows = getCommentRows(hnMain);
  if (!rows.length) {
    return null;
  }
  const insertAfter = document.querySelector("tr#bigbox") || rows[0];
  return {
    root: hnMain,
    mode: "rows",
    rows,
    insertAfter,
  };
}

function runRestyleWhenReady() {
  let attempts = 0;
  const maxAttempts = 20;
  const attempt = () => {
    if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
      return;
    }
    const context = findCommentContext();
    if (!context) {
      attempts += 1;
      if (attempts >= maxAttempts) {
        if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "loading") {
          delete document.documentElement.dataset[ZEN_HN_RESTYLE_KEY];
        }
        return;
      }
      window.requestAnimationFrame(attempt);
      return;
    }
    restyleComments(context);
  };
  attempt();
}

async function initRestyle() {
  await loadActionStore();
  if (isUserProfilePage()) {
    document.documentElement.dataset.zenHnUserPage = "true";
  }
  restyleSubmissions();
  restyleFatItem();
  runRestyleWhenReady();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initRestyle();
  });
} else {
  initRestyle();
}
