import type { Post } from "@/types/content";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const readingTime = (content: string) =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 220));

export const postReadingTime = (post: Pick<Post, "content">) => readingTime(post.content);

export const publicImageSource = (source: string) =>
  source.startsWith("/") ? source : source;
