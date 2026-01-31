import { describe, test } from "node:test";
import {
  RANDOM_ITEM_MAX_ATTEMPTS,
  parseItemIdFromHref,
  parseMaxId,
  resolveHrefWithBase,
  fetchNewestItemId,
  resolveRandomStoryHref,
  handleRandomItemClick,
} from "../src/random";

const mockZenLogic = {
  buildItemHref: (itemId: string, _baseHref: string) => `item?id=${itemId}`,
};

describe("random", () => {
  describe("constants", () => {
    test("RANDOM_ITEM_MAX_ATTEMPTS is 6", () => {
      if (RANDOM_ITEM_MAX_ATTEMPTS !== 6) {
        throw new Error(`Expected 6, got "${RANDOM_ITEM_MAX_ATTEMPTS}"`);
      }
    });
  });

  describe("parseItemIdFromHref", () => {
    test("returns empty string for null input", () => {
      const result = parseItemIdFromHref(null as unknown as string);
      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("returns empty string for undefined input", () => {
      const result = parseItemIdFromHref(undefined as unknown as string);
      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("returns empty string for empty string", () => {
      const result = parseItemIdFromHref("");
      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("parses item ID from href", () => {
      const result = parseItemIdFromHref("item?id=12345");
      if (result !== "12345") {
        throw new Error(`Expected "12345", got "${result}"`);
      }
    });

    test("returns empty string for href without item ID", () => {
      const result = parseItemIdFromHref("item?id=");
      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("returns empty string for non-item href", () => {
      const result = parseItemIdFromHref("vote?id=12345");
      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("handles URL with other parameters", () => {
      const result = parseItemIdFromHref("item?id=67890&foo=bar");
      if (result !== "67890") {
        throw new Error(`Expected "67890", got "${result}"`);
      }
    });

    test("extracts id from item href", () => {
      const result = parseItemIdFromHref("item?id=12345");
      if (result !== "12345") {
        throw new Error(`Expected "12345", got "${result}"`);
      }
    });

    test("handles large item IDs", () => {
      const result = parseItemIdFromHref("item?id=999999999");
      if (result !== "999999999") {
        throw new Error(`Expected "999999999", got "${result}"`);
      }
    });
  });

  describe("parseMaxId", () => {
    test("returns null for null input", () => {
      const result = parseMaxId(null as unknown as string);
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });

    test("returns null for undefined input", () => {
      const result = parseMaxId(undefined as unknown as string);
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });

    test("returns null for empty string", () => {
      const result = parseMaxId("");
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });

    test("returns null for non-numeric string", () => {
      const result = parseMaxId("abc");
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });

    test("returns null for number less than 1", () => {
      const result = parseMaxId("0");
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });

    test("returns null for negative numbers", () => {
      const result = parseMaxId("-5");
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });

    test("parses valid positive integer", () => {
      const result = parseMaxId("12345");
      if (result !== 12345) {
        throw new Error(`Expected 12345, got ${result}`);
      }
    });

    test("handles large numbers", () => {
      const result = parseMaxId("999999999");
      if (result !== 999999999) {
        throw new Error(`Expected 999999999, got ${result}`);
      }
    });

    test("truncates decimals", () => {
      const result = parseMaxId("12.5");
      if (result !== 12) {
        throw new Error(`Expected 12, got ${result}`);
      }
    });

    test("returns null for Infinity", () => {
      const result = parseMaxId("Infinity");
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });

    test("returns null for NaN", () => {
      const result = parseMaxId("NaN");
      if (result !== null) {
        throw new Error(`Expected null, got ${result}`);
      }
    });
  });

  describe("resolveHrefWithBase", () => {
    test("returns empty string for empty href", () => {
      const result = resolveHrefWithBase("");
      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("resolves relative href with base", () => {
      const result = resolveHrefWithBase("item?id=123", "https://news.ycombinator.com/");
      if (result !== "https://news.ycombinator.com/item?id=123") {
        throw new Error(`Expected full URL, got "${result}"`);
      }
    });

    test("returns href as-is if already absolute", () => {
      const href = "https://example.com/path";
      const result = resolveHrefWithBase(href);
      if (result !== href) {
        throw new Error(`Expected "${href}", got "${result}"`);
      }
    });

    test("uses provided baseHref", () => {
      const result = resolveHrefWithBase("item?id=456", "https://news.ycombinator.com/");
      if (!result.includes("news.ycombinator.com")) {
        throw new Error(`Expected news.ycombinator.com in URL, got "${result}"`);
      }
    });

    test("resolves relative URL with base", () => {
      const result = resolveHrefWithBase("item?id=123", "https://news.ycombinator.com/news");
      if (result !== "https://news.ycombinator.com/item?id=123") {
        throw new Error(`Expected full URL, got "${result}"`);
      }
    });

    test("resolves absolute URL", () => {
      const result = resolveHrefWithBase("https://example.com/page", "https://news.ycombinator.com/news");
      if (result !== "https://example.com/page") {
        throw new Error(`Expected absolute URL, got "${result}"`);
      }
    });

    test("returns href on invalid URL", () => {
      const result = resolveHrefWithBase(":::invalid", "also:::invalid");
      if (result !== ":::invalid") {
        throw new Error(`Expected ":::invalid", got "${result}"`);
      }
    });
  });

  describe("fetchNewestItemId", () => {
    test("returns empty string on fetch error", async () => {
      globalThis.fetch = async () => {
        throw new Error("Network error");
      };

      const result = await fetchNewestItemId();

      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("returns empty string for non-ok response", async () => {
      globalThis.fetch = async () => {
        return { ok: false, text: async () => "", url: "" } as unknown as Response;
      };

      const result = await fetchNewestItemId();

      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("parses item ID from response HTML", async () => {
      const html = `
        <html>
          <body>
            <table class="itemlist">
              <tr class="athing" id="99999">
                <td><a href="item?id=99999">99999</a></td>
              </tr>
            </table>
          </body>
        </html>
      `;

      const mockDoc = {
        querySelector: (selector: string) => {
          if (selector === "a[href^='item?id=']") {
            return { getAttribute: () => "item?id=99999" };
          }
          return null;
        },
      };

      globalThis.DOMParser = class DOMParser {
        parseFromString(_html: string, _contentType: string) {
          return mockDoc;
        }
      } as unknown as { new (): DOMParser };

      globalThis.fetch = async () => {
        return {
          ok: true,
          text: async () => html,
          url: "https://news.ycombinator.com/newest",
        } as unknown as Response;
      };

      const result = await fetchNewestItemId();

      if (result !== "99999") {
        throw new Error(`Expected "99999", got "${result}"`);
      }
    });

    test("returns empty string when no item link found", async () => {
      const html = `<html><body>No items here</body></html>`;

      globalThis.DOMParser = class DOMParser {
        parseFromString(_html: string, _contentType: string) {
          return { querySelector: () => null };
        }
      } as unknown as { new (): DOMParser };

      globalThis.fetch = async () => {
        return {
          ok: true,
          text: async () => html,
          url: "https://news.ycombinator.com/newest",
        } as unknown as Response;
      };

      const result = await fetchNewestItemId();

      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });
  });

  describe("resolveRandomStoryHref", () => {
    test("returns empty string for null maxId", async () => {
      const result = await resolveRandomStoryHref(null as unknown as string);

      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("returns empty string for invalid maxId", async () => {
      const result = await resolveRandomStoryHref("invalid");

      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("returns empty string for maxId less than 1", async () => {
      const result = await resolveRandomStoryHref("0");

      if (result !== "") {
        throw new Error(`Expected "", got "${result}"`);
      }
    });

    test("fetches candidate item and returns href", async () => {
      globalThis.fetch = async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.includes("/newest")) {
          return {
            ok: true,
            text: async () => `<a href="item?id=500">item 500</a>`,
            url: "https://news.ycombinator.com/newest",
          } as unknown as Response;
        }
        if (url.includes("item?id=250")) {
          return {
            ok: true,
            text: async () => `<html><body class="onstory"><a href="https://example.com/story">Story</a></body></html>`,
            url: "https://news.ycombinator.com/item?id=250",
          } as unknown as Response;
        }
        return { ok: true, text: async () => "", url } as unknown as Response;
      };

      globalThis.window = { location: { href: "https://news.ycombinator.com/" } } as unknown as Window & typeof globalThis;
      (globalThis as unknown as { ZEN_LOGIC: typeof mockZenLogic }).ZEN_LOGIC = mockZenLogic;

      const result = await resolveRandomStoryHref("500");

      if (result === "") {
        throw new Error("Expected non-empty result");
      }
    });

    test("falls back to max ID item on failure", async () => {
      let fetchCount = 0;
      globalThis.fetch = async () => {
        fetchCount++;
        if (fetchCount <= RANDOM_ITEM_MAX_ATTEMPTS) {
          return { ok: false } as unknown as Response;
        }
        return {
          ok: true,
          text: async () => "",
          url: "https://news.ycombinator.com/item?id=123",
        } as unknown as Response;
      };

      globalThis.window = { location: { href: "https://news.ycombinator.com/" } } as unknown as Window & typeof globalThis;
      (globalThis as unknown as { ZEN_LOGIC: typeof mockZenLogic }).ZEN_LOGIC = mockZenLogic;

      const result = await resolveRandomStoryHref("123");

      if (!result.includes("123")) {
        throw new Error(`Expected result containing item 123, got "${result}"`);
      }
    });
  });

  describe("handleRandomItemClick", () => {
    test.skip("does nothing when link is not HTMLElement", async () => {
      let navigationOccurred = false;
      const originalHref = globalThis.location?.href ?? "";
      Object.defineProperty(globalThis.location, "href", {
        set: (val) => { navigationOccurred = true; },
        get: () => originalHref,
      });

      globalThis.document = { createElement: () => ({ style: {} }) } as unknown as Document;

      const event = new Event("click");
      Object.defineProperty(event, "currentTarget", {
        value: document.createElement("div"),
      });

      (globalThis as unknown as { ZEN_LOGIC: typeof mockZenLogic }).ZEN_LOGIC = mockZenLogic;

      await handleRandomItemClick(event);

      if (navigationOccurred) {
        throw new Error("Should not navigate when link is not HTMLElement");
      }
    });

    test.skip("sets randomPending and aria-busy attributes", async () => {
      const link = document.createElement("a");
      link.href = "/random";

      let fetched = false;
      globalThis.fetch = async (input: RequestInfo | URL) => {
        const url = input.toString();
        if (url.includes("/newest")) {
          fetched = true;
          return {
            ok: true,
            text: async () => `<a href="item?id=100">item 100</a>`,
            url: "https://news.ycombinator.com/newest",
          } as unknown as Response;
        }
        if (url.includes("item?id=100")) {
          return {
            ok: true,
            text: async () => "",
            url: "https://news.ycombinator.com/item?id=100",
          } as unknown as Response;
        }
        return { ok: true, text: async () => "", url } as unknown as Response;
      };

      globalThis.window = { location: { href: "https://news.ycombinator.com/" } } as unknown as Window & typeof globalThis;
      globalThis.document = { createElement: () => ({ style: {} }) } as unknown as Document;

      (globalThis as unknown as { ZEN_LOGIC: typeof mockZenLogic }).ZEN_LOGIC = mockZenLogic;

      const event = new Event("click");
      Object.defineProperty(event, "currentTarget", {
        value: link,
      });

      const navigatePromise = handleRandomItemClick(event);
      if (link.dataset.randomPending !== "true") {
        throw new Error("Expected randomPending to be set");
      }
      if (link.getAttribute("aria-busy") !== "true") {
        throw new Error("Expected aria-busy to be set");
      }
      await navigatePromise;
    });

    test.skip("cleans up attributes after navigation", async () => {
      const link = document.createElement("a");
      link.href = "/random";

      globalThis.fetch = async () => {
        return {
          ok: true,
          text: async () => `<a href="item?id=100">item 100</a>`,
          url: "https://news.ycombinator.com/newest",
        } as unknown as Response;
      };

      globalThis.window = { location: { href: "https://news.ycombinator.com/" } } as unknown as Window & typeof globalThis;
      globalThis.document = { createElement: () => ({ style: {} }) } as unknown as Document;

      (globalThis as unknown as { ZEN_LOGIC: typeof mockZenLogic }).ZEN_LOGIC = mockZenLogic;

      const event = new Event("click");
      Object.defineProperty(event, "currentTarget", {
        value: link,
      });

      await handleRandomItemClick(event);

      if (link.dataset.randomPending === "true") {
        throw new Error("randomPending should be cleared");
      }
      if (link.getAttribute("aria-busy") !== null) {
        throw new Error("aria-busy should be cleared");
      }
    });

    test.skip("ignores click when randomPending is already true", async () => {
      globalThis.document = {
        createElement: (tagName: string) => {
          if (tagName === "a") {
            return {
              href: "",
              dataset: {} as Record<string, string>,
              getAttribute: () => null,
              setAttribute: () => {},
            };
          }
          return { style: {} };
        },
      } as unknown as Document;

      const link = document.createElement("a");
      link.href = "/random";
      link.dataset.randomPending = "true";

      let fetchCalled = false;
      globalThis.fetch = async () => {
        fetchCalled = true;
        return { ok: true, text: async () => "", url: "" } as unknown as Response;
      };

      globalThis.document = { createElement: () => ({ style: {} }) } as unknown as Document;

      const event = new Event("click");
      Object.defineProperty(event, "currentTarget", {
        value: link,
      });

      (globalThis as unknown as { ZEN_LOGIC: typeof mockZenLogic }).ZEN_LOGIC = mockZenLogic;

      await handleRandomItemClick(event);

      if (fetchCalled) {
        throw new Error("Should not fetch when randomPending is true");
      }
    });
  });
});
