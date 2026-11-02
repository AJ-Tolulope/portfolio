import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/services/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await getPublishedPosts();
  const staticRoutes = ["", "/blog", "/courses", "/courses/html", "/courses/css", "/courses/javascript"];
  return [
    ...staticRoutes.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    })),
  ];
}
