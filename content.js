console.log("HN Restyler Active");

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
    item.style.setProperty("--indent-width", `${indentWidth}px`);
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

    item.appendChild(meta);
    item.appendChild(text);
    container.appendChild(item);
  });

  table.insertAdjacentElement("afterend", container);
  table.style.display = "none";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", restyleComments);
} else {
  restyleComments();
}
