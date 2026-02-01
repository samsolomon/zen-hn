/**
 * Color mode utilities for Zen HN
 */

import { renderIcon } from "./icons";

export type ColorModePreference = "light" | "dark" | "system";
export type FontFamilyPreference =
  | "system"
  | "humanist"
  | "geometric"
  | "classical"
  | "serif"
  | "mono"
  | "inter"
  | "ibm-plex";
export type ThemePreference =
  | "zen"
  | "mauve"
  | "slate"
  | "sage"
  | "olive"
  | "sand"
  | "tomato"
  | "ruby"
  | "crimson"
  | "pink"
  | "plum"
  | "violet"
  | "iris"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "jade"
  | "grass"
  | "bronze"
  | "gold"
  | "orange";

export type FontSizePreference = "smaller" | "small" | "default" | "large" | "larger";

export const COLOR_MODE_CLASS = "dark-theme";
export const COLOR_MODE_STORAGE_KEY = "colorMode";
export const THEME_STORAGE_KEY = "theme";
export const FONT_FAMILY_STORAGE_KEY = "fontFamily";
export const FONT_SIZE_STORAGE_KEY = "fontSize";

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
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
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
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");

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
  { value: "zen", label: "Zen" },
  { value: "slate", label: "Slate" },
  { value: "sand", label: "Sand" },
  { value: "olive", label: "Olive" },
  { value: "sage", label: "Sage" },
  { value: "grass", label: "Grass" },
  { value: "jade", label: "Jade" },
  { value: "teal", label: "Teal" },
  { value: "cyan", label: "Cyan" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "iris", label: "Iris" },
  { value: "violet", label: "Violet" },
  { value: "plum", label: "Plum" },
  { value: "mauve", label: "Mauve" },
  { value: "pink", label: "Pink" },
  { value: "ruby", label: "Ruby" },
  { value: "crimson", label: "Crimson" },
  { value: "tomato", label: "Tomato" },
  { value: "orange", label: "Orange" },
  { value: "gold", label: "Gold" },
  { value: "bronze", label: "Bronze" },
];

/**
 * Theme color mappings for button swatches
 */
// Radix gray-9 values for each theme (used for swatches)
const THEME_COLORS: Record<ThemePreference, string> = {
  zen: "#8d8d8d",
  mauve: "#8e8c99",
  slate: "#8b8d98",
  sage: "#868e8b",
  olive: "#898e87",
  sand: "#8d8d86",
  tomato: "#e54d2e",
  ruby: "#e54666",
  crimson: "#e93d82",
  pink: "#d6409f",
  plum: "#ab4aba",
  violet: "#6e56cf",
  iris: "#5b5bd6",
  indigo: "#3e63dd",
  blue: "#0090ff",
  cyan: "#00a2c7",
  teal: "#12a594",
  jade: "#29a383",
  grass: "#46a758",
  bronze: "#a18072",
  gold: "#978365",
  orange: "#f76b15",
};

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
  if (theme === "zen") {
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
 * Build a theme button group control
 * @param currentTheme - The currently selected theme
 * @param onChange - Callback when theme selection changes
 */
export function buildThemeButtons(
  currentTheme: ThemePreference,
  onChange?: (theme: ThemePreference) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-theme-buttons-control";

  const label = document.createElement("div");
  label.className = "zen-hn-theme-buttons-label";
  label.textContent = "Theme";

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "zen-hn-theme-buttons";

  THEME_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zen-hn-theme-button";
    button.setAttribute("data-theme", option.value);
    button.setAttribute("aria-label", `Select ${option.label} theme`);
    button.title = option.label;

    const swatch = document.createElement("span");
    swatch.className = "zen-hn-theme-swatch";
    swatch.style.setProperty("--theme-color", THEME_COLORS[option.value] || "#978365");

    const buttonLabel = document.createElement("span");
    buttonLabel.className = "zen-hn-theme-button-label";
    buttonLabel.textContent = option.label;

    button.appendChild(swatch);
    button.appendChild(buttonLabel);

    if (currentTheme === option.value) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }

    button.addEventListener("click", () => {
      const selectedValue = option.value as ThemePreference;
      applyTheme(selectedValue);
      onChange?.(selectedValue);

      buttonsWrapper.querySelectorAll(".zen-hn-theme-button").forEach((btn) => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    });

    buttonsWrapper.appendChild(button);
  });

  container.appendChild(label);
  container.appendChild(buttonsWrapper);
  return container;
}

