import assert from "node:assert/strict";
import { test } from "node:test";

import {
  THEME_CLASS,
  THEME_STORAGE_KEY,
  toggleTheme,
  getThemeIcon,
  getThemeLabel,
  parseThemeFromStorage,
  getThemeStorageValue,
} from "../src/theme.ts";

test("THEME_CLASS is dark-theme", () => {
  assert.equal(THEME_CLASS, "dark-theme");
});

test("THEME_STORAGE_KEY is theme", () => {
  assert.equal(THEME_STORAGE_KEY, "theme");
});

test("toggleTheme from light to dark", () => {
  assert.equal(toggleTheme(false), true);
});

test("toggleTheme from dark to light", () => {
  assert.equal(toggleTheme(true), false);
});

test("getThemeIcon returns sun for light mode", () => {
  assert.equal(getThemeIcon(false), "sun");
});

test("getThemeIcon returns moon for dark mode", () => {
  assert.equal(getThemeIcon(true), "moon");
});

test("getThemeLabel returns switch to dark for light mode", () => {
  assert.equal(getThemeLabel(false), "Switch to dark theme");
});

test("getThemeLabel returns switch to light for dark mode", () => {
  assert.equal(getThemeLabel(true), "Switch to light theme");
});

test("parseThemeFromStorage returns true for dark", () => {
  assert.equal(parseThemeFromStorage("dark"), true);
});

test("parseThemeFromStorage returns false for light", () => {
  assert.equal(parseThemeFromStorage("light"), false);
});

test("parseThemeFromStorage returns false for undefined", () => {
  assert.equal(parseThemeFromStorage(undefined), false);
});

test("parseThemeFromStorage returns false for invalid value", () => {
  assert.equal(parseThemeFromStorage("invalid"), false);
});

test("getThemeStorageValue returns dark for true", () => {
  assert.equal(getThemeStorageValue(true), "dark");
});

test("getThemeStorageValue returns light for false", () => {
  assert.equal(getThemeStorageValue(false), "light");
});
