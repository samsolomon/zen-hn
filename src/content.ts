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
  type ThemePreference,
  THEME_CLASS,
  THEME_STORAGE_KEY,
  toggleTheme,
  getThemeIcon,
  getThemeLabel,
  parseThemeFromStorage,
  getSystemPrefersDark,
  getThemeStorageValue,
  isValidThemePreference,
  applyThemePreference,
  buildThemeControl,
} from "./theme";

// Import everything for globalThis exposure
import {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
} from "./icons";

import {
  THEME_CLASS,
  THEME_STORAGE_KEY,
  toggleTheme,
  getThemeIcon,
  getThemeLabel,
  parseThemeFromStorage,
  getSystemPrefersDark,
  getThemeStorageValue,
  isValidThemePreference,
  applyThemePreference,
  buildThemeControl,
} from "./theme";

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnIcons = {
  PHOSPHOR_SVGS,
  HN_HOME_SVG,
  renderIcon,
  registerIcon,
};

(globalThis as Record<string, unknown>).ZenHnTheme = {
  THEME_CLASS,
  THEME_STORAGE_KEY,
  toggleTheme,
  getThemeIcon,
  getThemeLabel,
  parseThemeFromStorage,
  getSystemPrefersDark,
  getThemeStorageValue,
  isValidThemePreference,
  applyThemePreference,
  buildThemeControl,
};
