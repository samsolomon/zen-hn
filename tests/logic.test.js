const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  buildVoteHref,
  buildCommentHref,
  toggleVoteState,
  toggleFavoriteState,
  willFavoriteFromHref,
  buildMenuItem,
  buildMenuItems,
} = require("../logic");

test("buildVoteHref adds how param", () => {
  const href = "vote?id=123&auth=abc";
  const result = buildVoteHref(href, "un", "https://news.ycombinator.com/item?id=123");
  const url = new URL(result);
  assert.equal(url.searchParams.get("how"), "un");
  assert.equal(url.searchParams.get("id"), "123");
});

test("buildCommentHref builds absolute comment link", () => {
  const href = buildCommentHref("456", "https://news.ycombinator.com/item?id=123");
  assert.equal(href, "https://news.ycombinator.com/item?id=456");
});

test("toggleVoteState upvote from neutral", () => {
  const next = toggleVoteState({ isUpvoted: false, isDownvoted: false }, "up");
  assert.deepEqual(next, { isUpvoted: true, isDownvoted: false });
});

test("toggleVoteState upvote from upvoted", () => {
  const next = toggleVoteState({ isUpvoted: true, isDownvoted: false }, "up");
  assert.deepEqual(next, { isUpvoted: false, isDownvoted: false });
});

test("toggleVoteState downvote from upvoted", () => {
  const next = toggleVoteState({ isUpvoted: true, isDownvoted: false }, "down");
  assert.deepEqual(next, { isUpvoted: false, isDownvoted: true });
});

test("toggleVoteState downvote from downvoted", () => {
  const next = toggleVoteState({ isUpvoted: false, isDownvoted: true }, "down");
  assert.deepEqual(next, { isUpvoted: false, isDownvoted: false });
});

test("toggleFavoriteState flips", () => {
  assert.equal(toggleFavoriteState(false), true);
  assert.equal(toggleFavoriteState(true), false);
});

test("willFavoriteFromHref detects unfavorite", () => {
  assert.equal(willFavoriteFromHref("fave?id=123"), true);
  assert.equal(willFavoriteFromHref("fave?id=123&un=t"), false);
});

test("buildMenuItem builds label from text", () => {
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

test("buildMenuItem falls back when text missing", () => {
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

test("buildMenuItem returns null without href", () => {
  const result = buildMenuItem({
    href: "",
    text: "hide",
    fallback: "Hide",
    action: "hide",
  });
  assert.equal(result, null);
});

test("buildMenuItems filters missing items", () => {
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
