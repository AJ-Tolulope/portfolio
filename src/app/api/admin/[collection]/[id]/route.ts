import { NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { revalidateContent } from "@/lib/services/revalidation";
import {
  contentCollections,
  managedItemSchema,
  postSchema,
  projectSchema,
} from "@/types/content";

const collectionSchemas = {
  posts: postSchema.omit({ createdAt: true, updatedAt: true }),
  projects: projectSchema.omit({ createdAt: true, updatedAt: true }),
  services: managedItemSchema.omit({ createdAt: true, updatedAt: true }),
  skills: managedItemSchema.omit({ createdAt: true, updatedAt: true }),
  testimonials: managedItemSchema.omit({ createdAt: true, updatedAt: true }),
  socialLinks: managedItemSchema.omit({ createdAt: true, updatedAt: true }),
  courses: managedItemSchema.omit({ createdAt: true, updatedAt: true }),
};
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { collection: rawCollection, id } = await params;
    const collection = z.enum(contentCollections).parse(rawCollection);
    const value = collectionSchemas[collection].parse(await request.json());
    if ("slug" in value) {
      const duplicate = await getAdminDb().collection(collection).where("slug", "==", value.slug).limit(2).get();
      if (duplicate.docs.some((doc) => doc.id !== id)) {
        return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
      }
    }
    const doc = getAdminDb().collection(collection).doc(id);
    if (!(await doc.get()).exists) return NextResponse.json({ error: "Content not found." }, { status: 404 });
    await doc.set({ ...value, updatedAt: Date.now() }, { merge: true });
    const affectedPaths = collection === "posts"
      ? ["/", "/blog", ...("slug" in value ? [`/blog/${value.slug}`] : [])]
      : collection === "courses"
        ? ["/courses", ...("coursePath" in value && value.coursePath ? [`/courses/${value.coursePath}`] : [])]
        : ["/"];
    revalidateContent([...affectedPaths, "/admin"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error && error.name === "ZodError" ? "Content fields are invalid." : "Unable to update content.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { collection: rawCollection, id } = await params;
    const collection = z.enum(contentCollections).parse(rawCollection);
    await getAdminDb().collection(collection).doc(id).delete();
    const affectedPaths = collection === "posts"
      ? ["/", "/blog"]
      : collection === "courses"
        ? ["/courses"]
        : ["/"];
    revalidateContent([...affectedPaths, "/admin"]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete content." }, { status: 400 });
  }
}
