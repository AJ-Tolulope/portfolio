import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { initialManagedContent, initialPosts, initialProjects, siteSettings } from "../src/content/seed-data";
import { postSchema } from "../src/types/content";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
else if (existsSync(".env")) process.loadEnvFile(".env");

const credentials = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
if (!credentials.projectId || !credentials.clientEmail || !credentials.privateKey) {
  throw new Error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY before seeding.");
}

const app = getApps()[0] ?? initializeApp({ credential: cert(credentials), projectId: credentials.projectId });
const db = getFirestore(app);

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)));
}

function htmlToMarkdown(source: string) {
  const blocks = source.match(/<p\b[^>]*>[\s\S]*?<\/p>|<(?:ul|ol)\b[^>]*>[\s\S]*?<\/(?:ul|ol)>|<h[3-6]\b[^>]*>[\s\S]*?<\/h[3-6]>/gi) ?? [];
  return blocks.map((block) => {
    const heading = block.match(/^<h([3-6])\b[^>]*>([\s\S]*?)<\/h[3-6]>$/i);
    if (heading) return `${"#".repeat(Number(heading[1]))} ${plainText(heading[2])}`;
    if (/^<(?:ul|ol)\b/i.test(block)) {
      return block.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_match, item: string) => `- ${plainText(item)}\n`).trim();
    }
    return plainText(block.replace(/^<p\b[^>]*>|<\/p>$/gi, ""));
  }).filter(Boolean).join("\n\n");
}

function plainText(value: string) {
  return decodeHtml(value.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, ""))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function getLegacyArticle(post: (typeof initialPosts)[number]) {
  const file = join(process.cwd(), "legacy", "blogs", `${post.slug}.html`);
  if (!existsSync(file)) return post;
  const html = readFileSync(file, "utf8");
  const heading = html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1];
  const headingText = heading ? plainText(heading) : post.title;
  const start = html.search(/<\/h2>/i);
  const end = html.search(/<div class="recent-post">/i);
  if (start < 0 || end <= start) return { ...post, title: headingText };
  const body = html.slice(start + 5, end).replace(/<div class="author-date">[\s\S]*?<\/div>/i, "");
  const content = htmlToMarkdown(body);
  if (!content) return { ...post, title: headingText };
  return postSchema.parse({ ...post, title: post.id === "scss-and-sass" ? post.title : headingText, content });
}

async function writeDocuments(collection: string, documents: { id: string; [key: string]: unknown }[]) {
  for (const document of documents) {
    const { id, ...data } = document;
    await db.collection(collection).doc(id).set(data, { merge: true });
  }
}

const posts = initialPosts.map(getLegacyArticle);
await writeDocuments("posts", posts);
await writeDocuments("projects", initialProjects);
for (const [collection, records] of Object.entries(initialManagedContent)) {
  await writeDocuments(collection, records);
}
await db.collection("siteSettings").doc("main").set(siteSettings, { merge: true });

process.stdout.write(
  `Seeded ${posts.length} posts, ${initialProjects.length} projects, ${Object.values(initialManagedContent).flat().length} managed items, and site settings into ${credentials.projectId}.\n`,
);
