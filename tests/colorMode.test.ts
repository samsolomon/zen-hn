import assert from "node:assert/strict";
import { test } from "node:test";

import {
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getColorModeStorageValue,
  isValidColorModePreference,
  type ThemePreference,
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
test("ThemePreference includes all 31 Radix color scales", () => {
  const allThemes: ThemePreference[] = [
    "gray",
    "mauve",
    "slate",
    "sage",
    "olive",
    "sand",
    "tomato",
    "red",
    "ruby",
    "crimson",
    "pink",
    "plum",
    "purple",
    "violet",
    "iris",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "jade",
    "green",
    "grass",
    "bronze",
    "gold",
    "brown",
    "orange",
    "amber",
    "yellow",
    "lime",
    "mint",
    "sky",
  ];
  assert.equal(allThemes.length, 31);
});
