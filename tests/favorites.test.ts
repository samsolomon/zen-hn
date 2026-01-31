import { test, describe } from "node:test";
import assert from "node:assert";
import {
  resolveFavoriteLink,
  resolveStoryFavoriteLink,
} from "../src/favorites";

describe("favorites", () => {
  describe("resolveFavoriteLink", () => {
    test("returns null for empty commentId", async () => {
      const result = await resolveFavoriteLink("");
      assert.strictEqual(result, null);
    });

    test("returns null for null-like commentId", async () => {
      const result = await resolveFavoriteLink(null as unknown as string);
      assert.strictEqual(result, null);
    });

    test("returns null for undefined commentId", async () => {
      const result = await resolveFavoriteLink(undefined as unknown as string);
      assert.strictEqual(result, null);
    });
  });

  describe("resolveStoryFavoriteLink", () => {
    test("returns null for empty itemId", async () => {
      const result = await resolveStoryFavoriteLink("");
      assert.strictEqual(result, null);
    });

    test("returns null for null-like itemId", async () => {
      const result = await resolveStoryFavoriteLink(null as unknown as string);
      assert.strictEqual(result, null);
    });

    test("returns null for undefined itemId", async () => {
      const result = await resolveStoryFavoriteLink(undefined as unknown as string);
      assert.strictEqual(result, null);
    });
  });
});
