import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { findCommentContext, restyleComments, CommentContext } from "../src/restyleComments";

describe("findCommentContext", () => {
  test("returns mode 'table' for /threads pages with comment rows", () => {
    // Mock a comment row that passes the filter in getCommentRows
    const mockCommentRow = {
      classList: {
        contains: (cls: string) => cls === "athing" || cls === "comtr",
      },
      querySelector: (selector: string) => {
        if (selector === ".comment .commtext") return {};
        return null;
      },
    };

    // Create array-like NodeList mock
    const mockNodeList = Object.assign([mockCommentRow], {
      item: (i: number) => [mockCommentRow][i],
      forEach: Array.prototype.forEach,
    });

    const mockHnMain = {
      querySelectorAll: (selector: string) => {
        // getCommentRows queries for "tr.athing"
        if (selector === "tr.athing") {
          return mockNodeList;
        }
        return Object.assign([], { item: () => null, forEach: Array.prototype.forEach });
      },
    };

    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === "table.comment-tree") return null;
        if (selector === "tr#bigbox table") return null;
        if (selector === "table#hnmain") return mockHnMain;
        if (selector === "tr#bigbox") return null;
        return null;
      }),
      querySelectorAll: mock.fn((selector: string) => {
        if (selector === "table.itemlist") {
          return Object.assign([], { item: () => null, forEach: Array.prototype.forEach });
        }
        return Object.assign([], { item: () => null, forEach: Array.prototype.forEach });
      }),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/threads",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const context = findCommentContext();
    assert.notEqual(context, null);
    assert.equal(context?.mode, "table");
    assert.equal(context?.root, mockHnMain);
  });

  test("returns mode 'rows' for non-threads pages with hnmain comments", () => {
    const mockCommentRow = {
      classList: {
        contains: (cls: string) => cls === "athing" || cls === "comtr",
      },
      querySelector: (selector: string) => {
        if (selector === ".comment .commtext") return {};
        return null;
      },
    };

    const mockNodeList = Object.assign([mockCommentRow], {
      item: (i: number) => [mockCommentRow][i],
      forEach: Array.prototype.forEach,
    });

    const mockHnMain = {
      querySelectorAll: (selector: string) => {
        if (selector === "tr.athing") {
          return mockNodeList;
        }
        return Object.assign([], { item: () => null, forEach: Array.prototype.forEach });
      },
    };

    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === "table.comment-tree") return null;
        if (selector === "tr#bigbox table") return null;
        if (selector === "table#hnmain") return mockHnMain;
        if (selector === "tr#bigbox") return null;
        return null;
      }),
      querySelectorAll: mock.fn((selector: string) => {
        if (selector === "table.itemlist") {
          return Object.assign([], { item: () => null, forEach: Array.prototype.forEach });
        }
        return Object.assign([], { item: () => null, forEach: Array.prototype.forEach });
      }),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/item",
          search: "?id=12345",
        },
      },
      configurable: true,
    });

    const context = findCommentContext();
    assert.notEqual(context, null);
    assert.equal(context?.mode, "rows");
  });

  test("returns mode 'table' for comment-tree", () => {
    const mockCommentTree = { id: "comment-tree" };

    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === "table.comment-tree") return mockCommentTree;
        return null;
      }),
      querySelectorAll: mock.fn(() => []),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/item",
          search: "?id=12345",
        },
      },
      configurable: true,
    });

    const context = findCommentContext();
    assert.notEqual(context, null);
    assert.equal(context?.mode, "table");
    assert.equal(context?.root, mockCommentTree);
  });

  test("returns null when no comment context found", () => {
    const mockDocument = {
      querySelector: mock.fn(() => null),
      querySelectorAll: mock.fn(() => []),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/",
          search: "",
        },
      },
      configurable: true,
    });

    const context = findCommentContext();
    assert.equal(context, null);
  });
});

describe("restyleComments", () => {
  test("returns early for null context", () => {
    const mockDocument = {
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn(),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    // Should not throw
    assert.doesNotThrow(() => restyleComments(null));
    // createElement should not be called since we return early
    assert.equal(mockDocument.createElement.mock.callCount(), 0);
  });

  test("returns early when already restyled", () => {
    const mockDocument = {
      documentElement: {
        dataset: { zenHnRestyled: "true" } as DOMStringMap,
      },
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn(),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    const context: CommentContext = {
      root: {} as Element,
      mode: "table",
    };

    assert.doesNotThrow(() => restyleComments(context));
    assert.equal(mockDocument.createElement.mock.callCount(), 0);
  });

  test("hides center wrapper in table mode", () => {
    const centerWrapperStyle = { display: "" };
    const rootStyle = { display: "" };

    const mockCenterWrapper = {
      style: centerWrapperStyle,
    };

    const mockRoot = {
      style: rootStyle,
      closest: mock.fn((selector: string) => {
        if (selector === "center") return mockCenterWrapper;
        return null;
      }),
      querySelectorAll: mock.fn(() => []),
      querySelector: mock.fn(() => null),
    };

    const mockCommentRow = {
      classList: {
        contains: (cls: string) => cls === "athing" || cls === "comtr",
      },
      querySelector: (selector: string) => {
        if (selector === ".commtext") return { textContent: "test comment" };
        if (selector === ".age a") return { getAttribute: () => "1 hour ago" };
        if (selector === ".hnuser") return { textContent: "testuser" };
        return null;
      },
      querySelectorAll: mock.fn(() => []),
      dataset: {},
      id: "123",
    } as unknown as HTMLTableRowElement;

    const mockZenHnMain = {
      appendChild: mock.fn(),
    };

    const mockContainer = {
      id: "",
      appendChild: mock.fn(),
    };

    const mockDocument = {
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      querySelectorAll: mock.fn((selector: string) => {
        if (selector === "#hn-comment-list") return [];
        return [];
      }),
      createElement: mock.fn(() => mockContainer),
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    const context: CommentContext = {
      root: mockRoot as unknown as Element,
      mode: "table",
      rows: [mockCommentRow],
    };

    restyleComments(context);

    // Verify center wrapper was hidden
    assert.equal(centerWrapperStyle.display, "none");
    // Verify root was also hidden
    assert.equal(rootStyle.display, "none");
  });
});
