function insertSkipLink(): void {
  const skipLink = document.createElement("a");
  skipLink.href = "#zen-hn-main";
  skipLink.className = "zen-hn-skip-link";
  skipLink.textContent = "Skip to content";

  skipLink.addEventListener("click", (e) => {
    e.preventDefault();
    const main = document.getElementById("zen-hn-main");
    if (main) {
      main.tabIndex = -1;
      main.focus();
      main.scrollIntoView();
    }
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

export function createSkipLink(): void {
  if (document.body) {
    insertSkipLink();
  } else {
    document.addEventListener("DOMContentLoaded", insertSkipLink);
  }
}
