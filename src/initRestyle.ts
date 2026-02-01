import { loadActionStore } from "./actionStore";
import { buildSidebarNavigation } from "./sidebar";
import { isUserProfilePage } from "./logic";
import { restyleSubmissions } from "./restyleSubmissions";
import { restyleSubmitPage, restyleUserPage, restyleChangePwPage, restyleUserListPage, restyleAboutPage, restyleNoprocrastPage, cacheLoggedInUsername } from "./pages";
import { restyleFatItem } from "./restyleFatItem";
import { runRestyleWhenReady } from "./restyleComments";

export async function initRestyle(): Promise<void> {
  await loadActionStore();
  buildSidebarNavigation();
  cacheLoggedInUsername();
  if (isUserProfilePage()) {
    document.documentElement.dataset.zenHnUserPage = "true";
  }
  restyleSubmissions();
  restyleSubmitPage();
  restyleUserPage();
  restyleUserListPage();
  restyleChangePwPage();
  restyleAboutPage();
  restyleNoprocrastPage();
  restyleFatItem();
  runRestyleWhenReady();

  // Hide original HN content only if we created restyled content
  const zenHnMain = document.getElementById("zen-hn-main");
  if (zenHnMain && zenHnMain.children.length > 0) {
    const hnmain = document.getElementById("hnmain");
    const centerWrapper = hnmain?.closest("center") as HTMLElement | null;
    if (centerWrapper) {
      centerWrapper.style.display = "none";
    } else if (hnmain) {
      hnmain.style.display = "none";
    }
  }
}

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnInitRestyle = {
  initRestyle,
};
