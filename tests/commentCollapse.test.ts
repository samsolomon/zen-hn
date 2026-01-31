const mockZenHnLogic = {
  getIndentLevelFromItem: (item: Element): number => {
    if (!item) return 0;
    const element = item as { dataset?: { indentLevel?: string } };
    return Number.parseInt(element.dataset?.indentLevel || "0", 10) || 0;
  },
};

(globalThis as { ZenHnLogic: typeof mockZenHnLogic }).ZenHnLogic = mockZenHnLogic as typeof mockZenHnLogic & Record<string, unknown>;

import { describe, it } from "node:test";
import { setCollapseButtonState, hideDescendantComments, restoreDescendantVisibility, toggleCommentCollapse } from "../src/commentCollapse";

interface MockButton {
  classList: { toggle: (cls: string, state?: boolean) => boolean | void; contains: (cls: string) => boolean };
  setAttribute: (attr: string, val: string) => void;
  getAttribute: (attr: string) => string | null;
}

function createMockButton(): MockButton {
  let expandedValue: string | null = null;
  let labelValue: string | null = null;
  return {
    classList: {
      toggle: (_cls: string, _state?: boolean) => true,
      contains: (_cls: string) => false,
    },
    setAttribute: (attr: string, val: string) => {
      if (attr === "aria-expanded") expandedValue = val;
      if (attr === "aria-label") labelValue = val;
    },
    getAttribute: (attr: string) => {
      if (attr === "aria-expanded") return expandedValue;
      if (attr === "aria-label") return labelValue;
      return null;
    },
  };
}

describe("setCollapseButtonState", () => {
  it("does nothing when button is null", () => {
    setCollapseButtonState(null, true, true);
  });

  it("sets collapsed state and aria attributes for thread", () => {
    const button = createMockButton();
    setCollapseButtonState(button as unknown as HTMLElement, true, true);
    if (button.getAttribute("aria-expanded") !== "false") {
      throw new Error(`Expected aria-expanded "false", got "${button.getAttribute("aria-expanded")}"`);
    }
    if (button.getAttribute("aria-label") !== "Expand thread") {
      throw new Error(`Expected aria-label "Expand thread", got "${button.getAttribute("aria-label")}"`);
    }
  });

  it("sets expanded state for comment", () => {
    const button = createMockButton();
    setCollapseButtonState(button as unknown as HTMLElement, false, false);
    if (button.getAttribute("aria-expanded") !== "true") {
      throw new Error(`Expected aria-expanded "true", got "${button.getAttribute("aria-expanded")}"`);
    }
    if (button.getAttribute("aria-label") !== "Collapse comment") {
      throw new Error(`Expected aria-label "Collapse comment", got "${button.getAttribute("aria-label")}"`);
    }
  });
});

interface MockElement {
  classList: { contains: (cls: string) => boolean };
  dataset: { indentLevel: string; collapsed?: string; hasChildren?: string; [key: string]: string | undefined };
  nextElementSibling: MockElement | null;
  hidden: boolean;
  querySelector: (selector: string) => MockButton | null;
}

function createMockElement(indentLevel: string, collapsed?: string, hasChildren?: string): MockElement {
  return {
    classList: { contains: (cls: string) => cls === "hn-comment" },
    dataset: { indentLevel, collapsed: collapsed || "", hasChildren: hasChildren || "" },
    nextElementSibling: null,
    hidden: false,
    querySelector: () => null,
  };
}

describe("hideDescendantComments", () => {
  it("hides no siblings when no following hn-comment elements", () => {
    const item = createMockElement("0");
    hideDescendantComments(item as unknown as HTMLElement);
    if (item.hidden) {
      throw new Error("Expected item to not be hidden");
    }
  });

  it("hides descendant comments with higher indent level", () => {
    const item = createMockElement("0");
    const child1 = createMockElement("1");
    const child2 = createMockElement("2");
    const sibling = createMockElement("0");

    item.nextElementSibling = child1;
    child1.nextElementSibling = child2;
    child2.nextElementSibling = sibling;

    hideDescendantComments(item as unknown as HTMLElement);

    if (item.hidden) {
      throw new Error("Expected item to not be hidden");
    }
    if (!child1.hidden) {
      throw new Error("Expected child1 to be hidden");
    }
    if (!child2.hidden) {
      throw new Error("Expected child2 to be hidden");
    }
    if (sibling.hidden) {
      throw new Error("Expected sibling to not be hidden");
    }
  });

  it("stops hiding at sibling with equal or lower indent level", () => {
    const item = createMockElement("1");
    const child1 = createMockElement("2");
    const cousin = createMockElement("1");

    item.nextElementSibling = child1;
    child1.nextElementSibling = cousin;

    hideDescendantComments(item as unknown as HTMLElement);

    if (!child1.hidden) {
      throw new Error("Expected child1 to be hidden");
    }
    if (cousin.hidden) {
      throw new Error("Expected cousin to not be hidden");
    }
  });
});

describe("restoreDescendantVisibility", () => {
  it("restores visibility for non-collapsed descendants", () => {
    const item = createMockElement("0");
    const child1 = createMockElement("1");
    const child2 = createMockElement("2");

    item.nextElementSibling = child1;
    child1.nextElementSibling = child2;

    child1.hidden = true;
    child2.hidden = true;

    restoreDescendantVisibility(item as unknown as HTMLElement);

    if (child1.hidden) {
      throw new Error("Expected child1 to be visible");
    }
    if (child2.hidden) {
      throw new Error("Expected child2 to be visible");
    }
  });

  it("keeps descendants hidden if parent collapsed", () => {
    const item = createMockElement("0");
    const child1 = createMockElement("1", "true");
    const grandchild = createMockElement("2");

    item.nextElementSibling = child1;
    child1.nextElementSibling = grandchild;

    grandchild.hidden = true;

    restoreDescendantVisibility(item as unknown as HTMLElement);

    if (child1.hidden) {
      throw new Error("Expected child1 to be visible");
    }
    if (!grandchild.hidden) {
      throw new Error("Expected grandchild to be hidden");
    }
  });
});

describe("toggleCommentCollapse", () => {
  it("collapses comment and hides descendants", () => {
    const item = createMockElement("0", undefined, "true");
    const button = createMockButton();

    item.classList = { contains: (cls: string) => cls === "hn-comment" } as typeof item.classList;
    item.querySelector = () => button;

    const child = createMockElement("1");
    item.nextElementSibling = child;

    toggleCommentCollapse(item as unknown as HTMLElement);

    if (item.dataset.collapsed !== "true") {
      throw new Error(`Expected collapsed "true", got "${item.dataset.collapsed}"`);
    }
    if (button.getAttribute("aria-expanded") !== "false") {
      throw new Error(`Expected aria-expanded "false", got "${button.getAttribute("aria-expanded")}"`);
    }
    if (!child.hidden) {
      throw new Error("Expected child to be hidden");
    }
  });

  it("expands comment and restores descendants", () => {
    const item = createMockElement("0", "true", "true");
    const button = createMockButton();

    item.classList = { contains: (cls: string) => cls === "hn-comment" } as typeof item.classList;
    item.querySelector = () => button;

    const child = createMockElement("1");
    item.nextElementSibling = child;
    child.hidden = true;

    toggleCommentCollapse(item as unknown as HTMLElement);

    if (item.dataset.collapsed !== "false") {
      throw new Error(`Expected collapsed "false", got "${item.dataset.collapsed}"`);
    }
    if (child.hidden) {
      throw new Error("Expected child to be visible");
    }
  });
});
