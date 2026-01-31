import { describe, it } from "node:test";
import assert from "node:assert";
import {
  resolveReplyFormFromElement,
  submitReplyWithResolved,
  type ResolvedReplyForm,
} from "../src/replyForm";

describe("replyForm", () => {
  describe("resolveReplyFormFromElement", () => {
    it("returns null for null form", () => {
      const result = resolveReplyFormFromElement(null);
      assert.strictEqual(result, null);
    });

    it("returns null for undefined form", () => {
      const result = resolveReplyFormFromElement(undefined as unknown as HTMLFormElement);
      assert.strictEqual(result, null);
    });
  });

  describe("submitReplyWithResolved", () => {
    it("returns ok: false for null resolved form", async () => {
      const result = await submitReplyWithResolved(null, "test reply");
      assert.strictEqual(result.ok, false);
    });

    it("returns ok: false for undefined resolved form", async () => {
      const result = await submitReplyWithResolved(undefined as unknown as ResolvedReplyForm, "test reply");
      assert.strictEqual(result.ok, false);
    });
  });

  describe("type definitions", () => {
    it("ResolvedReplyForm accepts valid structure", () => {
      const form: ResolvedReplyForm = {
        actionUrl: "https://news.ycombinator.com/comment",
        method: "POST",
        fields: { parent: "123" },
        textName: "text",
      };
      assert.strictEqual(form.method, "POST");
      assert.strictEqual(form.fields.parent, "123");
    });

    it("ResolvedReplyForm accepts GET method", () => {
      const form: ResolvedReplyForm = {
        actionUrl: "https://news.ycombinator.com/comment",
        method: "GET",
        fields: { id: "456" },
        textName: "text",
      };
      assert.strictEqual(form.method, "GET");
    });

    it("ResolvedReplyForm accepts empty fields", () => {
      const form: ResolvedReplyForm = {
        actionUrl: "https://news.ycombinator.com/comment",
        method: "POST",
        fields: {},
        textName: "text",
      };
      assert.deepStrictEqual(Object.keys(form.fields), []);
    });
  });
});
