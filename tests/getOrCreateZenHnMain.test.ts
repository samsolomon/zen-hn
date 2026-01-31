import { test, describe, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getOrCreateZenHnMain } from "../src/getOrCreateZenHnMain";

describe("getOrCreateZenHnMain", () => {
  let mockDocument: {
    getElementById: ReturnType<typeof mock.fn>;
    createElement: ReturnType<typeof mock.fn>;
    body: {
      appendChild: ReturnType<typeof mock.fn>;
    };
  };

  beforeEach(() => {
    mockDocument = {
      getElementById: mock.fn((_id: string) => null),
      createElement: mock.fn((_tag: string) => {
        return { id: "", insertAdjacentElement: mock.fn() };
      }),
      body: {
        appendChild: mock.fn(),
      },
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });
  });

  test("returns existing zen-hn-main if it exists", () => {
    const existingMain = { id: "zen-hn-main" } as HTMLElement;
    mockDocument.getElementById = mock.fn((id: string) => {
      if (id === "zen-hn-main") return existingMain;
      return null;
    });

    const result = getOrCreateZenHnMain();

    assert.strictEqual(result, existingMain);
  });

  test("creates new main element when none exists", () => {
    const newMain = { id: "", insertAdjacentElement: mock.fn() } as unknown as HTMLElement;
    mockDocument.createElement = mock.fn((_tag: string) => newMain);

    const result = getOrCreateZenHnMain();

    assert.ok(result);
    assert.strictEqual(result.id, "zen-hn-main");
  });

  test("inserts before hnmain when center wrapper exists", () => {
    const centerWrapper = {
      insertAdjacentElement: mock.fn(() => {}),
    };
    const hnmain = {
      closest: mock.fn(() => centerWrapper),
      insertAdjacentElement: mock.fn(() => {}),
    };
    const newMain = { id: "zen-hn-main", insertAdjacentElement: mock.fn() } as unknown as HTMLElement;

    mockDocument.getElementById = mock.fn((id: string) => {
      if (id === "hnmain") return hnmain as unknown as HTMLElement;
      return null;
    });
    mockDocument.createElement = mock.fn((_tag: string) => newMain);

    const result = getOrCreateZenHnMain();

    assert.strictEqual(result.id, "zen-hn-main");
    assert.strictEqual(centerWrapper.insertAdjacentElement.mock.calls.length, 1);
    assert.strictEqual(centerWrapper.insertAdjacentElement.mock.calls[0].arguments[0], "beforebegin");
  });

  test("inserts before hnmain when no center wrapper", () => {
    const hnmain = {
      closest: mock.fn(() => null),
      insertAdjacentElement: mock.fn(() => {}),
    };
    const newMain = { id: "zen-hn-main", insertAdjacentElement: mock.fn() } as unknown as HTMLElement;

    mockDocument.getElementById = mock.fn((id: string) => {
      if (id === "hnmain") return hnmain as unknown as HTMLElement;
      return null;
    });
    mockDocument.createElement = mock.fn((_tag: string) => newMain);

    const result = getOrCreateZenHnMain();

    assert.strictEqual(result.id, "zen-hn-main");
    assert.strictEqual(hnmain.insertAdjacentElement.mock.calls.length, 1);
    assert.strictEqual(hnmain.insertAdjacentElement.mock.calls[0].arguments[0], "beforebegin");
  });

  test("appends to body when hnmain does not exist", () => {
    mockDocument.getElementById = mock.fn(() => null);
    mockDocument.createElement = mock.fn((_tag: string) => {
      return { id: "zen-hn-main", insertAdjacentElement: mock.fn() } as unknown as HTMLElement;
    });

    getOrCreateZenHnMain();

    assert.strictEqual(mockDocument.body.appendChild.mock.calls.length, 1);
  });
});
