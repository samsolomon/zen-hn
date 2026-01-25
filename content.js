console.log("HN Restyler Active");

function ensurePhosphorIcons() {
  const existing = document.querySelector("link#phosphor-icons");
  if (existing) {
    return;
  }

  const link = document.createElement("link");
  link.id = "phosphor-icons";
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href =
    "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css";
  document.head.appendChild(link);
}

function restyleComments() {
  const table = document.querySelector("table.comment-tree");
  if (!table) {
    return;
  }

  const container = document.createElement("div");
  container.id = "hn-comment-list";

  const rows = Array.from(table.querySelectorAll("tr"));
  rows.forEach((row) => {
    const cell = row.querySelector("td.default");
    if (!cell) {
      return;
    }

    const user = row.querySelector(".comhead .hnuser")?.textContent?.trim() || "";
    const timestamp = row.querySelector(".comhead .age a")?.textContent?.trim() || "";
    const comhead = row.querySelector(".comhead");
    const textHtml = row.querySelector(".commtext")?.innerHTML || "";

    const indentImg = row.querySelector("td.ind img");
    const indentWidth = Number.parseInt(indentImg?.getAttribute("width") || "0", 10) || 0;
    const indentLevel = Math.round(indentWidth / 40) || 0;

    const item = document.createElement("div");
    item.className = "hn-comment";
    item.classList.add(`level-${indentLevel}`);
    item.style.setProperty("--indent-level", String(indentLevel));

    const meta = document.createElement("div");
    meta.className = "hn-comment-meta";
    if (comhead) {
      meta.appendChild(comhead.cloneNode(true));
    } else {
      meta.textContent = [user, timestamp].filter(Boolean).join(" • ");
    }

    const text = document.createElement("div");
    text.className = "hn-comment-text";
    text.innerHTML = textHtml;

    const actions = document.createElement("div");
    actions.className = "hn-comment-actions";

    const upvoteButton = document.createElement("button");
    upvoteButton.className = "icon-button";
    upvoteButton.type = "button";
    upvoteButton.setAttribute("aria-label", "Upvote");
    upvoteButton.innerHTML = "<i class=\"ph ph-arrow-fat-up\"></i>";

    const downvoteButton = document.createElement("button");
    downvoteButton.className = "icon-button";
    downvoteButton.type = "button";
    downvoteButton.setAttribute("aria-label", "Downvote");
    downvoteButton.innerHTML = "<i class=\"ph ph-arrow-fat-down\"></i>";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = "icon-button";
    bookmarkButton.type = "button";
    bookmarkButton.setAttribute("aria-label", "Bookmark");
    bookmarkButton.innerHTML = "<i class=\"ph ph-bookmark-simple\"></i>";

    const shareButton = document.createElement("button");
    shareButton.className = "icon-button is-flipped";
    shareButton.type = "button";
    shareButton.setAttribute("aria-label", "Share");
    shareButton.innerHTML = "<i class=\"ph ph-share-fat\"></i>";

    actions.appendChild(upvoteButton);
    actions.appendChild(downvoteButton);
    actions.appendChild(bookmarkButton);
    actions.appendChild(shareButton);

    item.appendChild(meta);
    item.appendChild(text);
    item.appendChild(actions);
    container.appendChild(item);
  });

  table.insertAdjacentElement("afterend", container);
  table.style.display = "none";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    ensurePhosphorIcons();
    restyleComments();
  });
} else {
  ensurePhosphorIcons();
  restyleComments();
}
