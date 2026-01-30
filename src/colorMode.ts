/**
 * Color mode utilities for Zen HN
 */

import { renderIcon } from "./icons";

export type ColorModePreference = "light" | "dark" | "system";
export type ThemePreference =
  | "gray"
  | "mauve"
  | "slate"
  | "sage"
  | "olive"
  | "sand"
  | "tomato"
  | "red"
  | "ruby"
  | "crimson"
  | "pink"
  | "plum"
  | "purple"
  | "violet"
  | "iris"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "jade"
  | "green"
  | "grass"
  | "bronze"
  | "gold"
  | "brown"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "mint"
  | "sky";

export const COLOR_MODE_CLASS = "dark-theme";
export const COLOR_MODE_STORAGE_KEY = "colorMode";
export const THEME_STORAGE_KEY = "theme";

/**
 * Check if Chrome storage API is available
 */
function hasChromeStorage(): boolean {
  return typeof chrome !== "undefined" && !!chrome.storage;
}

/**
 * Get the saved color mode preference from storage
 * @returns Promise resolving to the saved preference, or undefined if not set
 */
export async function getSavedColorMode(): Promise<ColorModePreference | undefined> {
  if (!hasChromeStorage()) return undefined;
  const result = await chrome.storage.local.get(COLOR_MODE_STORAGE_KEY);
  return result[COLOR_MODE_STORAGE_KEY] as ColorModePreference | undefined;
}

/**
 * Save color mode preference to storage
 * @param preference - The preference to save
 */
export async function saveColorMode(preference: ColorModePreference): Promise<void> {
  if (!hasChromeStorage()) return;
  await chrome.storage.local.set({ [COLOR_MODE_STORAGE_KEY]: preference });
}

/**
 * Initialize color mode from saved preference
 * Loads the saved preference from storage and applies it
 */
export async function initColorMode(): Promise<void> {
  const saved = await getSavedColorMode();
  if (saved) {
    applyColorMode(saved);
  }
}

/**
 * Listen for system color scheme changes and update when in "system" mode
 */
export function listenForSystemColorModeChanges(): void {
  if (!window.matchMedia) return;

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", async () => {
    const saved = await getSavedColorMode();
    if (saved === "system") {
      applyColorMode("system");
    }
  });
}

/**
 * Toggle color mode state
 * @param isDark - Current dark mode state
 * @returns New dark mode state
 */
export function toggleColorMode(isDark: boolean): boolean {
  return !isDark;
}

/**
 * Get the icon name for the current color mode state
 * @param isDark - Whether dark mode is active
 * @returns Icon name ("moon" for dark, "sun" for light)
 */
export function getColorModeIcon(isDark: boolean): string {
  return isDark ? "moon" : "sun";
}

/**
 * Get the aria-label for the color mode toggle button
 * @param isDark - Whether dark mode is active
 * @returns Aria label describing the action
 */
export function getColorModeLabel(isDark: boolean): string {
  return isDark ? "Switch to light mode" : "Switch to dark mode";
}

/**
 * Parse color mode from storage value
 * @param value - Value from storage (may be undefined)
 * @returns Whether dark mode should be active
 */
export function parseColorModeFromStorage(value: string | undefined): boolean {
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
 * Get storage value for color mode
 * @param isDark - Whether dark mode is active
 * @returns Value to store ("dark" or "light")
 */
export function getColorModeStorageValue(isDark: boolean): ColorModePreference {
  return isDark ? "dark" : "light";
}

/**
 * Validate color mode preference value
 */
export function isValidColorModePreference(value: string): value is ColorModePreference {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Apply a color mode preference to the document
 * @param preference - The color mode preference to apply
 */
export function applyColorMode(preference: ColorModePreference): void {
  const html = document.documentElement;
  let shouldBeDark = false;

  if (preference === "system") {
    shouldBeDark = getSystemPrefersDark();
  } else if (preference === "dark") {
    shouldBeDark = true;
  }

  if (shouldBeDark) {
    html.classList.add(COLOR_MODE_CLASS);
  } else {
    html.classList.remove(COLOR_MODE_CLASS);
  }
}

interface ColorModeOption {
  value: ColorModePreference;
  label: string;
  icon: "sun" | "moon" | "monitor";
}

const COLOR_MODE_OPTIONS: ColorModeOption[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

/**
 * Build a color mode control UI element
 * @param currentPreference - The currently selected color mode preference
 * @param onChange - Callback when color mode selection changes
 * @returns The color mode control container element
 */
export function buildColorModeControl(
  currentPreference: ColorModePreference,
  onChange?: (preference: ColorModePreference) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-color-mode-control";

  const label = document.createElement("span");
  label.className = "zen-hn-color-mode-label";
  label.textContent = "Color mode";

  const options = document.createElement("div");
  options.className = "zen-hn-color-mode-options";

  COLOR_MODE_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zen-hn-color-mode-option";
    if (currentPreference === option.value) {
      button.classList.add("is-active");
    }
    button.setAttribute("data-color-mode", option.value);
    button.setAttribute("aria-label", `${option.label} mode`);
    button.innerHTML = `${renderIcon(option.icon)}<span>${option.label}</span>`;

    button.addEventListener("click", (e) => {
      // Stop propagation to prevent HN's click handler from
      // choking on SVG elements (SVGAnimatedString vs string)
      e.stopPropagation();

      // Update active state
      options.querySelectorAll(".zen-hn-color-mode-option").forEach((btn) => {
        btn.classList.remove("is-active");
      });
      button.classList.add("is-active");

      // Apply color mode and notify
      applyColorMode(option.value);
      onChange?.(option.value);
    });

    options.appendChild(button);
  });

  container.appendChild(label);
  container.appendChild(options);
  return container;
}

/**
 * Build a color mode control with automatic storage persistence
 * @param currentPreference - The currently selected color mode preference
 * @returns The color mode control container element
 */
export function buildColorModeControlWithStorage(
  currentPreference: ColorModePreference
): HTMLElement {
  return buildColorModeControl(currentPreference, (preference) => {
    saveColorMode(preference);
  });
}

/**
 * Build and append a color mode control to a container, loading the current preference from storage
 * @param container - The container element to append the control to
 */
export async function appendColorModeControl(container: HTMLElement): Promise<void> {
  const saved = await getSavedColorMode();
  const current = saved || "light";
  const control = buildColorModeControlWithStorage(current);
  container.appendChild(control);
}

// =============================================================================
// Theme (color palette) controls
// =============================================================================

interface ThemeOption {
  value: ThemePreference;
  label: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: "amber", label: "Amber" },
  { value: "blue", label: "Blue" },
  { value: "bronze", label: "Bronze" },
  { value: "brown", label: "Brown" },
  { value: "crimson", label: "Crimson" },
  { value: "cyan", label: "Cyan" },
  { value: "gold", label: "Gold" },
  { value: "grass", label: "Grass" },
  { value: "gray", label: "Gray" },
  { value: "green", label: "Green" },
  { value: "indigo", label: "Indigo" },
  { value: "iris", label: "Iris" },
  { value: "jade", label: "Jade" },
  { value: "lime", label: "Lime" },
  { value: "mauve", label: "Mauve" },
  { value: "mint", label: "Mint" },
  { value: "olive", label: "Olive" },
  { value: "orange", label: "Orange" },
  { value: "pink", label: "Pink" },
  { value: "plum", label: "Plum" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "ruby", label: "Ruby" },
  { value: "sage", label: "Sage" },
  { value: "sand", label: "Sand" },
  { value: "sky", label: "Sky" },
  { value: "slate", label: "Slate" },
  { value: "teal", label: "Teal" },
  { value: "tomato", label: "Tomato" },
  { value: "violet", label: "Violet" },
  { value: "yellow", label: "Yellow" },
];

