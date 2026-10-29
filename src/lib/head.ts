import { useEffect } from "react";

export type MetaTag =
  { title: string } | { name: string; content: string } | { property: string; content: string };

// Client-side replacement for per-route `head()` meta: applies the tags while the
// page is mounted and restores the previous values (from index.html) on unmount.
export function usePageMeta(meta: MetaTag[]) {
  // Re-apply when the content changes (e.g. the UI language switches).
  const key = JSON.stringify(meta);
  useEffect(() => {
    const restore: Array<() => void> = [];
    for (const tag of meta) {
      if ("title" in tag) {
        const previous = document.title;
        document.title = tag.title;
        restore.push(() => (document.title = previous));
        continue;
      }
      const [attr, key] = "name" in tag ? ["name", tag.name] : ["property", tag.property];
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (el) {
        const previous = el.content;
        const existing = el;
        restore.push(() => (existing.content = previous));
      } else {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        const created = el;
        restore.push(() => created.remove());
      }
      el.content = tag.content;
    }
    return () => restore.reverse().forEach((fn) => fn());
    // `key` captures the meta content; the array identity changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
