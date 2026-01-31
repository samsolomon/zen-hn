export interface FavoriteLinkResult {
  href: string;
  isFavorited: boolean;
}

export async function resolveFavoriteLink(commentId: string): Promise<FavoriteLinkResult | null> {
  if (!commentId) {
    return null;
  }
  const response = await fetch(`item?id=${commentId}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const comheads = Array.from(doc.querySelectorAll(".comhead"));
  const targetComhead = comheads.find((head) =>
    head.querySelector(`a[href^='item?id=${commentId}']`),
  );
  const comhead = targetComhead || comheads[0];
  if (!comhead) {
    return null;
  }
  const linkById = comhead.querySelector("a[href^='fave?id='], a[id^='fav_'], a[id^='fave_']");
  const linkByText = Array.from(comhead.querySelectorAll("a")).find((link) => {
    const text = link.textContent?.trim().toLowerCase();
    return text === "favorite" || text === "unfavorite";
  });
  const link = linkById || linkByText;
  if (!link) {
    return null;
  }
  const text = link.textContent?.trim().toLowerCase() || "";
  const href = link.getAttribute("href") || "";
  return {
    href,
    isFavorited: text === "unfavorite" || href.includes("un=t"),
  };
}

export async function resolveStoryFavoriteLink(itemId: string): Promise<FavoriteLinkResult | null> {
  if (!itemId) {
    return null;
  }
  const response = await fetch(`item?id=${itemId}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const fatitem = doc.querySelector("table.fatitem");
  const subtext = fatitem?.querySelector(".subtext");
  if (!subtext) {
    return null;
  }
  const linkById = subtext.querySelector("a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']");
  const linkByText = Array.from(subtext.querySelectorAll("a")).find((link) => {
    const text = link.textContent?.trim().toLowerCase();
    return text === "favorite" || text === "unfavorite";
  });
  const link = linkById || linkByText;
  if (!link) {
    return null;
  }
  const text = link.textContent?.trim().toLowerCase() || "";
  const href = link.getAttribute("href") || "";
  return {
    href,
    isFavorited: text === "unfavorite" || href.includes("un=t"),
  };
}
