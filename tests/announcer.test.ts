import { test, describe, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createAnnouncer, announce } from "../src/announcer";

describe("createAnnouncer", () => {
  let originalDocument: typeof document;

  beforeEach(() => {
    originalDocument = globalThis.document;
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
  });

  test("creates live region element", () => {
    const appendChildMock = mock.fn();
    const setAttributeMock = mock.fn();
    const createdElement = {
      id: "",
      className: "",
      setAttribute: setAttributeMock,
    };

    const mockDocument = {
      getElementById: mock.fn(() => null),
      createElement: mock.fn(() => createdElement),
      body: {
        appendChild: appendChildMock,
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createAnnouncer();

    assert.equal(mockDocument.createElement.mock.callCount(), 1);
    assert.deepEqual(mockDocument.createElement.mock.calls[0].arguments, ["div"]);
    assert.equal(appendChildMock.mock.callCount(), 1);
  });

  test("element has aria-live='polite'", () => {
    const setAttributeMock = mock.fn();
    const createdElement = {
      id: "",
      className: "",
      setAttribute: setAttributeMock,
    };

    const mockDocument = {
      getElementById: mock.fn(() => null),
      createElement: mock.fn(() => createdElement),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createAnnouncer();

    const calls = setAttributeMock.mock.calls;
    const ariaLiveCall = calls.find((c: { arguments: [string, string] }) => c.arguments[0] === "aria-live");
    assert.ok(ariaLiveCall, "aria-live attribute should be set");
    assert.equal(ariaLiveCall.arguments[1], "polite");
  });

  test("element has role='status'", () => {
    const setAttributeMock = mock.fn();
    const createdElement = {
      id: "",
      className: "",
      setAttribute: setAttributeMock,
    };

    const mockDocument = {
      getElementById: mock.fn(() => null),
      createElement: mock.fn(() => createdElement),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createAnnouncer();

    const calls = setAttributeMock.mock.calls;
    const roleCall = calls.find((c: { arguments: [string, string] }) => c.arguments[0] === "role");
    assert.ok(roleCall, "role attribute should be set");
    assert.equal(roleCall.arguments[1], "status");
  });

  test("element has aria-atomic='true'", () => {
    const setAttributeMock = mock.fn();
    const createdElement = {
      id: "",
      className: "",
      setAttribute: setAttributeMock,
    };

    const mockDocument = {
      getElementById: mock.fn(() => null),
      createElement: mock.fn(() => createdElement),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createAnnouncer();

    const calls = setAttributeMock.mock.calls;
    const ariaAtomicCall = calls.find((c: { arguments: [string, string] }) => c.arguments[0] === "aria-atomic");
    assert.ok(ariaAtomicCall, "aria-atomic attribute should be set");
    assert.equal(ariaAtomicCall.arguments[1], "true");
  });

  test("element is visually hidden (sr-only class)", () => {
    const createdElement = {
      id: "",
      className: "",
      setAttribute: mock.fn(),
    };

    const mockDocument = {
      getElementById: mock.fn(() => null),
      createElement: mock.fn(() => createdElement),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createAnnouncer();

    assert.equal(createdElement.className, "sr-only");
  });

  test("does not create duplicate announcer", () => {
    const existingAnnouncer = { id: "zen-hn-announcer" };
    const createElementMock = mock.fn();

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-announcer") {
          return existingAnnouncer;
        }
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

    createAnnouncer();

    assert.equal(createElementMock.mock.callCount(), 0, "Should not create element when one exists");
  });

  test("waits for DOMContentLoaded if body doesn't exist", () => {
    const addEventListenerMock = mock.fn();
    const createdElement = {
      id: "",
      className: "",
      setAttribute: mock.fn(),
    };

    const mockDocument = {
      getElementById: mock.fn(() => null),
      createElement: mock.fn(() => createdElement),
      body: null,
      addEventListener: addEventListenerMock,
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    createAnnouncer();

    assert.equal(addEventListenerMock.mock.callCount(), 1);
    assert.equal(addEventListenerMock.mock.calls[0].arguments[0], "DOMContentLoaded");
  });
});

describe("announce", () => {
  let originalDocument: typeof document;
  let originalRequestAnimationFrame: typeof requestAnimationFrame;

  beforeEach(() => {
    originalDocument = globalThis.document;
    originalRequestAnimationFrame = globalThis.requestAnimationFrame;

    // Mock requestAnimationFrame to execute callback immediately
    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      },
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
    Object.defineProperty(globalThis, "requestAnimationFrame", {
      value: originalRequestAnimationFrame,
      configurable: true,
    });
  });

  test("updates live region text content", () => {
    const announcer = {
      textContent: "",
    };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-announcer") {
          return announcer;
        }
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    announce("Test message");

    assert.equal(announcer.textContent, "Test message");
  });

  test("clears text before setting new content", () => {
    const textContentHistory: string[] = [];
    const announcer = {
      _textContent: "previous",
      get textContent() {
        return this._textContent;
      },
      set textContent(value: string) {
        textContentHistory.push(value);
        this._textContent = value;
      },
    };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "zen-hn-announcer") {
          return announcer;
        }
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    announce("New message");

    // First should clear, then set the message
    assert.equal(textContentHistory[0], "");
    assert.equal(textContentHistory[1], "New message");
  });

  test("does nothing when announcer element not found", () => {
    const mockDocument = {
      getElementById: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    // Should not throw
    assert.doesNotThrow(() => {
      announce("Test message");
    });
  });
});
