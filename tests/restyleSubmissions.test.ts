import { test, describe, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

function createMockDocument() {
  return {
    querySelector: mock.fn(() => null),
    querySelectorAll: mock.fn(() => []),
    createElement: mock.fn((_tag: string) => {
      return {
        className: "",
        classList: { add: mock.fn(), contains: mock.fn(() => false), toggle: mock.fn() },
        setAttribute: mock.fn(),
        appendChild: mock.fn(),
        getAttribute: mock.fn(() => ""),
        querySelector: mock.fn(() => null),
        querySelectorAll: mock.fn(() => []),
        dataset: {},
        style: { display: "" },
        textContent: "",
        innerHTML: "",
        addEventListener: mock.fn(),
        cloneNode: mock.fn(() => ({ classList: { add: mock.fn() } })),
        remove: mock.fn(),
      } as unknown as HTMLElement;
    }),
    addEventListener: mock.fn(),
    documentElement: {
      dataset: {},
      getAttribute: mock.fn(() => ""),
    },
  };
}

function setupGlobalMocks(mockDocument: ReturnType<typeof createMockDocument>) {
  Object.defineProperty(globalThis, "document", {
    value: mockDocument,
    configurable: true,
  });

  Object.defineProperty(globalThis, "location", {
    value: { href: "https://news.ycombinator.com/", pathname: "/" },
    configurable: true,
  });

  Object.defineProperty(globalThis, "fetch", {
    value: mock.fn(() => Promise.resolve({ ok: true })),
    configurable: true,
  });

  Object.defineProperty(globalThis, "setTimeout", {
    value: mock.fn(() => 1),
    configurable: true,
  });

  Object.defineProperty(globalThis, "clearTimeout", {
    value: mock.fn(),
    configurable: true,
  });

  Object.defineProperty(globalThis, "navigator", {
    value: { clipboard: { writeText: mock.fn(() => Promise.resolve(true)) } },
    configurable: true,
  });

  Object.defineProperty(globalThis, "ZenHnLogic", {
    value: {
      isUserProfilePage: mock.fn(() => false),
      getVoteState: mock.fn(() => ({ isUpvoted: false, isDownvoted: false })),
      resolveVoteItemId: mock.fn(() => ""),
      buildVoteHref: mock.fn(() => ""),
      buildMenuItems: mock.fn(() => []),
      resolveSubmissionCopyHref: mock.fn(() => ""),
      toggleFavoriteState: mock.fn((v: boolean) => !v),
      willFavoriteFromHref: mock.fn(() => false),
      buildNextFavoriteHref: mock.fn(() => ""),
      addSubmissionClickHandler: mock.fn(),
    },
    configurable: true,
  });

  Object.defineProperty(globalThis, "ZenHnUtils", {
    value: {
      stripParenTextNodes: mock.fn(),
      copyTextToClipboard: mock.fn(() => Promise.resolve(true)),
      toSentenceCase: mock.fn((s: string) => s),
    },
    configurable: true,
  });

  Object.defineProperty(globalThis, "ZenHnIcons", {
    value: {
      renderIcon: mock.fn(() => "<svg></svg>"),
    },
    configurable: true,
  });

  Object.defineProperty(globalThis, "ZenHnSubmissionMenu", {
    value: {
      SUBMISSION_MENU_CLASS: "hn-submission-menu",
      SUBMISSION_MENU_OPEN_CLASS: "is-open",
      setSubmissionMenuState: mock.fn(),
      closeAllSubmissionMenus: mock.fn(),
      registerSubmissionMenuListeners: mock.fn(),
    },
    configurable: true,
  });

  Object.defineProperty(globalThis, "ZenHnFavorites", {
    value: {
      resolveStoryFavoriteLink: mock.fn(() => Promise.resolve({ href: "" })),
    },
    configurable: true,
  });

  Object.defineProperty(globalThis, "ZenHnActionStore", {
    value: {
      getStoredAction: mock.fn(() => null),
      updateStoredAction: mock.fn(),
    },
    configurable: true,
  });

  Object.defineProperty(globalThis, "ZenHnMain", {
    value: {
      getOrCreateZenHnMain: mock.fn(() => ({
        appendChild: mock.fn(),
      }) as unknown as HTMLElement),
    },
    configurable: true,
  });
}

describe("getStoryRows", () => {
  let mockDocument: ReturnType<typeof createMockDocument>;

  beforeEach(() => {
    mockDocument = createMockDocument();
    setupGlobalMocks(mockDocument);
  });

  test("returns empty array for null root", async () => {
    const { getStoryRows } = await import("../src/restyleSubmissions");
    const result = getStoryRows(null);
    assert.deepStrictEqual(result, []);
  });

  test("returns empty array when no athing rows found", async () => {
    const root = { querySelectorAll: mock.fn(() => []) } as unknown as HTMLElement;
    const { getStoryRows } = await import("../src/restyleSubmissions");
    const result = getStoryRows(root);
    assert.deepStrictEqual(result, []);
  });

  test("filters out comment rows", async () => {
    const rows = [
      { classList: { contains: () => false }, querySelector: () => null },
      { classList: { contains: () => true }, querySelector: () => null },
      { classList: { contains: () => false }, querySelector: () => null },
    ];
    const root = { querySelectorAll: mock.fn(() => rows as unknown as NodeListOf<HTMLElement>) } as unknown as HTMLElement;
    const { getStoryRows } = await import("../src/restyleSubmissions");
    const result = getStoryRows(root);
    assert.strictEqual(result.length, 2);
  });

  test("filters out rows with comment text", async () => {
    const rows = [
      { classList: { contains: () => false }, querySelector: () => null },
      { classList: { contains: () => false }, querySelector: () => ({ classList: { contains: () => true } }) },
    ];
    const root = { querySelectorAll: mock.fn(() => rows as unknown as NodeListOf<HTMLElement>) } as unknown as HTMLElement;
    const { getStoryRows } = await import("../src/restyleSubmissions");
    const result = getStoryRows(root);
    assert.strictEqual(result.length, 1);
  });
});

describe("restyleSubmissions", () => {
  let mockDocument: ReturnType<typeof createMockDocument>;

  beforeEach(() => {
    mockDocument = createMockDocument();
    setupGlobalMocks(mockDocument);
  });

  test("returns early when no source table found", async () => {
    mockDocument.querySelector = mock.fn((selector: string) => {
      if (selector === "table.itemlist" || selector === "tr#bigbox table") return null;
      if (selector === "table.comment-tree") return null;
      return null;
    });

    const { restyleSubmissions } = await import("../src/restyleSubmissions");
    restyleSubmissions();

    assert.strictEqual(mockDocument.createElement.mock.calls.length, 0);
  });

  test("returns early when already restyled", async () => {
    const mockTable = {
      dataset: { zenHnSubmissions: "true" },
      querySelectorAll: mock.fn(() => []),
      querySelector: mock.fn(() => null),
      style: { display: "" },
    };
    mockDocument.querySelector = mock.fn((selector: string) => {
      if (selector === "table.itemlist") return mockTable as unknown as Element;
      if (selector === "table.comment-tree") return null;
      return null;
    });

    const { restyleSubmissions } = await import("../src/restyleSubmissions");
    restyleSubmissions();

    assert.strictEqual(mockDocument.createElement.mock.calls.length, 0);
  });

  test("returns early when comment tree present", async () => {
    mockDocument.querySelector = mock.fn((selector: string) => {
      if (selector === "table.itemlist") return { dataset: {} } as unknown as Element;
      if (selector === "table.comment-tree") return {} as Element;
      return null;
    });

    const { restyleSubmissions } = await import("../src/restyleSubmissions");
    restyleSubmissions();

    assert.strictEqual(mockDocument.createElement.mock.calls.length, 0);
  });

  test("returns early when no story rows found", async () => {
    const mockTable = {
      dataset: {},
      querySelectorAll: mock.fn(() => []),
      querySelector: mock.fn(() => null),
      style: { display: "" },
    };
    mockDocument.querySelector = mock.fn((selector: string) => {
      if (selector === "table.itemlist") return mockTable as unknown as Element;
      if (selector === "table.comment-tree") return null;
      return null;
    });

    const { restyleSubmissions } = await import("../src/restyleSubmissions");
    restyleSubmissions();

    assert.strictEqual(mockDocument.createElement.mock.calls.length, 0);
    assert.strictEqual(mockTable.style.display, "");
  });
});
