/**
 * Sidebar navigation for Zen HN
 */

import { renderIcon, HN_HOME_SVG, type IconName } from "./icons";
import { handleRandomItemClick } from "./random";

interface IconLinkConfig {
  href?: string;
  icon: IconName;
  iconFill?: IconName;
  label: string;
  action?: "random";
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

function findUserLink(): { href: string; label: string } {
  const profileLink = document.querySelector<HTMLAnchorElement>("a#me");
  const loginLink = document.querySelector<HTMLAnchorElement>("span.pagetop a[href^='login']");
  const userLink = profileLink || loginLink;
  const href = userLink?.getAttribute("href") || "/login";
  const label = userLink === loginLink ? "Log in" : userLink ? "Profile" : "Log in";
  return { href, label };
}

function createIconLink(item: IconLinkConfig): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "zen-hn-sidebar-icon-link";
  link.href = item.href || "#";
  link.setAttribute("aria-label", item.label);
  link.setAttribute("title", item.label);

  const currentPath = getCurrentPath();
  const isActive = item.action !== "random" && item.href && isActiveRoute(item.href);

  if (isActive && item.iconFill) {
    link.innerHTML = renderIcon(item.iconFill);
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  } else {
    link.innerHTML = renderIcon(item.icon);
  }

  if (item.action === "random") {
    link.addEventListener("click", handleRandomItemClick);
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
  button.setAttribute("title", "Home");
  button.innerHTML = HN_HOME_SVG;
  item.appendChild(button);
  return item;
}

function createIconGroup(): HTMLLIElement {
  const iconLinks: IconLinkConfig[] = [
    { href: "/news", icon: "house-simple", iconFill: "house-simple-fill", label: "News" },
    { href: "/newest", icon: "seal", iconFill: "seal-fill", label: "New" },
    { href: "/active", icon: "lightning", iconFill: "lightning-fill", label: "Active" },
    { href: "/best", icon: "crown-simple", iconFill: "crown-simple-fill", label: "Best" },
    { href: "/ask", icon: "chat-circle", iconFill: "chat-circle-fill", label: "Ask" },
    { href: "/newest", icon: "dice-two", label: "Random", action: "random" },
  ];

  const group = document.createElement("li");
  group.className = "zen-hn-sidebar-item zen-hn-sidebar-icons";

  iconLinks.forEach((config) => {
    group.appendChild(createIconLink(config));
  });

  return group;
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
  submitLink.setAttribute("title", "Submit");
  if (currentPath === "/submit") {
    submitLink.innerHTML = renderIcon("pencil-simple-fill");
    submitLink.classList.add("is-active");
    submitLink.setAttribute("aria-current", "page");
  } else {
    submitLink.innerHTML = renderIcon("pencil-simple");
  }
  group.appendChild(submitLink);

  const userLink = document.createElement("a");
  userLink.className = "zen-hn-sidebar-icon-link";
  userLink.href = userInfo.href;
  userLink.setAttribute("aria-label", userInfo.label);
  userLink.setAttribute("title", userInfo.label);
  const isUserActive = currentPath === "/user";
  if (isUserActive) {
    userLink.innerHTML = renderIcon("user-fill");
    userLink.classList.add("is-active");
    userLink.setAttribute("aria-current", "page");
  } else {
    userLink.innerHTML = renderIcon("user");
  }
  group.appendChild(userLink);

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
