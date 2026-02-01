/**
 * Page restyling utilities for Zen HN
 */

import { getOrCreateZenHnMain } from "./getOrCreateZenHnMain";
import { isUserProfilePage } from "./logic";
import { appendAppearanceControls, replaceHnSettingsWithToggles } from "./colorMode";
import { initSubnavOverflow } from "./subnavOverflow";
import { createModal } from "./modal";
import { renderIcon } from "./icons";

interface ZenHnRandomGlobal {
  handleRandomItemClick: (event: Event) => Promise<void>;
}

declare const ZenHnRandom: ZenHnRandomGlobal;

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const LOGGED_IN_USERNAME_KEY = "zenHnLoggedInUsername";
const EDIT_PROFILE_MODAL_ID = "zen-hn-edit-profile-modal";

// =============================================================================
// User Profile Header
// =============================================================================

interface UserProfileData {
  username: string;
  created: string;
  karma: string;
  about: string;
  email: string;
  isOwnProfile: boolean;
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
  let isOwnProfile = false;

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
        if (textarea) {
          // Own profile: store raw text, will be formatted later
          data.about = textarea.value;
          isOwnProfile = true;
        } else {
          // Other users: HN already rendered, just use innerHTML
          data.about = value.innerHTML || "";
        }
      }
      // Email is only on own profile form
      if (label === "email") {
        const emailInput = value.querySelector("input");
        data.email = emailInput?.value || "";
      }
    }
  }

  if (!data.username) return null;
  return { ...data, email: data.email || "", isOwnProfile } as UserProfileData;
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
 * Format HN about field text to HTML matching HN's rendering rules
 *
 * HN formatting rules:
 * - Blank line = paragraph break
 * - *text* = italic
 * - \* or ** = literal *
 * - 2+ space indent after blank line = code block (verbatim)
 * - URLs = auto-linked
 * - <url> = explicit link syntax
 */
function formatHnAbout(text: string): string {
  // 1. Escape HTML entities (prevent XSS)
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  // 2. Handle escaped asterisks: \* becomes placeholder, ** becomes *
  const ESCAPED_ASTERISK = "\u0000ESC_AST\u0000";
  html = html.replace(/\\\*/g, ESCAPED_ASTERISK);
  html = html.replace(/\*\*/g, "*");

  // 3. Convert *text* to <i>text</i> (non-greedy, no newlines inside)
  html = html.replace(/\*([^*\n]+)\*/g, "<i>$1</i>");

  // 4. Restore escaped asterisks
  html = html.replace(new RegExp(ESCAPED_ASTERISK, "g"), "*");

  // 5. Split into paragraphs (blank lines)
  const paragraphs = html.split(/\n\n+/);

  // 6. Process each paragraph for code blocks and regular content
  const processedParagraphs = paragraphs.map((para) => {
    // Check if paragraph starts with 2+ spaces (code block)
    // A code block is text that starts with 2+ spaces after a blank line
    const lines = para.split("\n");
    const isCodeBlock = lines.every((line) => line === "" || /^  +/.test(line));

    if (isCodeBlock && lines.some((line) => line.trim() !== "")) {
      // Remove the leading 2 spaces from each line for code block
      const codeContent = lines
        .map((line) => (line.startsWith("  ") ? line.slice(2) : line))
        .join("\n");
      return `<pre>${codeContent}</pre>`;
    }

    // 7. Handle &lt;url&gt; syntax (explicit link) - now safe after HTML escaping
    let processed = para.replace(/&lt;(https?:\/\/[^&]+)&gt;/g, (_, url) => {
      return `<a href="${url}" rel="nofollow">${url}</a>`;
    });

    // 8. Convert single newlines to <br>
    processed = processed.replace(/\n/g, "<br>");

    return `<p>${processed}</p>`;
  });

  // Join paragraphs
  html = processedParagraphs.join("");

  // 9. Run through linkifyText() for plain URL detection
  html = linkifyText(html);

  return html;
}

/**
 * Auto-resize a textarea to fit its content
 */
