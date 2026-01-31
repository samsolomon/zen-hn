export type ReplyFormMethod = "GET" | "POST";

export interface ResolvedReplyForm {
  actionUrl: string;
  method: ReplyFormMethod;
  fields: Record<string, string>;
  textName: string;
}

export interface SubmitResult {
  ok: boolean;
  status?: number;
}

export async function resolveReplyForm(replyHref: string): Promise<ResolvedReplyForm | null> {
  if (!replyHref) {
    return null;
  }
  const response = await fetch(replyHref, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const form = doc.querySelector("form");
  if (!form) {
    return null;
  }
  const action = form.getAttribute("action") || "";
  const method = (form.getAttribute("method") || "post").toUpperCase() as ReplyFormMethod;
  const inputs = Array.from(form.querySelectorAll("input[name]"));
  const fields: Record<string, string> = {};
  inputs.forEach((input) => {
    const htmlInput = input as HTMLInputElement;
    fields[htmlInput.name] = htmlInput.value || "";
  });
  const textName = form.querySelector("textarea[name]")?.getAttribute("name") || "text";
  const actionUrl = new URL(action || response.url, response.url).toString();
  return {
    actionUrl,
    method,
    fields,
    textName,
  };
}

export function resolveReplyFormFromElement(form: HTMLFormElement | null): ResolvedReplyForm | null {
  if (!form) {
    return null;
  }
  const action = form.getAttribute("action") || "";
  const method = (form.getAttribute("method") || "post").toUpperCase() as ReplyFormMethod;
  const inputs = Array.from(form.querySelectorAll("input[name]"));
  const fields: Record<string, string> = {};
  inputs.forEach((input) => {
    const htmlInput = input as HTMLInputElement;
    fields[htmlInput.name] = htmlInput.value || "";
  });
  const textName = form.querySelector("textarea[name]")?.getAttribute("name") || "text";
  const actionUrl = new URL(action || window.location.href, window.location.href).toString();
  return {
    actionUrl,
    method,
    fields,
    textName,
  };
}

export async function submitReplyWithResolved(
  resolved: ResolvedReplyForm | null,
  text: string,
): Promise<SubmitResult> {
  if (!resolved) {
    return { ok: false };
  }
  const payload = new URLSearchParams({
    ...resolved.fields,
    [resolved.textName]: text,
  });
  let response: Response | null = null;
  if (resolved.method === "GET") {
    const url = new URL(resolved.actionUrl);
    payload.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    response = await fetch(url.toString(), {
      credentials: "same-origin",
      cache: "no-store",
    });
  } else {
    response = await fetch(resolved.actionUrl, {
      method: resolved.method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      credentials: "same-origin",
      cache: "no-store",
    });
  }
  return {
    ok: response?.ok ?? false,
    status: response?.status,
  };
}

export async function submitReply(replyHref: string, text: string): Promise<SubmitResult> {
  try {
    const resolved = await resolveReplyForm(replyHref);
    if (!resolved) {
      return { ok: false };
    }
    return await submitReplyWithResolved(resolved, text);
  } catch {
    return { ok: false };
  }
}
