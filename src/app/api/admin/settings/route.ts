import { NextResponse } from "next/server";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { revalidateContent } from "@/lib/services/revalidation";
import { siteSettingsSchema } from "@/types/content";

export async function GET() {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const snapshot = await getAdminDb().collection("siteSettings").doc("main").get();
  return NextResponse.json(snapshot.data() ?? null);
}

export async function PUT(request: Request) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const input = siteSettingsSchema.omit({ updatedAt: true }).parse(await request.json());
    await getAdminDb().collection("siteSettings").doc("main").set({ ...input, updatedAt: Date.now() });
    revalidateContent(["/", "/blog", "/courses"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error && error.name === "ZodError" ? "Settings fields are invalid." : "Unable to save site settings.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