/**
 * Build a theme button group with automatic storage persistence
 */
export function buildThemeButtonsWithStorage(currentTheme: ThemePreference): HTMLElement {
  return buildThemeButtons(currentTheme, (theme) => {
    saveTheme(theme);
  });
}

/**
 * Build and append a theme button group to a container, loading the current preference from storage
 */
export async function appendThemeButtons(container: HTMLElement): Promise<void> {
  const saved = await getSavedTheme();
  const current = saved || "zen";
  const control = buildThemeButtonsWithStorage(current);
  container.appendChild(control);
}

/**
 * Append all appearance controls (color mode + theme + font) to a container
 */
export async function appendAppearanceControls(container: HTMLElement): Promise<void> {
  await appendColorModeControl(container);
  await appendThemeButtons(container);
  await appendFontFamilyButtons(container);
  await appendFontSizeButtons(container);
}

// =============================================================================
// Font Family controls
// =============================================================================

interface FontFamilyOption {
  value: FontFamilyPreference;
  label: string;
}

const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  { value: "system", label: "System" },
  { value: "humanist", label: "Humanist" },
  { value: "geometric", label: "Geometric" },
  { value: "classical", label: "Classical" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
  { value: "inter", label: "Inter" },
  { value: "ibm-plex", label: "IBM Plex" },
];

/**
 * Get the saved font family preference from storage
 */
export async function getSavedFontFamily(): Promise<FontFamilyPreference | undefined> {
  if (!hasChromeStorage()) return undefined;
  const result = await chrome.storage.local.get(FONT_FAMILY_STORAGE_KEY);
  return result[FONT_FAMILY_STORAGE_KEY] as FontFamilyPreference | undefined;
}

/**
 * Save font family preference to storage
 */
export async function saveFontFamily(fontFamily: FontFamilyPreference): Promise<void> {
  if (!hasChromeStorage()) return;
  await chrome.storage.local.set({ [FONT_FAMILY_STORAGE_KEY]: fontFamily });
}

/**
 * Apply a font family to the document
 * @param fontFamily - The font family to apply
 */
export function applyFontFamily(fontFamily: FontFamilyPreference): void {
  const html = document.documentElement;
  if (fontFamily === "system") {
    html.removeAttribute("data-font-family");
  } else {
    html.setAttribute("data-font-family", fontFamily);
  }
}

/**
 * Initialize font family from saved preference
 */
export async function initFontFamily(): Promise<void> {
  const saved = await getSavedFontFamily();
  if (saved) {
    applyFontFamily(saved);
  }
}

/**
 * Build a font family button group control
 * @param currentFontFamily - The currently selected font family
 * @param onChange - Callback when font family selection changes
 */
export function buildFontFamilyButtons(
  currentFontFamily: FontFamilyPreference,
  onChange?: (fontFamily: FontFamilyPreference) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-font-family-control";

  const label = document.createElement("div");
  label.className = "zen-hn-font-family-label";
  label.textContent = "Font";

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "zen-hn-font-family-buttons";

  FONT_FAMILY_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zen-hn-font-family-button";
    button.setAttribute("data-font-family", option.value);
    button.setAttribute("aria-label", `Select ${option.label} font`);
    button.textContent = option.label;

    if (currentFontFamily === option.value) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }

    button.addEventListener("click", () => {
      const selectedValue = option.value as FontFamilyPreference;
      applyFontFamily(selectedValue);
      onChange?.(selectedValue);

      buttonsWrapper.querySelectorAll(".zen-hn-font-family-button").forEach((btn) => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    });

    buttonsWrapper.appendChild(button);
  });

  container.appendChild(label);
  container.appendChild(buttonsWrapper);
  return container;
}

