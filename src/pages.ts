/**
 * Page restyling utilities for Zen HN
 */

import { getOrCreateZenHnMain } from "./getOrCreateZenHnMain";
import { isUserProfilePage } from "./logic";
import { appendAppearanceControls, styleUserPageSelects } from "./colorMode";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";

export function restyleChangePwPage(): boolean {
  if (window.location.pathname !== "/changepw") {
    return false;
  }

  const hnmain = document.getElementById("hnmain") as HTMLElement | null;
  if (!hnmain || hnmain.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return false;
  }

  const form = hnmain.querySelector("form");
  if (!form) {
    return false;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "hn-form-page hn-changepw-page";

  wrapper.appendChild(form);

  hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  getOrCreateZenHnMain().appendChild(wrapper);

  return true;
}

export function restyleSubmitPage(): boolean {
  if (window.location.pathname !== "/submit") {
    return false;
  }

  const hnmain = document.getElementById("hnmain") as HTMLElement | null;
  if (!hnmain || hnmain.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return false;
  }

  const form = hnmain.querySelector("form");
  if (!form) {
    return false;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "hn-form-page hn-submit-page";

  wrapper.appendChild(form);

  hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  getOrCreateZenHnMain().appendChild(wrapper);

  return true;
}

export function restyleUserPage(): boolean {
  if (!isUserProfilePage()) {
    return false;
  }

  const hnmain = document.getElementById("hnmain") as HTMLElement | null;
  if (!hnmain || hnmain.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return false;
  }

  const form = hnmain.querySelector("form");
  const bigbox = hnmain.querySelector<HTMLTableCellElement>("tr#bigbox > td");

  if (!form && !bigbox) {
    return false;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "hn-form-page hn-user-page";

  if (form) {
    wrapper.appendChild(form);

    const settingsSection = document.createElement("div");
    settingsSection.className = "zen-hn-settings-section";

    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "zen-hn-settings-title";
    sectionTitle.textContent = "Zen HN Settings";
    settingsSection.appendChild(sectionTitle);

    appendAppearanceControls(settingsSection);

    wrapper.appendChild(settingsSection);
  } else if (bigbox) {
    while (bigbox.firstChild) {
      wrapper.appendChild(bigbox.firstChild);
    }
  }

  hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  getOrCreateZenHnMain().appendChild(wrapper);

  if (form) {
    styleUserPageSelects();
  }

  return true;
}

(globalThis as Record<string, unknown>).ZenHnPages = {
  restyleChangePwPage,
  restyleSubmitPage,
  restyleUserPage,
};
