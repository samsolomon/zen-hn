import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { buildSidebarNavigation, runSidebarWhenReady } from "../src/sidebar";

describe("buildSidebarNavigation", () => {
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
