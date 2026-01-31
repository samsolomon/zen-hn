import { getIndentLevelFromRow, getCommentRows } from "./logic";
import { buildCommentItem } from "./buildCommentItem";
import { getOrCreateZenHnMain } from "./getOrCreateZenHnMain";

const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";

export interface CommentContext {
  root: Element;
  mode: "table" | "rows";
  rows?: HTMLTableRowElement[];
  insertAfter?: Element;
}

export function restyleComments(context: CommentContext | null): void {
  if (!context?.root) {
    return;
  }

  if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return;
  }

  const existingLists = document.querySelectorAll("#hn-comment-list");
  existingLists.forEach((list) => {
    const wrapperRow = list.closest("tr[data-zen-hn-comment-row='true']");
    if (wrapperRow) {
      wrapperRow.remove();
      return;
    }
    list.remove();
  });

  const container = document.createElement("div");
  container.id = "hn-comment-list";

  const rows = context.rows || getCommentRows(context.root);
  if (!rows.length) {
    if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "loading") {
      delete document.documentElement.dataset[ZEN_HN_RESTYLE_KEY];
    }
    return;
  }

  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  rows.forEach((row, index) => {
    const indentLevel = getIndentLevelFromRow(row);
    const nextIndentLevel = getIndentLevelFromRow(rows[index + 1]);
    const hasChildren = nextIndentLevel > indentLevel;
    const item = buildCommentItem(row, { indentLevel, hasChildren });
    if (!item) {
      return;
    }
    container.appendChild(item);
  });

  const moreLink = context.root.querySelector("a.morelink");
  if (moreLink) {
    const moreContainer = document.createElement("div");
    moreContainer.className = "hn-comment-more";
    const moreAnchor = moreLink.cloneNode(true);
    moreContainer.appendChild(moreAnchor);
    container.appendChild(moreContainer);
  }

  if (context.mode === "rows") {
    const insertAfter = context.insertAfter?.closest("tr") || rows[0];
    if (!insertAfter) {
      return;
    }
    const containerRow = document.createElement("tr");
    containerRow.dataset.zenHnCommentRow = "true";
    const containerCell = document.createElement("td");
    const cellCount = insertAfter.children.length || 1;
    if (cellCount > 1) {
      containerCell.colSpan = cellCount;
    }
    containerCell.appendChild(container);
    containerRow.appendChild(containerCell);
    insertAfter.insertAdjacentElement("afterend", containerRow);

    const rowsToHide = new Set<Element>(rows);
    rows.forEach((row) => {
      const spacer = row.nextElementSibling;
      if (spacer?.classList.contains("spacer")) {
        rowsToHide.add(spacer);
      }
    });
    if (moreLink) {
      const moreRow = moreLink.closest("tr");
      if (moreRow) {
        rowsToHide.add(moreRow);
        const moreSpacer = moreRow.previousElementSibling;
        if (moreSpacer?.classList.contains("morespace")) {
          rowsToHide.add(moreSpacer);
        }
      }
    }
    rowsToHide.forEach((row) => {
      (row as HTMLElement).style.display = "none";
    });
    return;
  }

  getOrCreateZenHnMain().appendChild(container);
  (context.root as HTMLElement).style.display = "none";
  // Also hide the center wrapper if present
  const centerWrapper = (context.root as HTMLElement).closest("center") as HTMLElement | null;
  if (centerWrapper) {
    centerWrapper.style.display = "none";
  }
}

export function findCommentContext(): CommentContext | null {
  const commentTree = document.querySelector("table.comment-tree");
  if (commentTree) {
    return { root: commentTree, mode: "table" };
  }

  const itemTables = Array.from(document.querySelectorAll("table.itemlist"));
  const itemTable = itemTables.find((table) => getCommentRows(table).length > 0);
  if (itemTable) {
    return { root: itemTable, mode: "table" };
  }

  const bigboxTable = document.querySelector("tr#bigbox table");
  if (bigboxTable && getCommentRows(bigboxTable).length > 0) {
    return { root: bigboxTable, mode: "table" };
  }

  // For /threads pages, use table mode to move content to zen-hn-main
  const pathname = window.location.pathname;
  if (pathname === "/threads") {
    const hnMain = document.querySelector("table#hnmain");
    if (hnMain) {
      const rows = getCommentRows(hnMain);
      if (rows.length > 0) {
        return { root: hnMain, mode: "table", rows };
      }
    }
  }

  const hnMain = document.querySelector("table#hnmain");
  if (!hnMain) {
    return null;
  }
  const rows = getCommentRows(hnMain);
  if (!rows.length) {
    return null;
  }
  const insertAfter = document.querySelector("tr#bigbox") || rows[0];
  return {
    root: hnMain,
    mode: "rows",
    rows,
    insertAfter,
  };
}

export function runRestyleWhenReady(): void {
  let attempts = 0;
  const maxAttempts = 20;
  const attempt = (): void => {
    if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
      return;
    }
    const context = findCommentContext();
    if (!context) {
      attempts += 1;
      if (attempts >= maxAttempts) {
        if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "loading") {
          delete document.documentElement.dataset[ZEN_HN_RESTYLE_KEY];
        }
        return;
      }
      window.requestAnimationFrame(attempt);
      return;
    }
    restyleComments(context);
  };
  attempt();
}

// Expose on globalThis for content.js to access
(globalThis as Record<string, unknown>).ZenHnRestyleComments = {
  restyleComments,
  findCommentContext,
  runRestyleWhenReady,
};
