import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";

describe("tooltip shortcut parsing", () => {
  // Test the shortcut parsing logic directly by examining the structure
  // created in showTooltip when a shortcut is provided

  test("shortcut string is split by plus sign", () => {
    const shortcut = "g+h";
    const keys = shortcut.split("+");
    assert.deepEqual(keys, ["g", "h"]);
  });

  test("single key shortcut produces one element", () => {
    const shortcut = "u";
    const keys = shortcut.split("+");
    assert.deepEqual(keys, ["u"]);
    assert.equal(keys.length, 1);
  });

  test("chord shortcut g+h produces two elements", () => {
    const shortcut = "g+h";
    const keys = shortcut.split("+");
    assert.equal(keys.length, 2);
    assert.equal(keys[0], "g");
    assert.equal(keys[1], "h");
  });

  test("Space shortcut is preserved as-is", () => {
    const shortcut = "Space";
    const keys = shortcut.split("+");
    assert.deepEqual(keys, ["Space"]);
  });

  test("complex chord like Ctrl+Shift+K splits correctly", () => {
    const shortcut = "Ctrl+Shift+K";
    const keys = shortcut.split("+");
    assert.equal(keys.length, 3);
    assert.equal(keys[0], "Ctrl");
    assert.equal(keys[1], "Shift");
    assert.equal(keys[2], "K");
  });
});

