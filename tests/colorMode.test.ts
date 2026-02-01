import assert from "node:assert/strict";
import { test, describe, mock, beforeEach, afterEach } from "node:test";

import {
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  FONT_FAMILY_STORAGE_KEY,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getColorModeStorageValue,
  isValidColorModePreference,
  replaceHnSettingsWithToggles,
  type ThemePreference,
  type FontFamilyPreference,
} from "../src/colorMode.ts";

test("COLOR_MODE_CLASS is dark-theme", () => {
  assert.equal(COLOR_MODE_CLASS, "dark-theme");
});

test("COLOR_MODE_STORAGE_KEY is colorMode", () => {
  assert.equal(COLOR_MODE_STORAGE_KEY, "colorMode");
});

test("toggleColorMode from light to dark", () => {
  assert.equal(toggleColorMode(false), true);
});

test("toggleColorMode from dark to light", () => {
  assert.equal(toggleColorMode(true), false);
});

test("getColorModeIcon returns sun for light mode", () => {
  assert.equal(getColorModeIcon(false), "sun");
});

test("getColorModeIcon returns moon for dark mode", () => {
  assert.equal(getColorModeIcon(true), "moon");
});

test("getColorModeLabel returns switch to dark for light mode", () => {
  assert.equal(getColorModeLabel(false), "Switch to dark mode");
});

test("getColorModeLabel returns switch to light for dark mode", () => {
  assert.equal(getColorModeLabel(true), "Switch to light mode");
});

test("parseColorModeFromStorage returns true for dark", () => {
  assert.equal(parseColorModeFromStorage("dark"), true);
});

test("parseColorModeFromStorage returns false for light", () => {
  assert.equal(parseColorModeFromStorage("light"), false);
});

test("parseColorModeFromStorage returns false for undefined", () => {
  assert.equal(parseColorModeFromStorage(undefined), false);
});

test("parseColorModeFromStorage returns false for invalid value", () => {
  assert.equal(parseColorModeFromStorage("invalid"), false);
});

test("getColorModeStorageValue returns dark for true", () => {
  assert.equal(getColorModeStorageValue(true), "dark");
});

test("getColorModeStorageValue returns light for false", () => {
  assert.equal(getColorModeStorageValue(false), "light");
});

// isValidColorModePreference tests
test("isValidColorModePreference returns true for light", () => {
  assert.equal(isValidColorModePreference("light"), true);
});

test("isValidColorModePreference returns true for dark", () => {
  assert.equal(isValidColorModePreference("dark"), true);
});

test("isValidColorModePreference returns true for system", () => {
  assert.equal(isValidColorModePreference("system"), true);
});

test("isValidColorModePreference returns false for invalid value", () => {
  assert.equal(isValidColorModePreference("invalid"), false);
});

test("isValidColorModePreference returns false for empty string", () => {
  assert.equal(isValidColorModePreference(""), false);
});

// Theme storage key test
test("THEME_STORAGE_KEY is theme", () => {
  assert.equal(THEME_STORAGE_KEY, "theme");
});

// ThemePreference type tests (compile-time validation via type assertions)
test("ThemePreference includes all 22 Radix color scales", () => {
  const allThemes: ThemePreference[] = [
    "gray",
    "mauve",
    "slate",
    "sage",
    "olive",
    "sand",
    "tomato",
    "ruby",
    "crimson",
    "pink",
    "plum",
    "violet",
    "iris",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "jade",
    "grass",
    "bronze",
    "gold",
    "orange",
  ];
  assert.equal(allThemes.length, 22);
});

// Font family storage key test
test("FONT_FAMILY_STORAGE_KEY is fontFamily", () => {
  assert.equal(FONT_FAMILY_STORAGE_KEY, "fontFamily");
});

// FontFamilyPreference type tests (compile-time validation via type assertions)
test("FontFamilyPreference includes all 8 font options", () => {
  const allFonts: FontFamilyPreference[] = [
    "system",
    "humanist",
    "geometric",
    "classical",
    "serif",
    "mono",
    "inter",
    "ibm-plex",
  ];
  assert.equal(allFonts.length, 8);
});

// =============================================================================
// HN Settings Controls Tests
// =============================================================================

