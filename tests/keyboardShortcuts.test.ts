import { test, describe, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { registerKeyboardShortcuts, unregisterKeyboardShortcuts } from "../src/keyboardShortcuts";

describe("registerKeyboardShortcuts", () => {
  let originalDocument: typeof document;
  let originalWindow: typeof window;
  let originalSessionStorage: typeof sessionStorage;
  let keydownHandlers: ((e: KeyboardEvent) => void)[];

  beforeEach(() => {
    originalDocument = globalThis.document;
    originalWindow = globalThis.window;
    originalSessionStorage = globalThis.sessionStorage;
    keydownHandlers = [];

    const mockSessionStorage = {
      getItem: mock.fn(() => null),
      setItem: mock.fn(),
    };

    Object.defineProperty(globalThis, "sessionStorage", {
      value: mockSessionStorage,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      configurable: true,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      value: originalSessionStorage,
      configurable: true,
    });

    // Clean up registered shortcuts
    try {
      unregisterKeyboardShortcuts();
    } catch {
      // Ignore errors during cleanup
    }
  });

  function setupMockDocument(options: {
    activeElement?: { tagName: string; isContentEditable?: boolean };
    submissions?: HTMLElement[];
    comments?: HTMLElement[];
  } = {}) {
    const mockDocument = {
      activeElement: options.activeElement || null,
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      body: {
        appendChild: mock.fn(),
        contains: mock.fn(() => true),
      },
      addEventListener: mock.fn((event: string, handler: (e: KeyboardEvent) => void) => {
        if (event === "keydown") {
          keydownHandlers.push(handler);
        }
      }),
      removeEventListener: mock.fn((event: string, handler: (e: KeyboardEvent) => void) => {
        if (event === "keydown") {
          const index = keydownHandlers.indexOf(handler);
          if (index > -1) {
            keydownHandlers.splice(index, 1);
          }
        }
      }),
      getElementById: mock.fn(() => null),
      querySelector: mock.fn(() => null),
      querySelectorAll: mock.fn((selector: string) => {
        if (selector === ".hn-submission") {
          return options.submissions || [];
        }
        if (selector === ".hn-comment:not([hidden])") {
          return options.comments || [];
        }
        return [];
      }),
      createElement: mock.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        className: "",
        id: "",
        type: "",
        value: "",
        placeholder: "",
        textContent: "",
        innerHTML: "",
        style: { display: "" },
        classList: {
          add: mock.fn(),
          remove: mock.fn(),
          contains: mock.fn(() => false),
        },
        appendChild: mock.fn(),
        setAttribute: mock.fn(),
        addEventListener: mock.fn(),
        remove: mock.fn(),
        focus: mock.fn(),
        querySelectorAll: mock.fn(() => []),
      })),
      createTextNode: mock.fn((text: string) => ({
        nodeType: 3,
        textContent: text,
      })),
    };

    // Also set up requestAnimationFrame globally
    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: mock.fn((cb: FrameRequestCallback) => { cb(0); return 0; }),
      configurable: true,
    });

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/",
          href: "/",
        },
        matchMedia: mock.fn(() => ({
          matches: false,
        })),
      },
      configurable: true,
    });

    return mockDocument;
  }

  function dispatchKeydown(key: string, options: { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean; altKey?: boolean } = {}): boolean {
    const event = {
      key,
      shiftKey: options.shiftKey || false,
      metaKey: options.metaKey || false,
      ctrlKey: options.ctrlKey || false,
      altKey: options.altKey || false,
      preventDefault: mock.fn(),
    } as unknown as KeyboardEvent;

    for (const handler of keydownHandlers) {
      handler(event);
    }

    return (event.preventDefault as ReturnType<typeof mock.fn>).mock.callCount() > 0;
  }

  test("does not activate shortcuts when typing in input", () => {
    setupMockDocument({
      activeElement: { tagName: "INPUT" },
    });

    registerKeyboardShortcuts();

    // ArrowDown should not activate when typing in input
    const prevented = dispatchKeydown("ArrowDown");
    assert.equal(prevented, false, "ArrowDown should not be prevented when typing in input");
  });

  test("does not activate shortcuts when typing in textarea", () => {
    setupMockDocument({
      activeElement: { tagName: "TEXTAREA" },
    });

    registerKeyboardShortcuts();

    const prevented = dispatchKeydown("ArrowUp");
    assert.equal(prevented, false, "ArrowUp should not be prevented when typing in textarea");
  });

  test("does not activate shortcuts when typing in select", () => {
    setupMockDocument({
      activeElement: { tagName: "SELECT" },
    });

    registerKeyboardShortcuts();

    const prevented = dispatchKeydown("ArrowDown");
    assert.equal(prevented, false, "ArrowDown should not be prevented when in select");
  });

  test("does not activate shortcuts when in contenteditable", () => {
    setupMockDocument({
      activeElement: { tagName: "DIV", isContentEditable: true },
    });

    registerKeyboardShortcuts();

    const prevented = dispatchKeydown("ArrowDown");
    assert.equal(prevented, false, "ArrowDown should not be prevented when in contenteditable");
  });

  test("does not activate shortcuts when modifier keys are pressed", () => {
    setupMockDocument();
    registerKeyboardShortcuts();

    // Cmd+R for example should not be intercepted
    let prevented = dispatchKeydown("r", { metaKey: true });
    assert.equal(prevented, false, "Cmd+R should not be prevented");

    prevented = dispatchKeydown("r", { ctrlKey: true });
    assert.equal(prevented, false, "Ctrl+R should not be prevented");

    prevented = dispatchKeydown("r", { altKey: true });
    assert.equal(prevented, false, "Alt+R should not be prevented");
  });

  test("arrow keys navigate (ArrowDown/ArrowUp)", () => {
    const mockSubmission = {
      classList: {
        add: mock.fn(),
        remove: mock.fn(),
        contains: mock.fn(() => false),
      },
      scrollIntoView: mock.fn(),
    };

    setupMockDocument({
      submissions: [mockSubmission] as unknown as HTMLElement[],
    });

    registerKeyboardShortcuts();

    let prevented = dispatchKeydown("ArrowDown");
    assert.equal(prevented, true, "ArrowDown should be prevented");

    prevented = dispatchKeydown("ArrowUp");
    assert.equal(prevented, true, "ArrowUp should be prevented");
  });

  test("g key starts chord and waits for second key", () => {
    setupMockDocument();
    registerKeyboardShortcuts();

    const prevented = dispatchKeydown("g");
    assert.equal(prevented, true, "g should be prevented (starts chord)");
  });

  test("g key is prevented indicating chord started", () => {
    setupMockDocument();

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/",
          href: "/",
        },
        matchMedia: mock.fn(() => ({ matches: false })),
      },
      configurable: true,
      writable: true,
    });

    registerKeyboardShortcuts();

    // g key should be prevented (indicating chord started)
    const prevented = dispatchKeydown("g");
    assert.equal(prevented, true, "g should be prevented to start chord");
  });

  test("second key after g is prevented for valid chord", () => {
    setupMockDocument();

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/",
          href: "/",
        },
        matchMedia: mock.fn(() => ({ matches: false })),
      },
      configurable: true,
      writable: true,
    });

    registerKeyboardShortcuts();

    dispatchKeydown("g");
    // n should be prevented as part of g+n chord
    const prevented = dispatchKeydown("n");
    assert.equal(prevented, true, "n should be prevented as part of chord");
  });

  test("Escape clears pending chord state", () => {
    setupMockDocument();

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/",
          href: "/",
        },
        matchMedia: mock.fn(() => ({ matches: false })),
      },
      configurable: true,
      writable: true,
    });

    registerKeyboardShortcuts();

    // Start a chord
    dispatchKeydown("g");

    // Cancel with Escape
    dispatchKeydown("Escape");

    // Now press 'n' - should NOT be prevented since chord was cleared
    // (it's not a valid single-key shortcut on its own)
    const prevented = dispatchKeydown("n");
    assert.equal(prevented, false, "n should not be prevented after chord was cleared");
  });

  test("Escape clears focus from focused item", () => {
    const mockSubmission = {
      classList: {
        add: mock.fn(),
        remove: mock.fn(),
        contains: mock.fn(() => false),
      },
      scrollIntoView: mock.fn(),
    };

    setupMockDocument({
      submissions: [mockSubmission] as unknown as HTMLElement[],
    });

    registerKeyboardShortcuts();

    // Focus an item first
    dispatchKeydown("ArrowDown");
    assert.equal(mockSubmission.classList.add.mock.callCount(), 1);

    // Now escape should clear focus
    dispatchKeydown("Escape");
    assert.equal(mockSubmission.classList.remove.mock.callCount() > 0, true);
  });

  test("? key shows help modal", () => {
    const mockDocument = setupMockDocument();
    // Add createTextNode for modal rendering
    (mockDocument as { createTextNode?: typeof mock.fn }).createTextNode = mock.fn((text: string) => ({
      nodeType: 3,
      textContent: text,
    }));

    registerKeyboardShortcuts();

    const prevented = dispatchKeydown("?");
    assert.equal(prevented, true, "? should be prevented");
    // Modal should be created
    assert.ok(mockDocument.createElement.mock.callCount() > 0, "Elements should be created for modal");
  });

  test("/ key shows search palette", () => {
    const mockDocument = setupMockDocument();

    registerKeyboardShortcuts();

    const prevented = dispatchKeydown("/");
    assert.equal(prevented, true, "/ should be prevented");
    // Search palette should be created
    assert.ok(mockDocument.createElement.mock.callCount() > 0, "Elements should be created for search palette");
  });

  test("c key is prevented for navigation to submit page", () => {
    setupMockDocument();

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/",
          href: "/",
        },
        matchMedia: mock.fn(() => ({ matches: false })),
      },
      configurable: true,
      writable: true,
    });

    registerKeyboardShortcuts();

    const prevented = dispatchKeydown("c");
    assert.equal(prevented, true, "c should be prevented for navigation");
  });
});