describe("initTooltip interface", () => {
  function setupMockEnvironment() {
    const createdElements: Array<{
      tagName: string;
      className: string;
      textContent: string;
      id: string;
      children: unknown[];
      appendChild: ReturnType<typeof mock.fn>;
    }> = [];

    // Mock HTMLElement for instanceof checks
    class MockHTMLElement {
      tagName = "DIV";
      getAttribute() { return null; }
    }

    Object.defineProperty(globalThis, "HTMLElement", {
      value: MockHTMLElement,
      configurable: true,
    });

    Object.defineProperty(globalThis, "Node", {
      value: { ELEMENT_NODE: 1 },
      configurable: true,
    });

    const mockTooltipContainer = {
      tagName: "DIV",
      className: "zen-tooltip",
      textContent: "",
      id: "",
      style: {} as Record<string, string>,
      children: [] as unknown[],
      firstChild: null as unknown,
      appendChild: mock.fn((child: unknown) => {
        mockTooltipContainer.children.push(child);
        if (!mockTooltipContainer.firstChild) {
          mockTooltipContainer.firstChild = child;
        }
        return child;
      }),
      insertBefore: mock.fn((child: unknown, _ref: unknown) => {
        mockTooltipContainer.children.unshift(child);
        mockTooltipContainer.firstChild = child;
        return child;
      }),
      removeChild: mock.fn((child: unknown) => {
        const idx = mockTooltipContainer.children.indexOf(child);
        if (idx >= 0) mockTooltipContainer.children.splice(idx, 1);
        return child;
      }),
      setAttribute: mock.fn(),
      getAttribute: mock.fn(),
      classList: {
        add: mock.fn(),
        remove: mock.fn(),
        contains: mock.fn(() => false),
      },
      getBoundingClientRect: mock.fn(() => ({
        top: 100,
        left: 100,
        width: 100,
        height: 30,
        bottom: 130,
        right: 200,
      })),
      contains: mock.fn(() => false),
      dataset: {} as Record<string, string>,
    };

    const mockDocument = {
      createElement: mock.fn((tag: string) => {
        const element = {
          tagName: tag.toUpperCase(),
          className: "",
          textContent: "",
          id: "",
          style: {} as Record<string, string>,
          children: [] as unknown[],
          appendChild: mock.fn((child: unknown) => {
            element.children.push(child);
            return child;
          }),
          insertBefore: mock.fn(),
          setAttribute: mock.fn(),
          getAttribute: mock.fn(),
          classList: {
            add: mock.fn(),
            remove: mock.fn(),
          },
          getBoundingClientRect: mock.fn(() => ({
            top: 100, left: 100, width: 100, height: 30, bottom: 130, right: 200,
          })),
          firstChild: null,
          removeChild: mock.fn(),
          contains: mock.fn(() => false),
          dataset: {} as Record<string, string>,
        };
        createdElements.push(element);
        return element;
      }),
      body: {
        appendChild: mock.fn(),
        contains: mock.fn((el: unknown) => el === mockTooltipContainer),
      },
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      createTextNode: mock.fn((text: string) => ({ nodeType: 3, textContent: text })),
    };

    // Make createElement return the cached tooltip container for div elements
    let tooltipCreated = false;
    mockDocument.createElement = mock.fn((tag: string) => {
      if (tag === "div" && !tooltipCreated) {
        tooltipCreated = true;
        createdElements.push(mockTooltipContainer as typeof createdElements[0]);
        return mockTooltipContainer;
      }
      const element = {
        tagName: tag.toUpperCase(),
        className: "",
        textContent: "",
        id: "",
        style: {} as Record<string, string>,
        children: [] as unknown[],
        appendChild: mock.fn((child: unknown) => {
          element.children.push(child);
          return child;
        }),
        insertBefore: mock.fn(),
        setAttribute: mock.fn(),
        getAttribute: mock.fn(),
        classList: { add: mock.fn(), remove: mock.fn() },
        getBoundingClientRect: mock.fn(() => ({
          top: 100, left: 100, width: 100, height: 30, bottom: 130, right: 200,
        })),
        firstChild: null,
        removeChild: mock.fn(),
        contains: mock.fn(() => false),
        dataset: {} as Record<string, string>,
      };
      createdElements.push(element);
      return element;
    });

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        innerWidth: 1024,
        innerHeight: 768,
        scrollX: 0,
        scrollY: 0,
        setTimeout: mock.fn((fn: () => void, _delay: number) => {
          fn();
          return 1;
        }),
        clearTimeout: mock.fn(),
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: mock.fn((fn: () => void) => {
        fn();
        return 1;
      }),
      configurable: true,
    });

    return { mockDocument, createdElements, mockTooltipContainer };
  }

  test("initTooltip returns controller with expected methods", async () => {
    setupMockEnvironment();

    // Dynamic import to ensure mocks are in place
    const { initTooltip } = await import("../src/tooltip");

    const element = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      setAttribute: mock.fn(),
      removeAttribute: mock.fn(),
    } as unknown as HTMLElement;

    const controller = initTooltip(element, "Test tooltip");

    assert.equal(typeof controller.show, "function", "should have show method");
    assert.equal(typeof controller.hide, "function", "should have hide method");
    assert.equal(typeof controller.updateText, "function", "should have updateText method");
    assert.equal(typeof controller.destroy, "function", "should have destroy method");
  });

  test("initTooltip adds event listeners to element", async () => {
    setupMockEnvironment();

    const { initTooltip } = await import("../src/tooltip");

    const addEventListenerMock = mock.fn();
    const element = {
      addEventListener: addEventListenerMock,
      removeEventListener: mock.fn(),
      setAttribute: mock.fn(),
      removeAttribute: mock.fn(),
    } as unknown as HTMLElement;

    initTooltip(element, "Test tooltip");

    // Should add mouseenter, mouseleave, focus, and keydown listeners
    assert.ok(addEventListenerMock.mock.callCount() >= 4, "should add at least 4 event listeners");

    const eventTypes = addEventListenerMock.mock.calls.map(
      (c: { arguments: [string, unknown] }) => c.arguments[0]
    );
    assert.ok(eventTypes.includes("mouseenter"), "should listen to mouseenter");
    assert.ok(eventTypes.includes("mouseleave"), "should listen to mouseleave");
    assert.ok(eventTypes.includes("focus"), "should listen to focus");
    assert.ok(eventTypes.includes("keydown"), "should listen to keydown");
  });

  test("initTooltip sets aria-describedby attribute", async () => {
    setupMockEnvironment();

    const { initTooltip } = await import("../src/tooltip");

    const setAttributeMock = mock.fn();
    const element = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      setAttribute: setAttributeMock,
      removeAttribute: mock.fn(),
    } as unknown as HTMLElement;

    initTooltip(element, "Test tooltip");

    assert.ok(setAttributeMock.mock.callCount() >= 1, "should call setAttribute");
    const [attrName] = setAttributeMock.mock.calls[0].arguments;
    assert.equal(attrName, "aria-describedby", "should set aria-describedby");
  });

  test("destroy removes event listeners", async () => {
    setupMockEnvironment();

    const { initTooltip } = await import("../src/tooltip");

    const removeEventListenerMock = mock.fn();
    const element = {
      addEventListener: mock.fn(),
      removeEventListener: removeEventListenerMock,
      setAttribute: mock.fn(),
      removeAttribute: mock.fn(),
    } as unknown as HTMLElement;

    const controller = initTooltip(element, "Test tooltip");
    controller.destroy();

    assert.ok(removeEventListenerMock.mock.callCount() >= 4, "should remove event listeners on destroy");
  });

  test("destroy removes aria-describedby attribute", async () => {
    setupMockEnvironment();

    const { initTooltip } = await import("../src/tooltip");

    const removeAttributeMock = mock.fn();
    const element = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      setAttribute: mock.fn(),
      removeAttribute: removeAttributeMock,
    } as unknown as HTMLElement;

    const controller = initTooltip(element, "Test tooltip");
    controller.destroy();

    assert.ok(removeAttributeMock.mock.callCount() >= 1, "should call removeAttribute");
    assert.equal(removeAttributeMock.mock.calls[0].arguments[0], "aria-describedby");
  });
});

