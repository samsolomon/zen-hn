import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { addUserSubnav, runUserSubnavWhenReady, restyleUserListPage, addFilterButtons, restyleChangePwPage, restyleListsPage } from "../src/pages";

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

describe("restyleChangePwPage", () => {
  test("returns false when not on /changepw", () => {
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
        },
      },
      configurable: true,
    });

    const result = restyleChangePwPage();
    assert.equal(result, false);
    // getElementById should not be called when not on /changepw
    assert.equal(mockDocument.getElementById.mock.callCount(), 0);
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
          pathname: "/changepw",
        },
      },
      configurable: true,
    });

    const result = restyleChangePwPage();
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
          pathname: "/changepw",
        },
      },
      configurable: true,
    });

    const result = restyleChangePwPage();
    assert.equal(result, false);
  });

  test("returns false when no form found", () => {
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
          pathname: "/changepw",
        },
      },
      configurable: true,
    });

    const result = restyleChangePwPage();
    assert.equal(result, false);
  });

  test("returns true and creates styled form when form exists", () => {
    const mockForm = {
      action: "https://news.ycombinator.com/changepw",
      querySelector: mock.fn((selector: string) => {
        if (selector === 'input[name="oldpw"]') {
          return { value: "" };
        }
        if (selector === 'input[name="pw"]') {
          return { value: "" };
        }
        return null;
      }),
    };

    const mockHnMain = {
      dataset: {} as Record<string, string>,
      querySelector: mock.fn((selector: string) => {
        if (selector === "form") return mockForm;
        return null;
      }),
    };

    const mockZenHnMain = {
      appendChild: mock.fn(),
    };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: mock.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        className: "",
        id: "",
        htmlFor: "",
        type: "",
        name: "",
        value: "",
        autocomplete: "",
        required: false,
        textContent: "",
        method: "",
        action: "",
        appendChild: mock.fn(),
      })),
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
          pathname: "/changepw",
        },
      },
      configurable: true,
    });

    const result = restyleChangePwPage();
    assert.equal(result, true);
    assert.equal(mockHnMain.dataset.zenHnRestyled, "true");
    assert.equal(mockZenHnMain.appendChild.mock.callCount(), 1);
  });
});

