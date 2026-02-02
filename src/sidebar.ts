/**
 * Sidebar navigation for Zen HN
 */

import { renderIcon, HN_HOME_SVG, type IconName } from "./icons";
import { initTooltip } from "./tooltip";
import {
  createDropdownMenu,
  type DropdownMenuItem,
  type DropdownMenuOptions,
} from "./dropdownMenu";
import { showHelpModal } from "./keyboardShortcuts";

interface IconLinkConfig {
  href: string;
  icon: IconName;
  iconFill?: IconName;
  label: string;
  shortcut?: string;
}

function getCurrentPath(): string {
  return globalThis.location?.pathname || "";
}

function isActiveRoute(href: string): boolean {
  const currentPath = getCurrentPath();
  if (href === "/news") {
    return currentPath === "/" || currentPath === "/news";
  }
  return currentPath === href;
}

const LOGGED_IN_USERNAME_KEY = "zenHnLoggedInUsername";

interface UserInfo {
  href: string;
  label: string;
  isLoggedIn: boolean;
  logoutHref?: string;
}

function findUserLink(): UserInfo {
  const profileLink = document.querySelector<HTMLAnchorElement>("a#me");
  const loginLink = document.querySelector<HTMLAnchorElement>("span.pagetop a[href^='login']");
  const logoutLink = document.querySelector<HTMLAnchorElement>("span.pagetop a#logout");

  // If we have a profile link, extract and validate the username
  if (profileLink) {
    const href = profileLink.getAttribute("href") || "";
    const match = href.match(/user\?id=([^&]+)/);
    const logoutHref = logoutLink?.getAttribute("href") || undefined;

    if (match && match[1]) {
      // Cache username for pages without header
      try {
        localStorage.setItem(LOGGED_IN_USERNAME_KEY, match[1]);
      } catch {
        // Ignore storage errors
      }
      // Return absolute URL to avoid relative URL resolution issues
      return { href: `/user?id=${match[1]}`, label: "Profile", isLoggedIn: true, logoutHref };
    }

    // Fallback: try getting username from link text
    const username = profileLink.textContent?.trim();
    if (username) {
      try {
        localStorage.setItem(LOGGED_IN_USERNAME_KEY, username);
      } catch {
        // Ignore storage errors
      }
      return { href: `/user?id=${username}`, label: "Profile", isLoggedIn: true, logoutHref };
    }
  }

  // Try cached username if no profile link found
  try {
    const cachedUsername = localStorage.getItem(LOGGED_IN_USERNAME_KEY);
    if (cachedUsername) {
      return { href: `/user?id=${cachedUsername}`, label: "Profile", isLoggedIn: true };
    }
  } catch {
    // Ignore storage errors
  }

  // Fall back to login link or /login
  const loginHref = loginLink?.getAttribute("href") || "/login";
  return { href: loginHref, label: "Log in", isLoggedIn: false };
}

function createIconLink(item: IconLinkConfig): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "zen-hn-sidebar-icon-link";
  link.href = item.href;
  link.setAttribute("aria-label", item.label);
  initTooltip(link, item.label, { position: "right", shortcut: item.shortcut });

  const isActive = isActiveRoute(item.href);

  if (isActive && item.iconFill) {
    link.innerHTML = renderIcon(item.iconFill);
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  } else {
    link.innerHTML = renderIcon(item.icon);
  }

  return link;
}

function createHomeButton(): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "zen-hn-sidebar-item";
  const button = document.createElement("a");
  button.className = "zen-hn-sidebar-icon-link zen-hn-home-button";
  button.href = "/";
  button.setAttribute("aria-label", "Home");
  initTooltip(button, "Home", { position: "right", shortcut: "g+h" });
  button.innerHTML = HN_HOME_SVG;
  item.appendChild(button);
  return item;
}

function createIconGroup(): HTMLLIElement {
  const iconLinks: IconLinkConfig[] = [
    { href: "/news", icon: "house-simple", iconFill: "house-simple-fill", label: "News", shortcut: "g+h" },
    { href: "/newest", icon: "seal", iconFill: "seal-fill", label: "New", shortcut: "g+n" },
    { href: "/active", icon: "lightning", iconFill: "lightning-fill", label: "Active", shortcut: "g+a" },
    { href: "/best", icon: "crown-simple", iconFill: "crown-simple-fill", label: "Best", shortcut: "g+b" },
    { href: "/ask", icon: "chat-circle", iconFill: "chat-circle-fill", label: "Ask", shortcut: "g+s" },
    { href: "/lists", icon: "list-dashes", iconFill: "list-dashes-fill", label: "Lists", shortcut: "g+l" },
  ];

  const group = document.createElement("li");
  group.className = "zen-hn-sidebar-item zen-hn-sidebar-icons";

  iconLinks.forEach((config) => {
    group.appendChild(createIconLink(config));
  });

  return group;
}

function createUserMenuButton(isActive: boolean): HTMLElement {
  const buttonContent = document.createElement("span");
  buttonContent.className = "zen-hn-sidebar-icon-link-inner";
  buttonContent.innerHTML = renderIcon(isActive ? "user-fill" : "user");
  return buttonContent;
}

