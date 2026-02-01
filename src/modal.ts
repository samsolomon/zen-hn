/**
 * Generic Modal Component for Zen HN
 *
 * A reusable modal component that handles common modal behaviors:
 * - Backdrop and content structure
 * - Escape key to close
 * - Backdrop click to close
 * - Focus trap for accessibility
 * - Focus restoration on close
 * - ARIA attributes
 */

export interface ModalOptions {
  /** Unique ID for the modal element */
  id: string;
  /** Additional class name for content styling */
  className?: string;
  /** ID for aria-labelledby (title element) */
  titleId?: string;
  /** ID for aria-describedby (description element) */
  descriptionId?: string;
  /** Close when clicking backdrop (default: true) */
  closeOnBackdrop?: boolean;
  /** Close when pressing Escape key (default: true) */
  closeOnEscape?: boolean;
  /** Enable focus trap within modal (default: false) */
  focusTrap?: boolean;
  /** Restore focus to trigger element on close (default: true) */
  restoreFocus?: boolean;
  /** Callback when modal closes */
  onClose?: () => void;
  /** Role attribute for the modal (default: "dialog") */
  role?: "dialog" | "alertdialog";
}

export interface ModalResult {
  /** The modal container element */
  modal: HTMLElement;
  /** The content div (for adding children) */
  content: HTMLElement;
  /** Function to close the modal */
  close: () => void;
}

// Store trigger elements for focus restoration
const modalTriggers = new Map<string, HTMLElement | null>();

// Store escape key handlers for cleanup
const escapeHandlers = new Map<string, (e: KeyboardEvent) => void>();

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * Create a focus trap handler for modal dialogs
 */
function createFocusTrap(container: HTMLElement): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableElements(container);
    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
}

/**
 * Create a modal with the specified options
 */
export function createModal(options: ModalOptions): ModalResult {
  const {
    id,
    className,
    titleId,
    descriptionId,
    closeOnBackdrop = true,
    closeOnEscape = true,
    focusTrap = false,
    restoreFocus = true,
    onClose,
    role = "dialog",
  } = options;

  // Store the trigger element for focus restoration
  if (restoreFocus) {
    modalTriggers.set(id, document.activeElement as HTMLElement | null);
  }

  // Create modal container
  const modal = document.createElement("div");
  modal.id = id;
  modal.className = `zen-hn-modal${className ? ` ${className}` : ""}`;
  modal.setAttribute("role", role);
  modal.setAttribute("aria-modal", "true");

  if (titleId) {
    modal.setAttribute("aria-labelledby", titleId);
  }
  if (descriptionId) {
    modal.setAttribute("aria-describedby", descriptionId);
  }

  // Create backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "zen-hn-modal-backdrop";

  // Create content container
  const content = document.createElement("div");
  content.className = "zen-hn-modal-content";

  // Close function
  const close = (): void => {
    const existingModal = document.getElementById(id);
    if (existingModal) {
      existingModal.remove();
    }

    // Clean up escape handler
    const escapeHandler = escapeHandlers.get(id);
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandlers.delete(id);
    }

    // Restore focus
    if (restoreFocus) {
      const trigger = modalTriggers.get(id);
      if (trigger && document.body.contains(trigger)) {
        trigger.focus();
      }
      modalTriggers.delete(id);
    }

    // Call onClose callback
    onClose?.();
  };

  // Handle backdrop click
  if (closeOnBackdrop) {
    backdrop.addEventListener("click", close);
  }

  // Handle escape key
  if (closeOnEscape) {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        close();
      }
    };
    escapeHandlers.set(id, handleEscape);
    document.addEventListener("keydown", handleEscape);
  }

  // Set up focus trap
  if (focusTrap) {
    const trapHandler = createFocusTrap(modal);
    modal.addEventListener("keydown", trapHandler);
  }

  // Assemble modal
  modal.appendChild(backdrop);
  modal.appendChild(content);

  // Append to body
  if (document.body) {
    document.body.appendChild(modal);
  }

  return { modal, content, close };
}

/**
 * Close a modal by its ID
 */
export function closeModal(id: string): void {
  const modal = document.getElementById(id);
  if (modal) {
    modal.remove();
  }

  // Clean up escape handler
  const escapeHandler = escapeHandlers.get(id);
  if (escapeHandler) {
    document.removeEventListener("keydown", escapeHandler);
    escapeHandlers.delete(id);
  }

  // Restore focus
  const trigger = modalTriggers.get(id);
  if (trigger && document.body.contains(trigger)) {
    trigger.focus();
  }
  modalTriggers.delete(id);
}

/**
 * Check if a modal is currently open
 */
export function isModalOpen(id: string): boolean {
  return document.getElementById(id) !== null;
}
