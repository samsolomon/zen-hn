/**
 * Subnav overflow detection and "More" dropdown management
 * Uses the generic dropdown component for state management
 */

import {
  setDropdownMenuState,
  registerDropdownMenuListeners,
} from "./dropdownMenu";

const SUBNAV_MORE_MENU_CLASS = "zen-hn-subnav-more-menu";

/**
 * Measure available width and distribute items between main list and More dropdown
 */
function measureAndDistributeItems(nav: HTMLElement): void {
  const list = nav.querySelector(".zen-hn-subnav-list") as HTMLElement | null;
  const moreWrapper = nav.querySelector(`.${SUBNAV_MORE_MENU_CLASS}`) as HTMLElement | null;
  const moreDropdown = moreWrapper?.querySelector(".zen-dropdown-dropdown") as HTMLElement | null;

  if (!list || !moreWrapper || !moreDropdown) return;

  // Get all regular nav items (not the More wrapper)
  const allItems = Array.from(list.querySelectorAll(`.zen-hn-subnav-item:not(.${SUBNAV_MORE_MENU_CLASS})`)) as HTMLElement[];

  // Reset: move all items back to main list and make them visible
  for (const item of allItems) {
    if (item.parentElement === moreDropdown) {
      list.insertBefore(item, moreWrapper);
    }
    item.style.display = "";
  }

  // Hide the More button initially to measure without it
  moreWrapper.classList.remove("has-overflow");

  // Get available width (nav container width minus padding)
  const navStyle = getComputedStyle(nav);
  const navPaddingLeft = parseFloat(navStyle.paddingLeft) || 0;
  const navPaddingRight = parseFloat(navStyle.paddingRight) || 0;
  const availableWidth = nav.clientWidth - navPaddingLeft - navPaddingRight;

  // Measure the More button width (temporarily show it)
  moreWrapper.style.visibility = "hidden";
  moreWrapper.classList.add("has-overflow");
  const moreButtonWidth = moreWrapper.offsetWidth;
  moreWrapper.classList.remove("has-overflow");
  moreWrapper.style.visibility = "";

  // Get gap between items
  const listStyle = getComputedStyle(list);
  const gap = parseFloat(listStyle.gap) || 0;

  // Measure each item and determine which fit
  let currentWidth = 0;
  let overflowStartIndex = -1;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const itemWidth = item.offsetWidth;

    // Add gap if not the first item
    const widthWithGap = i === 0 ? itemWidth : itemWidth + gap;

    // Check if this item fits
    // Reserve space for More button if there are more items after this
    const needsMoreButton = i < allItems.length - 1;
    const reservedWidth = needsMoreButton ? moreButtonWidth + gap : 0;

    if (currentWidth + widthWithGap + reservedWidth > availableWidth) {
      overflowStartIndex = i;
      break;
    }

    currentWidth += widthWithGap;
  }

  // If all items fit, we're done
  if (overflowStartIndex === -1) {
    moreWrapper.classList.remove("has-overflow", "has-active-item");
    return;
  }

  // Move overflow items to dropdown
  let hasActiveItem = false;
  for (let i = overflowStartIndex; i < allItems.length; i++) {
    const item = allItems[i];
    moreDropdown.appendChild(item);

    // Check if this item contains the active link
    if (item.querySelector(".zen-hn-subnav-link.is-active")) {
      hasActiveItem = true;
    }
  }

  // Show More button and set active indicator
  moreWrapper.classList.add("has-overflow");
  moreWrapper.classList.toggle("has-active-item", hasActiveItem);
}

/**
 * Handle keyboard navigation within the dropdown
 */
function handleDropdownKeydown(e: KeyboardEvent, wrapper: HTMLElement): void {
  const dropdown = wrapper.querySelector(".zen-dropdown-dropdown") as HTMLElement | null;
  const button = wrapper.querySelector(".zen-dropdown-button") as HTMLButtonElement | null;

  if (!dropdown || !button) return;

  const items = Array.from(dropdown.querySelectorAll(".zen-hn-subnav-link")) as HTMLElement[];
  const currentIndex = items.findIndex((item) => item === document.activeElement);

  switch (e.key) {
    case "Escape":
      e.preventDefault();
      setDropdownMenuState(wrapper, false);
      button.focus();
      break;

    case "ArrowDown":
      e.preventDefault();
      if (currentIndex < items.length - 1) {
        items[currentIndex + 1].focus();
      } else {
        items[0].focus();
      }
      break;

    case "ArrowUp":
      e.preventDefault();
      if (currentIndex > 0) {
        items[currentIndex - 1].focus();
      } else {
        items[items.length - 1].focus();
      }
      break;

    case "Home":
      e.preventDefault();
      items[0]?.focus();
      break;

    case "End":
      e.preventDefault();
      items[items.length - 1]?.focus();
      break;

    case "Tab":
      // Close dropdown when tabbing out
      setDropdownMenuState(wrapper, false);
      break;
  }
}

/**
 * Initialize subnav overflow detection and event handlers
 */
export function initSubnavOverflow(nav: HTMLElement): void {
  const moreWrapper = nav.querySelector(`.${SUBNAV_MORE_MENU_CLASS}`) as HTMLElement | null;
  const moreButton = moreWrapper?.querySelector(".zen-dropdown-button") as HTMLButtonElement | null;

  if (!moreWrapper || !moreButton) return;

  // Register global handlers for this dropdown class
  registerDropdownMenuListeners(SUBNAV_MORE_MENU_CLASS);

  // Stop propagation on all clicks within the menu to prevent HN's
  // document click handler from erroring when traversing our elements
  moreWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Toggle dropdown on button click
  moreButton.addEventListener("click", () => {
    const isCurrentlyOpen = moreWrapper.classList.contains("is-open");
    setDropdownMenuState(moreWrapper, !isCurrentlyOpen);
  });

  // Keyboard navigation
  moreWrapper.addEventListener("keydown", (e) => {
    if (moreWrapper.classList.contains("is-open")) {
      handleDropdownKeydown(e, moreWrapper);
    } else if (e.key === "ArrowDown" && document.activeElement === moreButton) {
      e.preventDefault();
      setDropdownMenuState(moreWrapper, true);
    }
  });

  // Debounced resize handler
  let resizeTimeout: number | null = null;
  const resizeObserver = new ResizeObserver(() => {
    if (resizeTimeout) {
      window.clearTimeout(resizeTimeout);
    }
    resizeTimeout = window.setTimeout(() => {
      measureAndDistributeItems(nav);
    }, 100);
  });

  resizeObserver.observe(nav);

  // Initial measurement
  measureAndDistributeItems(nav);
}