/**
 * Build a font family button group with automatic storage persistence
 */
export function buildFontFamilyButtonsWithStorage(
  currentFontFamily: FontFamilyPreference
): HTMLElement {
  return buildFontFamilyButtons(currentFontFamily, (fontFamily) => {
    saveFontFamily(fontFamily);
  });
}

/**
 * Build and append font family buttons to a container, loading the current preference from storage
 */
export async function appendFontFamilyButtons(container: HTMLElement): Promise<void> {
  const saved = await getSavedFontFamily();
  const current = saved || "system";
  const control = buildFontFamilyButtonsWithStorage(current);
  container.appendChild(control);
}

// =============================================================================
// Font Size controls
// =============================================================================

interface FontSizeOption {
  value: FontSizePreference;
  label: string;
}

const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { value: "smaller", label: "Aa - Smaller" },
  { value: "small", label: "Aa - Small" },
  { value: "default", label: "Aa - Medium" },
  { value: "large", label: "Aa - Large" },
  { value: "larger", label: "Aa - Larger" },
];

/**
 * Get the saved font size preference from storage
 */
export async function getSavedFontSize(): Promise<FontSizePreference | undefined> {
  if (!hasChromeStorage()) return undefined;
  const result = await chrome.storage.local.get(FONT_SIZE_STORAGE_KEY);
  return result[FONT_SIZE_STORAGE_KEY] as FontSizePreference | undefined;
}

/**
 * Save font size preference to storage
 */
export async function saveFontSize(size: FontSizePreference): Promise<void> {
  if (!hasChromeStorage()) return;
  await chrome.storage.local.set({ [FONT_SIZE_STORAGE_KEY]: size });
}

/**
 * Apply a font size to the document
 * @param size - The font size to apply
 */
export function applyFontSize(size: FontSizePreference): void {
  const html = document.documentElement;
  if (size === "default") {
    html.removeAttribute("data-font-size");
  } else {
    html.setAttribute("data-font-size", size);
  }
}

/**
 * Initialize font size from saved preference
 */
export async function initFontSize(): Promise<void> {
  const saved = await getSavedFontSize();
  if (saved) {
    applyFontSize(saved);
  }
}

/**
 * Build a font size button group control
 * @param currentSize - The currently selected font size
 * @param onChange - Callback when font size selection changes
 */
export function buildFontSizeButtons(
  currentSize: FontSizePreference,
  onChange?: (size: FontSizePreference) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-font-size-control";

  const label = document.createElement("div");
  label.className = "zen-hn-font-size-label";
  label.textContent = "Font Size";

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "zen-hn-font-size-buttons";

  FONT_SIZE_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zen-hn-font-size-button";
    button.setAttribute("data-font-size", option.value);
    button.setAttribute("aria-label", `Select ${option.value} font size`);
    button.textContent = option.label;

    if (currentSize === option.value) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }

    button.addEventListener("click", () => {
      const selectedValue = option.value as FontSizePreference;
      applyFontSize(selectedValue);
      onChange?.(selectedValue);

      buttonsWrapper.querySelectorAll(".zen-hn-font-size-button").forEach((btn) => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    });

    buttonsWrapper.appendChild(button);
  });

  container.appendChild(label);
  container.appendChild(buttonsWrapper);
  return container;
}

/**
 * Build a font size button group with automatic storage persistence
 */
export function buildFontSizeButtonsWithStorage(
  currentSize: FontSizePreference
): HTMLElement {
  return buildFontSizeButtons(currentSize, (size) => {
    saveFontSize(size);
  });
}

/**
 * Build and append font size buttons to a container, loading the current preference from storage
 */
export async function appendFontSizeButtons(container: HTMLElement): Promise<void> {
  const saved = await getSavedFontSize();
  const current = saved || "default";
  const control = buildFontSizeButtonsWithStorage(current);
  container.appendChild(control);
}

