const ZEN_LOGIC = globalThis.ZenHnLogic;
const ZEN_UTILS = globalThis.ZenHnUtils;
const ZEN_PAGES = globalThis.ZenHnPages;
const ZEN_ACTION_STORE = globalThis.ZenHnActionStore;
const ZEN_SUBMISSION_MENU = globalThis.ZenHnSubmissionMenu;
const ZEN_RANDOM = globalThis.ZenHnRandom;
const ZEN_COMMENT_COLLAPSE = globalThis.ZenHnCommentCollapse;
const ZEN_FAVORITES = globalThis.ZenHnFavorites;
const ZEN_REPLY_FORM = globalThis.ZenHnReplyForm;
const ZEN_SIDEBAR = globalThis.ZenHnSidebar;
const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ZEN_HN_SUBMISSIONS_KEY = "zenHnSubmissions";
const ZEN_RESTYLE_SUBMISSIONS = globalThis.ZenHnRestyleSubmissions;

document.documentElement.dataset.zenHnActive = "true";

if (!document.documentElement.dataset.zenHnSidebar) {
  document.documentElement.dataset.zenHnSidebar = "loading";
}

if (window.location.pathname === "/item") {
  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "loading";
}

const SUBMISSION_MENU_CLASS = ZEN_SUBMISSION_MENU.SUBMISSION_MENU_CLASS;
const SUBMISSION_MENU_OPEN_CLASS = ZEN_SUBMISSION_MENU.SUBMISSION_MENU_OPEN_CLASS;
const setSubmissionMenuState = ZEN_SUBMISSION_MENU.setSubmissionMenuState;
const closeAllSubmissionMenus = ZEN_SUBMISSION_MENU.closeAllSubmissionMenus;
const registerSubmissionMenuListeners = ZEN_SUBMISSION_MENU.registerSubmissionMenuListeners;

const setCollapseButtonState = ZEN_COMMENT_COLLAPSE.setCollapseButtonState;
const hideDescendantComments = ZEN_COMMENT_COLLAPSE.hideDescendantComments;
const restoreDescendantVisibility = ZEN_COMMENT_COLLAPSE.restoreDescendantVisibility;
const toggleCommentCollapse = ZEN_COMMENT_COLLAPSE.toggleCommentCollapse;

// Color mode control functions from TypeScript
const ZEN_COLOR_MODE = globalThis.ZenHnColorMode;
const ZEN_ICONS = globalThis.ZenHnIcons;

const renderIcon = ZEN_ICONS.renderIcon;

// Initialize color mode and theme from storage on startup
ZEN_COLOR_MODE.initColorMode();
ZEN_COLOR_MODE.initTheme();

// Listen for system color scheme changes
ZEN_COLOR_MODE.listenForSystemColorModeChanges();

function getOrCreateZenHnMain() {
  return globalThis.ZenHnMain.getOrCreateZenHnMain();
}

function buildSidebarNavigation() {
  return ZEN_SIDEBAR.buildSidebarNavigation();
}

function registerCommentCollapseListeners() {
  return ZEN_COMMENT_COLLAPSE.registerCommentCollapseListeners();
}

function initCommentCollapse() {
  return ZEN_COMMENT_COLLAPSE.initCommentCollapse();
}

// function buildSubnav() {
//   if (document.getElementById("zen-hn-subnav")) {
//     return true;
//   }
//
//   const subnavLinks = [
//     { href: "/front", label: "Front" },
//     { href: "/pool", label: "Pool" },
//     { href: "/invited", label: "Invited" },
//     { href: "/shownew", label: "Show New" },
//     { href: "/asknew", label: "Ask New" },
//     { href: "/best", label: "Best" },
//     { href: "/active", label: "Active" },
//     { href: "/classic", label: "Classic" },
//     { href: "/launches", label: "Launches" },
//   ];
//
//   const nav = document.createElement("nav");
//   nav.id = "zen-hn-subnav";
//   nav.className = "zen-hn-subnav";
//   nav.setAttribute("aria-label", "Secondary navigation");
//
//   const list = document.createElement("ul");
//   list.className = "zen-hn-subnav-list";
//
//   const currentPath = window.location.pathname;
//
//   subnavLinks.forEach((item) => {
//     const li = document.createElement("li");
//     li.className = "zen-hn-subnav-item";
//
//     const link = document.createElement("a");
//     link.className = "zen-hn-subnav-link";
//     link.href = item.href;
//     link.textContent = item.label;
//
//     if (currentPath === item.href) {
//       link.classList.add("is-active");
//       link.setAttribute("aria-current", "page");
//     }
//
//     li.appendChild(link);
//     list.appendChild(li);
//   });
//
//   nav.appendChild(list);
//   document.body.appendChild(nav);
//   document.documentElement.dataset.zenHnSubnav = "true";
//
//   return true;
// }

