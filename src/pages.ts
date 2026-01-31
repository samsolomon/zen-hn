/**
 * Page restyling utilities for Zen HN
 */

import { getOrCreateZenHnMain } from "./getOrCreateZenHnMain";
import { isUserProfilePage } from "./logic";
import { appendAppearanceControls, styleUserPageSelects } from "./colorMode";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";

// =============================================================================
// User Page Subnav
// =============================================================================

interface SubnavItem {
  label: string;
  href: string;
  isActive: boolean;
}

/**
 * Pages that should show the user subnav
 */
const USER_SUBNAV_PAGES = ["/user", "/favorites", "/upvoted", "/submitted", "/threads"];

/**
 * Check if the current page should show the user subnav
 */
function isUserSubnavPage(): boolean {
  return USER_SUBNAV_PAGES.includes(window.location.pathname);
}

/**
 * Get the username from the current URL's id parameter
 */
function getUsernameFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/**
 * Get the current page type based on pathname
 */
function getCurrentPageType(): string {
  const pathname = window.location.pathname;
  if (pathname === "/submitted") return "submissions";
  if (pathname === "/threads") return "comments";
  if (pathname === "/favorites") return "favorites";
  if (pathname === "/upvoted") return "upvoted";
  if (pathname === "/user") return "profile";
  return "profile";
}

/**
 * Build the subnav items for user pages
 */
function buildSubnavItems(username: string): SubnavItem[] {
  const currentPage = getCurrentPageType();

  return [
    {
      label: "Profile",
      href: `/user?id=${username}`,
      isActive: currentPage === "profile",
    },
    {
      label: "Favorites",
      href: `/favorites?id=${username}`,
      isActive: currentPage === "favorites",
    },
    {
      label: "Upvoted",
      href: `/upvoted?id=${username}`,
      isActive: currentPage === "upvoted",
    },
    {
      label: "Submissions",
      href: `/submitted?id=${username}`,
      isActive: currentPage === "submissions",
    },
    {
      label: "Comments",
      href: `/threads?id=${username}`,
      isActive: currentPage === "comments",
    },
  ];
}

/**
 * Create the subnav element for user pages
 */
function createUserSubnav(username: string): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "zen-hn-subnav";
  nav.setAttribute("aria-label", "User navigation");

  const list = document.createElement("ul");
  list.className = "zen-hn-subnav-list";

  const items = buildSubnavItems(username);

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "zen-hn-subnav-item";

    const link = document.createElement("a");
    link.className = "zen-hn-subnav-link";
    link.href = item.href;
    link.textContent = item.label;

    if (item.isActive) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    li.appendChild(link);
    list.appendChild(li);
  }

  nav.appendChild(list);
  return nav;
}

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

  // Add subnav if we have a username
  const username = getUsernameFromUrl();
  if (username) {
    const subnav = createUserSubnav(username);
    document.body.appendChild(subnav);
    document.documentElement.setAttribute("data-zen-hn-subnav", "true");
  }

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

/**
 * Add the subnav to user-related pages (favorites, upvoted, submissions, comments)
 * This is called separately from restyleUserPage since these pages have different content
 */
export function addUserSubnav(): boolean {
  // Skip if extension is disabled
  if (document.documentElement.dataset.zenHnEnabled === "false") {
    return false;
  }

  // Skip if not a user subnav page or already has subnav
  if (!isUserSubnavPage()) {
    return false;
  }

  // Skip if subnav already exists
  if (document.querySelector(".zen-hn-subnav")) {
    return false;
  }

  const username = getUsernameFromUrl();
  if (!username) {
    return false;
  }

  const subnav = createUserSubnav(username);
  document.body.appendChild(subnav);
  document.documentElement.setAttribute("data-zen-hn-subnav", "true");

  return true;
}

/**
 * Run addUserSubnav early to prevent flash
 */
export function runUserSubnavWhenReady(): void {
  // Skip if extension is disabled
  if (document.documentElement.dataset.zenHnEnabled === "false") {
    return;
  }

  // Set loading state early
  if (isUserSubnavPage()) {
    document.documentElement.setAttribute("data-zen-hn-subnav", "loading");
  }

  let attempts = 0;
  const maxAttempts = 60;

  const attempt = (): void => {
    const built = addUserSubnav();
    if (built) {
      return;
    }
    attempts += 1;
    if (attempts >= maxAttempts && document.readyState !== "loading") {
      if (document.documentElement.dataset.zenHnSubnav === "loading") {
        delete document.documentElement.dataset.zenHnSubnav;
      }
      return;
    }
    globalThis.requestAnimationFrame(attempt);
  };

  attempt();
}

(globalThis as Record<string, unknown>).ZenHnPages = {
  restyleChangePwPage,
  restyleSubmitPage,
  restyleUserPage,
  addUserSubnav,
  runUserSubnavWhenReady,
};