// =============================================================================
// External Site Escape Toggle
// =============================================================================

/**
 * Get the current external escape status from the background script
 */
async function getExternalEscapeStatus(): Promise<boolean> {
  if (!hasChromeStorage()) return false;
  try {
    const response = await chrome.runtime.sendMessage({
      type: "getExternalEscapeStatus",
    });
    return response?.enabled ?? false;
  } catch {
    return false;
  }
}

/**
 * Toggle external escape feature via the background script
 */
async function toggleExternalEscape(
  enable: boolean
): Promise<{ success: boolean; enabled: boolean }> {
  if (!hasChromeStorage()) return { success: false, enabled: false };
  try {
    const response = await chrome.runtime.sendMessage({
      type: "toggleExternalEscape",
      enable,
    });
    return response ?? { success: false, enabled: false };
  } catch {
    return { success: false, enabled: false };
  }
}

/**
 * Build the external escape toggle control
 */
function buildExternalEscapeToggle(
  isEnabled: boolean,
  onChange?: (enabled: boolean) => void
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-setting-toggle-control";

  const labelContainer = document.createElement("div");
  labelContainer.className = "zen-hn-setting-toggle-label-container";

  const label = document.createElement("span");
  label.className = "zen-hn-setting-toggle-label";
  label.textContent = "Escape to return";

  const description = document.createElement("span");
  description.className = "zen-hn-setting-toggle-description";
  description.textContent = "Press Esc to come back here after opening external links. Requires additional Chrome permissions.";

  labelContainer.appendChild(label);
  labelContainer.appendChild(description);

  const switchEl = document.createElement("button");
  switchEl.type = "button";
  switchEl.className = "zen-hn-switch";
  switchEl.setAttribute("role", "switch");
  switchEl.setAttribute("aria-checked", isEnabled ? "true" : "false");
  if (isEnabled) {
    switchEl.classList.add("is-active");
  }

  const switchTrack = document.createElement("span");
  switchTrack.className = "zen-hn-switch-track";

  const switchThumb = document.createElement("span");
  switchThumb.className = "zen-hn-switch-thumb";

  switchTrack.appendChild(switchThumb);
  switchEl.appendChild(switchTrack);

  switchEl.addEventListener("click", async () => {
    const newEnabled = !switchEl.classList.contains("is-active");

    // Disable button while processing
    switchEl.disabled = true;

    const result = await toggleExternalEscape(newEnabled);

    switchEl.disabled = false;

    if (result.success) {
      if (result.enabled) {
        switchEl.classList.add("is-active");
        switchEl.setAttribute("aria-checked", "true");
      } else {
        switchEl.classList.remove("is-active");
        switchEl.setAttribute("aria-checked", "false");
      }
      onChange?.(result.enabled);
    }
    // If not successful (user denied permission), switch stays in current state
  });

  container.appendChild(labelContainer);
  container.appendChild(switchEl);

  return container;
}

/**
 * Append the external escape toggle to a container
 */
