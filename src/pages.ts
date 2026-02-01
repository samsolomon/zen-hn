/**
 * Page restyling utilities for Zen HN
 */

import { getOrCreateZenHnMain } from "./getOrCreateZenHnMain";
import { isUserProfilePage } from "./logic";
import { appendAppearanceControls, replaceHnSettingsWithToggles } from "./colorMode";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const LOGGED_IN_USERNAME_KEY = "zenHnLoggedInUsername";

// =============================================================================
// User Profile Header
// =============================================================================

interface UserProfileData {
  username: string;
  created: string;
  karma: string;
  about: string;
}

/**
 * Extract user profile data from HN's table rows
 * Works for both bigbox (other users) and form pages (own profile)
 */
function extractUserProfileData(container: HTMLElement): UserProfileData | null {
  // Find all table rows - works for both bigbox and form pages
  const table = container.querySelector("table");
  const rows = table ? table.querySelectorAll("tr") : container.querySelectorAll("tr");
  const data: Partial<UserProfileData> = {};

  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 2) {
      const label = cells[0].textContent?.trim().replace(":", "").toLowerCase();
      const value = cells[1];
      if (label === "user") data.username = value.textContent?.trim() || "";
      if (label === "created") data.created = value.textContent?.trim() || "";
      if (label === "karma") data.karma = value.textContent?.trim() || "";
      // For about, check for textarea (own profile) or just innerHTML (other users)
      if (label === "about") {
        const textarea = value.querySelector("textarea");
        data.about = textarea
          ? textarea.value.replace(/\n/g, "<br>")
          : value.innerHTML || "";
      }
    }
  }

  if (!data.username) return null;
  return data as UserProfileData;
}

/**
 * Convert plain text URLs and emails to clickable links
 * Preserves existing HTML links
 */
function linkifyText(html: string): string {
  // Create a temporary element to work with the HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Process text nodes only (to avoid double-linking existing anchors)
  const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null);
  const textNodes: Text[] = [];

  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    // Skip text nodes that are inside anchor tags
    if (node.parentElement?.closest("a")) continue;
    textNodes.push(node);
  }

  // URL pattern - matches http://, https://, and www.
  const urlPattern = /(\b(?:https?:\/\/|www\.)[^\s<>]+)/gi;
  // Email pattern
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

  for (const textNode of textNodes) {
    const text = textNode.textContent || "";
    if (!urlPattern.test(text) && !emailPattern.test(text)) continue;

    // Reset regex lastIndex
    urlPattern.lastIndex = 0;
    emailPattern.lastIndex = 0;

    // Replace URLs and emails with links
    let newHtml = text
      .replace(urlPattern, (url) => {
        const href = url.startsWith("www.") ? `https://${url}` : url;
        return `<a href="${href}" rel="nofollow">${url}</a>`;
      })
      .replace(emailPattern, (email) => {
        return `<a href="mailto:${email}">${email}</a>`;
      });

    if (newHtml !== text) {
      const span = document.createElement("span");
      span.innerHTML = newHtml;
      textNode.replaceWith(...span.childNodes);
    }
  }

  return temp.innerHTML;
}

/**
 * Create a styled header element for user profiles
 */
function createUserProfileHeader(data: UserProfileData): HTMLElement {
  const header = document.createElement("header");
  header.className = "zen-hn-user-header";

  const username = document.createElement("h1");
  username.className = "zen-hn-user-name";
  username.textContent = data.username;
  header.appendChild(username);

  const meta = document.createElement("p");
  meta.className = "zen-hn-user-meta";
  meta.textContent = `${data.created} · ${data.karma} karma`;
  header.appendChild(meta);

  if (data.about) {
    const about = document.createElement("div");
    about.className = "zen-hn-user-about";
    about.innerHTML = linkifyText(data.about);
    header.appendChild(about);
  }

  return header;
}

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
const USER_SUBNAV_PAGES = ["/user", "/favorites", "/upvoted", "/hidden", "/flagged", "/submitted", "/threads", "/about"];

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
 * Cache the logged-in user's username if available on the current page.
 * Should be called early on page load to populate the cache for later use.
 */
export function cacheLoggedInUsername(): void {
  const profileLink = document.querySelector<HTMLAnchorElement>("a#me");
  if (profileLink) {
    const href = profileLink.getAttribute("href");
    if (href) {
      const match = href.match(/user\?id=([^&]+)/);
      if (match) {
        try {
          localStorage.setItem(LOGGED_IN_USERNAME_KEY, match[1]);
        } catch {
          // Ignore storage errors
        }
      }
    }
  }
}

