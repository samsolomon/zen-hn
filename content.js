console.log("Zen HN Active");

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
};

const ZEN_LOGIC = globalThis.ZenHnLogic;

function registerIcon(name, svg) {
  if (!name || !svg) {
    return;
  }
  PHOSPHOR_SVGS[name] = svg;
}

function renderIcon(name) {
  return PHOSPHOR_SVGS[name] || "";
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

function setCollapseButtonState(button, isCollapsed) {
  if (!button) {
    return;
  }
  button.classList.toggle("is-collapsed", isCollapsed);
  button.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  button.setAttribute("aria-label", isCollapsed ? "Expand thread" : "Collapse thread");
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
  const collapseButton = item.querySelector(".hn-collapse-button");
  setCollapseButtonState(collapseButton, nextCollapsed);
  if (nextCollapsed) {
    hideDescendantComments(item);
  } else {
    restoreDescendantVisibility(item);
  }
}

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";

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

async function submitReply(replyHref, text) {
  try {
    const resolved = await resolveReplyForm(replyHref);
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

function restyleComments() {
  const table = document.querySelector("table.comment-tree");
  if (!table) {
    return;
  }

  if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return;
  }
  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "true";

  const existingLists = document.querySelectorAll("#hn-comment-list");
  existingLists.forEach((list) => list.remove());

  const container = document.createElement("div");
  container.id = "hn-comment-list";

  const rows = Array.from(table.querySelectorAll("tr.athing.comtr"));
  rows.forEach((row, index) => {
    const cell = row.querySelector("td.default");
    if (!cell) {
      return;
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
    const replyHref = getReplyHref(row, comhead);
    let { isUpvoted, isDownvoted } = getVoteState(row);
    const favoriteText = favoriteLink?.textContent?.trim().toLowerCase() || "";
    let isFavorited = favoriteText === "unfavorite";

    const indentLevel = getIndentLevelFromRow(row);
    const nextIndentLevel = getIndentLevelFromRow(rows[index + 1]);
    const hasChildren = nextIndentLevel > indentLevel;

    const item = document.createElement("div");
    item.className = "hn-comment";
    item.classList.add(`level-${indentLevel}`);
    item.style.setProperty("--indent-level", String(indentLevel));
    item.dataset.indentLevel = String(indentLevel);
    item.dataset.collapsed = "false";

    const header = document.createElement("div");
    header.className = "hn-comment-header";

    const collapseButton = document.createElement("button");
    collapseButton.className = "icon-button hn-collapse-button";
    collapseButton.type = "button";
    collapseButton.innerHTML = renderIcon("caret-down");
    setCollapseButtonState(collapseButton, false);
    if (!hasChildren) {
      collapseButton.hidden = true;
    } else {
      collapseButton.addEventListener("click", () => {
        toggleCommentCollapse(item);
      });
    }

    const meta = document.createElement("div");
    meta.className = "hn-comment-meta";
    if (comhead) {
      meta.classList.add("has-comhead");
      meta.appendChild(comhead.cloneNode(true));
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
        console.log("Zen HN action", {
          type: "upvote",
          commentId,
          wasUpvoted: isUpvoted,
          wasDownvoted: isDownvoted,
          href: voteHref,
        });
        fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
        const nextState = ZEN_LOGIC.toggleVoteState(
          { isUpvoted, isDownvoted },
          "up",
        );
        isUpvoted = nextState.isUpvoted;
        isDownvoted = nextState.isDownvoted;
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
        console.log("Zen HN action", {
          type: "downvote",
          commentId,
          wasDownvoted: isDownvoted,
          wasUpvoted: isUpvoted,
          href: voteHref,
        });
        fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
        const nextState = ZEN_LOGIC.toggleVoteState(
          { isUpvoted, isDownvoted },
          "down",
        );
        isUpvoted = nextState.isUpvoted;
        isDownvoted = nextState.isDownvoted;
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
      console.log("Zen HN action", {
        type: "bookmark",
        commentId,
        wasFavorited: isFavorited,
      });
      const wasFavorited = isFavorited;
      isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      let favoriteHref = favoriteLink?.getAttribute("href") || "";
      if (!favoriteHref) {
        console.log("Zen HN favorite link missing", { commentId });
        bookmarkButton.disabled = true;
        const resolved = await resolveFavoriteLink(commentId);
        bookmarkButton.disabled = false;
        if (!resolved?.href) {
          console.log("Zen HN favorite resolve failed", { commentId });
          isFavorited = wasFavorited;
          bookmarkButton.classList.toggle("is-active", isFavorited);
          bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
          return;
        }
        favoriteHref = resolved.href;
      }
      console.log("Zen HN favorite click", {
        href: favoriteHref,
        wasFavorited: isFavorited,
      });
      await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
      isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
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
      console.log("Zen HN action", {
        type: "reply-toggle",
        commentId,
      });
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
      console.log("Zen HN action", {
        type: "copy-link",
        commentId,
        copied,
        href: commentHref,
      });
      if (!copied) {
        console.warn("Zen HN copy failed", { commentId, href: commentHref });
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
    if (!replyHref) {
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
      if (!replyHref) {
        return;
      }
      replyButton.disabled = true;
      replyTextarea.disabled = true;
      console.log("Zen HN action", {
        type: "reply-submit",
        commentId,
        length: replyText.length,
      });
      let result = { ok: false };
      try {
        result = await submitReply(replyHref, replyText);
      } finally {
        replyButton.disabled = false;
        replyTextarea.disabled = false;
      }
      if (result.ok) {
        replyTextarea.value = "";
        closeReply();
        return;
      }
      console.warn("Zen HN reply failed", {
        commentId,
        status: result.status,
      });
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
    container.appendChild(item);
  });

  table.insertAdjacentElement("afterend", container);
  table.style.display = "none";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    restyleComments();
  });
} else {
  restyleComments();
}
