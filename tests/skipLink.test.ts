import { test, describe, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createSkipLink } from "../src/skipLink";

describe("createSkipLink", () => {
  let originalDocument: typeof document;
  let addEventListenerMock: ReturnType<typeof mock.fn>;

  beforeEach(() => {
    originalDocument = globalThis.document;
    addEventListenerMock = mock.fn();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
  });

  test("creates skip link element as first child of body", () => {
    const insertBeforeMock = mock.fn();
    const firstChild = { id: "first-child" };
    const createdElement = {
      href: "",
      className: "",
      textContent: "",
      addEventListener: mock.fn(),
    };

    const mockDocument = {
      body: {
        insertBefore: insertBeforeMock,
        firstChild,
      },
      createElement: mock.fn(() => createdElement),
      addEventListener: addEventListenerMock,
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createSkipLink();

    assert.equal(mockDocument.createElement.mock.callCount(), 1);
    assert.deepEqual(mockDocument.createElement.mock.calls[0].arguments, ["a"]);
    assert.equal(insertBeforeMock.mock.callCount(), 1);
    assert.deepEqual(insertBeforeMock.mock.calls[0].arguments, [createdElement, firstChild]);
  });

  test("waits for DOMContentLoaded if body doesn't exist", () => {
    const createdElement = {
      href: "",
      className: "",
      textContent: "",
      addEventListener: mock.fn(),
    };

    const mockDocument = {
      body: null,
      createElement: mock.fn(() => createdElement),
      addEventListener: addEventListenerMock,
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createSkipLink();

    assert.equal(addEventListenerMock.mock.callCount(), 1);
    assert.equal(addEventListenerMock.mock.calls[0].arguments[0], "DOMContentLoaded");
    assert.equal(typeof addEventListenerMock.mock.calls[0].arguments[1], "function");
  });

  test("skip link has correct class and text content", () => {
    const createdElement = {
      href: "",
      className: "",
      textContent: "",
      addEventListener: mock.fn(),
    };

    const mockDocument = {
      body: {
        insertBefore: mock.fn(),
        firstChild: null,
      },
      createElement: mock.fn(() => createdElement),
      addEventListener: addEventListenerMock,
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createSkipLink();

    assert.equal(createdElement.href, "#zen-hn-main");
    assert.equal(createdElement.className, "zen-hn-skip-link");
    assert.equal(createdElement.textContent, "Skip to content");
  });

  test("click handler focuses main element", () => {
    const focusMock = mock.fn();
    const scrollIntoViewMock = mock.fn();
    const mainElement = {
      tabIndex: 0,
      focus: focusMock,
      scrollIntoView: scrollIntoViewMock,
    };

    let clickHandler: ((e: { preventDefault: () => void }) => void) | null = null;
    const createdElement = {
      href: "",
      className: "",
      textContent: "",
      addEventListener: mock.fn((event: string, handler: (e: { preventDefault: () => void }) => void) => {
        if (event === "click") {
          clickHandler = handler;
        }
      }),
    };

    const mockDocument = {
      body: {
        insertBefore: mock.fn(),
        firstChild: null,
      },
      createElement: mock.fn(() => createdElement),
      addEventListener: addEventListenerMock,
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-main") {
          return mainElement;
        }
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createSkipLink();

    assert.ok(clickHandler, "Click handler should be registered");
    const preventDefaultMock = mock.fn();
    clickHandler!({ preventDefault: preventDefaultMock });

    assert.equal(preventDefaultMock.mock.callCount(), 1);
    assert.equal(focusMock.mock.callCount(), 1);
  });

  test("click handler sets tabIndex on main", () => {
    const mainElement = {
      tabIndex: 0,
      focus: mock.fn(),
      scrollIntoView: mock.fn(),
    };

    let clickHandler: ((e: { preventDefault: () => void }) => void) | null = null;
    const createdElement = {
      href: "",
      className: "",
      textContent: "",
      addEventListener: mock.fn((event: string, handler: (e: { preventDefault: () => void }) => void) => {
        if (event === "click") {
          clickHandler = handler;
        }
      }),
    };

    const mockDocument = {
      body: {
        insertBefore: mock.fn(),
        firstChild: null,
      },
      createElement: mock.fn(() => createdElement),
      addEventListener: addEventListenerMock,
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-main") {
          return mainElement;
        }
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createSkipLink();

    assert.ok(clickHandler, "Click handler should be registered");
    clickHandler!({ preventDefault: mock.fn() });

    assert.equal(mainElement.tabIndex, -1);
  });

  test("click handler scrolls main into view", () => {
    const scrollIntoViewMock = mock.fn();
    const mainElement = {
      tabIndex: 0,
      focus: mock.fn(),
      scrollIntoView: scrollIntoViewMock,
    };

    let clickHandler: ((e: { preventDefault: () => void }) => void) | null = null;
    const createdElement = {
      href: "",
      className: "",
      textContent: "",
      addEventListener: mock.fn((event: string, handler: (e: { preventDefault: () => void }) => void) => {
        if (event === "click") {
          clickHandler = handler;
        }
      }),
    };

    const mockDocument = {
      body: {
        insertBefore: mock.fn(),
        firstChild: null,
      },
      createElement: mock.fn(() => createdElement),
      addEventListener: addEventListenerMock,
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-main") {
          return mainElement;
        }
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createSkipLink();

    assert.ok(clickHandler, "Click handler should be registered");
    clickHandler!({ preventDefault: mock.fn() });

    assert.equal(scrollIntoViewMock.mock.callCount(), 1);
  });

  test("click handler does nothing when main element not found", () => {
    let clickHandler: ((e: { preventDefault: () => void }) => void) | null = null;
    const createdElement = {
      href: "",
      className: "",
      textContent: "",
      addEventListener: mock.fn((event: string, handler: (e: { preventDefault: () => void }) => void) => {
        if (event === "click") {
          clickHandler = handler;
        }
      }),
    };

    const mockDocument = {
      body: {
        insertBefore: mock.fn(),
        firstChild: null,
      },
      createElement: mock.fn(() => createdElement),
      addEventListener: addEventListenerMock,
      getElementById: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createSkipLink();

    assert.ok(clickHandler, "Click handler should be registered");
    const preventDefaultMock = mock.fn();
    // Should not throw when main element not found
    assert.doesNotThrow(() => {
      clickHandler!({ preventDefault: preventDefaultMock });
    });
    assert.equal(preventDefaultMock.mock.callCount(), 1);
  });
});
