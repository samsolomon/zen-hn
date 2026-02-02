/**
 * Generic reusable dropdown menu component
 */

export interface DropdownMenuOptions {
  /** CSS class prefix for the menu (e.g., "hn-submission" -> "hn-submission-menu") */
  classPrefix?: string;
  /** Custom class for the wrapper element */
  wrapperClass?: string;
  /** Position of dropdown relative to button */
  position?: "left" | "right";
  /** Callback when menu opens */
  onOpen?: () => void;
  /** Callback when menu closes */
  onClose?: () => void;
}

export interface DropdownMenuItem {
  /** Display text for the item */
  label: string;
  /** Optional href for link items */
  href?: string;
  /** Click handler for button items */
  onClick?: (event: MouseEvent) => void;
  /** Additional CSS class */
  className?: string;
  /** Whether item is currently active/selected */
  isActive?: boolean;
  /** Keyboard shortcut to display */
  shortcut?: string;
}

const DEFAULT_CLASS_PREFIX = "zen-dropdown";
const OPEN_CLASS = "is-open";

let globalHandlersRegistered = false;
const registeredMenuClasses = new Set<string>();

/**
 * Creates a dropdown menu element
 */
export function createDropdownMenu(
  buttonContent: string | HTMLElement,
  items: DropdownMenuItem[],
  options: DropdownMenuOptions = {},
): HTMLElement {
  const prefix = options.classPrefix ?? DEFAULT_CLASS_PREFIX;
  const menuClass = `${prefix}-menu`;

  // Wrapper
  const wrapper = document.createElement("div");
  wrapper.className = menuClass;
  if (options.wrapperClass) {
    wrapper.classList.add(options.wrapperClass);
  }

  // Button
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${prefix}-button`;
  button.setAttribute("aria-haspopup", "menu");
  button.setAttribute("aria-expanded", "false");

  if (typeof buttonContent === "string") {
    button.textContent = buttonContent;
  } else {
    button.appendChild(buttonContent);
  }

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = wrapper.classList.contains(OPEN_CLASS);
    closeAllDropdownMenus(menuClass, wrapper);
    setDropdownMenuState(wrapper, !isOpen, options);
  });

  // Dropdown
  const dropdown = document.createElement("ul");
  dropdown.className = `${prefix}-dropdown`;
  dropdown.setAttribute("role", "menu");
  if (options.position === "left") {
    dropdown.classList.add("position-left");
  }

  // Items
  items.forEach((item) => {
    const li = document.createElement("li");
    li.setAttribute("role", "none");

    const element = item.href
      ? document.createElement("a")
      : document.createElement("button");

    element.className = `${prefix}-item`;
    if (item.className) {
      element.classList.add(item.className);
    }
    if (item.isActive) {
      element.classList.add("is-active");
    }
    element.setAttribute("role", "menuitem");

    // Create label span
    const labelSpan = document.createElement("span");
    labelSpan.className = `${prefix}-item-label`;
    labelSpan.textContent = item.label;
    element.appendChild(labelSpan);

    // Add shortcut if provided
    if (item.shortcut) {
      const shortcutSpan = document.createElement("span");
      shortcutSpan.className = `${prefix}-item-shortcut`;
      // Split shortcut into individual keys and wrap in kbd elements
      const keys = item.shortcut.split("+").map((k) => k.trim());
      keys.forEach((key, index) => {
        if (index > 0) {
          shortcutSpan.appendChild(document.createTextNode(" "));
        }
        const kbd = document.createElement("kbd");
        kbd.textContent = key;
        shortcutSpan.appendChild(kbd);
      });
      element.appendChild(shortcutSpan);
    }

    if (item.href && element instanceof HTMLAnchorElement) {
      element.href = item.href;
    }

    if (element instanceof HTMLButtonElement) {
      element.type = "button";
    }

    if (item.onClick) {
      element.addEventListener("click", item.onClick);
    }

    li.appendChild(element);
    dropdown.appendChild(li);
  });

  wrapper.appendChild(button);
  wrapper.appendChild(dropdown);

  // Register global handlers for this menu class
  registerDropdownMenuListeners(menuClass);

  return wrapper;
}

/**
 * Sets the open/close state of a dropdown menu
 */
export function setDropdownMenuState(
  menu: Element | null,
  isOpen: boolean,
  options: DropdownMenuOptions = {},
): void {
  if (!menu) return;

  menu.classList.toggle(OPEN_CLASS, isOpen);

  const button = menu.querySelector("[aria-haspopup]");
  if (button) {
    button.setAttribute("aria-expanded", String(isOpen));
  }

  if (isOpen) {
    options.onOpen?.();
    // Focus first item when opening
    const firstItem = menu.querySelector("[role='menuitem']") as HTMLElement;
    if (firstItem) {
      requestAnimationFrame(() => firstItem.focus());
    }
  } else {
    options.onClose?.();
  }
}

/**
 * Closes all dropdown menus with the given class, optionally except one
 */
export function closeAllDropdownMenus(
  menuClass: string,
  exceptMenu?: Element,
): void {
  const openMenus = document.querySelectorAll(`.${menuClass}.${OPEN_CLASS}`);
  openMenus.forEach((menu) => {
    if (menu === exceptMenu) return;
    setDropdownMenuState(menu, false);
  });
}

/**
 * Registers global click-outside and escape key handlers for dropdown menus
 */
export function registerDropdownMenuListeners(menuClass: string): void {
  if (registeredMenuClasses.has(menuClass)) return;
  registeredMenuClasses.add(menuClass);

  if (globalHandlersRegistered) return;
  globalHandlersRegistered = true;

  // Click outside to close
  document.addEventListener("click", (event: MouseEvent) => {
    registeredMenuClasses.forEach((cls) => {
      const openMenus = document.querySelectorAll(`.${cls}.${OPEN_CLASS}`);
      openMenus.forEach((menu) => {
        if (!menu.contains(event.target as Node)) {
          setDropdownMenuState(menu, false);
        }
      });
    });
  });

  // Escape to close all
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    registeredMenuClasses.forEach((cls) => {
      closeAllDropdownMenus(cls);
    });
  });
}

/**
 * Check if a dropdown menu is currently open
 */
export function isDropdownMenuOpen(menu: Element): boolean {
  return menu.classList.contains(OPEN_CLASS);
}