function autoResizeTextarea(textarea: HTMLTextAreaElement): void {
  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = "auto";
  // Set height to scrollHeight to fit content
  textarea.style.height = `${textarea.scrollHeight}px`;
}

/**
 * Show the edit profile modal
 */
function showEditProfileModal(currentAbout: string, currentEmail: string): void {
  const TITLE_ID = "zen-hn-edit-profile-title";

  const { content, close } = createModal({
    id: EDIT_PROFILE_MODAL_ID,
    className: "zen-hn-edit-profile-modal",
    titleId: TITLE_ID,
    closeOnBackdrop: true,
    closeOnEscape: true,
    focusTrap: true,
    restoreFocus: true,
  });

  // Header with title and close button
  const header = document.createElement("div");
  header.className = "zen-hn-edit-profile-header";

  const title = document.createElement("h2");
  title.id = TITLE_ID;
  title.className = "zen-hn-edit-profile-title";
  title.textContent = "Edit profile";

  const closeButton = document.createElement("button");
  closeButton.className = "zen-hn-button-icon-ghost zen-hn-edit-profile-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.innerHTML = renderIcon("x");
  closeButton.addEventListener("click", close);

  header.appendChild(title);
  header.appendChild(closeButton);
  content.appendChild(header);

  // Form container
  const form = document.createElement("div");
  form.className = "zen-hn-edit-profile-form";

  // About field
  const aboutGroup = document.createElement("div");
  aboutGroup.className = "zen-hn-edit-profile-field";

  const aboutLabel = document.createElement("label");
  aboutLabel.className = "zen-hn-edit-profile-label";
  aboutLabel.htmlFor = "zen-hn-edit-about";
  aboutLabel.textContent = "About";
  aboutGroup.appendChild(aboutLabel);

  const aboutTextarea = document.createElement("textarea");
  aboutTextarea.id = "zen-hn-edit-about";
  aboutTextarea.className = "zen-hn-edit-profile-textarea";
  aboutTextarea.name = "about";
  aboutTextarea.value = currentAbout;
  aboutTextarea.rows = 4;
  aboutGroup.appendChild(aboutTextarea);

  // About hint text
  const aboutHint = document.createElement("div");
  aboutHint.className = "zen-hn-edit-profile-hint";
  aboutHint.innerHTML = `Blank lines separate paragraphs. Text surrounded by asterisks is <i>italicized</i>. To get a literal asterisk, use \\* or **.<br><br>
Text after a blank line that is indented by two or more spaces is reproduced verbatim. (This is intended for code.)<br><br>
Urls become links, except in the text field of a submission. If your url gets linked incorrectly, put it in &lt;angle brackets&gt; and it should work.`;
  aboutGroup.appendChild(aboutHint);

  form.appendChild(aboutGroup);

  // Email field
  const emailGroup = document.createElement("div");
  emailGroup.className = "zen-hn-edit-profile-field";

  const emailLabel = document.createElement("label");
  emailLabel.className = "zen-hn-edit-profile-label";
  emailLabel.htmlFor = "zen-hn-edit-email";
  emailLabel.textContent = "Email";
  emailGroup.appendChild(emailLabel);

  const emailInput = document.createElement("input");
  emailInput.id = "zen-hn-edit-email";
  emailInput.className = "zen-hn-edit-profile-input";
  emailInput.type = "email";
  emailInput.name = "email";
  emailInput.value = currentEmail;
  emailGroup.appendChild(emailInput);

  // Email hint text
  const emailHint = document.createElement("div");
  emailHint.className = "zen-hn-edit-profile-hint";
  emailHint.textContent = "Only admins see your email. To share publicly, add to About.";
  emailGroup.appendChild(emailHint);

  // Email error message (hidden by default)
  const emailError = document.createElement("div");
  emailError.className = "zen-hn-edit-profile-error";
  emailError.textContent = "Please enter a valid email address.";
  emailError.style.display = "none";
  emailGroup.appendChild(emailError);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    if (!email.trim()) return true; // Empty is allowed
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
  };

  // Clear error on input
  emailInput.addEventListener("input", () => {
    emailInput.classList.remove("is-invalid");
    emailError.style.display = "none";
  });

  form.appendChild(emailGroup);
  content.appendChild(form);

  // Button row
  const buttonRow = document.createElement("div");
  buttonRow.className = "zen-hn-edit-profile-buttons";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "zen-hn-button-ghost";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", close);

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "zen-hn-button-outline";
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    console.log("[Edit Profile] Save clicked");

    // Validate email
    if (!isValidEmail(emailInput.value)) {
      emailInput.classList.add("is-invalid");
      emailError.style.display = "block";
      emailInput.focus();
      return;
    }

    // Debug: log all forms on the page
    const allForms = document.querySelectorAll("form");
    console.log("[Edit Profile] All forms on page:", allForms.length);
    allForms.forEach((f, i) => {
      console.log(`[Edit Profile] Form ${i}: action="${f.action}", id="${f.id}", class="${f.className}"`);
    });

    // Get the original form from the page - try multiple selectors
    let originalForm = document.querySelector<HTMLFormElement>('form[action="xuser"]');
    if (!originalForm) {
      // Try finding form with about textarea
      originalForm = document.querySelector<HTMLFormElement>('form:has(textarea[name="about"])');
    }
    if (!originalForm) {
      // Try any form in the user page wrapper
      originalForm = document.querySelector<HTMLFormElement>('.hn-user-page form');
    }
    console.log("[Edit Profile] Original form found:", !!originalForm, originalForm?.action);
    if (!originalForm) {
      console.log("[Edit Profile] No form found, closing modal");
      close();
      return;
    }

    // Update the original form fields
    const originalAbout = originalForm.querySelector<HTMLTextAreaElement>('textarea[name="about"]');
    const originalEmail = originalForm.querySelector<HTMLInputElement>('input[name="email"]');
    console.log("[Edit Profile] Form fields found - about:", !!originalAbout, "email:", !!originalEmail);

    if (originalAbout) {
      console.log("[Edit Profile] Updating about from:", originalAbout.value.substring(0, 50), "to:", aboutTextarea.value.substring(0, 50));
      originalAbout.value = aboutTextarea.value;
    }
    if (originalEmail) {
      console.log("[Edit Profile] Updating email from:", originalEmail.value, "to:", emailInput.value);
      originalEmail.value = emailInput.value;
    }

    // Update the displayed header immediately (optimistic update)
    const headerAbout = document.querySelector(".zen-hn-user-about");
    console.log("[Edit Profile] Header about element found:", !!headerAbout);
    if (headerAbout) {
      const newAboutValue = aboutTextarea.value.trim();
      if (newAboutValue) {
        console.log("[Edit Profile] Updating header about content");
        headerAbout.innerHTML = formatHnAbout(newAboutValue);
      } else {
        console.log("[Edit Profile] Removing empty header about");
        headerAbout.remove();
      }
    } else if (aboutTextarea.value.trim()) {
      // Create about section if it didn't exist before
      const header = document.querySelector(".zen-hn-user-header");
      console.log("[Edit Profile] Creating new about section, header found:", !!header);
      if (header) {
        const about = document.createElement("div");
        about.className = "zen-hn-user-about";
        about.innerHTML = formatHnAbout(aboutTextarea.value.trim());
        header.appendChild(about);
      }
    }

    // Close the modal
    console.log("[Edit Profile] Closing modal");
    close();

    // Submit the original form to save to HN's server
    console.log("[Edit Profile] Submitting form");
    originalForm.submit();
  });

  buttonRow.appendChild(cancelButton);
  buttonRow.appendChild(saveButton);
  content.appendChild(buttonRow);

  // Set up auto-resize for textarea
  autoResizeTextarea(aboutTextarea);
  aboutTextarea.addEventListener("input", () => autoResizeTextarea(aboutTextarea));

  // Focus the about textarea
  requestAnimationFrame(() => {
    aboutTextarea.focus();
    // Move cursor to end of text
    aboutTextarea.setSelectionRange(aboutTextarea.value.length, aboutTextarea.value.length);
  });
}

