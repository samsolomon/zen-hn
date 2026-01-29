/**
 * Page restyling utilities for Zen HN
 */

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";

/**
 * Get or create the zen-hn-main container element
 * @returns The main container element
 */
function getOrCreateZenHnMain(): HTMLElement {
  let main = document.getElementById("zen-hn-main");
  if (main) return main;

  main = document.createElement("main");
  main.id = "zen-hn-main";

  const hnmain = document.getElementById("hnmain");
  const centerWrapper = hnmain?.closest("center");
  if (centerWrapper) {
    centerWrapper.before(main);
  } else if (hnmain) {
    hnmain.before(main);
  } else {
    document.body.prepend(main);
  }

  return main;
}

/**
 * Restyle the change password page with consistent form styling
 * @returns True if the page was restyled, false otherwise
 */
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

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnPages = {
  restyleChangePwPage,
};
