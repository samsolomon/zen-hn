/**
 * Color mode utilities for Zen HN
 */

import { renderIcon } from "./icons";

export type ColorModePreference = "light" | "dark" | "system";

export const COLOR_MODE_CLASS = "dark-theme";
export const COLOR_MODE_STORAGE_KEY = "colorMode";

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