/**
 * Create a styled header element for user profiles
 */
function createUserProfileHeader(data: UserProfileData): HTMLElement {
  const header = document.createElement("header");
  header.className = "zen-hn-user-header";

  // Title row with username and optional edit button
  const titleRow = document.createElement("div");
  titleRow.className = "zen-hn-user-title-row";

  const username = document.createElement("h1");
  username.className = "zen-hn-user-name";
  username.textContent = data.username;
  titleRow.appendChild(username);

  if (data.isOwnProfile) {
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "zen-hn-button-outline zen-hn-edit-profile-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      showEditProfileModal(data.about, data.email);
    });
    titleRow.appendChild(editButton);

    const changePasswordLink = document.createElement("a");
    changePasswordLink.href = "https://news.ycombinator.com/changepw";
    changePasswordLink.className = "zen-hn-button-outline zen-hn-edit-profile-button";
    changePasswordLink.textContent = "Change password";
    titleRow.appendChild(changePasswordLink);
  }

  header.appendChild(titleRow);

  const meta = document.createElement("p");
  meta.className = "zen-hn-user-meta";
  meta.textContent = `${data.created} · ${data.karma} karma`;
  header.appendChild(meta);

  if (data.about) {
    const about = document.createElement("div");
    about.className = "zen-hn-user-about";
    // Own profile: format raw text with HN rules; other users: already rendered by HN
    about.innerHTML = data.isOwnProfile
      ? formatHnAbout(data.about)
      : linkifyText(data.about);
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

  // Add More button wrapper for overflow items (uses generic dropdown classes)
  const moreWrapper = document.createElement("li");
  moreWrapper.className = "zen-hn-subnav-item zen-hn-subnav-more-menu";

  const moreButton = document.createElement("button");
  moreButton.className = "zen-hn-subnav-link zen-dropdown-button";
  moreButton.setAttribute("aria-haspopup", "menu");
  moreButton.setAttribute("aria-expanded", "false");
  moreButton.type = "button";
  moreButton.textContent = "More";

  const moreDropdown = document.createElement("ul");
  moreDropdown.className = "zen-dropdown-dropdown";
  moreDropdown.setAttribute("role", "menu");

  moreWrapper.appendChild(moreButton);
  moreWrapper.appendChild(moreDropdown);
  list.appendChild(moreWrapper);

  nav.appendChild(list);

  // Initialize overflow detection after DOM is ready
  requestAnimationFrame(() => {
    initSubnavOverflow(nav);
  });

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

  const originalForm = hnmain.querySelector("form");
  if (!originalForm) {
    return false;
  }

  // Extract values from original form
  const currentPwInput = originalForm.querySelector<HTMLInputElement>('input[name="oldpw"]');
  const newPwInput = originalForm.querySelector<HTMLInputElement>('input[name="pw"]');
  const formAction = originalForm.action;

  // Create styled page
  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-changepw-page";

  // Header
  const header = document.createElement("header");
  header.className = "zen-hn-changepw-header";

  const title = document.createElement("h1");
  title.className = "zen-hn-changepw-title";
  title.textContent = "Change password";
  header.appendChild(title);

  wrapper.appendChild(header);

  // Form
  const form = document.createElement("form");
  form.className = "zen-hn-changepw-form";
  form.method = "post";
  form.action = formAction;

  // Current password field
  const currentPwGroup = document.createElement("div");
  currentPwGroup.className = "zen-hn-changepw-field";

  const currentPwLabel = document.createElement("label");
  currentPwLabel.className = "zen-hn-changepw-label";
  currentPwLabel.htmlFor = "zen-hn-oldpw";
  currentPwLabel.textContent = "Current password";
  currentPwGroup.appendChild(currentPwLabel);

  const currentPwField = document.createElement("input");
  currentPwField.id = "zen-hn-oldpw";
  currentPwField.className = "zen-hn-changepw-input";
  currentPwField.type = "password";
  currentPwField.name = "oldpw";
  currentPwField.autocomplete = "current-password";
  currentPwField.required = true;
  if (currentPwInput?.value) {
    currentPwField.value = currentPwInput.value;
  }
  currentPwGroup.appendChild(currentPwField);

  form.appendChild(currentPwGroup);

  // New password field
  const newPwGroup = document.createElement("div");
  newPwGroup.className = "zen-hn-changepw-field";

  const newPwLabel = document.createElement("label");
  newPwLabel.className = "zen-hn-changepw-label";
  newPwLabel.htmlFor = "zen-hn-newpw";
  newPwLabel.textContent = "New password";
  newPwGroup.appendChild(newPwLabel);

  const newPwField = document.createElement("input");
  newPwField.id = "zen-hn-newpw";
  newPwField.className = "zen-hn-changepw-input";
  newPwField.type = "password";
  newPwField.name = "pw";
  newPwField.autocomplete = "new-password";
  newPwField.required = true;
  if (newPwInput?.value) {
    newPwField.value = newPwInput.value;
  }
  newPwGroup.appendChild(newPwField);

  form.appendChild(newPwGroup);

  // Submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "zen-hn-button-outline";
  submitButton.textContent = "Change password";
  form.appendChild(submitButton);

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

  const originalForm = hnmain.querySelector("form");
  if (!originalForm) {
    return false;
  }

  // Extract values from original form
  const titleInput = originalForm.querySelector<HTMLInputElement>('input[name="title"]');
  const urlInput = originalForm.querySelector<HTMLInputElement>('input[name="url"]');
  const textArea = originalForm.querySelector<HTMLTextAreaElement>('textarea[name="text"]');
  const formAction = originalForm.action;

  // Find any hidden inputs we need to preserve
  const hiddenInputs = originalForm.querySelectorAll<HTMLInputElement>('input[type="hidden"]');

  // Create styled page wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-submit-page";

  // Header
  const header = document.createElement("header");
  header.className = "zen-hn-submit-header";

  const title = document.createElement("h1");
  title.className = "zen-hn-submit-title";
  title.textContent = "Submit";
  header.appendChild(title);

  wrapper.appendChild(header);

  // Help text
  const helpText = document.createElement("p");
  helpText.className = "zen-hn-submit-help";
  helpText.innerHTML = `Leave url blank to submit a question for discussion. If there is no url, text will appear at the top of the thread. If there is a url, text is optional.<br><br>You can also submit via <a href="/bookmarklet.html">bookmarklet</a>.`;
  wrapper.appendChild(helpText);

  // Form
  const form = document.createElement("form");
  form.className = "zen-hn-submit-form";
  form.method = "post";
  form.action = formAction;

  // Copy hidden inputs
  for (const hidden of hiddenInputs) {
    const hiddenClone = document.createElement("input");
    hiddenClone.type = "hidden";
    hiddenClone.name = hidden.name;
    hiddenClone.value = hidden.value;
    form.appendChild(hiddenClone);
  }

  // Title field
  const titleGroup = document.createElement("div");
  titleGroup.className = "zen-hn-submit-field";

  const titleLabel = document.createElement("label");
  titleLabel.className = "zen-hn-submit-label";
  titleLabel.htmlFor = "zen-hn-title";
  titleLabel.textContent = "Title";
  titleGroup.appendChild(titleLabel);

  const titleField = document.createElement("input");
  titleField.id = "zen-hn-title";
  titleField.className = "zen-hn-submit-input";
  titleField.type = "text";
  titleField.name = "title";
  titleField.required = true;
  if (titleInput?.value) {
    titleField.value = titleInput.value;
  }
  titleGroup.appendChild(titleField);

  form.appendChild(titleGroup);

  // URL field
  const urlGroup = document.createElement("div");
  urlGroup.className = "zen-hn-submit-field";

  const urlLabel = document.createElement("label");
  urlLabel.className = "zen-hn-submit-label";
  urlLabel.htmlFor = "zen-hn-url";
  urlLabel.textContent = "URL";
  urlGroup.appendChild(urlLabel);

  const urlField = document.createElement("input");
  urlField.id = "zen-hn-url";
  urlField.className = "zen-hn-submit-input";
  urlField.type = "text";
  urlField.name = "url";
  if (urlInput?.value) {
    urlField.value = urlInput.value;
  }
  urlGroup.appendChild(urlField);

  form.appendChild(urlGroup);

  // Divider text
  const divider = document.createElement("div");
  divider.className = "zen-hn-submit-divider";
  divider.textContent = "or";
  form.appendChild(divider);

  // Text field
  const textGroup = document.createElement("div");
  textGroup.className = "zen-hn-submit-field";

  const textLabel = document.createElement("label");
  textLabel.className = "zen-hn-submit-label";
  textLabel.htmlFor = "zen-hn-text";
  textLabel.textContent = "Text";
  textGroup.appendChild(textLabel);

  const textField = document.createElement("textarea");
  textField.id = "zen-hn-text";
  textField.className = "zen-hn-submit-textarea";
  textField.name = "text";
  textField.rows = 4;
  if (textArea?.value) {
    textField.value = textArea.value;
  }
  textGroup.appendChild(textField);

  form.appendChild(textGroup);

  // Submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "zen-hn-button-outline";
  submitButton.textContent = "Submit";
  form.appendChild(submitButton);

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
    // Insert after sidebar for correct tab order
    const sidebar = document.getElementById("zen-hn-sidebar");
    if (sidebar) {
      sidebar.insertAdjacentElement("afterend", subnav);
    } else {
      document.body.insertBefore(subnav, document.body.firstChild);
    }
    document.documentElement.setAttribute("data-zen-hn-subnav", "true");
  }

  if (form) {
    // Extract profile data from the form and show header
    const profileData = extractUserProfileData(form);
    if (profileData) {
      const header = createUserProfileHeader(profileData);
      wrapper.appendChild(header);
    }

    // Form stays hidden in hnmain - profile editing is done via modal
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

    // Move HN settings section from hidden form to visible wrapper
    const hnSettingsSection = form.querySelector(".zen-hn-hn-settings-section");
    if (hnSettingsSection) {
      // Insert before the Zen HN Appearance section
      const zenHnSettings = wrapper.querySelector(".zen-hn-settings-section");
      if (zenHnSettings) {
        wrapper.insertBefore(hnSettingsSection, zenHnSettings);
      } else {
        wrapper.appendChild(hnSettingsSection);
      }
    }
  }

  return true;
}

