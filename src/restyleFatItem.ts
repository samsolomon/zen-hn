import { renderIcon } from "./icons";
import {
  getVoteState,
  buildVoteHref,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildNextFavoriteHref,
  buildItemHref,
  getCommentRows,
} from "./logic";
import { getStoredAction, updateStoredAction } from "./actionStore";
import { resolveStoryFavoriteLink } from "./favorites";
import { resolveReplyFormFromElement, submitReplyWithResolved, submitReply } from "./replyForm";
import { buildCommentItem } from "./buildCommentItem";
import { getOrCreateZenHnMain } from "./getOrCreateZenHnMain";
import { copyTextToClipboard, stripParenTextNodes } from "./utils";

function getFatItemCommentRow(fatitem: Element | null): HTMLTableRowElement | null {
  if (!fatitem) {
    return null;
  }
  const commentContent = fatitem.querySelector(".comment .commtext, .commtext");
  const rowFromContent = commentContent?.closest("tr") as HTMLTableRowElement | null;
  if (rowFromContent) {
    return rowFromContent;
  }
  return getCommentRows(fatitem)[0] || null;
}

export function restyleFatItem(): void {
  const fatitem = document.querySelector<HTMLTableElement>("table.fatitem");
  if (!fatitem || fatitem.dataset.zenHnRestyled === "true") {
    return;
  }

  const commentRow = getFatItemCommentRow(fatitem);
  if (commentRow) {
    const wrapper = document.createElement("div");
    wrapper.className = "hn-fatitem is-comment";
    const replyForm = fatitem.querySelector("form textarea[name='text']")?.closest("form");
    const replyResolved = resolveReplyFormFromElement(replyForm as HTMLFormElement | null);
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
    getOrCreateZenHnMain().appendChild(wrapper);
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

  const title = titleLink.cloneNode(true) as HTMLElement;
  title.classList.add("hn-fatitem-title");
  wrapper.appendChild(title);

  const subRow = document.createElement("div");
  subRow.className = "hn-fatitem-sub";

  const meta = document.createElement("div");
  meta.className = "hn-fatitem-meta";

  const appendMetaItem = (node: Element | null, className?: string): void => {
    if (!node) {
      return;
    }
    const clone = node.cloneNode(true) as HTMLElement;
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

  appendMetaItem(score ?? null);
  appendMetaItem(hnuser ?? null);
  appendMetaItem(age ?? null);
  appendMetaItem(commentsLink ?? null, "hn-fatitem-comments");
  appendMetaItem(sitebit);

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
  upvoteButton.innerHTML = renderIcon(isUpvotedState ? "arrow-fat-up-fill" : "arrow-fat-up");
  if (isUpvotedState) {
    upvoteButton.classList.add("is-active");
  }
  if (upvoteLink || isUpvotedState) {
    upvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isUpvotedState
        ? (unvoteHref || buildVoteHref(upvoteHref, "un", window.location.href))
        : upvoteHref;
      if (!voteHref) {
        return;
      }
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      isUpvotedState = !isUpvotedState;
      if (itemId) {
        updateStoredAction("stories", itemId, { vote: isUpvotedState ? "up" : null });
      }
      upvoteButton.classList.toggle("is-active", isUpvotedState);
      upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
      upvoteButton.innerHTML = renderIcon(isUpvotedState ? "arrow-fat-up-fill" : "arrow-fat-up");
    });
  } else {
    upvoteButton.hidden = true;
  }

  const favoriteLinkById = fatitem.querySelector(
    "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']"
  );
  const favoriteLinkByText = subtext
    ? Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "favorite" || text === "unfavorite";
      })
    : null;
  const favoriteLink = favoriteLinkById || favoriteLinkByText;
  const favoriteText = (favoriteLink as HTMLElement | null)?.textContent?.trim().toLowerCase() || "";
  const storedFavorite = storedStoryAction?.favorite;
  const hasFavoriteSignal = Boolean(favoriteLink);
  const domFavorited = favoriteText === "unfavorite";
  let isFavorited = domFavorited || storedFavorite === true;
  // Only sync TO storage when DOM shows favorited but we don't have it stored
  if (hasFavoriteSignal && itemId && domFavorited && storedFavorite !== true) {
    updateStoredAction("stories", itemId, { favorite: true });
  }
  let favoriteHref = favoriteLink?.getAttribute("href") || "";

  const bookmarkButton = document.createElement("button");
  bookmarkButton.className = "icon-button";
  bookmarkButton.type = "button";
  bookmarkButton.setAttribute("aria-label", "Favorite");
  bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
  bookmarkButton.innerHTML = renderIcon(isFavorited ? "bookmark-simple-fill" : "bookmark-simple");
  if (isFavorited) {
    bookmarkButton.classList.add("is-active");
  }
  const updateFatitemBookmarkIcon = (): void => {
    bookmarkButton.innerHTML = renderIcon(isFavorited ? "bookmark-simple-fill" : "bookmark-simple");
  };
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasFavorited = isFavorited;
    isFavorited = toggleFavoriteState(isFavorited);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    updateFatitemBookmarkIcon();
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
        updateFatitemBookmarkIcon();
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
      updateFatitemBookmarkIcon();
      if (itemId) {
        updateStoredAction("stories", itemId, { favorite: isFavorited });
      }
      return;
    }
    await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
    isFavorited = willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    updateFatitemBookmarkIcon();
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
  let copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  linkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const itemHref = buildItemHref(itemId, window.location.href);
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
  const replyResolved = resolveReplyFormFromElement(replyForm as HTMLFormElement | null);
  const hasReplyTarget = Boolean(replyResolved || replyLink);
  if (!hasReplyTarget) {
    replyButton.disabled = true;
  }

  actions.appendChild(upvoteButton);
  actions.appendChild(bookmarkButton);
  actions.appendChild(linkButton);
  actions.appendChild(replyButton);

  if (toptext) {
    const toptextClone = toptext.cloneNode(true) as HTMLElement;
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
  const closeReply = (): void => {
    replyContainer.classList.add("is-hidden");
  };
  const replySubmitButton = document.createElement("button");
  replySubmitButton.className = "hn-reply-button";
  replySubmitButton.type = "button";
  replySubmitButton.textContent = "Reply";
  replyTextarea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    replySubmitButton.click();
  });
  const cancelButton = document.createElement("button");
  cancelButton.className = "hn-reply-cancel";
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeReply();
  });
  if (!hasReplyTarget) {
    replyTextarea.disabled = true;
    replySubmitButton.disabled = true;
    cancelButton.disabled = true;
  }
  replySubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
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
      event.stopPropagation();
      const isHidden = replyContainer.classList.toggle("is-hidden");
      if (!isHidden) {
        replyTextarea.focus();
      }
    });
  }

  wrapper.appendChild(subRow);
  wrapper.appendChild(replyContainer);

  fatitem.dataset.zenHnRestyled = "true";
  getOrCreateZenHnMain().appendChild(wrapper);
  fatitem.style.display = "none";
}

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnRestyleFatItem = {
  restyleFatItem,
};