/**
 * Get the logged-in user's username from the page header.
 * Caches the username in localStorage for pages without the header (like error pages).
 */
function getLoggedInUsername(): string | null {
  const profileLink = document.querySelector<HTMLAnchorElement>("a#me");
  if (profileLink) {
    const href = profileLink.getAttribute("href");
    if (href) {
      const match = href.match(/user\?id=([^&]+)/);
      if (match) {
        const username = match[1];
        // Cache the username for pages without the header
        try {
          localStorage.setItem(LOGGED_IN_USERNAME_KEY, username);
        } catch {
          // Ignore storage errors
        }
        return username;
      }
    }
  }

  // Fallback to cached username (useful for error pages like /about)
  try {
    return localStorage.getItem(LOGGED_IN_USERNAME_KEY);
  } catch {
    return null;
  }
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
  if (pathname === "/flagged") return "flagged";
  if (pathname === "/hidden") return "hidden";
  if (pathname === "/about") return "about";
  if (pathname === "/user") return "profile";
  return "profile";
}

/**
 * Build the subnav items for user pages
 */
function buildSubnavItems(username: string | null): SubnavItem[] {
  const currentPage = getCurrentPageType();

  const items: SubnavItem[] = [];

  // Only add user-specific pages if we have a username
  if (username) {
    items.push(
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
      {
        label: "Flagged",
        href: `/flagged?id=${username}`,
        isActive: currentPage === "flagged",
      },
      {
        label: "Hidden",
        href: `/hidden?id=${username}`,
        isActive: currentPage === "hidden",
      }
    );
  }

  // About link is always available
  items.push({
    label: "About",
    href: "/about",
    isActive: currentPage === "about",
  });

  return items;
}

/**
 * Create the subnav element for user pages
 */
function createUserSubnav(username: string | null): HTMLElement {
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
    // Extract profile data from the form and show header
    const profileData = extractUserProfileData(form);
    if (profileData) {
      const header = createUserProfileHeader(profileData);
      wrapper.appendChild(header);
    }

    wrapper.appendChild(form);

    const settingsSection = document.createElement("div");
    settingsSection.className = "zen-hn-settings-section";

    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "zen-hn-settings-title";
    sectionTitle.textContent = "Appearance";
    settingsSection.appendChild(sectionTitle);

    appendAppearanceControls(settingsSection);

    wrapper.appendChild(settingsSection);
  } else if (bigbox) {
    // Extract user data from HN's table and create styled header
    const profileData = extractUserProfileData(bigbox);
    if (profileData) {
      const header = createUserProfileHeader(profileData);
      wrapper.appendChild(header);
    } else {
      // Fallback: move original content if extraction fails
      while (bigbox.firstChild) {
        wrapper.appendChild(bigbox.firstChild);
      }
    }
  }

  hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  getOrCreateZenHnMain().appendChild(wrapper);

  if (form) {
    replaceHnSettingsWithToggles();
  }

  return true;
}

/**
 * Pages that are user list pages (not the profile page itself)
 * Note: /threads is handled by restyleComments() instead
 */
const USER_LIST_PAGES = ["/favorites", "/upvoted", "/flagged", "/hidden", "/submitted"];

/**
 * Check if the current page is a user list page
 */
function isUserListPage(): boolean {
  return USER_LIST_PAGES.includes(window.location.pathname);
}

/**
 * Restyle user list pages (favorites, upvoted, submitted, threads)
 * These pages show lists of items and need proper restyling
 */
