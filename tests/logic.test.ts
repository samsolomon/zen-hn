import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";
import {
  buildVoteHref,
  buildCommentHref,
  buildItemHref,
  resolveVoteItemId,
  resolveSubmissionCopyHref,
  toggleVoteState,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildMenuItem,
  buildMenuItems,
} from "../src/logic";

describe("buildVoteHref", () => {
  test("adds how param", () => {
    const href = "vote?id=123&auth=abc";
    const result = buildVoteHref(href, "un", "https://news.ycombinator.com/item?id=123");
    const url = new URL(result);
    assert.equal(url.searchParams.get("how"), "un");
    assert.equal(url.searchParams.get("id"), "123");
  });

  test("returns empty for null href", () => {
    assert.equal(buildVoteHref(null), "");
  });

  test("returns empty for undefined href", () => {
    assert.equal(buildVoteHref(undefined), "");
  });
});

describe("buildCommentHref", () => {
  test("builds absolute comment link", () => {
    const href = buildCommentHref("456", "https://news.ycombinator.com/item?id=123");
    assert.equal(href, "https://news.ycombinator.com/item?id=456");
  });

  test("returns empty for null id", () => {
    assert.equal(buildCommentHref(null), "");
  });
});

describe("buildItemHref", () => {
  test("builds absolute item link", () => {
    const href = buildItemHref("456", "https://news.ycombinator.com/news");
    assert.equal(href, "https://news.ycombinator.com/item?id=456");
  });
});

describe("resolveVoteItemId", () => {
  test("parses vote href id", () => {
    const id = resolveVoteItemId("vote?id=123&how=up", "https://news.ycombinator.com/news");
    assert.equal(id, "123");
  });

  test("returns empty for null href", () => {
    assert.equal(resolveVoteItemId(null), "");
  });
});

describe("resolveSubmissionCopyHref", () => {
  test("prefers comments link", () => {
    const href = resolveSubmissionCopyHref(
      "item?id=456",
      "123",
      "https://news.ycombinator.com/news",
    );
    assert.equal(href, "https://news.ycombinator.com/item?id=456");
  });

  test("falls back to item id", () => {
    const href = resolveSubmissionCopyHref("", "123", "https://news.ycombinator.com/news");
    assert.equal(href, "https://news.ycombinator.com/item?id=123");
  });
});

describe("toggleVoteState", () => {
  test("upvote from neutral", () => {
    const next = toggleVoteState({ isUpvoted: false, isDownvoted: false }, "up");
    assert.deepEqual(next, { isUpvoted: true, isDownvoted: false });
  });

  test("upvote from upvoted", () => {
    const next = toggleVoteState({ isUpvoted: true, isDownvoted: false }, "up");
    assert.deepEqual(next, { isUpvoted: false, isDownvoted: false });
  });

  test("downvote from upvoted", () => {
    const next = toggleVoteState({ isUpvoted: true, isDownvoted: false }, "down");
    assert.deepEqual(next, { isUpvoted: false, isDownvoted: true });
  });

  test("downvote from downvoted", () => {
    const next = toggleVoteState({ isUpvoted: false, isDownvoted: true }, "down");
    assert.deepEqual(next, { isUpvoted: false, isDownvoted: false });
  });

  test("handles null current state", () => {
    const next = toggleVoteState(null, "up");
    assert.deepEqual(next, { isUpvoted: true, isDownvoted: false });
  });
});

describe("toggleFavoriteState", () => {
  test("flips", () => {
    assert.equal(toggleFavoriteState(false), true);
    assert.equal(toggleFavoriteState(true), false);
  });

  test("handles null/undefined", () => {
    assert.equal(toggleFavoriteState(null), true);
    assert.equal(toggleFavoriteState(undefined), true);
  });
});

describe("willFavoriteFromHref", () => {
  test("detects unfavorite", () => {
    assert.equal(willFavoriteFromHref("fave?id=123"), true);
    assert.equal(willFavoriteFromHref("fave?id=123&un=t"), false);
  });

  test("returns false for null href", () => {
    assert.equal(willFavoriteFromHref(null), false);
  });
});

describe("buildMenuItem", () => {
  test("builds label from text", () => {
    const result = buildMenuItem({
      href: "hide?id=1",
      text: "hide",
      fallback: "Hide",
      action: "hide",
    });
    assert.deepEqual(result, {
      label: "Hide",
      href: "hide?id=1",
      action: "hide",
    });
  });

  test("falls back when text missing", () => {
    const result = buildMenuItem({
      href: "flag?id=1",
      text: "",
      fallback: "Flag",
      action: "flag",
    });
    assert.deepEqual(result, {
      label: "Flag",
      href: "flag?id=1",
      action: "flag",
    });
  });

  test("returns null without href", () => {
    const result = buildMenuItem({
      href: "",
      text: "hide",
      fallback: "Hide",
      action: "hide",
    });
    assert.equal(result, null);
  });

  test("returns null for null href", () => {
    const result = buildMenuItem({
      href: null,
      text: "hide",
      fallback: "Hide",
    });
    assert.equal(result, null);
  });
});

describe("buildMenuItems", () => {
  test("filters missing items", () => {
    const result = buildMenuItems([
      { href: "", text: "hide", fallback: "Hide", action: "hide" },
      { href: "flag?id=1", text: "flag", fallback: "Flag", action: "flag" },
    ]);
    assert.deepEqual(result, [
      {
        label: "Flag",
        href: "flag?id=1",
        action: "flag",
      },
    ]);
  });

  test("returns empty array for null input", () => {
    const result = buildMenuItems(null);
    assert.deepEqual(result, []);
  });

  test("returns empty array for non-array input", () => {
    const result = buildMenuItems("not an array" as unknown as never[]);
    assert.deepEqual(result, []);
  });
});