function createBottomGroup(): HTMLLIElement {
  const group = document.createElement("li");
  group.className = "zen-hn-sidebar-item zen-hn-sidebar-bottom zen-hn-sidebar-bottom-group";

  const userInfo = findUserLink();
  const currentPath = getCurrentPath();

  const submitLink = document.createElement("a");
  submitLink.className = "zen-hn-sidebar-icon-link";
  submitLink.href = "/submit";
  submitLink.setAttribute("aria-label", "Submit");
  initTooltip(submitLink, "Submit", { position: "right", shortcut: "c" });
  if (currentPath === "/submit") {
    submitLink.innerHTML = renderIcon("pencil-simple-fill");
    submitLink.classList.add("is-active");
    submitLink.setAttribute("aria-current", "page");
  } else {
    submitLink.innerHTML = renderIcon("pencil-simple");
  }
  group.appendChild(submitLink);

  // If not logged in, show a simple login link
  if (!userInfo.isLoggedIn) {
    const loginLink = document.createElement("a");
    loginLink.className = "zen-hn-sidebar-icon-link";
    loginLink.href = userInfo.href;
    loginLink.setAttribute("aria-label", userInfo.label);
    initTooltip(loginLink, userInfo.label, { position: "right" });
    loginLink.innerHTML = renderIcon("user");
    group.appendChild(loginLink);
    return group;
  }

  // Create user menu for logged-in users
  const isUserActive = currentPath === "/user";
  const menuItems: DropdownMenuItem[] = [
    {
      label: "Profile",
      href: userInfo.href,
      shortcut: "g + p",
      isActive: isUserActive,
    },
    {
      label: "Shortcuts",
      onClick: (e) => {
        e.preventDefault();
        showHelpModal();
      },
      shortcut: "?",
    },
    {
      label: "About",
      href: "/newsguidelines.html",
    },
  ];

  // Add logout if we have the link
  if (userInfo.logoutHref) {
    menuItems.push({
      label: "Log out",
      href: userInfo.logoutHref,
    });
  }

  const menuOptions: DropdownMenuOptions = {
    classPrefix: "zen-hn-user-menu",
    position: "left",
  };

  const userMenu = createDropdownMenu(
    createUserMenuButton(isUserActive),
    menuItems,
    menuOptions,
  );
  userMenu.classList.add("zen-hn-sidebar-user-menu");
  if (isUserActive) {
    userMenu.classList.add("is-active");
  }

  group.appendChild(userMenu);

  return group;
}

function hideHeaderElements(): void {
  const pagetops = document.querySelectorAll("span.pagetop");
  const headerRow = pagetops[0]?.closest("tr");
  if (headerRow) {
    headerRow.style.display = "none";
  }

  const pageSpacer = document.querySelector<HTMLElement>("tr#pagespace");
  if (pageSpacer) {
    pageSpacer.style.display = "none";
  }
}

export function buildSidebarNavigation(): boolean {
  // Skip if extension is disabled
  if (document.documentElement.dataset.zenHnEnabled === "false") {
    return false;
  }

  if (document.getElementById("zen-hn-sidebar")) {
    document.documentElement.dataset.zenHnSidebar = "true";
    return true;
  }

  const pagetops = Array.from(document.querySelectorAll("span.pagetop"));
  const isAboutPage = getCurrentPath() === "/about";

  // About page may not have pagetops or hnmain initially (error page structure)
  // so we only require document.body to exist
  if (!isAboutPage && !pagetops.length && !document.getElementById("hnmain")) {
    return false;
  }

  const list = document.createElement("ul");
  list.className = "zen-hn-sidebar-list";

  list.appendChild(createHomeButton());
  list.appendChild(createIconGroup());
  list.appendChild(createBottomGroup());

  if (!list.childNodes.length) {
    return false;
  }

  if (!document.body) {
    return false;
  }

  const nav = document.createElement("nav");
  nav.className = "zen-hn-sidebar-nav";
  nav.appendChild(list);

  const sidebar = document.createElement("aside");
  sidebar.id = "zen-hn-sidebar";
  sidebar.setAttribute("aria-label", "Hacker News navigation");
  sidebar.appendChild(nav);

  // Insert at beginning of body for correct tab order (after skip link if present)
  const skipLink = document.querySelector(".zen-hn-skip-link");
  if (skipLink) {
    skipLink.insertAdjacentElement("afterend", sidebar);
  } else {
    document.body.insertBefore(sidebar, document.body.firstChild);
  }
  document.documentElement.dataset.zenHnSidebar = "true";

  hideHeaderElements();

  return true;
}

export function runSidebarWhenReady(): void {
  // Skip if extension is disabled
  if (document.documentElement.dataset.zenHnEnabled === "false") {
    return;
  }

  let attempts = 0;
  const maxAttempts = 60;

  const attempt = (): void => {
    const built = buildSidebarNavigation();
    if (built) {
      return;
    }
    attempts += 1;
    if (attempts >= maxAttempts && document.readyState !== "loading") {
      if (document.documentElement.dataset.zenHnSidebar === "loading") {
        delete document.documentElement.dataset.zenHnSidebar;
      }
      return;
    }
    globalThis.requestAnimationFrame(attempt);
  };

  attempt();
}