function runSidebarWhenReady() {
  ZEN_SIDEBAR.runSidebarWhenReady();
}

function runCommentCollapseWhenReady() {
  return ZEN_COMMENT_COLLAPSE.runCommentCollapseWhenReady();
}

if (window.location.pathname === "/item") {
  runCommentCollapseWhenReady();
}

function loadActionStore() {
  return ZEN_ACTION_STORE.loadActionStore();
}

function getStoredAction(kind, id) {
  return ZEN_ACTION_STORE.getStoredAction(kind, id);
}

function updateStoredAction(kind, id, update) {
  return ZEN_ACTION_STORE.updateStoredAction(kind, id, update);
}

const resolveFavoriteLink = ZEN_FAVORITES.resolveFavoriteLink;
const resolveStoryFavoriteLink = ZEN_FAVORITES.resolveStoryFavoriteLink;

const resolveReplyForm = ZEN_REPLY_FORM.resolveReplyForm;
const resolveReplyFormFromElement = ZEN_REPLY_FORM.resolveReplyFormFromElement;
const submitReplyWithResolved = ZEN_REPLY_FORM.submitReplyWithResolved;
const submitReply = ZEN_REPLY_FORM.submitReply;

function restyleSubmissions() {
  return ZEN_RESTYLE_SUBMISSIONS.restyleSubmissions();
}

function restyleSubmitPage() {
  if (window.location.pathname !== "/submit") {
    return;
  }
  const hnmain = document.getElementById("hnmain");
  if (!hnmain || hnmain.dataset.zenHnRestyled === "true") {
    return;
  }

  // Find the form element
  const form = hnmain.querySelector("form");
  if (!form) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "hn-form-page hn-submit-page";

  // Move the form (not clone) so submission works
  wrapper.appendChild(form);

  hnmain.dataset.zenHnRestyled = "true";
  getOrCreateZenHnMain().appendChild(wrapper);
}

