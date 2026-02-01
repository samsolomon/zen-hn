import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { addUserSubnav, runUserSubnavWhenReady, restyleUserListPage, addFilterButtons } from "../src/pages";

describe("addUserSubnav", () => {
  test("returns false when extension is disabled", () => {
    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "false" } as DOMStringMap,
        setAttribute: mock.fn(),
      },
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/user",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = addUserSubnav();
    assert.equal(result, false);
    // Ensure no DOM modifications were attempted
    assert.equal(mockDocument.body.appendChild.mock.callCount(), 0);
  });

  test("returns false when not on a user subnav page", () => {
    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "true" } as DOMStringMap,
        setAttribute: mock.fn(),
      },
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/news",
          search: "",
        },
      },
      configurable: true,
    });

    const result = addUserSubnav();
    assert.equal(result, false);
  });

  test("returns false when subnav already exists", () => {
    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "true" } as DOMStringMap,
        setAttribute: mock.fn(),
      },
      querySelector: mock.fn((selector: string) => {
        if (selector === ".zen-hn-subnav") {
          return {} as Element;
        }
        return null;
      }),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/user",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = addUserSubnav();
    assert.equal(result, false);
  });

  test("returns false when no username in URL", () => {
    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "true" } as DOMStringMap,
        setAttribute: mock.fn(),
      },
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/user",
          search: "",
        },
      },
      configurable: true,
    });

    const result = addUserSubnav();
    assert.equal(result, false);
  });
});

describe("runUserSubnavWhenReady", () => {
  test("returns early when extension is disabled", () => {
    const rafMock = mock.fn((_cb: FrameRequestCallback) => 0);
    const setAttributeMock = mock.fn();
    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "false" } as DOMStringMap,
        setAttribute: setAttributeMock,
      },
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
      readyState: "complete",
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/user",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: rafMock,
      configurable: true,
    });

    runUserSubnavWhenReady();
    // requestAnimationFrame should not be called when disabled
    assert.equal(rafMock.mock.callCount(), 0);
    // setAttribute should not be called for loading state when disabled
    assert.equal(setAttributeMock.mock.callCount(), 0);
  });

  test("does not throw when called with extension enabled", () => {
    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "true" } as DOMStringMap,
        setAttribute: mock.fn(),
      },
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
      readyState: "complete",
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

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: mock.fn((_cb: FrameRequestCallback) => 0),
      configurable: true,
    });

    assert.doesNotThrow(() => runUserSubnavWhenReady());
  });
});

describe("restyleUserListPage", () => {
  test("returns false for /threads (handled by restyleComments instead)", () => {
    const mockDocument = {
      getElementById: mock.fn(() => null),
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

    const result = restyleUserListPage();
    assert.equal(result, false);
    // getElementById should not be called since /threads is not in USER_LIST_PAGES
    assert.equal(mockDocument.getElementById.mock.callCount(), 0);
  });

  test("returns false for non-user-list pages", () => {
    const mockDocument = {
      getElementById: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/news",
          search: "",
        },
      },
      configurable: true,
    });

    const result = restyleUserListPage();
    assert.equal(result, false);
  });

  test("returns false when hnmain not found", () => {
    const mockDocument = {
      getElementById: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/favorites",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = restyleUserListPage();
    assert.equal(result, false);
  });

  test("returns false when already restyled", () => {
    const mockHnMain = {
      dataset: { zenHnRestyled: "true" },
      querySelector: mock.fn(() => null),
    };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/favorites",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = restyleUserListPage();
    assert.equal(result, false);
  });

  test("returns false when no content table found", () => {
    const mockHnMain = {
      dataset: {},
      querySelector: mock.fn(() => null),
    };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/submitted",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = restyleUserListPage();
    assert.equal(result, false);
  });

  test("returns false for filter pages (handled by addFilterButtons)", () => {
    const mockDocument = {
      getElementById: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/favorites",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = restyleUserListPage();
    assert.equal(result, false);
    // getElementById should not be called since /favorites is a filter page
    assert.equal(mockDocument.getElementById.mock.callCount(), 0);
  });
});

