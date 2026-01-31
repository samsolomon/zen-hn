function getZenHnLogic(): { getIndentLevelFromItem: (item: Element) => number } {
  return (globalThis as unknown as { ZenHnLogic: { getIndentLevelFromItem: (item: Element) => number } }).ZenHnLogic;
}

export function setCollapseButtonState(button: HTMLElement | null, isCollapsed: boolean, hasChildren: boolean): void {
  if (!button) {
    return;
  }
  const targetLabel = hasChildren ? "thread" : "comment";
  button.classList.toggle("is-collapsed", isCollapsed);
  button.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  button.setAttribute(
    "aria-label",
    isCollapsed ? `Expand ${targetLabel}` : `Collapse ${targetLabel}`,
  );
}

export function hideDescendantComments(item: HTMLElement): void {
  const logic = getZenHnLogic();
  const baseLevel = logic.getIndentLevelFromItem(item);
  let sibling = item.nextElementSibling;
  while (sibling && sibling.classList.contains("hn-comment")) {
    const level = logic.getIndentLevelFromItem(sibling);
    if (level <= baseLevel) {
      break;
    }
    (sibling as HTMLElement).hidden = true;
    sibling = sibling.nextElementSibling;
  }
}

export function restoreDescendantVisibility(item: HTMLElement): void {
  const logic = getZenHnLogic();
  const baseLevel = logic.getIndentLevelFromItem(item);
  let sibling = item.nextElementSibling;
  const collapsedStack: number[] = [];
  while (sibling && sibling.classList.contains("hn-comment")) {
    const level = logic.getIndentLevelFromItem(sibling);
    if (level <= baseLevel) {
      break;
    }
    while (collapsedStack.length && level <= collapsedStack[collapsedStack.length - 1]) {
      collapsedStack.pop();
    }
    const isHiddenByAncestor = collapsedStack.length > 0;
    (sibling as HTMLElement).hidden = isHiddenByAncestor;
    const siblingElement = sibling as HTMLElement;
    const isCollapsed = siblingElement.dataset.collapsed === "true";
    if (!isHiddenByAncestor && isCollapsed) {
      collapsedStack.push(level);
    }
    sibling = sibling.nextElementSibling;
  }
}

export function toggleCommentCollapse(item: HTMLElement): void {
  const isCollapsed = item.dataset.collapsed === "true";
  const nextCollapsed = !isCollapsed;
  item.dataset.collapsed = nextCollapsed ? "true" : "false";
  const hasChildren = item.dataset.hasChildren === "true";
  const collapseButton = item.querySelector(".hn-collapse-button");
  setCollapseButtonState(collapseButton as HTMLElement | null, nextCollapsed, hasChildren);
  if (nextCollapsed) {
    hideDescendantComments(item);
  } else {
    restoreDescendantVisibility(item);
  }
}
