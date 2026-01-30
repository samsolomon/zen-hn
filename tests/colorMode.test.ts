import assert from "node:assert/strict";
import { test } from "node:test";

import {
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getColorModeStorageValue,
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
