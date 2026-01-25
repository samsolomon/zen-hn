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
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ZenHnLogic;
}

globalThis.ZenHnLogic = ZenHnLogic;
