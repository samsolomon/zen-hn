import { test, describe, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createModal, closeModal, isModalOpen } from "../src/modal";

describe("createModal", () => {
  let originalDocument: typeof document;
  let createdElements: Map<string, Record<string, unknown>>;
  let appendChildMock: ReturnType<typeof mock.fn>;
  let bodyContainsMock: ReturnType<typeof mock.fn>;
  let documentEventListeners: Map<string, ((e: KeyboardEvent) => void)[]>;

  beforeEach(() => {
    originalDocument = globalThis.document;
    createdElements = new Map();
    documentEventListeners = new Map();
    appendChildMock = mock.fn();
    bodyContainsMock = mock.fn(() => true);

    const mockDocument = {
      activeElement: null as HTMLElement | null,
      body: {
        appendChild: appendChildMock,
        contains: bodyContainsMock,
      },
      createElement: mock.fn((tag: string) => {
        const element: Record<string, unknown> = {
          tagName: tag.toUpperCase(),
          id: "",
          className: "",
          appendChild: mock.fn(),
          setAttribute: mock.fn(),
          remove: mock.fn(),
          addEventListener: mock.fn(),
          querySelectorAll: mock.fn(() => []),
        };
        const id = `element-${createdElements.size}`;
        createdElements.set(id, element);
        return element;
      }),
      getElementById: mock.fn((id: string) => {
        for (const element of createdElements.values()) {
          if (element.id === id) {
            return element;
          }
        }
        return null;
      }),
      addEventListener: mock.fn((event: string, handler: (e: KeyboardEvent) => void) => {
        if (!documentEventListeners.has(event)) {
          documentEventListeners.set(event, []);
        }
        documentEventListeners.get(event)!.push(handler);
      }),
      removeEventListener: mock.fn((event: string, handler: (e: KeyboardEvent) => void) => {
        const handlers = documentEventListeners.get(event);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index > -1) {
            handlers.splice(index, 1);
          }
        }
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
  });

  test("creates modal with correct structure (overlay, content)", () => {
    const { modal, content } = createModal({ id: "test-modal" });

    assert.equal((modal as { className: string }).className, "zen-hn-modal");
    assert.equal((modal as { id: string }).id, "test-modal");
    assert.equal((content as { className: string }).className, "zen-hn-modal-content");

    // Modal should have backdrop and content as children
    const appendChildCalls = (modal as { appendChild: ReturnType<typeof mock.fn> }).appendChild.mock.calls;
    assert.equal(appendChildCalls.length, 2);
    assert.equal((appendChildCalls[0].arguments[0] as { className: string }).className, "zen-hn-modal-backdrop");
    assert.equal((appendChildCalls[1].arguments[0] as { className: string }).className, "zen-hn-modal-content");
  });

  test("modal has correct ARIA attributes", () => {
    const { modal } = createModal({
      id: "test-modal",
      titleId: "test-title",
      descriptionId: "test-description",
    });

    const setAttributeMock = (modal as { setAttribute: ReturnType<typeof mock.fn> }).setAttribute;
    const calls = setAttributeMock.mock.calls;
    const attributes = new Map(calls.map((c: { arguments: [string, string] }) => [c.arguments[0], c.arguments[1]]));

    assert.equal(attributes.get("role"), "dialog");
    assert.equal(attributes.get("aria-modal"), "true");
    assert.equal(attributes.get("aria-labelledby"), "test-title");
    assert.equal(attributes.get("aria-describedby"), "test-description");
  });

  test("close function calls onClose callback", () => {
    const onCloseMock = mock.fn();
    const { close, modal } = createModal({
      id: "test-modal",
      onClose: onCloseMock,
    });

    // Set up the modal ID so getElementById can find it
    (modal as { id: string }).id = "test-modal";

    close();

    assert.equal(onCloseMock.mock.callCount(), 1);
  });

  test("Escape key closes modal when closeOnEscape is true", () => {
    const onCloseMock = mock.fn();
    const { modal } = createModal({
      id: "test-modal",
      closeOnEscape: true,
      onClose: onCloseMock,
    });

    (modal as { id: string }).id = "test-modal";

    // Simulate Escape key press
    const keydownHandlers = documentEventListeners.get("keydown") || [];
    assert.ok(keydownHandlers.length > 0, "Escape key handler should be registered");

    const escapeEvent = { key: "Escape" } as KeyboardEvent;
    keydownHandlers[0](escapeEvent);

    assert.equal(onCloseMock.mock.callCount(), 1);
  });

  test("Escape key does not close modal when closeOnEscape is false", () => {
    const onCloseMock = mock.fn();
    createModal({
      id: "test-modal",
      closeOnEscape: false,
      onClose: onCloseMock,
    });

    // No keydown handler should be registered for escape
    const keydownHandlers = documentEventListeners.get("keydown") || [];
    assert.equal(keydownHandlers.length, 0);
  });

  test("clicking overlay background closes modal when closeOnBackdrop is true", () => {
    const onCloseMock = mock.fn();
    const { modal } = createModal({
      id: "test-modal",
      closeOnBackdrop: true,
      onClose: onCloseMock,
    });

    (modal as { id: string }).id = "test-modal";

    // Find the backdrop element (first child appended to modal)
    const appendChildCalls = (modal as { appendChild: ReturnType<typeof mock.fn> }).appendChild.mock.calls;
    const backdrop = appendChildCalls[0].arguments[0] as { addEventListener: ReturnType<typeof mock.fn> };

    // Get the click handler
    const backdropAddEventListener = backdrop.addEventListener;
    assert.equal(backdropAddEventListener.mock.callCount(), 1);
    assert.equal(backdropAddEventListener.mock.calls[0].arguments[0], "click");

    // Simulate click on backdrop
    const clickHandler = backdropAddEventListener.mock.calls[0].arguments[1] as () => void;
    clickHandler();

    assert.equal(onCloseMock.mock.callCount(), 1);
  });

  test("clicking overlay does not close modal when closeOnBackdrop is false", () => {
    const onCloseMock = mock.fn();
    const { modal } = createModal({
      id: "test-modal",
      closeOnBackdrop: false,
      onClose: onCloseMock,
    });

    // Find the backdrop element
    const appendChildCalls = (modal as { appendChild: ReturnType<typeof mock.fn> }).appendChild.mock.calls;
    const backdrop = appendChildCalls[0].arguments[0] as { addEventListener: ReturnType<typeof mock.fn> };

    // No click handler should be registered on backdrop
    assert.equal(backdrop.addEventListener.mock.callCount(), 0);
  });

  test("close function removes modal from DOM", () => {
    const { close, modal } = createModal({ id: "test-modal" });

    (modal as { id: string }).id = "test-modal";
    const removeMock = (modal as { remove: ReturnType<typeof mock.fn> }).remove;

    close();

    assert.equal(removeMock.mock.callCount(), 1);
  });

  test("focus trap cycles through focusable elements", () => {
    const { modal } = createModal({
      id: "test-modal",
      focusTrap: true,
    });

    // Modal should have keydown listener for focus trap
    const modalAddEventListener = (modal as { addEventListener: ReturnType<typeof mock.fn> }).addEventListener;
    const keydownCalls = modalAddEventListener.mock.calls.filter(
      (c: { arguments: [string] }) => c.arguments[0] === "keydown"
    );
    assert.equal(keydownCalls.length, 1, "Focus trap keydown handler should be registered");
  });

  test("modal appends to body", () => {
    createModal({ id: "test-modal" });

    assert.equal(appendChildMock.mock.callCount(), 1);
  });
});

describe("closeModal", () => {
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

  test("removes modal by ID", () => {
    const removeMock = mock.fn();
    const modalElement = { remove: removeMock };

    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "test-modal") {
          return modalElement;
        }
        return null;
      }),
      removeEventListener: mock.fn(),
      body: {
        contains: mock.fn(() => false),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    closeModal("test-modal");

    assert.equal(removeMock.mock.callCount(), 1);
  });

  test("does nothing when modal not found", () => {
    const mockDocument = {
      getElementById: mock.fn(() => null),
      removeEventListener: mock.fn(),
      body: {
        contains: mock.fn(() => false),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    // Should not throw
    assert.doesNotThrow(() => {
      closeModal("nonexistent-modal");
    });
  });
});

describe("isModalOpen", () => {
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

  test("returns true when modal exists", () => {
    const mockDocument = {
      getElementById: mock.fn((id: string) => {
        if (id === "test-modal") {
          return {};
        }
        return null;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    assert.equal(isModalOpen("test-modal"), true);
  });

  test("returns false when modal does not exist", () => {
    const mockDocument = {
      getElementById: mock.fn(() => null),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    assert.equal(isModalOpen("test-modal"), false);
  });
});
