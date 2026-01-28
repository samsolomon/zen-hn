import assert from "node:assert/strict";
import { test } from "node:test";

import {
  RANDOM_ITEM_MAX_ATTEMPTS,
  parseItemIdFromHref,
  parseMaxId,
  resolveHrefWithBase,
} from "../src/random.ts";

test("RANDOM_ITEM_MAX_ATTEMPTS is 6", () => {
  assert.equal(RANDOM_ITEM_MAX_ATTEMPTS, 6);
});

test("parseItemIdFromHref extracts id from item href", () => {
  assert.equal(parseItemIdFromHref("item?id=12345"), "12345");
  assert.equal(parseItemIdFromHref("item?id=1"), "1");
  assert.equal(parseItemIdFromHref("item?id=999999999"), "999999999");
});

test("parseItemIdFromHref returns empty string for invalid hrefs", () => {
  assert.equal(parseItemIdFromHref(""), "");
  assert.equal(parseItemIdFromHref("newest"), "");
  assert.equal(parseItemIdFromHref("item?id="), "");
  assert.equal(parseItemIdFromHref("item?id=abc"), "");
  assert.equal(parseItemIdFromHref("vote?id=123"), "");
});

test("parseMaxId parses valid positive integers", () => {
  assert.equal(parseMaxId("1"), 1);
  assert.equal(parseMaxId("12345"), 12345);
  assert.equal(parseMaxId("999999999"), 999999999);
});

test("parseMaxId returns null for invalid input", () => {
  assert.equal(parseMaxId(""), null);
  assert.equal(parseMaxId("0"), null);
  assert.equal(parseMaxId("-1"), null);
  assert.equal(parseMaxId("abc"), null);
  assert.equal(parseMaxId("Infinity"), null);
  assert.equal(parseMaxId("NaN"), null);
});

test("parseMaxId truncates decimals", () => {
  assert.equal(parseMaxId("12.5"), 12);
});

test("resolveHrefWithBase resolves relative URL with base", () => {
  const result = resolveHrefWithBase(
    "item?id=123",
    "https://news.ycombinator.com/news"
  );
  assert.equal(result, "https://news.ycombinator.com/item?id=123");
});

test("resolveHrefWithBase resolves absolute URL", () => {
  const result = resolveHrefWithBase(
    "https://example.com/page",
    "https://news.ycombinator.com/news"
  );
  assert.equal(result, "https://example.com/page");
});

test("resolveHrefWithBase returns empty string for empty href", () => {
  assert.equal(resolveHrefWithBase("", "https://news.ycombinator.com/"), "");
});

test("resolveHrefWithBase uses default base when not provided", () => {
  const result = resolveHrefWithBase("item?id=456");
  assert.ok(result.includes("item?id=456"));
});

test("resolveHrefWithBase returns href on invalid URL", () => {
  const result = resolveHrefWithBase(":::invalid", "also:::invalid");
  assert.equal(result, ":::invalid");
});
