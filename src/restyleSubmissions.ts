import { isUserProfilePage } from "./logic";
import { stripParenTextNodes, copyTextToClipboard, toSentenceCase } from "./utils";
import { renderIcon } from "./icons";
import {
  SUBMISSION_MENU_CLASS,
  SUBMISSION_MENU_OPEN_CLASS,
  setSubmissionMenuState,
  closeAllSubmissionMenus,
  registerSubmissionMenuListeners,
} from "./submissionMenu";
import { resolveStoryFavoriteLink } from "./favorites";
import { getStoredAction, updateStoredAction } from "./actionStore";
import { getOrCreateZenHnMain } from "./getOrCreateZenHnMain";
import { announce } from "./announcer";
import {
  buildVoteHref,
  buildMenuItems,
  getVoteState,
  resolveVoteItemId,
  resolveSubmissionCopyHref,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildNextFavoriteHref,
  addSubmissionClickHandler,
  type VoteState,
  type MenuItem,
} from "./logic";
import { initTooltip } from "./tooltip";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ZEN_HN_SUBMISSIONS_KEY = "zenHnSubmissions";

export function getStoryRows(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }
  const rows = Array.from(root.querySelectorAll<HTMLElement>("tr.athing"));
  return rows.filter(
    (row) => !row.classList.contains("comtr") && !row.querySelector(".comment .commtext"),
  );
}

