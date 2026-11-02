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

const collectionParamSchema = z.enum(contentCollections);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { collection: rawCollection } = await params;
    const collection = collectionParamSchema.parse(rawCollection);
    const snapshot = await getAdminDb().collection(collection).orderBy("updatedAt", "desc").get();
    return NextResponse.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch {
    return NextResponse.json({ error: "Unable to retrieve content." }, { status: 400 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { collection: rawCollection } = await params;
    const collection = collectionParamSchema.parse(rawCollection);
    const value = collectionSchemas[collection].parse(await request.json());
    if ("slug" in value) {
      const duplicate = await getAdminDb()
        .collection(collection)
        .where("slug", "==", value.slug)
        .limit(1)
        .get();
      if (!duplicate.empty) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    const now = Date.now();
    const doc = await getAdminDb().collection(collection).add({
      ...value,
      createdAt: now,
      updatedAt: now,
    });
    const affectedPaths = collection === "posts"
      ? ["/", "/blog"]
      : collection === "courses"
        ? ["/courses", ...("coursePath" in value && value.coursePath ? [`/courses/${value.coursePath}`] : [])]
        : ["/"];
    revalidateContent([...affectedPaths, "/admin"]);
    return NextResponse.json({ id: doc.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.name === "ZodError" ? "Content fields are invalid." : "Unable to save content.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