async function appendExternalEscapeToggle(container: HTMLElement): Promise<void> {
  const isEnabled = await getExternalEscapeStatus();
  const control = buildExternalEscapeToggle(isEnabled);
  container.appendChild(control);
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

// =============================================================================
// HN Native Settings Toggles (showdead, noprocrast)
// =============================================================================

interface HnSettingConfig {
  selectName: string;
  label: string;
  description: string;
}

const HN_SETTING_CONFIGS: HnSettingConfig[] = [
  {
    selectName: "showd",
    label: "Show dead",
    description: "Show posts that have been killed by moderators or software.",
  },
  {
    selectName: "nopro",
    label: "Noprocrast",
    description: "Turn on procrastination prevention to limit your time on HN.",
  },
];

/**
 * Check if a select element's current value represents "enabled"
 */
function isSelectEnabled(select: HTMLSelectElement): boolean {
  return select.value === "yes";
}

/**
 * Build a toggle switch that syncs with a native select element
 */
function buildSelectToggle(
  select: HTMLSelectElement,
  config: HnSettingConfig
): HTMLElement {
  const container = document.createElement("div");
  container.className = "zen-hn-setting-toggle-control";

  const labelContainer = document.createElement("div");
  labelContainer.className = "zen-hn-setting-toggle-label-container";

  const label = document.createElement("span");
  label.className = "zen-hn-setting-toggle-label";
  label.textContent = config.label;

  const description = document.createElement("span");
  description.className = "zen-hn-setting-toggle-description";
  description.textContent = config.description;

  labelContainer.appendChild(label);
  labelContainer.appendChild(description);

  const isEnabled = isSelectEnabled(select);

  const switchEl = document.createElement("button");
  switchEl.type = "button";
  switchEl.className = "zen-hn-switch";
  switchEl.setAttribute("role", "switch");
  switchEl.setAttribute("aria-checked", isEnabled ? "true" : "false");
  switchEl.setAttribute("aria-label", config.label);
  if (isEnabled) {
    switchEl.classList.add("is-active");
  }

  const switchTrack = document.createElement("span");
  switchTrack.className = "zen-hn-switch-track";

  const switchThumb = document.createElement("span");
  switchThumb.className = "zen-hn-switch-thumb";

  switchTrack.appendChild(switchThumb);
  switchEl.appendChild(switchTrack);

  switchEl.addEventListener("click", () => {
    const newEnabled = !switchEl.classList.contains("is-active");

    // Update the hidden select value
    select.value = newEnabled ? "yes" : "no";

    // Update toggle UI
    if (newEnabled) {
      switchEl.classList.add("is-active");
      switchEl.setAttribute("aria-checked", "true");
    } else {
      switchEl.classList.remove("is-active");
      switchEl.setAttribute("aria-checked", "false");
    }
  });

  container.appendChild(labelContainer);
  container.appendChild(switchEl);

  return container;
}

/**
 * Replace HN native select elements with toggle switches
 * The original selects are hidden but remain in the DOM for form submission
 */
export function replaceHnSettingsWithToggles(): void {
  let hnSettingsSection: Element | null = null;

  for (const config of HN_SETTING_CONFIGS) {
    const select = document.querySelector<HTMLSelectElement>(
      `select[name="${config.selectName}"]`
    );

    if (!select) continue;

    // Skip if already processed
    if (select.dataset.zenHnToggled === "true") continue;

    // Find the parent row (usually a <tr> containing the select)
    const parentRow = select.closest("tr");
    if (!parentRow) continue;

    // Hide the original row
    parentRow.style.display = "none";

    // Mark as processed
    select.dataset.zenHnToggled = "true";

    // Create the toggle and insert it after the hidden row
    const toggle = buildSelectToggle(select, config);

    // Find the form to append the toggles section
    const form = select.closest("form");
    if (form) {
      // Look for existing HN settings section or create one
      if (!hnSettingsSection) {
        hnSettingsSection = form.querySelector(".zen-hn-hn-settings-section");
      }
      if (!hnSettingsSection) {
        hnSettingsSection = document.createElement("div");
        hnSettingsSection.className = "zen-hn-hn-settings-section";

        const sectionTitle = document.createElement("h3");
        sectionTitle.className = "zen-hn-settings-title";
        sectionTitle.textContent = "HN Settings";
        hnSettingsSection.appendChild(sectionTitle);

        // Insert before the Zen HN settings section if it exists, otherwise at end of form
        const zenHnSection = form.querySelector(".zen-hn-settings-section");
        if (zenHnSection) {
          form.insertBefore(hnSettingsSection, zenHnSection);
        } else {
          form.appendChild(hnSettingsSection);
        }
      }

      hnSettingsSection.appendChild(toggle);
    }
  }

  // Add the external escape toggle to HN settings section
  if (hnSettingsSection) {
    appendExternalEscapeToggle(hnSettingsSection as HTMLElement);
  }
}