describe("restyleListsPage", () => {
  test("returns false when not on /lists", () => {
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
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, false);
    // getElementById should not be called when not on /lists
    assert.equal(mockDocument.getElementById.mock.callCount(), 0);
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, false);
  });

  test("returns false when no bigbox table found", () => {
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, false);
  });

  test("returns true and creates styled list when bigbox table exists", () => {
    const mockRow = {
      querySelectorAll: mock.fn(() => [
        {
          querySelector: mock.fn(() => ({
            href: "/newest",
            textContent: "Newest",
          })),
        },
        {
          innerHTML: "Most recent submissions",
        },
      ]),
    };

    const mockBigboxTable = {
      querySelectorAll: mock.fn(() => [mockRow]),
    };

    const mockHnMain = {
      dataset: {} as Record<string, string>,
      querySelector: mock.fn((selector: string) => {
        if (selector === "#bigbox table") return mockBigboxTable;
        return null;
      }),
    };

    const mockZenHnMain = {
      appendChild: mock.fn(),
    };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: mock.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        className: "",
        href: "",
        textContent: "",
        innerHTML: "",
        appendChild: mock.fn(),
        addEventListener: mock.fn(),
      })),
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, true);
    assert.equal(mockHnMain.dataset.zenHnRestyled, "true");
    assert.equal(mockZenHnMain.appendChild.mock.callCount(), 1);
  });

  test("skips rows without enough cells", () => {
    const mockRowWithOneCell = {
      querySelectorAll: mock.fn(() => [
        { querySelector: mock.fn(() => null) },
      ]),
    };

    const mockBigboxTable = {
      querySelectorAll: mock.fn(() => [mockRowWithOneCell]),
    };

    const mockHnMain = {
      dataset: {} as Record<string, string>,
      querySelector: mock.fn((selector: string) => {
        if (selector === "#bigbox table") return mockBigboxTable;
        return null;
      }),
    };

    const mockZenHnMain = {
      appendChild: mock.fn(),
    };

    const createElementMock = mock.fn((tag: string) => ({
      tagName: tag.toUpperCase(),
      className: "",
      href: "",
      textContent: "",
      innerHTML: "",
      appendChild: mock.fn(),
      addEventListener: mock.fn(),
    }));

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: createElementMock,
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, true);
    // The function creates li elements for built-in nav items (Random, New, New comments, Ask, Show, Jobs)
    // even when table rows are skipped, so we expect 6 li elements from the nav items
    const liCalls = createElementMock.mock.calls.filter(
      (c: { arguments: [string] }) => c.arguments[0] === "li"
    );
    assert.equal(liCalls.length, 6, "Should create li elements for built-in nav items only");
  });

  test("skips rows without a link in the first cell", () => {
    const mockRowWithNoLink = {
      querySelectorAll: mock.fn(() => [
        { querySelector: mock.fn(() => null) }, // No link
        { innerHTML: "Some description" },
      ]),
    };

    const mockBigboxTable = {
      querySelectorAll: mock.fn(() => [mockRowWithNoLink]),
    };

    const mockHnMain = {
      dataset: {} as Record<string, string>,
      querySelector: mock.fn((selector: string) => {
        if (selector === "#bigbox table") return mockBigboxTable;
        return null;
      }),
    };

    const mockZenHnMain = {
      appendChild: mock.fn(),
    };

    const createElementMock = mock.fn((tag: string) => ({
      tagName: tag.toUpperCase(),
      className: "",
      href: "",
      textContent: "",
      innerHTML: "",
      appendChild: mock.fn(),
      addEventListener: mock.fn(),
    }));

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: createElementMock,
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, true);
    // The function creates li elements for built-in nav items (Random, New, New comments, Ask, Show, Jobs)
    // even when table rows have no links, so we expect 6 li elements from the nav items
    const liCalls = createElementMock.mock.calls.filter(
      (c: { arguments: [string] }) => c.arguments[0] === "li"
    );
    assert.equal(liCalls.length, 6, "Should create li elements for built-in nav items only");
  });

  test("sorts list items alphabetically by label", () => {
    // Create rows with items that would be out of order if not sorted
    const mockRows = [
      {
        querySelectorAll: mock.fn(() => [
          {
            querySelector: mock.fn(() => ({
              href: "/best",
              textContent: "best",
            })),
          },
          { innerHTML: "Best stories" },
        ]),
      },
      {
        querySelectorAll: mock.fn(() => [
          {
            querySelector: mock.fn(() => ({
              href: "/active",
              textContent: "active",
            })),
          },
          { innerHTML: "Active discussions" },
        ]),
      },
      {
        querySelectorAll: mock.fn(() => [
          {
            querySelector: mock.fn(() => ({
              href: "/classic",
              textContent: "classic",
            })),
          },
          { innerHTML: "Classic stories" },
        ]),
      },
    ];

    const mockBigboxTable = {
      querySelectorAll: mock.fn(() => mockRows),
    };

    const mockHnMain = {
      dataset: {} as Record<string, string>,
      querySelector: mock.fn((selector: string) => {
        if (selector === "#bigbox table") return mockBigboxTable;
        return null;
      }),
    };

    const mockZenHnMain = {
      appendChild: mock.fn(),
    };

    // Track the order of link text content assignments
    const linkTextOrder: string[] = [];

    const createElementMock = mock.fn((tag: string) => {
      const element = {
        tagName: tag.toUpperCase(),
        className: "",
        href: "",
        _textContent: "",
        innerHTML: "",
        appendChild: mock.fn(),
        addEventListener: mock.fn(),
        get textContent() {
          return this._textContent;
        },
        set textContent(value: string) {
          this._textContent = value;
          // Track when link text is set (for sorting verification)
          if (tag === "a" && value) {
            linkTextOrder.push(value);
          }
        },
      };
      return element;
    });

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: createElementMock,
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, true);

    // Filter out any empty strings and verify alphabetical order
    const sortedLinks = linkTextOrder.filter(t => t.length > 0);

    // The items should be sorted alphabetically
    // Note: The function also adds nav items and Random, so we check relative order
    // of the items we added: Active, Ask, Best, Classic, etc.
    const activeIndex = sortedLinks.indexOf("Active");
    const askIndex = sortedLinks.indexOf("Ask");
    const bestIndex = sortedLinks.indexOf("Best");
    const classicIndex = sortedLinks.indexOf("Classic");

    // Active should come before Ask, Ask before Best, Best before Classic
    assert.ok(activeIndex < askIndex, "Active should come before Ask");
    assert.ok(askIndex < bestIndex, "Ask should come before Best");
    assert.ok(bestIndex < classicIndex, "Best should come before Classic");
  });

  test("skips topcolors item", () => {
    const mockRows = [
      {
        querySelectorAll: mock.fn(() => [
          {
            querySelector: mock.fn(() => ({
              href: "/topcolors",
              textContent: "topcolors",
            })),
          },
          { innerHTML: "Top colors" },
        ]),
      },
      {
        querySelectorAll: mock.fn(() => [
          {
            querySelector: mock.fn(() => ({
              href: "/best",
              textContent: "best",
            })),
          },
          { innerHTML: "Best stories" },
        ]),
      },
    ];

    const mockBigboxTable = {
      querySelectorAll: mock.fn(() => mockRows),
    };

    const mockHnMain = {
      dataset: {} as Record<string, string>,
      querySelector: mock.fn((selector: string) => {
        if (selector === "#bigbox table") return mockBigboxTable;
        return null;
      }),
    };

    const mockZenHnMain = {
      appendChild: mock.fn(),
    };

    const linkTexts: string[] = [];
    const createElementMock = mock.fn((tag: string) => {
      const element = {
        tagName: tag.toUpperCase(),
        className: "",
        href: "",
        _textContent: "",
        innerHTML: "",
        appendChild: mock.fn(),
        addEventListener: mock.fn(),
        get textContent() {
          return this._textContent;
        },
        set textContent(value: string) {
          this._textContent = value;
          if (tag === "a" && value) {
            linkTexts.push(value);
          }
        },
      };
      return element;
    });

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "hnmain") return mockHnMain;
        if (id === "zen-hn-main") return mockZenHnMain;
        return null;
      }),
      createElement: createElementMock,
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
          pathname: "/lists",
        },
      },
      configurable: true,
    });

    const result = restyleListsPage();
    assert.equal(result, true);

    // Topcolors should not appear in the link texts
    const hasTopcolors = linkTexts.some(t => t.toLowerCase().includes("topcolor"));
    assert.equal(hasTopcolors, false, "Topcolors should be skipped");

    // Best should be present
    const hasBest = linkTexts.some(t => t === "Best");
    assert.equal(hasBest, true, "Best should be present");
  });
});
