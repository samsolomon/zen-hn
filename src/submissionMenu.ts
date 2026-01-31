/**
 * Submission menu utilities for Zen HN
 */

export const SUBMISSION_MENU_CLASS = "hn-submission-menu";
export const SUBMISSION_MENU_OPEN_CLASS = "is-open";

let submissionMenuHandlersRegistered = false;

export function setSubmissionMenuState(menu: Element | null, isOpen: boolean): void {
  if (!menu) {
    return;
  }
  menu.classList.toggle(SUBMISSION_MENU_OPEN_CLASS, isOpen);
  const button = menu.querySelector(".hn-menu-button");
  if (button) {
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

export function closeAllSubmissionMenus(exceptMenu?: Element): void {
  const openMenus = document.querySelectorAll(
    `.${SUBMISSION_MENU_CLASS}.${SUBMISSION_MENU_OPEN_CLASS}`,
  );
  openMenus.forEach((menu) => {
    if (menu === exceptMenu) {
      return;
    }
    setSubmissionMenuState(menu, false);
  });
}

export function registerSubmissionMenuListeners(): void {
  if (submissionMenuHandlersRegistered) {
    return;
  }
  submissionMenuHandlersRegistered = true;
  document.addEventListener("click", (event: MouseEvent) => {
    const openMenus = document.querySelectorAll(
      `.${SUBMISSION_MENU_CLASS}.${SUBMISSION_MENU_OPEN_CLASS}`,
    );
    if (!openMenus.length) {
      return;
    }
    openMenus.forEach((menu) => {
      if (menu.contains(event.target as Node)) {
        return;
      }
      setSubmissionMenuState(menu, false);
    });
  });
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }
    closeAllSubmissionMenus();
  });
}
