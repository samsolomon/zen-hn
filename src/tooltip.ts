/**
 * Tooltip component - custom tooltips to replace browser native tooltips
 *
 * Usage:
 *   import { initTooltip } from './tooltip';
 *
 *   // Add tooltip to an element
 *   initTooltip(element, 'Tooltip text');
 *
 *   // Or with options
 *   initTooltip(element, 'Tooltip text', { position: 'bottom' });
 *
 *   // Programmatic control
 *   const { show, hide, destroy } = initTooltip(element, 'Text');
 */

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipOptions {
  /** Position relative to the target element */
  position?: TooltipPosition;
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) */
  hideDelay?: number;
  /** Keyboard shortcut hint, e.g. "u", "g+h", "Space" */
  shortcut?: string;
}

export interface TooltipController {
  /** Show the tooltip */
  show: () => void;
  /** Hide the tooltip */
  hide: () => void;
  /** Update tooltip text */
  updateText: (text: string) => void;
  /** Remove tooltip and cleanup listeners */
  destroy: () => void;
}

const TOOLTIP_CLASS = "zen-tooltip";
const TOOLTIP_ARROW_CLASS = "zen-tooltip-arrow";
const VISIBLE_CLASS = "is-visible";

const DEFAULT_OPTIONS: Required<TooltipOptions> = {
  position: "top",
  showDelay: 400,
  hideDelay: 0,
  shortcut: "",
};

let tooltipContainer: HTMLElement | null = null;
let tooltipArrow: HTMLElement | null = null;
let activeTooltip: { target: HTMLElement; text: string } | null = null;
let showTimeoutId: number | null = null;
let hideTimeoutId: number | null = null;

/**
 * Creates the shared tooltip container element
 */
function getTooltipContainer(): HTMLElement {
  if (tooltipContainer && document.body.contains(tooltipContainer)) {
    return tooltipContainer;
  }

  tooltipContainer = document.createElement("div");
  tooltipContainer.className = TOOLTIP_CLASS;
  tooltipContainer.setAttribute("role", "tooltip");
  tooltipContainer.setAttribute("aria-hidden", "true");

  tooltipArrow = document.createElement("div");
  tooltipArrow.className = TOOLTIP_ARROW_CLASS;
  tooltipContainer.appendChild(tooltipArrow);

  document.body.appendChild(tooltipContainer);
  return tooltipContainer;
}

/**
 * Positions the tooltip relative to the target element
 */
function positionTooltip(
  target: HTMLElement,
  position: TooltipPosition,
): void {
  const container = getTooltipContainer();
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = container.getBoundingClientRect();

  const gap = 8;
  let top = 0;
  let left = 0;

  // Reset position classes
  container.dataset.position = position;

  switch (position) {
    case "top":
      top = targetRect.top - tooltipRect.height - gap;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case "bottom":
      top = targetRect.bottom + gap;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case "left":
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.left - tooltipRect.width - gap;
      break;
    case "right":
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.right + gap;
      break;
  }

  // Keep tooltip within viewport bounds
  const padding = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Horizontal bounds
  if (left < padding) {
    left = padding;
  } else if (left + tooltipRect.width > viewportWidth - padding) {
    left = viewportWidth - tooltipRect.width - padding;
  }

  // Vertical bounds
  if (top < padding) {
    top = padding;
  } else if (top + tooltipRect.height > viewportHeight - padding) {
    top = viewportHeight - tooltipRect.height - padding;
  }

  container.style.top = `${top + window.scrollY}px`;
  container.style.left = `${left + window.scrollX}px`;
}

/**
 * Shows the tooltip for the target element
 */