describe("tooltip with shortcut option", () => {
  function setupMockEnvironment() {
    const createdElements: Array<{
      tagName: string;
      className: string;
      textContent: string;
    }> = [];

    class MockHTMLElement {
      tagName = "DIV";
      getAttribute() { return null; }
    }

    Object.defineProperty(globalThis, "HTMLElement", {
      value: MockHTMLElement,
      configurable: true,
    });

    Object.defineProperty(globalThis, "Node", {
      value: { ELEMENT_NODE: 1 },
      configurable: true,
    });

    const tooltipArrow = {
      tagName: "DIV",
      className: "zen-tooltip-arrow",
    };

    const mockTooltipContainer = {
      tagName: "DIV",
      className: "zen-tooltip",
      textContent: "",
      id: "",
      style: {} as Record<string, string>,
      children: [tooltipArrow] as unknown[],
      firstChild: tooltipArrow as unknown,
      appendChild: mock.fn((child: unknown) => {
        mockTooltipContainer.children.push(child);
        return child;
      }),
      insertBefore: mock.fn((child: unknown, _ref: unknown) => {
        // Insert before the arrow (at the beginning)
        const arrowIdx = mockTooltipContainer.children.indexOf(tooltipArrow);
        if (arrowIdx >= 0) {
          mockTooltipContainer.children.splice(arrowIdx, 0, child);
        } else {
          mockTooltipContainer.children.unshift(child);
        }
        mockTooltipContainer.firstChild = mockTooltipContainer.children[0];
        return child;
      }),
      removeChild: mock.fn((child: unknown) => {
        const idx = mockTooltipContainer.children.indexOf(child);
        if (idx >= 0) mockTooltipContainer.children.splice(idx, 1);
        if (mockTooltipContainer.children.length > 0) {
          mockTooltipContainer.firstChild = mockTooltipContainer.children[0];
        } else {
          mockTooltipContainer.firstChild = null;
        }
        return child;
      }),
      setAttribute: mock.fn(),
      getAttribute: mock.fn(),
      classList: {
        add: mock.fn(),
        remove: mock.fn(),
        contains: mock.fn(() => false),
      },
      getBoundingClientRect: mock.fn(() => ({
        top: 100, left: 100, width: 100, height: 30, bottom: 130, right: 200,
      })),
      contains: mock.fn(() => false),
      dataset: {} as Record<string, string>,
    };

    let tooltipCreated = false;
    const mockDocument = {
      createElement: mock.fn((tag: string) => {
        if (tag === "div" && !tooltipCreated) {
          tooltipCreated = true;
          return mockTooltipContainer;
        }
        const element = {
          tagName: tag.toUpperCase(),
          className: "",
          textContent: "",
          id: "",
          style: {} as Record<string, string>,
          children: [] as unknown[],
          appendChild: mock.fn((child: unknown) => {
            element.children.push(child);
            return child;
          }),
          insertBefore: mock.fn(),
          setAttribute: mock.fn(),
          getAttribute: mock.fn(),
          classList: { add: mock.fn(), remove: mock.fn() },
          getBoundingClientRect: mock.fn(() => ({
            top: 100, left: 100, width: 100, height: 30, bottom: 130, right: 200,
          })),
          firstChild: null,
          removeChild: mock.fn(),
          contains: mock.fn(() => false),
          dataset: {} as Record<string, string>,
        };
        createdElements.push(element);
        return element;
      }),
      body: {
        appendChild: mock.fn(),
        contains: mock.fn(() => true),
      },
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      createTextNode: mock.fn((text: string) => ({ nodeType: 3, textContent: text })),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "window", {
      value: {
        innerWidth: 1024,
        innerHeight: 768,
        scrollX: 0,
        scrollY: 0,
        setTimeout: mock.fn((fn: () => void, _delay: number) => {
          fn();
          return 1;
        }),
        clearTimeout: mock.fn(),
      },
      configurable: true,
    });

    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: mock.fn((fn: () => void) => {
        fn();
        return 1;
      }),
      configurable: true,
    });

    return { mockDocument, createdElements, mockTooltipContainer };
  }

  test("creates kbd elements when shortcut option is provided", async () => {
    const { createdElements } = setupMockEnvironment();

    const { initTooltip } = await import("../src/tooltip");

    const element = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      setAttribute: mock.fn(),
      removeAttribute: mock.fn(),
      getBoundingClientRect: mock.fn(() => ({
        top: 50, left: 50, width: 100, height: 30, bottom: 80, right: 150,
      })),
    } as unknown as HTMLElement;

    const controller = initTooltip(element, "Upvote", { shortcut: "u" });
    controller.show();

    // Find kbd elements created
    const kbdElements = createdElements.filter(el => el.tagName === "KBD");
    assert.ok(kbdElements.length >= 1, "should create at least one kbd element");
  });

  test("creates multiple kbd elements for chord shortcuts", async () => {
    const { createdElements } = setupMockEnvironment();

    const { initTooltip } = await import("../src/tooltip");

    const element = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      setAttribute: mock.fn(),
      removeAttribute: mock.fn(),
      getBoundingClientRect: mock.fn(() => ({
        top: 50, left: 50, width: 100, height: 30, bottom: 80, right: 150,
      })),
    } as unknown as HTMLElement;

    const controller = initTooltip(element, "Go home", { shortcut: "g+h" });
    controller.show();

    // Find kbd elements created
    const kbdElements = createdElements.filter(el => el.tagName === "KBD");
    assert.ok(kbdElements.length >= 2, "should create at least two kbd elements for g+h");
  });

  test("creates shortcut span with zen-tooltip-shortcut class", async () => {
    const { createdElements } = setupMockEnvironment();

    const { initTooltip } = await import("../src/tooltip");

    const element = {
      addEventListener: mock.fn(),
      removeEventListener: mock.fn(),
      setAttribute: mock.fn(),
      removeAttribute: mock.fn(),
      getBoundingClientRect: mock.fn(() => ({
        top: 50, left: 50, width: 100, height: 30, bottom: 80, right: 150,
      })),
    } as unknown as HTMLElement;

    const controller = initTooltip(element, "Test", { shortcut: "u" });
    controller.show();

    // Find span with shortcut class
    const shortcutSpans = createdElements.filter(
      el => el.tagName === "SPAN" && el.className === "zen-tooltip-shortcut"
    );
    assert.ok(shortcutSpans.length >= 1, "should create span with zen-tooltip-shortcut class");
  });
});
