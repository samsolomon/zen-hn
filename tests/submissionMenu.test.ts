import { describe, test } from "node:test";
import {
  SUBMISSION_MENU_CLASS,
  SUBMISSION_MENU_OPEN_CLASS,
  setSubmissionMenuState,
  closeAllSubmissionMenus,
  registerSubmissionMenuListeners,
} from "../src/submissionMenu";

describe("submissionMenu", () => {
  describe("constants", () => {
    test("SUBMISSION_MENU_CLASS is hn-submission-menu", () => {
      if (SUBMISSION_MENU_CLASS !== "hn-submission-menu") {
        throw new Error(`Expected "hn-submission-menu", got "${SUBMISSION_MENU_CLASS}"`);
      }
    });

    test("SUBMISSION_MENU_OPEN_CLASS is is-open", () => {
      if (SUBMISSION_MENU_OPEN_CLASS !== "is-open") {
        throw new Error(`Expected "is-open", got "${SUBMISSION_MENU_OPEN_CLASS}"`);
      }
    });
  });

  describe("setSubmissionMenuState", () => {
    test("does nothing when menu is null", () => {
      setSubmissionMenuState(null, true);
    });

    test("does nothing when menu is undefined", () => {
      setSubmissionMenuState(undefined as unknown as Element, true);
    });

    test("toggles is-open class on menu", () => {
      let toggledClass: string | undefined;
      let toggledState: boolean | undefined;

      const menu = {
        classList: {
          toggle: (cls: string, state: boolean) => {
            toggledClass = cls;
            toggledState = state;
          },
        },
        querySelector: () => null,
      } as unknown as Element;

      setSubmissionMenuState(menu, true);

      if (toggledClass !== "is-open") {
        throw new Error(`Expected class "is-open", got "${toggledClass}"`);
      }
      if (toggledState !== true) {
        throw new Error(`Expected state true, got ${toggledState}`);
      }
    });

    test("toggles is-open to false when isOpen is false", () => {
      let toggledClass: string | undefined;
      let toggledState: boolean | undefined;

      const menu = {
        classList: {
          toggle: (cls: string, state: boolean) => {
            toggledClass = cls;
            toggledState = state;
          },
        },
        querySelector: () => null,
      } as unknown as Element;

      setSubmissionMenuState(menu, false);

      if (toggledClass !== "is-open") {
        throw new Error(`Expected class "is-open", got "${toggledClass}"`);
      }
      if (toggledState !== false) {
        throw new Error(`Expected state false, got ${toggledState}`);
      }
    });

    test("sets aria-expanded on menu button", () => {
      const button = { setAttribute: () => {} };
      const menu = {
        classList: { toggle: () => {} },
        querySelector: () => button,
      } as unknown as Element;

      let attrKey: string | undefined;
      let attrVal: string | undefined;

      button.setAttribute = (key: string, val: string) => {
        attrKey = key;
        attrVal = val;
      };

      setSubmissionMenuState(menu, true);

      if (attrKey !== "aria-expanded") {
        throw new Error(`Expected "aria-expanded", got "${attrKey}"`);
      }
      if (attrVal !== "true") {
        throw new Error(`Expected "true", got "${attrVal}"`);
      }
    });

    test("sets aria-expanded to false when isOpen is false", () => {
      const button = { setAttribute: () => {} };
      const menu = {
        classList: { toggle: () => {} },
        querySelector: () => button,
      } as unknown as Element;

      let attrVal: string | undefined;
      button.setAttribute = (_key: string, val: string) => {
        attrVal = val;
      };

      setSubmissionMenuState(menu, false);

      if (attrVal !== "false") {
        throw new Error(`Expected "false", got "${attrVal}"`);
      }
    });
  });

  describe("closeAllSubmissionMenus", () => {
    test("closes all open menus", () => {
      const menus: Array<{
        classList: { toggle: (cls: string, state: boolean) => void };
        querySelector: () => null;
      }> = [];

      for (let i = 0; i < 3; i++) {
        menus.push({
          classList: { toggle: () => {} },
          querySelector: () => null,
        });
      }

      let toggleCount = 0;

      globalThis.document = {
        querySelectorAll: () => menus,
      } as unknown as Document;

      menus.forEach((menu) => {
        menu.classList.toggle = () => {
          toggleCount++;
        };
      });

      closeAllSubmissionMenus();

      if (toggleCount !== 3) {
        throw new Error(`Expected 3 toggle calls, got ${toggleCount}`);
      }
    });

    test("skips exceptMenu when provided", () => {
      const menus: Array<{
        classList: { toggle: () => void };
        querySelector: () => null;
      }> = [];

      for (let i = 0; i < 3; i++) {
        menus.push({
          classList: { toggle: () => {} },
          querySelector: () => null,
        });
      }

      let toggleCount = 0;

      globalThis.document = {
        querySelectorAll: () => menus,
      } as unknown as Document;

      menus.forEach((menu) => {
        menu.classList.toggle = () => {
          toggleCount++;
        };
      });

      closeAllSubmissionMenus(menus[1]);

      if (toggleCount !== 2) {
        throw new Error(`Expected 2 toggle calls, got ${toggleCount}`);
      }
    });

    test("handles empty result set", () => {
      globalThis.document = {
        querySelectorAll: () => [],
      } as unknown as Document;

      closeAllSubmissionMenus();
    });
  });

  describe("registerSubmissionMenuListeners", () => {
    test("registers click and keydown listeners on first call", () => {
      const events: string[] = [];

      globalThis.document = {
        addEventListener: (event: string, _handler: EventListener) => {
          events.push(event);
        },
        querySelectorAll: () => [],
      } as unknown as Document;

      registerSubmissionMenuListeners();

      if (events.length !== 2) {
        throw new Error(`Expected 2 events, got ${events.length}`);
      }
      if (events[0] !== "click") {
        throw new Error(`Expected "click", got "${events[0]}"`);
      }
      if (events[1] !== "keydown") {
        throw new Error(`Expected "keydown", got "${events[1]}"`);
      }
    });

    test.skip("does not register listeners on subsequent calls", () => {
      let registrationCount = 0;

      globalThis.document = {
        addEventListener: (_event: string, _handler: EventListener) => {
          registrationCount++;
        },
        querySelectorAll: () => [],
      } as unknown as Document;

      registerSubmissionMenuListeners();
      registerSubmissionMenuListeners();
      registerSubmissionMenuListeners();

      if (registrationCount !== 2) {
        throw new Error(`Expected 2 event registrations (not more on subsequent calls), got ${registrationCount}`);
      }
    });
  });
});
