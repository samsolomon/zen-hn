import assert from "node:assert/strict";
import { test } from "node:test";

import {
  isTypingInInput,
  shouldNavigateBack,
  shouldMarkAsInteracted,
} from "../src/externalSiteEscape.ts";

// =============================================================================
// isTypingInInput tests
// =============================================================================

test("isTypingInInput returns false for null activeElement", () => {
  assert.equal(isTypingInInput(null), false);
});

test("isTypingInInput returns true for input element", () => {
  const input = { tagName: "INPUT" } as Element;
  assert.equal(isTypingInInput(input), true);
});

test("isTypingInInput returns true for textarea element", () => {
  const textarea = { tagName: "TEXTAREA" } as Element;
  assert.equal(isTypingInInput(textarea), true);
});

test("isTypingInInput returns true for select element", () => {
  const select = { tagName: "SELECT" } as Element;
  assert.equal(isTypingInInput(select), true);
});

test("isTypingInInput returns true for contentEditable element", () => {
  const div = { tagName: "DIV", isContentEditable: true } as unknown as Element;
  assert.equal(isTypingInInput(div), true);
});

test("isTypingInInput returns false for regular div", () => {
  const div = { tagName: "DIV", isContentEditable: false } as unknown as Element;
  assert.equal(isTypingInInput(div), false);
});

test("isTypingInInput returns false for button", () => {
  const button = { tagName: "BUTTON", isContentEditable: false } as unknown as Element;
  assert.equal(isTypingInInput(button), false);
});

// =============================================================================
// shouldNavigateBack tests
// =============================================================================

test("shouldNavigateBack returns true for Escape without interaction", () => {
  const event = { key: "Escape", metaKey: false, ctrlKey: false, altKey: false };
  assert.equal(shouldNavigateBack(event, false, null), true);
});

test("shouldNavigateBack returns false for non-Escape key", () => {
  const event = { key: "Enter", metaKey: false, ctrlKey: false, altKey: false };
  assert.equal(shouldNavigateBack(event, false, null), false);
});

test("shouldNavigateBack returns false when user has interacted", () => {
  const event = { key: "Escape", metaKey: false, ctrlKey: false, altKey: false };
  assert.equal(shouldNavigateBack(event, true, null), false);
});

test("shouldNavigateBack returns false when typing in input", () => {
  const event = { key: "Escape", metaKey: false, ctrlKey: false, altKey: false };
  const input = { tagName: "INPUT" } as Element;
  assert.equal(shouldNavigateBack(event, false, input), false);
});

test("shouldNavigateBack returns false when typing in textarea", () => {
  const event = { key: "Escape", metaKey: false, ctrlKey: false, altKey: false };
  const textarea = { tagName: "TEXTAREA" } as Element;
  assert.equal(shouldNavigateBack(event, false, textarea), false);
});

test("shouldNavigateBack returns false with metaKey pressed", () => {
  const event = { key: "Escape", metaKey: true, ctrlKey: false, altKey: false };
  assert.equal(shouldNavigateBack(event, false, null), false);
});

test("shouldNavigateBack returns false with ctrlKey pressed", () => {
  const event = { key: "Escape", metaKey: false, ctrlKey: true, altKey: false };
  assert.equal(shouldNavigateBack(event, false, null), false);
});

test("shouldNavigateBack returns false with altKey pressed", () => {
  const event = { key: "Escape", metaKey: false, ctrlKey: false, altKey: true };
  assert.equal(shouldNavigateBack(event, false, null), false);
});

test("shouldNavigateBack returns true with focus on regular element", () => {
  const event = { key: "Escape", metaKey: false, ctrlKey: false, altKey: false };
  const div = { tagName: "DIV", isContentEditable: false } as unknown as Element;
  assert.equal(shouldNavigateBack(event, false, div), true);
});

// =============================================================================
// shouldMarkAsInteracted tests
// =============================================================================

test("shouldMarkAsInteracted returns true for regular keys", () => {
  assert.equal(shouldMarkAsInteracted("a"), true);
  assert.equal(shouldMarkAsInteracted("Enter"), true);
  assert.equal(shouldMarkAsInteracted(" "), true);
  assert.equal(shouldMarkAsInteracted("ArrowDown"), true);
});

test("shouldMarkAsInteracted returns false for Escape key", () => {
  assert.equal(shouldMarkAsInteracted("Escape"), false);
});
