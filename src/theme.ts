/**
 * Theme toggle utilities for Zen HN
 */

export type Theme = "light" | "dark";

export const THEME_CLASS = "dark-theme";
export const THEME_STORAGE_KEY = "theme";

/**
 * Toggle theme state
 * @param isDark - Current dark mode state
 * @returns New dark mode state
 */
export function toggleTheme(isDark: boolean): boolean {
  return !isDark;
}

/**
 * Get the icon name for the current theme state
 * @param isDark - Whether dark mode is active
 * @returns Icon name ("moon" for dark, "sun" for light)
 */
export function getThemeIcon(isDark: boolean): string {
  return isDark ? "moon" : "sun";
}

/**
 * Get the aria-label for the theme toggle button
 * @param isDark - Whether dark mode is active
 * @returns Aria label describing the action
 */
export function getThemeLabel(isDark: boolean): string {
  return isDark ? "Switch to light theme" : "Switch to dark theme";
}

/**
 * Parse theme from storage value
 * @param value - Value from storage (may be undefined)
 * @returns Whether dark mode should be active
 */
export function parseThemeFromStorage(value: string | undefined): boolean {
  return value === "dark";
}

/**
 * Get storage value for theme
 * @param isDark - Whether dark mode is active
 * @returns Value to store ("dark" or "light")
 */
export function getThemeStorageValue(isDark: boolean): Theme {
  return isDark ? "dark" : "light";
}