function restyleUserPage() {
  if (!ZEN_LOGIC.isUserProfilePage()) {
    return;
  }
  const hnmain = document.getElementById("hnmain");
  if (!hnmain || hnmain.dataset.zenHnRestyled === "true") {
    return;
  }

  // Find the form (for own profile) or content table (for other users)
  const form = hnmain.querySelector("form");
  const bigbox = hnmain.querySelector("tr#bigbox > td");

  if (!form && !bigbox) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "hn-form-page hn-user-page";

  // Move the form or content (not clone) so it works
  if (form) {
    wrapper.appendChild(form);

    // Add color mode control section for own profile (has form)
    const settingsSection = document.createElement("div");
    settingsSection.className = "zen-hn-settings-section";

    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "zen-hn-settings-title";
    sectionTitle.textContent = "Zen HN Settings";
    settingsSection.appendChild(sectionTitle);

    // Add appearance controls (color mode + theme)
    ZEN_COLOR_MODE.appendAppearanceControls(settingsSection);

    wrapper.appendChild(settingsSection);
  } else if (bigbox) {
    // Move all children from bigbox
    while (bigbox.firstChild) {
      wrapper.appendChild(bigbox.firstChild);
    }
  }

  hnmain.dataset.zenHnRestyled = "true";
  getOrCreateZenHnMain().appendChild(wrapper);

  // Style native HN selects (showdead, noprocrast) - must be after wrapper is in DOM
  if (form) {
    ZEN_COLOR_MODE.styleUserPageSelects();
  }
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
  const { isUpvoted } = ZEN_LOGIC.getVoteState(fatitem);
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
      ZEN_UTILS.stripParenTextNodes(clone);
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
  upvoteButton.innerHTML = renderIcon(isUpvotedState ? "arrow-fat-up-fill" : "arrow-fat-up");
  if (isUpvotedState) {
    upvoteButton.classList.add("is-active");
  }
  if (upvoteLink || isUpvotedState) {
    upvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isUpvotedState
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
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
  const updateFatitemBookmarkIcon = () => {
    bookmarkButton.innerHTML = renderIcon(isFavorited ? "bookmark-simple-fill" : "bookmark-simple");
  };
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasFavorited = isFavorited;
    isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
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
    isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    updateFatitemBookmarkIcon();
    if (itemId) {
      updateStoredAction("stories", itemId, { favorite: isFavorited });
    }
    favoriteHref = ZEN_LOGIC.buildNextFavoriteHref(favoriteHref, !isFavorited);
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
    event.stopPropagation();
    const itemHref = ZEN_LOGIC.buildItemHref(itemId, window.location.href);
    const targetHref = itemHref || window.location.href;
    const copied = await ZEN_UTILS.copyTextToClipboard(targetHref);
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
  const commentId = ZEN_LOGIC.getCommentId(row, comhead);
  const replyHref = replyHrefOverride ?? ZEN_LOGIC.getReplyHref(row, comhead);
  const storedCommentAction = getStoredAction("comments", commentId);
  let { isUpvoted, isDownvoted } = ZEN_LOGIC.getVoteState(row);
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
  const domFavorited = favoriteText === "unfavorite";
  let isFavorited = domFavorited || storedFavorite === true;
  // Only sync TO storage when DOM shows favorited but we don't have it stored
  if (hasFavoriteSignal && commentId && domFavorited && storedFavorite !== true) {
    updateStoredAction("comments", commentId, { favorite: true });
  }

  const indentLevel = Number.isFinite(indentOverride)
    ? indentOverride
    : ZEN_LOGIC.getIndentLevelFromRow(row);
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
  collapseButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleCommentCollapse(item);
  });

  const meta = document.createElement("div");
  meta.className = "hn-comment-meta";
  if (comhead) {
    meta.classList.add("has-comhead");
    const userLink = comhead.querySelector(".hnuser");
    if (userLink) {
      const userSpan = document.createElement("span");
      userSpan.className = "hn-comment-user";
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
  if (isUpvoted) {
    upvoteButton.classList.add("is-active");
  }

  const downvoteButton = document.createElement("button");
  downvoteButton.className = "icon-button";
  downvoteButton.type = "button";
  downvoteButton.setAttribute("aria-label", "Downvote");
  downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
  downvoteButton.innerHTML = renderIcon(isDownvoted ? "arrow-fat-down-fill" : "arrow-fat-down");
  if (isDownvoted) {
    downvoteButton.classList.add("is-active");
  }

  const updateVoteIcons = () => {
    upvoteButton.innerHTML = renderIcon(isUpvoted ? "arrow-fat-up-fill" : "arrow-fat-up");
    downvoteButton.innerHTML = renderIcon(isDownvoted ? "arrow-fat-down-fill" : "arrow-fat-down");
  };

  if (upvoteLink || isUpvoted) {
    upvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isUpvoted
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
        : upvoteHref;
      if (!voteHref) {
        return;
      }
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
      updateVoteIcons();
    });
  } else {
    upvoteButton.hidden = true;
  }

  if (downvoteLink || isDownvoted) {
    downvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isDownvoted
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(downvoteHref, "un", window.location.href))
        : downvoteHref;
      if (!voteHref) {
        return;
      }
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
      updateVoteIcons();
    });
  } else {
    downvoteButton.hidden = true;
  }

  const bookmarkButton = document.createElement("button");
  bookmarkButton.className = "icon-button";
  bookmarkButton.type = "button";
  bookmarkButton.setAttribute("aria-label", "Favorite");
  bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
  bookmarkButton.innerHTML = renderIcon(isFavorited ? "bookmark-simple-fill" : "bookmark-simple");
  if (isFavorited) {
    bookmarkButton.classList.add("is-active");
  }
  const updateCommentBookmarkIcon = () => {
    bookmarkButton.innerHTML = renderIcon(isFavorited ? "bookmark-simple-fill" : "bookmark-simple");
  };
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasFavorited = isFavorited;
    isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
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
    isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    updateCommentBookmarkIcon();
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
    event.stopPropagation();
    const commentHref = ZEN_LOGIC.buildCommentHref(commentId, window.location.href);
    if (!commentHref) {
      return;
    }
    const copied = await ZEN_UTILS.copyTextToClipboard(commentHref);
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

  ZEN_LOGIC.addCommentClickHandler(item, toggleCommentCollapse);

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
    const indentLevel = ZEN_LOGIC.getIndentLevelFromRow(row);
    const nextIndentLevel = ZEN_LOGIC.getIndentLevelFromRow(rows[index + 1]);
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

  getOrCreateZenHnMain().appendChild(container);
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
  buildSidebarNavigation();
  // buildSubnav();
  if (ZEN_LOGIC.isUserProfilePage()) {
    document.documentElement.dataset.zenHnUserPage = "true";
  }
  restyleSubmissions();
  restyleSubmitPage();
  restyleUserPage();
  ZEN_PAGES.restyleChangePwPage();
  restyleFatItem();
  runRestyleWhenReady();

  // Hide original HN content only if we created restyled content
  const zenHnMain = document.getElementById("zen-hn-main");
  if (zenHnMain && zenHnMain.children.length > 0) {
    const hnmain = document.getElementById("hnmain");
    const centerWrapper = hnmain?.closest("center");
    if (centerWrapper) {
      centerWrapper.style.display = "none";
    } else if (hnmain) {
      hnmain.style.display = "none";
    }
  }
}

runSidebarWhenReady();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initRestyle();
  });
} else {
  initRestyle();
}

