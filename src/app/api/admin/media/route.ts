import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getAdminStorage } from "@/lib/firebase/admin";
import { z } from "zod";

const maxUploadBytes = 5 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET() {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const bucket = getAdminStorage().bucket();
    const [files] = await bucket.getFiles({ prefix: "uploads/" });
    const media = await Promise.all(files.filter((file) => file.name !== "uploads/").map(async (file) => {
      let [metadata] = await file.getMetadata();
      let token = metadata.metadata?.firebaseStorageDownloadTokens;
      if (!token) {
        token = randomUUID();
        [metadata] = await file.setMetadata({ metadata: { ...metadata.metadata, firebaseStorageDownloadTokens: token } });
      }
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`;
      return { name: file.name, url, size: Number(metadata.size ?? 0), contentType: metadata.contentType ?? "" };
    }));
    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: "Unable to list uploaded media." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    if (!acceptedTypes.has(file.type)) return NextResponse.json({ error: "Use a JPEG, PNG, WebP, or GIF image." }, { status: 400 });
    if (file.size === 0 || file.size > maxUploadBytes) return NextResponse.json({ error: "Images must be smaller than 5 MB." }, { status: 400 });
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100);
    const path = `uploads/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const destination = getAdminStorage().bucket().file(path);
    const token = randomUUID();
    await destination.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: "public,max-age=31536000",
        metadata: { firebaseStorageDownloadTokens: token },
      },
      resumable: false,
    });
    const url = `https://firebasestorage.googleapis.com/v0/b/${destination.bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
    return NextResponse.json({ name: path, url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to upload media. Check Firebase Storage configuration." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!(await getVerifiedAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { name } = z.object({ name: z.string().startsWith("uploads/") }).parse(await request.json());
    await getAdminStorage().bucket().file(name).delete();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete media." }, { status: 400 });
  }
}