/**
 * Get the saved theme preference from storage
 */
export async function getSavedTheme(): Promise<ThemePreference | undefined> {
  if (!hasChromeStorage()) return undefined;
  const result = await chrome.storage.local.get(THEME_STORAGE_KEY);
  return result[THEME_STORAGE_KEY] as ThemePreference | undefined;
}

/**
 * Save theme preference to storage
 */
export async function saveTheme(theme: ThemePreference): Promise<void> {
  if (!hasChromeStorage()) return;
  await chrome.storage.local.set({ [THEME_STORAGE_KEY]: theme });
}

/**
 * Apply a theme to the document
 * @param theme - The theme to apply
 */
export function applyTheme(theme: ThemePreference): void {
  const html = document.documentElement;
  if (theme === "gray") {
    html.removeAttribute("data-theme");
  } else {
    html.setAttribute("data-theme", theme);
  }
}

/**
 * Initialize theme from saved preference
 */
export async function initTheme(): Promise<void> {
  const saved = await getSavedTheme();
  if (saved) {
    applyTheme(saved);
  }
}

/**
 * Build a theme select control
 * @param currentTheme - The currently selected theme
 * @param onChange - Callback when theme selection changes
 */
export function buildThemeSelect(
  currentTheme: ThemePreference,
  onChange?: (theme: ThemePreference) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-theme-select-control";

  const label = document.createElement("label");
  label.className = "zen-hn-theme-select-label";
  label.textContent = "Theme";

  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-theme-select-wrapper";

  const select = document.createElement("select");
  select.className = "zen-hn-theme-select";

  THEME_OPTIONS.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    if (currentTheme === option.value) {
      optionEl.selected = true;
    }
    select.appendChild(optionEl);
  });

  select.addEventListener("change", () => {
    const value = select.value as ThemePreference;
    applyTheme(value);
    onChange?.(value);
  });

  label.setAttribute("for", "zen-hn-theme-select");
  select.id = "zen-hn-theme-select";

  wrapper.appendChild(select);
  container.appendChild(label);
  container.appendChild(wrapper);
  return container;
}

/**
 * Build a theme select with automatic storage persistence
 */
export function buildThemeSelectWithStorage(currentTheme: ThemePreference): HTMLElement {
  return buildThemeSelect(currentTheme, (theme) => {
    saveTheme(theme);
  });
}

/**
 * Build and append a theme select to a container, loading the current preference from storage
 */
export async function appendThemeSelect(container: HTMLElement): Promise<void> {
  const saved = await getSavedTheme();
  const current = saved || "gray";
  const control = buildThemeSelectWithStorage(current);
  container.appendChild(control);
}

/**
 * Append all appearance controls (color mode + theme) to a container
 */
export async function appendAppearanceControls(container: HTMLElement): Promise<void> {
  await appendColorModeControl(container);
  await appendThemeSelect(container);
}

/**
 * Style a native select element with the zen-hn select styling
 * Wraps the select in a wrapper div for chevron pseudo-elements
 */
export function styleNativeSelect(select: HTMLSelectElement): void {
  // Skip if already styled
  if (select.classList.contains("zen-hn-theme-select")) return;

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-theme-select-wrapper";

  // Insert wrapper before select and move select inside
  select.parentNode?.insertBefore(wrapper, select);
  wrapper.appendChild(select);

  // Add styling class to select
  select.classList.add("zen-hn-theme-select");
}

/**
 * Style all native selects on the user settings page
 */
export function styleUserPageSelects(): void {
  const selects = document.querySelectorAll<HTMLSelectElement>(
    'select[name="showd"], select[name="nopro"]'
  );
  selects.forEach(styleNativeSelect);
}