/**
 * Pages that are user list pages (not the profile page itself)
 * Note: /threads is handled by restyleComments() instead
 */
const USER_LIST_PAGES = ["/favorites", "/upvoted", "/flagged", "/hidden", "/submitted"];

/**
 * Pages that support filtering between submissions and comments
 */
const FILTER_PAGES = ["/favorites", "/upvoted", "/flagged"];

/**
 * Check if the current page is a user list page
 */
function isUserListPage(): boolean {
  return USER_LIST_PAGES.includes(window.location.pathname);
}

/**
 * Check if the current page supports submissions/comments filtering
 */
function isFilterPage(): boolean {
  return FILTER_PAGES.includes(window.location.pathname);
}

/**
 * Check if we're currently viewing comments (via URL param)
 */
function isCommentsView(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("comments") === "t";
}

/**
 * Create filter buttons for switching between submissions and comments
 */
function createFilterButtons(username: string): HTMLElement {
  const pathname = window.location.pathname;
  const isComments = isCommentsView();

  const container = document.createElement("div");
  container.className = "zen-hn-filter-buttons";

  const submissionsLink = document.createElement("a");
  submissionsLink.className = "zen-hn-button-outline";
  submissionsLink.href = `${pathname}?id=${username}`;
  submissionsLink.textContent = "Submissions";
  if (!isComments) {
    submissionsLink.classList.add("is-active");
    submissionsLink.setAttribute("aria-current", "page");
  }

  const commentsLink = document.createElement("a");
  commentsLink.className = "zen-hn-button-outline";
  commentsLink.href = `${pathname}?id=${username}&comments=t`;
  commentsLink.textContent = "Comments";
  if (isComments) {
    commentsLink.classList.add("is-active");
    commentsLink.setAttribute("aria-current", "page");
  }

  container.appendChild(submissionsLink);
  container.appendChild(commentsLink);

  return container;
}