function showTooltip(
  target: HTMLElement,
  text: string,
  options: Required<TooltipOptions>,
): void {
  // Clear any pending hide
  if (hideTimeoutId !== null) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }

  // Clear any pending show
  if (showTimeoutId !== null) {
    clearTimeout(showTimeoutId);
    showTimeoutId = null;
  }

  showTimeoutId = window.setTimeout(() => {
    const container = getTooltipContainer();

    // Clear existing content (except arrow)
    while (container.firstChild !== tooltipArrow) {
      container.removeChild(container.firstChild!);
    }

    // Add text span
    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    container.insertBefore(textSpan, tooltipArrow);

    // Add shortcut if provided
    if (options.shortcut) {
      const shortcutSpan = document.createElement("span");
      shortcutSpan.className = "zen-tooltip-shortcut";
      // Parse "g+h" into ["g", "h"]
      const keys = options.shortcut.split("+");
      keys.forEach((key, i) => {
        if (i > 0) shortcutSpan.appendChild(document.createTextNode("+"));
        const kbd = document.createElement("kbd");
        kbd.textContent = key;
        shortcutSpan.appendChild(kbd);
      });
      container.insertBefore(shortcutSpan, tooltipArrow);
    }

    activeTooltip = { target, text };

    // Make visible but transparent for measuring
    container.style.visibility = "hidden";
    container.classList.add(VISIBLE_CLASS);

    // Position and show
    requestAnimationFrame(() => {
      positionTooltip(target, options.position);
      container.style.visibility = "";
      container.setAttribute("aria-hidden", "false");
    });

    showTimeoutId = null;
  }, options.showDelay);
}

/**
 * Hides the tooltip
 */
function hideTooltip(options: Required<TooltipOptions>): void {
  // Clear any pending show
  if (showTimeoutId !== null) {
    clearTimeout(showTimeoutId);
    showTimeoutId = null;
  }

  // Clear any pending hide
  if (hideTimeoutId !== null) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }

  hideTimeoutId = window.setTimeout(() => {
    const container = getTooltipContainer();
    container.classList.remove(VISIBLE_CLASS);
    container.setAttribute("aria-hidden", "true");
    activeTooltip = null;
    hideTimeoutId = null;
  }, options.hideDelay);
}

/**
 * Initialize a tooltip on an element
 */
export function initTooltip(
  element: HTMLElement,
  text: string,
  options: TooltipOptions = {},
): TooltipController {
  const opts: Required<TooltipOptions> = { ...DEFAULT_OPTIONS, ...options };
  let currentText = text;

  // Set up accessibility
  const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 9)}`;
  element.setAttribute("aria-describedby", tooltipId);

  const handleMouseEnter = () => {
    showTooltip(element, currentText, opts);
    const container = getTooltipContainer();
    container.id = tooltipId;
  };

  const handleMouseLeave = () => {
    hideTooltip(opts);
  };

  const handleFocus = () => {
    showTooltip(element, currentText, opts);
    const container = getTooltipContainer();
    container.id = tooltipId;
  };

  const handleBlur = () => {
    hideTooltip(opts);
  };

  // Hide on scroll to prevent orphaned tooltips
  const handleScroll = () => {
    if (activeTooltip?.target === element) {
      hideTooltip({ ...opts, hideDelay: 0 });
    }
  };

  // Hide on Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && activeTooltip?.target === element) {
      hideTooltip({ ...opts, hideDelay: 0 });
    }
  };

  // Add event listeners
  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);
  element.addEventListener("focus", handleFocus);
  element.addEventListener("blur", handleBlur);
  document.addEventListener("scroll", handleScroll, { passive: true });
  element.addEventListener("keydown", handleKeyDown);

  return {
    show: () => showTooltip(element, currentText, opts),
    hide: () => hideTooltip(opts),
    updateText: (newText: string) => {
      currentText = newText;
      if (activeTooltip?.target === element) {
        const container = getTooltipContainer();
        const textSpan = container.firstChild;
        if (textSpan && textSpan.nodeType === Node.ELEMENT_NODE) {
          textSpan.textContent = newText;
        }
      }
    },
    destroy: () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
      document.removeEventListener("scroll", handleScroll);
      element.removeEventListener("keydown", handleKeyDown);
      element.removeAttribute("aria-describedby");

      if (activeTooltip?.target === element) {
        hideTooltip({ ...opts, hideDelay: 0 });
      }
    },
  };
}

/**
 * Convenience function to add tooltips to elements with data-tooltip attribute
 * Call this to auto-initialize all [data-tooltip] elements
 */
export function initTooltipsFromAttributes(
  container: HTMLElement = document.body,
): TooltipController[] {
  const elements = container.querySelectorAll<HTMLElement>("[data-tooltip]");
  const controllers: TooltipController[] = [];

  elements.forEach((element) => {
    const text = element.dataset.tooltip;
    const position = (element.dataset.tooltipPosition as TooltipPosition) || "top";

    if (text) {
      controllers.push(initTooltip(element, text, { position }));
    }
  });

  return controllers;
}
