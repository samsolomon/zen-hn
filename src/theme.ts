/**
 * Theme toggle utilities for Zen HN
 */

import { renderIcon } from "./icons";

export type ThemePreference = "light" | "dark" | "system";

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
  if (value === "system") {
    return getSystemPrefersDark();
  }
  return value === "dark";
}

/**
 * Check if system prefers dark mode
 */
export function getSystemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

/**
 * Get storage value for theme
 * @param isDark - Whether dark mode is active
 * @returns Value to store ("dark" or "light")
 */
export function getThemeStorageValue(isDark: boolean): ThemePreference {
  return isDark ? "dark" : "light";
}

/**
 * Validate theme preference value
 */
export function isValidThemePreference(value: string): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Apply a theme preference to the document
 * @param preference - The theme preference to apply
 */
export function applyThemePreference(preference: ThemePreference): void {
  const html = document.documentElement;
  let shouldBeDark = false;

  if (preference === "system") {
    shouldBeDark = getSystemPrefersDark();
  } else if (preference === "dark") {
    shouldBeDark = true;
  }

  if (shouldBeDark) {
    html.classList.add(THEME_CLASS);
  } else {
    html.classList.remove(THEME_CLASS);
  }

  // Update sidebar theme button if it exists
  const themeButton = document.querySelector(
    "#zen-hn-sidebar .zen-hn-sidebar-icon-link[aria-label*='theme']"
  );
  if (themeButton) {
    const isDark = html.classList.contains(THEME_CLASS);
    themeButton.innerHTML = renderIcon(isDark ? "moon" : "sun");
    themeButton.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
    themeButton.setAttribute(
      "title",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  }
}

interface ThemeOption {
  value: ThemePreference;
  label: string;
  icon: "sun" | "moon" | "monitor";
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

/**
 * Build a theme control UI element
 * @param currentPreference - The currently selected theme preference
 * @param onChange - Callback when theme selection changes
 * @returns The theme control container element
 */
export function buildThemeControl(
  currentPreference: ThemePreference,
  onChange?: (preference: ThemePreference) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-theme-control";

  const label = document.createElement("span");
  label.className = "zen-hn-theme-label";
  label.textContent = "Theme";

  const options = document.createElement("div");
  options.className = "zen-hn-theme-options";

  THEME_OPTIONS.forEach((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zen-hn-theme-option";
    if (currentPreference === theme.value) {
      button.classList.add("is-active");
    }
    button.setAttribute("data-theme", theme.value);
    button.setAttribute("aria-label", `${theme.label} theme`);
    button.innerHTML = `${renderIcon(theme.icon)}<span>${theme.label}</span>`;

    button.addEventListener("click", (e) => {
      // Stop propagation to prevent HN's click handler from
      // choking on SVG elements (SVGAnimatedString vs string)
      e.stopPropagation();

      // Update active state
      options.querySelectorAll(".zen-hn-theme-option").forEach((btn) => {
        btn.classList.remove("is-active");
      });
      button.classList.add("is-active");

      // Apply theme and notify
      applyThemePreference(theme.value);
      onChange?.(theme.value);
    });

    options.appendChild(button);
  });

  container.appendChild(label);
  container.appendChild(options);
  return container;
}