/**
 * Add filter buttons to pages that support submissions/comments filtering.
 * Called after restyleSubmissions/restyleComments have already processed the content.
 */
export function addFilterButtons(): boolean {
  if (!isFilterPage()) {
    return false;
  }

  // Skip if filter buttons already exist
  if (document.querySelector(".zen-hn-filter-buttons")) {
    return false;
  }

  const username = getUsernameFromUrl();
  if (!username) {
    return false;
  }

  const zenHnMain = getOrCreateZenHnMain();
  const filterButtons = createFilterButtons(username);

  // Insert at the beginning of zen-hn-main
  zenHnMain.insertBefore(filterButtons, zenHnMain.firstChild);

  return true;
}

/**
 * Restyle user list pages (favorites, upvoted, submitted, threads)
 * These pages show lists of items and need proper restyling
 */
export function restyleUserListPage(): boolean {
  if (!isUserListPage()) {
    return false;
  }

  // Filter pages are handled by restyleSubmissions/restyleComments + addFilterButtons
  if (isFilterPage()) {
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

  // Insert after sidebar for correct tab order (sidebar -> subnav -> main content)
  const sidebar = document.getElementById("zen-hn-sidebar");
  if (sidebar) {
    sidebar.insertAdjacentElement("afterend", subnav);
  } else {
    document.body.insertBefore(subnav, document.body.firstChild);
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
        <h2 class="zen-hn-about-section-title">HN</h2>
        <ul class="zen-hn-about-links">
          <li><a href="https://news.ycombinator.com/newsguidelines.html" target="_blank" rel="noopener">Guidelines</a> / <a href="https://news.ycombinator.com/newsfaq.html" target="_blank" rel="noopener">FAQ</a></li>
          <li><a href="https://news.ycombinator.com/security.html" target="_blank" rel="noopener">Security</a> / <a href="https://www.ycombinator.com/legal/" target="_blank" rel="noopener">Legal</a></li>
          <li><a href="https://github.com/HackerNews/API" target="_blank" rel="noopener">API</a></li>
          <li><a href="https://www.ycombinator.com/apply/" target="_blank" rel="noopener">Apply to YC</a></li>
          <li><a href="mailto:hn@ycombinator.com">Contact</a></li>
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
    // Insert after sidebar for correct tab order
    const sidebar = document.getElementById("zen-hn-sidebar");
    if (sidebar) {
      sidebar.insertAdjacentElement("afterend", subnav);
    } else {
      document.body.insertBefore(subnav, document.body.firstChild);
    }
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

// =============================================================================
// Lists Page
// =============================================================================

/**
 * Restyle the Lists page (/lists)
 * This page shows a directory of various HN list views
 */
export function restyleListsPage(): boolean {
  if (window.location.pathname !== "/lists") {
    return false;
  }

  const hnmain = document.getElementById("hnmain") as HTMLElement | null;
  if (!hnmain || hnmain.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return false;
  }

  // Find the bigbox which contains the lists table
  const bigbox = hnmain.querySelector("#bigbox table");
  if (!bigbox) {
    return false;
  }

  // Create styled content
  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-lists-page";

  const header = document.createElement("header");
  header.className = "zen-hn-lists-header";

  const title = document.createElement("h1");
  title.className = "zen-hn-lists-title";
  title.textContent = "Lists";
  header.appendChild(title);

  wrapper.appendChild(header);

  // Create a styled list container
  const listContainer = document.createElement("ul");
  listContainer.className = "zen-hn-lists-container";

  // Add Random item at the top
  const randomItem = document.createElement("li");
  randomItem.className = "zen-hn-lists-item";

  const randomLink = document.createElement("a");
  randomLink.className = "zen-hn-lists-link";
  randomLink.href = "#";
  randomLink.textContent = "Random";
  randomLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (typeof ZenHnRandom !== "undefined" && ZenHnRandom.handleRandomItemClick) {
      ZenHnRandom.handleRandomItemClick(e).catch(() => {});
    }
  });
  randomItem.appendChild(randomLink);

  const randomDescription = document.createElement("p");
  randomDescription.className = "zen-hn-lists-description";
  randomDescription.textContent = "Jump to a random story from across HN's history.";
  randomItem.appendChild(randomDescription);

  // Make entire item clickable
  randomItem.addEventListener("click", (e) => {
    // Don't trigger if clicking on the link itself (it has its own handler)
    if ((e.target as HTMLElement).closest("a")) return;
    randomLink.click();
  });

  listContainer.appendChild(randomItem);

  // Extract rows from the table - each row has link in first td, description in second
  const rows = bigbox.querySelectorAll("tr");
  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells.length < 2) continue;

    const linkCell = cells[0];
    const descCell = cells[1];
    const link = linkCell.querySelector("a");

    if (!link) continue;

    const item = document.createElement("li");
    item.className = "zen-hn-lists-item";

    const itemLink = document.createElement("a");
    itemLink.className = "zen-hn-lists-link";
    itemLink.href = link.href;
    itemLink.textContent = link.textContent;
    item.appendChild(itemLink);

    // Description may contain links, so preserve HTML
    const description = document.createElement("p");
    description.className = "zen-hn-lists-description";
    description.innerHTML = descCell.innerHTML;
    item.appendChild(description);

    // Make entire item clickable
    item.addEventListener("click", (e) => {
      // Don't trigger if clicking on a link (description may have links)
      if ((e.target as HTMLElement).closest("a")) return;
      itemLink.click();
    });

    listContainer.appendChild(item);
  }

  wrapper.appendChild(listContainer);

  hnmain.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  getOrCreateZenHnMain().appendChild(wrapper);

  return true;
}