export function restyleUserListPage(): boolean {
  if (!isUserListPage()) {
    return false;
  }

  const hnmain = document.getElementById("hnmain") as HTMLElement | null;
  if (!hnmain || hnmain.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return false;
  }

  // Find the main content table
  const itemList = hnmain.querySelector("table.itemlist");
  const commentTree = hnmain.querySelector("table.comment-tree");
  const contentTable = itemList || commentTree;

  if (!contentTable) {
    return false;
  }

  // Mark as restyled
  hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";

  // Clone content table to zen-hn-main
  const wrapper = document.createElement("div");
  wrapper.className = "hn-user-list-page";
  const contentClone = contentTable.cloneNode(true) as HTMLElement;
  wrapper.appendChild(contentClone);
  getOrCreateZenHnMain().appendChild(wrapper);

  // Hide the original HN content
  const centerWrapper = hnmain.closest("center") as HTMLElement | null;
  if (centerWrapper) {
    centerWrapper.style.display = "none";
  } else {
    hnmain.style.display = "none";
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

  const pathname = window.location.pathname;
  let username = getUsernameFromUrl();

  // For About page, use logged-in user for user-specific links
  if (pathname === "/about") {
    username = getLoggedInUsername();
  } else if (!username) {
    // Require username for other pages
    return false;
  }

  // Create the subnav
  const subnav = createUserSubnav(username);

  // Append to zen-hn-main if it exists, otherwise to body
  const zenHnMain = document.getElementById("zen-hn-main");
  if (zenHnMain) {
    // Insert at the beginning of zen-hn-main
    zenHnMain.insertBefore(subnav, zenHnMain.firstChild);
  } else {
    document.body.appendChild(subnav);
  }

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

// =============================================================================
// About Page
// =============================================================================

/**
 * Restyle the About page with custom Zen HN content
 * Note: HN doesn't have an /about page, so we create our own
 */
export function restyleAboutPage(): boolean {
  if (window.location.pathname !== "/about") {
    return false;
  }

  // Check if already restyled (use documentElement since hnmain may not exist on 404)
  if (document.documentElement.dataset.zenHnAboutRestyled === "true") {
    return false;
  }

  // Mark as restyled early to prevent double-processing
  document.documentElement.dataset.zenHnAboutRestyled = "true";

  // Hide any HN content (404 page shows "Unknown" in a pre tag)
  const hnmain = document.getElementById("hnmain");
  if (hnmain) {
    hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  }
  const centerWrapper = document.querySelector("center") as HTMLElement | null;
  if (centerWrapper) {
    centerWrapper.style.display = "none";
  }
  // Hide the "Unknown." pre tag that appears on 404 pages
  const unknownPre = document.querySelector("body > pre") as HTMLElement | null;
  if (unknownPre) {
    unknownPre.style.display = "none";
  }

  // Get version from manifest
  const version = chrome.runtime.getManifest().version;

  // Create the about page content
  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-about-page";

  wrapper.innerHTML = `
    <header class="zen-hn-about-header">
      <h1 class="zen-hn-about-title">Zen HN</h1>
      <span class="zen-hn-about-version">v${version}</span>
    </header>

    <p class="zen-hn-about-tagline">
      A calmer way to read Hacker News. Less noise, more focus.
    </p>

    <hr class="zen-hn-about-divider" />

    <section class="zen-hn-about-story">
      <h2 class="zen-hn-about-story-title">Why I Built This</h2>

      <p>
        Hacker News has been part of my daily routine for over a decade. The community
        is thoughtful, the discussions are substantive, and I always learn something new.
        But the interface never quite matched the quality of the content.
      </p>

      <p>
        I wanted something that felt more intentional. Something that would let me read
        without the visual clutter, navigate without reaching for the mouse, and focus
        on what matters: the ideas and conversations.
      </p>

      <p>
        Zen HN is that something. It's not a replacement for Hacker News—it's a lens
        that brings the experience into sharper focus. I hope it serves you as well
        as it serves me.
      </p>
    </section>

    <hr class="zen-hn-about-divider" />

    <div class="zen-hn-about-sections-row">
      <section class="zen-hn-about-section">
        <h2 class="zen-hn-about-section-title">Connect</h2>
        <ul class="zen-hn-about-links">
          <li><a href="https://solomon.io" target="_blank" rel="noopener">Website</a></li>
          <li><a href="https://github.com/samsolomon" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="https://news.ycombinator.com/user?id=samsolomon" target="_blank" rel="noopener">Hacker News</a></li>
          <li><a href="https://www.linkedin.com/in/samuelrsolomon" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="https://twitter.com/samuelrsolomon" target="_blank" rel="noopener">Twitter</a></li>
        </ul>
      </section>

      <section class="zen-hn-about-section">
        <h2 class="zen-hn-about-section-title">Project</h2>
        <ul class="zen-hn-about-links">
          <li><a href="https://github.com/samsolomon/zen-hn" target="_blank" rel="noopener">Source Code</a></li>
          <li><a href="https://github.com/samsolomon/zen-hn/issues" target="_blank" rel="noopener">Report an Issue</a></li>
          <li><a href="#" class="zen-hn-about-shortcuts-link">Keyboard Shortcuts</a></li>
        </ul>
      </section>

      <section class="zen-hn-about-section">
        <h2 class="zen-hn-about-section-title">HN</h2>
        <ul class="zen-hn-about-links">
          <li><a href="https://news.ycombinator.com/newsguidelines.html" target="_blank" rel="noopener">Guidelines</a> / <a href="https://news.ycombinator.com/newsfaq.html" target="_blank" rel="noopener">FAQ</a></li>
          <li><a href="https://news.ycombinator.com/security.html" target="_blank" rel="noopener">Security</a> / <a href="https://www.ycombinator.com/legal/" target="_blank" rel="noopener">Legal</a></li>
          <li><a href="https://github.com/HackerNews/API" target="_blank" rel="noopener">API</a></li>
          <li><a href="https://www.ycombinator.com/apply/" target="_blank" rel="noopener">Apply to YC</a></li>
          <li><a href="mailto:hn@ycombinator.com">Contact</a></li>
        </ul>
      </section>
    </div>
  `;

  // Add click handler for keyboard shortcuts link
  const shortcutsLink = wrapper.querySelector(".zen-hn-about-shortcuts-link");
  if (shortcutsLink) {
    shortcutsLink.addEventListener("click", (e) => {
      e.preventDefault();
      // Trigger the keyboard shortcuts modal by dispatching a custom event
      // or directly calling the showShortcutsModal function if available
      const event = new KeyboardEvent("keydown", { key: "?" });
      document.dispatchEvent(event);
    });
  }

  getOrCreateZenHnMain().appendChild(wrapper);

  // Add subnav for About page (use logged-in user for user-specific links)
  if (!document.querySelector(".zen-hn-subnav") && document.body) {
    const loggedInUser = getLoggedInUsername();
    const subnav = createUserSubnav(loggedInUser);
    document.body.appendChild(subnav);
    document.documentElement.setAttribute("data-zen-hn-subnav", "true");
  }

  return true;
}

// =============================================================================
// Noprocrast Page
// =============================================================================

/**
 * Check if the current page is the noprocrast (anti-procrastination) blocked page
 */
function isNoprocrastPage(): boolean {
  const hnmain = document.getElementById("hnmain");
  if (!hnmain) return false;
  const firstBold = hnmain.querySelector("b");
  return firstBold?.textContent?.includes("Get back to work") ?? false;
}

/**
 * Restyle the noprocrast blocked page
 */
export function restyleNoprocrastPage(): boolean {
  if (!isNoprocrastPage()) {
    return false;
  }

  const hnmain = document.getElementById("hnmain") as HTMLElement | null;
  if (!hnmain || hnmain.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return false;
  }

  // Find the content cell
  const contentCell = hnmain.querySelector("td");
  if (!contentCell) return false;

  // Extract the time remaining from the text
  const text = contentCell.textContent || "";
  const timeMatch = text.match(/(\d+)\s*minutes/);
  const minutes = timeMatch ? timeMatch[1] : "?";

  // Create styled content
  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-noprocrast-page";

  wrapper.innerHTML = `
    <header class="zen-hn-noprocrast-header">
      <h1 class="zen-hn-noprocrast-title">Get back to work!</h1>
    </header>
    <p class="zen-hn-noprocrast-message">
      Based on your anti-procrastination settings, you'll be able to use the site again in <strong>${minutes} minutes</strong>.
    </p>
    <p class="zen-hn-noprocrast-note">
      To change these settings, go to your profile. If <code>noprocrast</code> is set to <code>yes</code>,
      you'll be limited to sessions of <code>maxvisit</code> minutes, with <code>minaway</code> minutes between them.
    </p>
    <a href="/news" class="zen-hn-noprocrast-retry">Retry</a>
  `;

  hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  getOrCreateZenHnMain().appendChild(wrapper);

  return true;
}

(globalThis as Record<string, unknown>).ZenHnPages = {
  restyleChangePwPage,
  restyleSubmitPage,
  restyleUserPage,
  restyleUserListPage,
  addUserSubnav,
  runUserSubnavWhenReady,
  restyleAboutPage,
  restyleNoprocrastPage,
  cacheLoggedInUsername,
};