export function restyleSubmissions(): void {
  if (isUserProfilePage()) {
    return;
  }
  // Skip on delete-confirm page - that page has its own restyling
  if (window.location.pathname === "/delete-confirm") {
    return;
  }
  const bigboxRow = document.querySelector<HTMLTableRowElement>("tr#bigbox");
  const itemList = document.querySelector<HTMLTableElement>("table.itemlist");
  const bigboxTable = bigboxRow?.querySelector<HTMLTableElement>("table");
  const sourceTable = (itemList || bigboxTable) as HTMLTableElement | undefined;
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
    let upvoteLink = row.querySelector<HTMLAnchorElement>("a[id^='up_']") ?? undefined;
    let unvoteLink = row.querySelector<HTMLAnchorElement>("a[id^='un_'], a[href*='how=un']") ?? undefined;
    if (!upvoteLink && subtextRow) {
      upvoteLink = subtextRow.querySelector<HTMLAnchorElement>("a[id^='up_']") ?? undefined;
    }
    if (!upvoteLink && subtext) {
      upvoteLink = Array.from(subtext.querySelectorAll<HTMLAnchorElement>("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text === "upvote" || text === "vote";
      }) ?? undefined;
    }
    if (!unvoteLink && subtextRow) {
      unvoteLink = subtextRow.querySelector<HTMLAnchorElement>("a[id^='un_'], a[href*='how=un']") ?? undefined;
    }
    if (!unvoteLink && subtext) {
      unvoteLink = Array.from(subtext.querySelectorAll<HTMLAnchorElement>("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text === "unvote";
      }) ?? undefined;
    }
    const upvoteHref = upvoteLink?.getAttribute("href") || "";
    const unvoteHref = unvoteLink?.getAttribute("href") || "";
    const voteItemId = resolveVoteItemId(upvoteHref || unvoteHref, globalThis.location?.href);
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
    if (!domUpvoted && storedVote === "up") {
      isUpvotedState = true;
    } else if (domUpvoted) {
      isUpvotedState = true;
    }

    const body = document.createElement("div");
    body.className = "hn-submission-body";

    const titleRow = document.createElement("div");
    titleRow.className = "hn-submission-titleline";
    const titleClone = titleLink.cloneNode(true) as HTMLElement;
    titleClone.classList.add("hn-submission-title");
    titleRow.appendChild(titleClone);
    body.appendChild(titleRow);

    const meta = document.createElement("div");
    meta.className = "hn-submission-meta";

    const appendMetaItem = (node: Node | null | undefined, className: string): void => {
      if (!node) {
        return;
      }
      const clone = node.cloneNode(true);
      if (className && clone instanceof Element) {
        clone.classList.add(className);
      }
      if ((className === "hn-submission-site" || (clone as Element).classList.contains("sitebit")) && clone instanceof Element) {
        stripParenTextNodes(clone);
      }
      if (clone instanceof Node) {
        meta.appendChild(clone);
      }
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
    const deleteLinkByHref = subtext?.querySelector("a[href*='delete-confirm']");
    const deleteLinkByText = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase() || "";
          return text === "delete";
        })
      : null;
    const deleteLink = deleteLinkByHref || deleteLinkByText;

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
    upvoteButton.innerHTML = renderIcon(isUpvotedState ? "arrow-fat-up-fill" : "arrow-fat-up");
    initTooltip(upvoteButton, "Upvote", { shortcut: "u" });
    if (isUpvotedState) {
      upvoteButton.classList.add("is-active");
    }
    if (upvoteLink || isUpvotedState) {
      upvoteButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const voteHref = isUpvotedState
          ? (unvoteHref || buildVoteHref(upvoteHref, "un", globalThis.location?.href))
          : upvoteHref;
        if (!voteHref) {
          return;
        }
        fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
        isUpvotedState = !isUpvotedState;
        if (effectiveItemId) {
          updateStoredAction("stories", effectiveItemId, { vote: isUpvotedState ? "up" : null });
        }
        upvoteButton.classList.toggle("is-active", isUpvotedState);
        upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
        upvoteButton.innerHTML = renderIcon(isUpvotedState ? "arrow-fat-up-fill" : "arrow-fat-up");
        announce(isUpvotedState ? "Upvoted" : "Vote removed");
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
    const domFavorited = favoriteText === "unfavorite";
    let isFavorited = domFavorited || storedFavorite === true;
    if (hasFavoriteSignal && effectiveItemId && domFavorited && storedFavorite !== true) {
      updateStoredAction("stories", effectiveItemId, { favorite: true });
    }
    let favoriteHref = favoriteLink?.getAttribute("href") || "";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = "icon-button";
    bookmarkButton.type = "button";
    bookmarkButton.setAttribute("aria-label", "Favorite");
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    bookmarkButton.innerHTML = renderIcon(isFavorited ? "bookmark-simple-fill" : "bookmark-simple");
    initTooltip(bookmarkButton, "Favorite", { shortcut: "f" });
    if (isFavorited) {
      bookmarkButton.classList.add("is-active");
    }
    const updateBookmarkIcon = (): void => {
      bookmarkButton.innerHTML = renderIcon(isFavorited ? "bookmark-simple-fill" : "bookmark-simple");
    };
    bookmarkButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const wasFavorited = isFavorited;
      isFavorited = toggleFavoriteState(isFavorited);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      updateBookmarkIcon();
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
          updateBookmarkIcon();
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
        updateBookmarkIcon();
        if (effectiveItemId) {
          updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
        }
        return;
      }
      await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
      isFavorited = willFavoriteFromHref(favoriteHref);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      updateBookmarkIcon();
      if (effectiveItemId) {
        updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
      }
      favoriteHref = buildNextFavoriteHref(favoriteHref, !isFavorited);
      announce(isFavorited ? "Added to favorites" : "Removed from favorites");
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
      const commentsHref = commentsLink?.getAttribute("href") || "";
      const targetHref = resolveSubmissionCopyHref(
        commentsHref,
        effectiveItemId,
        globalThis.location?.href,
      ) || globalThis.location?.href || "";
      const copied = await copyTextToClipboard(targetHref);
      if (copied) {
        if (copyResetTimer) {
          globalThis.clearTimeout(copyResetTimer);
        }
        linkButton.classList.add("is-copied");
        linkButton.classList.add("is-active");
        announce("Link copied to clipboard");
        copyResetTimer = globalThis.setTimeout(() => {
          linkButton.classList.remove("is-copied");
          linkButton.classList.remove("is-active");
          copyResetTimer = null;
        }, 1500);
      }
    });

    actions.appendChild(upvoteButton);
    actions.appendChild(bookmarkButton);
    actions.appendChild(linkButton);

    const extraLinks: Element[] = [];
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
        deleteLink,
      ]);
      extraLinks.push(
        ...Array.from(subtext.querySelectorAll("a")).filter(
          (link) => !excludedLinks.has(link),
        ),
      );
    }

    const hideHref = hideLink?.getAttribute("href") || "";
    const flagHref = flagLink?.getAttribute("href") || "";
    const deleteHref = deleteLink?.getAttribute("href") || "";
    const menuItems = buildMenuItems([
      {
        href: hideHref,
        text: hideLink?.textContent ?? undefined,
        fallback: "Hide",
        action: "hide",
      },
      {
        href: flagHref,
        text: flagLink?.textContent ?? undefined,
        fallback: "Flag",
        action: "flag",
      },
      {
        href: deleteHref,
        text: deleteLink?.textContent ?? undefined,
        fallback: "Delete",
        action: "delete",
      },
    ]);
    const extraMenuItems: MenuItem[] = [];
    extraLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!href) {
        return;
      }
      const label = toSentenceCase(link.textContent || "");
      if (!label) {
        return;
      }
      extraMenuItems.push({
        label,
        href,
        action: "extra",
      });
    });
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
    initTooltip(menuButton, "More actions");

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
        if (menuItem.action === "delete" && menuItem.href) {
          globalThis.location.href = menuItem.href;
          return;
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
    // Skip actions on leaders page - they don't make sense there
    if (window.location.pathname !== "/leaders") {
      subRow.appendChild(actions);
    }
    body.appendChild(subRow);

    if (effectiveItemId) {
      addSubmissionClickHandler(item, effectiveItemId);
    }

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
  getOrCreateZenHnMain().appendChild(container);
  sourceTable.style.display = "none";
}
