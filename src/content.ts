/**
 * Zen HN Content Script Entry Point
 *
 * This is the main entry point for the bundled content script.
 * It exports icons and utilities that can be used by the extension.
 */

export {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
  type IconName,
} from "./icons";

export {
  ACTION_STORE_KEY,
  ACTION_STORE_VERSION,
  ACTION_STORE_DEBOUNCE_MS,
  loadActionStore,
  getCurrentUserKey,
  getStoredAction,
  updateStoredAction,
  isActionStoreLoaded,
  getActionStore,
  type VoteDirection,
  type ActionItem,
  type UserActionBucket,
  type ActionStore,
  type ActionKind,
  type ActionUpdate,
} from "./actionStore";

export {
  type ColorModePreference,
  type ThemePreference,
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  getSavedColorMode,
  saveColorMode,
  initColorMode,
  listenForSystemColorModeChanges,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getSystemPrefersDark,
  getColorModeStorageValue,
  isValidColorModePreference,
  applyColorMode,
  buildColorModeControl,
  buildColorModeControlWithStorage,
  appendColorModeControl,
  getSavedTheme,
  saveTheme,
  applyTheme,
  initTheme,
  buildThemeButtons,
  buildThemeButtonsWithStorage,
  appendThemeButtons,
  appendAppearanceControls,
  styleNativeSelect,
  styleUserPageSelects,
} from "./colorMode";

// Import everything for globalThis exposure
import {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
} from "./icons";

import {
  ACTION_STORE_KEY,
  ACTION_STORE_VERSION,
  ACTION_STORE_DEBOUNCE_MS,
  loadActionStore,
  getCurrentUserKey,
  getStoredAction,
  updateStoredAction,
  isActionStoreLoaded,
  getActionStore,
} from "./actionStore";

import {
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  getSavedColorMode,
  saveColorMode,
  initColorMode,
  listenForSystemColorModeChanges,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getSystemPrefersDark,
  getColorModeStorageValue,
  isValidColorModePreference,
  applyColorMode,
  buildColorModeControl,
  buildColorModeControlWithStorage,
  appendColorModeControl,
  getSavedTheme,
  saveTheme,
  applyTheme,
  initTheme,
  buildThemeButtons,
  buildThemeButtonsWithStorage,
  appendThemeButtons,
  appendAppearanceControls,
  styleNativeSelect,
  styleUserPageSelects,
} from "./colorMode";

// Import logic module (self-exposes on globalThis)
import "./logic";

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnIcons = {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
};

(globalThis as Record<string, unknown>).ZenHnColorMode = {
  COLOR_MODE_CLASS,
  COLOR_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  getSavedColorMode,
  saveColorMode,
  initColorMode,
  listenForSystemColorModeChanges,
  toggleColorMode,
  getColorModeIcon,
  getColorModeLabel,
  parseColorModeFromStorage,
  getSystemPrefersDark,
  getColorModeStorageValue,
  isValidColorModePreference,
  applyColorMode,
  buildColorModeControl,
  buildColorModeControlWithStorage,
  appendColorModeControl,
  getSavedTheme,
  saveTheme,
  applyTheme,
  initTheme,
  buildThemeButtons,
  buildThemeButtonsWithStorage,
  appendThemeButtons,
  appendAppearanceControls,
  styleNativeSelect,
  styleUserPageSelects,
};

(globalThis as Record<string, unknown>).ZenHnActionStore = {
  ACTION_STORE_KEY,
  ACTION_STORE_VERSION,
  ACTION_STORE_DEBOUNCE_MS,
  loadActionStore,
  getCurrentUserKey,
  getStoredAction,
  updateStoredAction,
  isActionStoreLoaded,
  getActionStore,
};