describe("replaceHnSettingsWithToggles", () => {
  let originalDocument: typeof globalThis.document;
  let originalChrome: typeof globalThis.chrome;

  beforeEach(() => {
    originalDocument = globalThis.document;
    originalChrome = globalThis.chrome;
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
    Object.defineProperty(globalThis, "chrome", {
      value: originalChrome,
      configurable: true,
    });
  });

  test("does nothing when no HN setting selects are found", () => {
    const querySelectorMock = mock.fn(() => null);
    const mockDocument = {
      querySelector: querySelectorMock,
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn(() => ({
        className: "",
        appendChild: mock.fn(),
        classList: { add: mock.fn(), remove: mock.fn() },
      })),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    // Mock chrome to prevent errors
    Object.defineProperty(globalThis, "chrome", {
      value: { runtime: { sendMessage: mock.fn(() => Promise.resolve({ enabled: false })) } },
      configurable: true,
    });

    assert.doesNotThrow(() => replaceHnSettingsWithToggles());
  });

  test("hides original select row when processing showd select", () => {
    const hiddenRow = { style: { display: "" } };
    const mockSelect = {
      dataset: {},
      value: "no",
      closest: mock.fn((selector: string) => {
        if (selector === "tr") return hiddenRow;
        if (selector === "form") return {
          querySelector: mock.fn(() => null),
          appendChild: mock.fn(),
          insertBefore: mock.fn(),
        };
        return null;
      }),
    };

    const createdElements: Array<{ className: string; appendChild: ReturnType<typeof mock.fn> }> = [];
    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === 'select[name="showd"]') return mockSelect;
        if (selector === 'select[name="nopro"]') return null;
        if (selector === 'input[name="maxv"]') return null;
        return null;
      }),
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn((tag: string) => {
        const el = {
          className: "",
          type: "",
          textContent: "",
          innerHTML: "",
          appendChild: mock.fn(),
          setAttribute: mock.fn(),
          addEventListener: mock.fn(),
          querySelector: mock.fn(() => null),
          prepend: mock.fn(),
          classList: {
            add: mock.fn(),
            remove: mock.fn(),
            contains: mock.fn(() => false),
          },
        };
        createdElements.push(el);
        return el;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "chrome", {
      value: { runtime: { sendMessage: mock.fn(() => Promise.resolve({ enabled: false })) } },
      configurable: true,
    });

    replaceHnSettingsWithToggles();

    // Original row should be hidden
    assert.equal(hiddenRow.style.display, "none");
    // Select should be marked as processed
    assert.equal(mockSelect.dataset.zenHnToggled, "true");
  });

  test("creates HN settings section with title", () => {
    const appendedElements: unknown[] = [];
    const mockForm = {
      querySelector: mock.fn(() => null),
      appendChild: mock.fn((el: unknown) => appendedElements.push(el)),
      insertBefore: mock.fn((el: unknown) => appendedElements.push(el)),
    };

    const mockSelect = {
      dataset: {},
      value: "no",
      closest: mock.fn((selector: string) => {
        if (selector === "tr") return { style: { display: "" } };
        if (selector === "form") return mockForm;
        return null;
      }),
    };

    const createdElements: Array<{ className: string; textContent: string }> = [];
    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === 'select[name="showd"]') return mockSelect;
        if (selector === 'select[name="nopro"]') return null;
        if (selector === 'input[name="maxv"]') return null;
        return null;
      }),
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn((tag: string) => {
        const el = {
          className: "",
          type: "",
          textContent: "",
          innerHTML: "",
          appendChild: mock.fn(),
          setAttribute: mock.fn(),
          addEventListener: mock.fn(),
          querySelector: mock.fn(() => null),
          prepend: mock.fn(),
          classList: {
            add: mock.fn(),
            remove: mock.fn(),
            contains: mock.fn(() => false),
          },
        };
        createdElements.push(el);
        return el;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "chrome", {
      value: { runtime: { sendMessage: mock.fn(() => Promise.resolve({ enabled: false })) } },
      configurable: true,
    });

    replaceHnSettingsWithToggles();

    // Should create section with correct class
    const section = createdElements.find((el) => el.className === "zen-hn-hn-settings-section");
    assert.ok(section, "Should create HN settings section");

    // Should create title
    const title = createdElements.find((el) => el.className === "zen-hn-settings-title");
    assert.ok(title, "Should create settings title");
    assert.equal(title?.textContent, "Settings");
  });

  test("creates noprocrast inputs container when nopro select is found", () => {
    const mockForm = {
      querySelector: mock.fn(() => null),
      appendChild: mock.fn(),
      insertBefore: mock.fn(),
    };

    const mockNoproSelect = {
      dataset: {},
      value: "yes",
      closest: mock.fn((selector: string) => {
        if (selector === "tr") return { style: { display: "" } };
        if (selector === "form") return mockForm;
        return null;
      }),
    };

    const createdElements: Array<{ className: string; classList: { add: ReturnType<typeof mock.fn> } }> = [];
    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === 'select[name="showd"]') return null;
        if (selector === 'select[name="nopro"]') return mockNoproSelect;
        if (selector === 'input[name="maxv"]') return null;
        return null;
      }),
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn((tag: string) => {
        const el = {
          className: "",
          type: "",
          textContent: "",
          innerHTML: "",
          appendChild: mock.fn(),
          setAttribute: mock.fn(),
          addEventListener: mock.fn(),
          querySelector: mock.fn(() => null),
          prepend: mock.fn(),
          classList: {
            add: mock.fn(),
            remove: mock.fn(),
            contains: mock.fn(() => false),
          },
        };
        createdElements.push(el);
        return el;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "chrome", {
      value: { runtime: { sendMessage: mock.fn(() => Promise.resolve({ enabled: false })) } },
      configurable: true,
    });

    replaceHnSettingsWithToggles();

    // Should create noprocrast inputs container
    const container = createdElements.find((el) => el.className === "zen-hn-noprocrast-inputs");
    assert.ok(container, "Should create noprocrast inputs container");

    // Should add is-visible class since nopro is enabled (value="yes")
    assert.ok(
      container?.classList.add.mock.calls.some(
        (call: { arguments: string[] }) => call.arguments[0] === "is-visible"
      ),
      "Should add is-visible class when noprocrast is enabled"
    );
  });

  test("noprocrast inputs container is hidden when nopro is disabled", () => {
    const mockForm = {
      querySelector: mock.fn(() => null),
      appendChild: mock.fn(),
      insertBefore: mock.fn(),
    };

    const mockNoproSelect = {
      dataset: {},
      value: "no", // Disabled
      closest: mock.fn((selector: string) => {
        if (selector === "tr") return { style: { display: "" } };
        if (selector === "form") return mockForm;
        return null;
      }),
    };

    const createdElements: Array<{ className: string; classList: { add: ReturnType<typeof mock.fn> } }> = [];
    const mockDocument = {
      querySelector: mock.fn((selector: string) => {
        if (selector === 'select[name="showd"]') return null;
        if (selector === 'select[name="nopro"]') return mockNoproSelect;
        if (selector === 'input[name="maxv"]') return null;
        return null;
      }),
      querySelectorAll: mock.fn(() => []),
      createElement: mock.fn((tag: string) => {
        const el = {
          className: "",
          type: "",
          textContent: "",
          innerHTML: "",
          appendChild: mock.fn(),
          setAttribute: mock.fn(),
          addEventListener: mock.fn(),
          querySelector: mock.fn(() => null),
          prepend: mock.fn(),
          classList: {
            add: mock.fn(),
            remove: mock.fn(),
            contains: mock.fn(() => false),
          },
        };
        createdElements.push(el);
        return el;
      }),
    };

    Object.defineProperty(globalThis, "document", {
      value: mockDocument,
      configurable: true,
    });

    Object.defineProperty(globalThis, "chrome", {
      value: { runtime: { sendMessage: mock.fn(() => Promise.resolve({ enabled: false })) } },
      configurable: true,
    });

    replaceHnSettingsWithToggles();

    // Should create noprocrast inputs container
    const container = createdElements.find((el) => el.className === "zen-hn-noprocrast-inputs");
    assert.ok(container, "Should create noprocrast inputs container");

    // Should NOT add is-visible class since nopro is disabled
    assert.ok(
      !container?.classList.add.mock.calls.some(
        (call: { arguments: string[] }) => call.arguments[0] === "is-visible"
      ),
      "Should not add is-visible class when noprocrast is disabled"
    );
  });
});
