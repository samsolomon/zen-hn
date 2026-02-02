import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { buildSidebarNavigation, runSidebarWhenReady } from "../src/sidebar";

describe("buildSidebarNavigation", () => {
  test("returns false when extension is disabled", () => {
    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-sidebar") {
          return {} as Element;
        }
        return null;
      }),
      documentElement: {
        dataset: { zenHnEnabled: "false" } as DOMStringMap,
      },
      querySelectorAll: mock.fn(() => []),
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    const result = buildSidebarNavigation();
    assert.equal(result, false);
  });

  test("returns true if sidebar already exists", () => {
    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-sidebar") {
          return {} as Element;
        }
        return null;
      }),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      querySelectorAll: mock.fn(() => []),
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    const result = buildSidebarNavigation();
    assert.equal(result, true);
  });

  test("returns false when no hnmain and no pagetops", () => {
    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-sidebar") return null;
        if (id === "hnmain") return null;
        return null;
      }),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      querySelectorAll: mock.fn(() => []),
      querySelector: mock.fn(() => null),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    const result = buildSidebarNavigation();
    assert.equal(result, false);
  });
});

describe("runSidebarWhenReady", () => {
  test("returns early when extension is disabled", () => {
    const rafMock = mock.fn((_cb: FrameRequestCallback) => 0);
    const mockDocument = {
      getElementById: mock.fn((_id: string) => null),
      documentElement: {
        dataset: { zenHnEnabled: "false" } as DOMStringMap,
      },
      querySelectorAll: mock.fn(() => []),
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

    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/" },
      configurable: true,
    });

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: rafMock,
      configurable: true,
    });

    runSidebarWhenReady();
    // requestAnimationFrame should not be called when disabled
    assert.equal(rafMock.mock.callCount(), 0);
  });

  test("does not throw when called", () => {
    const mockDocument = {
      getElementById: mock.fn((_id: string) => null),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      querySelectorAll: mock.fn(() => []),
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

    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/" },
      configurable: true,
    });

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: mock.fn((cb: FrameRequestCallback) => {}),
      configurable: true,
    });

    assert.doesNotThrow(() => runSidebarWhenReady());
  });
});

describe("IconLinkConfig interface", () => {
  test("allows optional href for action links", () => {
    const randomLink = {
      icon: "dice-two" as const,
      label: "Random",
      action: "random" as const,
    };
    assert.equal(randomLink.action, "random");
    assert.equal(randomLink.icon, "dice-two");
  });
});

describe("sidebar tab order insertion", () => {
  test("sidebar is inserted after skip link when skip link exists", () => {
    const insertAdjacentElementMock = mock.fn();
    const skipLinkElement = {
      insertAdjacentElement: insertAdjacentElementMock,
    };
    const insertBeforeMock = mock.fn();
    const appendChildMock = mock.fn();
    const setAttributeMock = mock.fn();

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-sidebar") return null;
        if (id === "hnmain") return {};
        return null;
      }),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      querySelectorAll: mock.fn((selector: string) => {
        if (selector === "span.pagetop") {
          return [{ closest: mock.fn(() => ({ style: { display: "" } })) }];
        }
        return [];
      }),
      querySelector: mock.fn((selector: string) => {
        if (selector === ".zen-hn-skip-link") {
          return skipLinkElement;
        }
        if (selector === 'span.pagetop a[href^="login"]') {
          return null;
        }
        if (selector === "a#me") {
          return null;
        }
        if (selector === "tr#pagespace") {
          return null;
        }
        return null;
      }),
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      body: {
        appendChild: appendChildMock,
        insertBefore: insertBeforeMock,
        firstChild: null,
      },
      createElement: mock.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        className: "",
        id: "",
        appendChild: mock.fn(),
        setAttribute: setAttributeMock,
        addEventListener: mock.fn(),
        innerHTML: "",
        href: "",
        childNodes: { length: 3 },
        style: { display: "" },
        classList: {
          add: mock.fn(),
          remove: mock.fn(),
          contains: mock.fn(() => false),
        },
      })),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/" },
      configurable: true,
    });

    const result = buildSidebarNavigation();

    assert.equal(result, true);
    // Should use insertAdjacentElement on skip link, not insertBefore on body
    assert.equal(insertAdjacentElementMock.mock.callCount(), 1);
    assert.equal(insertAdjacentElementMock.mock.calls[0].arguments[0], "afterend");
    assert.equal(insertBeforeMock.mock.callCount(), 0);
  });

  test("sidebar is inserted at start of body when no skip link", () => {
    const insertBeforeMock = mock.fn();
    const appendChildMock = mock.fn();
    const setAttributeMock = mock.fn();
    const firstChild = { id: "first-child" };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-sidebar") return null;
        if (id === "hnmain") return {};
        return null;
      }),
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      querySelectorAll: mock.fn((selector: string) => {
        if (selector === "span.pagetop") {
          return [{ closest: mock.fn(() => ({ style: { display: "" } })) }];
        }
        return [];
      }),
      querySelector: mock.fn((selector: string) => {
        if (selector === ".zen-hn-skip-link") {
          return null; // No skip link
        }
        if (selector === 'span.pagetop a[href^="login"]') {
          return null;
        }
        if (selector === "a#me") {
          return null;
        }
        if (selector === "tr#pagespace") {
          return null;
        }
        return null;
      }),
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      body: {
        appendChild: appendChildMock,
        insertBefore: insertBeforeMock,
        firstChild,
      },
      createElement: mock.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        className: "",
        id: "",
        appendChild: mock.fn(),
        setAttribute: setAttributeMock,
        addEventListener: mock.fn(),
        innerHTML: "",
        href: "",
        childNodes: { length: 3 },
        style: { display: "" },
        classList: {
          add: mock.fn(),
          remove: mock.fn(),
          contains: mock.fn(() => false),
        },
      })),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/" },
      configurable: true,
    });

    const result = buildSidebarNavigation();

    assert.equal(result, true);
    // Should use insertBefore on body with firstChild
    assert.equal(insertBeforeMock.mock.callCount(), 1);
    assert.equal(insertBeforeMock.mock.calls[0].arguments[1], firstChild);
  });
});
