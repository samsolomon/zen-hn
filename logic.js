const ZenHnLogic = {
  buildVoteHref(href, how, baseHref) {
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
    } catch (error) {
      return href;
    }
  },
  buildCommentHref(commentId, baseHref) {
    if (!commentId) {
      return "";
    }
    try {
      const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
      return new URL(`item?id=${commentId}`, base).toString();
    } catch (error) {
      return `item?id=${commentId}`;
    }
  },
  buildItemHref(itemId, baseHref) {
    if (!itemId) {
      return "";
    }
    return ZenHnLogic.buildCommentHref(itemId, baseHref);
  },
  resolveVoteItemId(href, baseHref) {
    if (!href) {
      return "";
    }
    try {
      const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
      const url = new URL(href, base);
      return url.searchParams.get("id") || "";
    } catch (error) {
      const match = href.match(/[?&]id=(\d+)/);
      return match ? match[1] : "";
    }
  },
  resolveSubmissionCopyHref(commentsHref, itemId, baseHref) {
    const href = commentsHref || (itemId ? `item?id=${itemId}` : "");
    if (!href) {
      return "";
    }
    try {
      const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
      return new URL(href, base).toString();
    } catch (error) {
      return href;
    }
  },
  toggleVoteState(current, direction) {
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
  },
  toggleFavoriteState(isFavorited) {
    return !Boolean(isFavorited);
  },
  willFavoriteFromHref(href) {
    if (!href) {
      return false;
    }
    return !href.includes("un=t");
  },
  buildMenuItem({ href, text, fallback, action }) {
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
  },
  buildMenuItems(items) {
    if (!Array.isArray(items)) {
      return [];
    }
    return items.map((item) => ZenHnLogic.buildMenuItem(item)).filter(Boolean);
  },
  getVoteState(row) {
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
  },
  buildNextFavoriteHref(href, willBeFavorited, baseHref) {
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
    } catch (error) {
      if (willBeFavorited) {
        return href.replace(/([?&])un=t(&|$)/, "$1").replace(/[?&]$/, "");
      }
      return href.includes("un=t") ? href : `${href}${href.includes("?") ? "&" : "?"}un=t`;
    }
  },
  resolveHrefWithBase(href, baseHref) {
    if (!href) {
      return "";
    }
    try {
      const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
      return new URL(href, base).toString();
    } catch (error) {
      return href;
    }
  },
  isUserProfilePage() {
    const op = document.documentElement.getAttribute("op") || "";
    if (op.toLowerCase() === "user") {
      return true;
    }
    return globalThis.location?.pathname === "/user";
  },
  getIndentLevelFromRow(row) {
    if (!row) {
      return 0;
    }
    const indentImg = row.querySelector("td.ind img");
    const indentWidth = Number.parseInt(indentImg?.getAttribute("width") || "0", 10) || 0;
    return Math.round(indentWidth / 40) || 0;
  },
  getIndentLevelFromItem(item) {
    if (!item) {
      return 0;
    }
    return Number.parseInt(item.dataset?.indentLevel || "0", 10) || 0;
  },
  getCommentId(row, comhead) {
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
  },
  getReplyHref(row, comhead) {
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
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ZenHnLogic;
}

globalThis.ZenHnLogic = ZenHnLogic;
