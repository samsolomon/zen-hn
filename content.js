console.log("HN Restyler Active");

const PHOSPHOR_SVGS = {
  "arrow-fat-up":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M229.66,114.34l-96-96a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,32,128H72v80a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16V128h40a8,8,0,0,0,5.66-13.66ZM176,112a8,8,0,0,0-8,8v88H88V120a8,8,0,0,0-8-8H51.31L128,35.31,204.69,112Z\"/></svg>",
  "arrow-fat-down":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M231.39,132.94A8,8,0,0,0,224,128H184V48a16,16,0,0,0-16-16H88A16,16,0,0,0,72,48v80H32a8,8,0,0,0-5.66,13.66l96,96a8,8,0,0,0,11.32,0l96-96A8,8,0,0,0,231.39,132.94ZM128,220.69,51.31,144H80a8,8,0,0,0,8-8V48h80v88a8,8,0,0,0,8,8h28.69Z\"/></svg>",
  "bookmark-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z\"/></svg>",
  "share-fat":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z\"/></svg>",
};

function registerIcon(name, svg) {
  if (!name || !svg) {
    return;
  }
  PHOSPHOR_SVGS[name] = svg;
}

function renderIcon(name) {
  return PHOSPHOR_SVGS[name] || "";
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
    upvoteButton.innerHTML = renderIcon("arrow-fat-up");

    const downvoteButton = document.createElement("button");
    downvoteButton.className = "icon-button";
    downvoteButton.type = "button";
    downvoteButton.setAttribute("aria-label", "Downvote");
    downvoteButton.innerHTML = renderIcon("arrow-fat-down");

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = "icon-button";
    bookmarkButton.type = "button";
    bookmarkButton.setAttribute("aria-label", "Bookmark");
    bookmarkButton.innerHTML = renderIcon("bookmark-simple");

    const shareButton = document.createElement("button");
    shareButton.className = "icon-button is-flipped";
    shareButton.type = "button";
    shareButton.setAttribute("aria-label", "Share");
    shareButton.innerHTML = renderIcon("share-fat");

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
    restyleComments();
  });
} else {
  restyleComments();
}
