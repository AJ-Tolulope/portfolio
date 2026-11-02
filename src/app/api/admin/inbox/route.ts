import { NextResponse } from "next/server";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { z } from "zod";

export async function GET() {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const snapshot = await getAdminDb().collection("contactSubmissions").orderBy("createdAt", "desc").get();
  return NextResponse.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function PATCH(request: Request) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { id, read } = z.object({ id: z.string().min(1), read: z.boolean() }).parse(await request.json());
    await getAdminDb().collection("contactSubmissions").doc(id).update({ read });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to update contact submission." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { id } = z.object({ id: z.string().min(1) }).parse(await request.json());
    await getAdminDb().collection("contactSubmissions").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete contact submission." }, { status: 400 });
  }
}