export function restyleDeleteConfirmPage(): boolean {
  if (window.location.pathname !== "/delete-confirm") {
    return false;
  }

  const hnmain = document.getElementById("hnmain") as HTMLElement | null;
  if (!hnmain || hnmain.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return false;
  }

  // Find the delete form - it posts to /xdelete
  const originalForm = hnmain.querySelector<HTMLFormElement>('form[action="/xdelete"]');
  if (!originalForm) {
    return false;
  }

  // Find the Yes/No submit inputs
  const yesInput = originalForm.querySelector<HTMLInputElement>('input[type="submit"][value="Yes"]');
  const noInput = originalForm.querySelector<HTMLInputElement>('input[type="submit"][value="No"]');

  if (!yesInput && !noInput) {
    return false;
  }

  // Create styled page
  const wrapper = document.createElement("div");
  wrapper.className = "zen-hn-delete-confirm-page";

  // Header
  const header = document.createElement("header");
  header.className = "zen-hn-delete-confirm-header";

  const title = document.createElement("h1");
  title.className = "zen-hn-delete-confirm-title";
  title.textContent = "Confirm deletion";
  header.appendChild(title);

  wrapper.appendChild(header);

  // Confirmation message
  const message = document.createElement("p");
  message.className = "zen-hn-delete-confirm-message";
  message.textContent = "Do you want this to be deleted?";
  wrapper.appendChild(message);

  // Create new form with hidden inputs preserved
  const form = document.createElement("form");
  form.action = originalForm.action;
  form.method = originalForm.method;

  // Copy hidden inputs
  const hiddenInputs = originalForm.querySelectorAll<HTMLInputElement>('input[type="hidden"]');
  hiddenInputs.forEach((input) => {
    const clone = input.cloneNode(true) as HTMLInputElement;
    form.appendChild(clone);
  });

  // Button group
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "zen-hn-delete-confirm-buttons";

  if (yesInput) {
    const yesButton = document.createElement("button");
    yesButton.type = "submit";
    yesButton.name = "d";
    yesButton.value = "Yes";
    yesButton.className = "zen-hn-button-outline";
    yesButton.textContent = "Yes";
    buttonGroup.appendChild(yesButton);
  }

  if (noInput) {
    const noButton = document.createElement("button");
    noButton.type = "submit";
    noButton.name = "d";
    noButton.value = "No";
    noButton.className = "zen-hn-button-ghost";
    noButton.textContent = "No";
    buttonGroup.appendChild(noButton);
  }

  form.appendChild(buttonGroup);
  wrapper.appendChild(form);

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
  restyleListsPage,
  restyleDeleteConfirmPage,
  cacheLoggedInUsername,
};