describe("addFilterButtons", () => {
  test("returns false when not on a filter page", () => {
    const mockDocument = {
      querySelector: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/news",
          search: "",
        },
      },
      configurable: true,
    });

    const result = addFilterButtons();
    assert.equal(result, false);
  });

  test("returns false when not on /submitted (not a filter page)", () => {
    const mockDocument = {
      querySelector: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/submitted",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = addFilterButtons();
    assert.equal(result, false);
  });

  test("returns false when filter buttons already exist", () => {
    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === ".zen-hn-filter-buttons") {
          return {} as Element;
        }
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/favorites",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = addFilterButtons();
    assert.equal(result, false);
  });

  test("returns false when no username in URL", () => {
    const mockDocument = {
      querySelector: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/favorites",
          search: "",
        },
      },
      configurable: true,
    });

    const result = addFilterButtons();
    assert.equal(result, false);
  });

  test("returns true on /favorites with username", () => {
    const mockZenHnMain = {
      firstChild: null,
      insertBefore: mock.fn(),
    };

    const mockDocument = {
      querySelector: mock.fn(() => null),
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: mock.fn((tag: string) => {
        const element = {
          tagName: tag.toUpperCase(),
          className: "",
          href: "",
          textContent: "",
          classList: {
            add: mock.fn(),
          },
          setAttribute: mock.fn(),
          appendChild: mock.fn(),
        };
        return element;
      }),
      body: {},
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/favorites",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = addFilterButtons();
    assert.equal(result, true);
    assert.equal(mockZenHnMain.insertBefore.mock.callCount(), 1);
  });

  test("returns true on /upvoted with username", () => {
    const mockZenHnMain = {
      firstChild: null,
      insertBefore: mock.fn(),
    };

    const mockDocument = {
      querySelector: mock.fn(() => null),
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: mock.fn((tag: string) => {
        const element = {
          tagName: tag.toUpperCase(),
          className: "",
          href: "",
          textContent: "",
          classList: {
            add: mock.fn(),
          },
          setAttribute: mock.fn(),
          appendChild: mock.fn(),
        };
        return element;
      }),
      body: {},
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/upvoted",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = addFilterButtons();
    assert.equal(result, true);
  });

  test("returns true on /flagged with username", () => {
    const mockZenHnMain = {
      firstChild: null,
      insertBefore: mock.fn(),
    };

    const mockDocument = {
      querySelector: mock.fn(() => null),
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: mock.fn((tag: string) => {
        const element = {
          tagName: tag.toUpperCase(),
          className: "",
          href: "",
          textContent: "",
          classList: {
            add: mock.fn(),
          },
          setAttribute: mock.fn(),
          appendChild: mock.fn(),
        };
        return element;
      }),
      body: {},
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/flagged",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    const result = addFilterButtons();
    assert.equal(result, true);
  });
});

describe("subnav tab order", () => {
  test("subnav is inserted after sidebar for correct tab order", () => {
    const insertAdjacentElementMock = mock.fn();
    const insertBeforeMock = mock.fn();
    const sidebarElement = {
      insertAdjacentElement: insertAdjacentElementMock,
    };

    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "true" } as DOMStringMap,
        setAttribute: mock.fn(),
      },
      querySelector: mock.fn((selector: string) => {
        if (selector === ".zen-hn-subnav") {
          return null; // No subnav exists yet
        }
        return null;
      }),
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-sidebar") {
          return sidebarElement;
        }
        return null;
      }),
      createElement: mock.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        className: "",
        appendChild: mock.fn(),
        setAttribute: mock.fn(),
        querySelectorAll: mock.fn(() => []),
        classList: {
          add: mock.fn(),
          remove: mock.fn(),
          contains: mock.fn(() => false),
        },
      })),
      body: {
        appendChild: mock.fn(),
        insertBefore: insertBeforeMock,
        firstChild: null,
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/user",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: mock.fn(),
      configurable: true,
    });

    const result = addUserSubnav();

    assert.equal(result, true);
    // Should use insertAdjacentElement on sidebar
    assert.equal(insertAdjacentElementMock.mock.callCount(), 1);
    assert.equal(insertAdjacentElementMock.mock.calls[0].arguments[0], "afterend");
    // Should NOT use insertBefore on body
    assert.equal(insertBeforeMock.mock.callCount(), 0);
  });

  test("subnav falls back to body start when no sidebar", () => {
    const insertBeforeMock = mock.fn();
    const firstChild = { id: "first-child" };

    const mockDocument = {
      documentElement: {
        dataset: { zenHnEnabled: "true" } as DOMStringMap,
        setAttribute: mock.fn(),
      },
      querySelector: mock.fn((selector: string) => {
        if (selector === ".zen-hn-subnav") {
          return null;
        }
        return null;
      }),
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-sidebar") {
          return null; // No sidebar
        }
        return null;
      }),
      createElement: mock.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        className: "",
        appendChild: mock.fn(),
        setAttribute: mock.fn(),
        querySelectorAll: mock.fn(() => []),
        classList: {
          add: mock.fn(),
          remove: mock.fn(),
          contains: mock.fn(() => false),
        },
      })),
      body: {
        appendChild: mock.fn(),
        insertBefore: insertBeforeMock,
        firstChild,
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/user",
          search: "?id=testuser",
        },
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: mock.fn(),
      configurable: true,
    });

    const result = addUserSubnav();

    assert.equal(result, true);
    // Should use insertBefore on body with firstChild
    assert.equal(insertBeforeMock.mock.callCount(), 1);
    assert.equal(insertBeforeMock.mock.calls[0].arguments[1], firstChild);
  });
});