describe("unregisterKeyboardShortcuts", () => {
  let originalDocument: typeof document;
  let removeEventListenerMock: ReturnType<typeof mock.fn>;

  beforeEach(() => {
    originalDocument = globalThis.document;
    removeEventListenerMock = mock.fn();

    const mockDocument = {
      activeElement: null,
      documentElement: {
        dataset: {} as DOMStringMap,
      },
      body: {
        appendChild: mock.fn(),
        contains: mock.fn(() => true),
      },
      addEventListener: mock.fn(),
      removeEventListener: removeEventListenerMock,
      getElementById: mock.fn(() => null),
      querySelector: mock.fn(() => null),
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn(() => ({
        tagName: "DIV",
        className: "",
        id: "",
        appendChild: mock.fn(),
        setAttribute: mock.fn(),
        addEventListener: mock.fn(),
        remove: mock.fn(),
        querySelectorAll: mock.fn(() => []),
      })),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          pathname: "/",
          href: "/",
        },
        matchMedia: mock.fn(() => ({ matches: false })),
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "sessionStorage", {
      value: {
        getItem: mock.fn(() => null),
        setItem: mock.fn(),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
  });

  test("removes keydown event listener", () => {
    registerKeyboardShortcuts();
    unregisterKeyboardShortcuts();

    assert.equal(removeEventListenerMock.mock.callCount() > 0, true);
    const keydownCalls = removeEventListenerMock.mock.calls.filter(
      (c: { arguments: [string] }) => c.arguments[0] === "keydown"
    );
    assert.ok(keydownCalls.length > 0, "keydown listener should be removed");
  });
});
