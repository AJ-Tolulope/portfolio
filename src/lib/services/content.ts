import "server-only";
import { initialManagedContent, initialPosts, initialProjects, siteSettings } from "@/content/seed-data";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import {
  managedItemSchema,
  postSchema,
  projectSchema,
  siteSettingsSchema,
  type ContentCollection,
  type ManagedItem,
  type Post,
  type Project,
  type SiteSettings,
} from "@/types/content";

type ManagedCollection = "services" | "skills" | "testimonials" | "socialLinks" | "courses";

export async function getPublishedPosts(): Promise<Post[]> {
  if (!isFirebaseAdminConfigured()) return initialPosts.filter((post) => post.status === "published");
  const snapshot = await getAdminDb()
    .collection("posts")
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...postSchema.parse(doc.data()) }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isFirebaseAdminConfigured()) {
    return initialPosts.find((post) => post.slug === slug && post.status === "published") ?? null;
  }
  const snapshot = await getAdminDb()
    .collection("posts")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  return doc ? { id: doc.id, ...postSchema.parse(doc.data()) } : null;
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isFirebaseAdminConfigured()) return initialProjects.filter((project) => project.status === "published");
  const snapshot = await getAdminDb()
    .collection("projects")
    .where("status", "==", "published")
    .orderBy("year", "desc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...projectSchema.parse(doc.data()) }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseAdminConfigured()) return siteSettings;
  const snapshot = await getAdminDb().collection("siteSettings").doc("main").get();
  return snapshot.exists
    ? siteSettingsSchema.parse(snapshot.data())
    : siteSettings;
}

export async function getPublishedItems(collection: ManagedCollection): Promise<ManagedItem[]> {
  if (!isFirebaseAdminConfigured()) return initialManagedContent[collection];
  const snapshot = await getAdminDb()
    .collection(collection)
    .where("status", "==", "published")
    .orderBy("order", "asc")
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...managedItemSchema.parse(doc.data()) }));
}

export async function getContentCounts() {
  if (!isFirebaseAdminConfigured()) {
    return {
      posts: initialPosts.length,
      projects: initialProjects.length,
      contacts: 0,
    };
  }
  const db = getAdminDb();
  const [posts, projects, contacts] = await Promise.all([
    db.collection("posts").count().get(),
    db.collection("projects").count().get(),
    db.collection("contactSubmissions").count().get(),
  ]);
  return {
    posts: posts.data().count,
    projects: projects.data().count,
    contacts: contacts.data().count,
  };
}

export async function listAdminContent(collection: ContentCollection) {
  const db = getAdminDb();
  const snapshot = await db.collection(collection).orderBy("updatedAt", "desc").get();
  return snapshot.docs.map((doc) => {
    const data = collection === "posts"
      ? postSchema.parse(doc.data())
      : collection === "projects"
        ? projectSchema.parse(doc.data())
        : managedItemSchema.parse(doc.data());
    return { id: doc.id, ...data };
  });
}
