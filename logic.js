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
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ZenHnLogic;
}

globalThis.ZenHnLogic = ZenHnLogic;
