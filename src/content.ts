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
  buildThemeSelect,
  buildThemeSelectWithStorage,
  appendThemeSelect,
  appendAppearanceControls,
} from "./colorMode";

// Import everything for globalThis exposure
import {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
} from "./icons";

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
  buildThemeSelect,
  buildThemeSelectWithStorage,
  appendThemeSelect,
  appendAppearanceControls,
} from "./colorMode";

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
  buildThemeSelect,
  buildThemeSelectWithStorage,
  appendThemeSelect,
  appendAppearanceControls,
};
