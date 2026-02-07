import { renderIcon } from "./icons";
import {
  getCommentId,
  getReplyHref,
  getVoteState,
  getIndentLevelFromRow,
  toggleVoteState,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildVoteHref,
  buildCommentHref,
  addCommentClickHandler,
} from "./logic";
import { getStoredAction, updateStoredAction } from "./actionStore";
import { setCollapseButtonState, toggleCommentCollapse } from "./commentCollapse";
import { resolveFavoriteLink } from "./favorites";
import { submitReply, submitReplyWithResolved, type ResolvedReplyForm } from "./replyForm";
import { copyTextToClipboard } from "./utils";
import { announce } from "./announcer";
import { initTooltip } from "./tooltip";

export interface BuildCommentItemOptions {
  indentLevel?: number;
  hasChildren?: boolean;
  showOnStory?: boolean;
  replyResolved?: ResolvedReplyForm | null;
  replyHref?: string | null;
}

export function buildCommentItem(
  row: HTMLTableRowElement | null,
  options: BuildCommentItemOptions = {}
): HTMLDivElement | null {
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
    "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']"
  );
  const favoriteLinkByText = comhead
    ? Array.from(comhead.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "favorite" || text === "unfavorite";
      })
    : null;
  const favoriteLink = favoriteLinkById || favoriteLinkByText;
  const deleteLink = comhead
    ? Array.from(comhead.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "delete";
      })
    : null;
  const deleteHref = deleteLink?.getAttribute("href") || "";
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
  const favoriteText = (favoriteLink as HTMLElement | null)?.textContent?.trim().toLowerCase() || "";
  const storedFavorite = storedCommentAction?.favorite;
  const hasFavoriteSignal = Boolean(favoriteLink);
  const domFavorited = favoriteText === "unfavorite";
  let isFavorited = domFavorited || storedFavorite === true;
  // Only sync TO storage when DOM shows favorited but we don't have it stored
  if (hasFavoriteSignal && commentId && domFavorited && storedFavorite !== true) {
    updateStoredAction("comments", commentId, { favorite: true });
  }

  const indentLevel = Number.isFinite(indentOverride)
    ? indentOverride!
    : getIndentLevelFromRow(row);
  const hasChildren =
    typeof hasChildrenOverride === "boolean" ? hasChildrenOverride : false;

  const item = document.createElement("div");
  item.className = "hn-comment";
  item.classList.add(`level-${indentLevel}`);
  // Set a unique ID for aria-controls on collapse button
  if (commentId) {
    item.id = `comment-${commentId}`;
  }
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
  // Connect collapse button to the comment it controls for accessibility
  if (commentId) {
    collapseButton.setAttribute("aria-controls", `comment-${commentId}`);
  }
  setCollapseButtonState(collapseButton, false, hasChildren);
  const collapseTooltip = initTooltip(collapseButton, "Collapse", { shortcut: "Space" });
  collapseButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleCommentCollapse(item);
    // Update tooltip text based on new collapsed state
    const isNowCollapsed = item.dataset.collapsed === "true";
    collapseTooltip.updateText(isNowCollapsed ? "Expand" : "Collapse");
  });

  const meta = document.createElement("div");
  meta.className = "hn-comment-meta";
  if (comhead) {
    meta.classList.add("has-comhead");
    const userLink = comhead.querySelector(".hnuser");
    if (userLink) {
      const userSpan = document.createElement("span");
      userSpan.className = "hn-comment-user";
      const loggedInUser = document.querySelector<HTMLAnchorElement>("a#me")?.textContent?.trim()
        || localStorage.getItem("zenHnLoggedInUsername");
      if (loggedInUser && userLink.textContent?.trim() === loggedInUser) {
        const icon = document.createElement("span");
        icon.className = "is-own-user-icon";
        icon.innerHTML = renderIcon("asterisk");
        userSpan.appendChild(icon);
      }
      userSpan.appendChild(userLink.cloneNode(true));
      meta.appendChild(userSpan);
    }
    const ageSpan = comhead.querySelector(".age");
    if (ageSpan) {
      const age = document.createElement("span");
      age.className = "hn-comment-age";
      age.appendChild(ageSpan.cloneNode(true));
      meta.appendChild(age);
    }
    const scoreSpan = comhead.querySelector(".score");
    if (scoreSpan) {
      const score = document.createElement("span");
      score.className = "hn-comment-score";
      score.textContent = scoreSpan.textContent;
      meta.appendChild(score);
    }
    const onStoryLink = comhead.querySelector(".onstory a");
    if (onStoryLink) {
      const onStory = document.createElement("span");
      onStory.className = "hn-comment-onstory";
      onStory.appendChild(onStoryLink.cloneNode(true));
      meta.appendChild(onStory);
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
  upvoteButton.innerHTML = renderIcon(isUpvoted ? "arrow-fat-up-fill" : "arrow-fat-up");
  initTooltip(upvoteButton, "Upvote", { shortcut: "u" });
  if (isUpvoted) {
    upvoteButton.classList.add("is-active");
  }

  const downvoteButton = document.createElement("button");
  downvoteButton.className = "icon-button";
  downvoteButton.type = "button";
  downvoteButton.setAttribute("aria-label", "Downvote");
  downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
  downvoteButton.innerHTML = renderIcon(
    isDownvoted ? "arrow-fat-down-fill" : "arrow-fat-down"
  );
  initTooltip(downvoteButton, "Downvote", { shortcut: "d" });
  if (isDownvoted) {
    downvoteButton.classList.add("is-active");
  }

  const updateVoteIcons = (): void => {
    upvoteButton.innerHTML = renderIcon(isUpvoted ? "arrow-fat-up-fill" : "arrow-fat-up");
    downvoteButton.innerHTML = renderIcon(
      isDownvoted ? "arrow-fat-down-fill" : "arrow-fat-down"
    );
  };

  if (upvoteLink || isUpvoted) {
    upvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isUpvoted
        ? unvoteHref || buildVoteHref(upvoteHref, "un", window.location.href)
        : upvoteHref;
      if (!voteHref) {
        return;
      }
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      const nextState = toggleVoteState({ isUpvoted, isDownvoted }, "up");
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
      updateVoteIcons();
      announce(isUpvoted ? "Upvoted" : "Vote removed");
    });
  } else {
    upvoteButton.hidden = true;
  }

  if (downvoteLink || isDownvoted) {
    downvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isDownvoted
        ? unvoteHref || buildVoteHref(downvoteHref, "un", window.location.href)
        : downvoteHref;
      if (!voteHref) {
        return;
      }
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      const nextState = toggleVoteState({ isUpvoted, isDownvoted }, "down");
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
      updateVoteIcons();
      announce(isDownvoted ? "Downvoted" : "Vote removed");
    });
  } else {
    downvoteButton.hidden = true;
  }

  const bookmarkButton = document.createElement("button");
  bookmarkButton.className = "icon-button";
  bookmarkButton.type = "button";
  bookmarkButton.setAttribute("aria-label", "Favorite");
  bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
  bookmarkButton.innerHTML = renderIcon(
    isFavorited ? "bookmark-simple-fill" : "bookmark-simple"
  );
  initTooltip(bookmarkButton, "Favorite", { shortcut: "f" });
  if (isFavorited) {
    bookmarkButton.classList.add("is-active");
  }
  const updateCommentBookmarkIcon = (): void => {
    bookmarkButton.innerHTML = renderIcon(
      isFavorited ? "bookmark-simple-fill" : "bookmark-simple"
    );
  };
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasFavorited = isFavorited;
    isFavorited = toggleFavoriteState(isFavorited);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    updateCommentBookmarkIcon();
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
        updateCommentBookmarkIcon();
        if (commentId) {
          updateStoredAction("comments", commentId, { favorite: isFavorited });
        }
        return;
      }
      favoriteHref = resolved.href;
    }
    await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
    isFavorited = willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    updateCommentBookmarkIcon();
    if (commentId) {
      updateStoredAction("comments", commentId, { favorite: isFavorited });
    }
    announce(isFavorited ? "Added to favorites" : "Removed from favorites");
  });

  const shareButton = document.createElement("button");
  shareButton.className = "icon-button is-flipped";
  shareButton.type = "button";
  shareButton.setAttribute("aria-label", "Reply");
  shareButton.innerHTML = renderIcon("share-fat");
  initTooltip(shareButton, "Reply", { shortcut: "r" });
  let replyContainer: HTMLDivElement | null = null;
  shareButton.addEventListener("click", (event) => {
    event.stopPropagation();
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
  initTooltip(linkButton, "Copy link", { shortcut: "l" });
  const linkIconSwap = document.createElement("span");
  linkIconSwap.className = "icon-swap";
  linkIconSwap.innerHTML = `
    <span class="icon-default">${renderIcon("link-simple")}</span>
    <span class="icon-success">${renderIcon("check-circle-fill")}</span>
  `;
  linkButton.appendChild(linkIconSwap);
  let copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  linkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const commentHref = buildCommentHref(commentId, window.location.href);
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
      announce("Link copied to clipboard");
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

  if (deleteHref) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete");
    deleteButton.innerHTML = renderIcon("trash");
    initTooltip(deleteButton, "Delete");
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.location.href = deleteHref;
    });
    actions.appendChild(deleteButton);
  }

  header.appendChild(collapseButton);
  header.appendChild(meta);
  header.appendChild(actions);

  const text = document.createElement("div");
  text.className = "hn-comment-text";
  const textInner = document.createElement("div");
  textInner.className = "hn-comment-text-inner";
  textInner.innerHTML = textHtml;
  text.appendChild(textInner);

  replyContainer = document.createElement("div");
  replyContainer.className = "hn-reply is-hidden";
  const replyTextarea = document.createElement("textarea");
  replyTextarea.className = "hn-reply-textarea";
  replyTextarea.setAttribute("aria-label", "Reply");
  const closeReply = (): void => {
    replyContainer!.classList.add("is-hidden");
  };
  const replyButton = document.createElement("button");
  replyButton.className = "zen-hn-button-outline hn-reply-button";
  replyButton.type = "button";
  replyButton.textContent = "Reply";
  replyTextarea.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeReply();
      replyTextarea.blur();
      return;
    }
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    replyButton.click();
  });
  const cancelButton = document.createElement("button");
  cancelButton.className = "zen-hn-button-ghost hn-reply-cancel";
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
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
    event.stopPropagation();
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
      window.location.reload();
      return;
    }
  });
  const replyActions = document.createElement("div");
  replyActions.className = "hn-reply-actions";
  replyActions.appendChild(replyButton);
  replyActions.appendChild(cancelButton);
  replyContainer.appendChild(replyTextarea);
  replyContainer.appendChild(replyActions);

  addCommentClickHandler(item, toggleCommentCollapse);

  item.appendChild(header);
  item.appendChild(text);
  item.appendChild(replyContainer);
  return item;
}

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnBuildCommentItem = {
  buildCommentItem,
};
