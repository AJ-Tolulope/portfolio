import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getAdminStorage } from "@/lib/firebase/admin";

export default async function AdminMediaPage() {
  if (!(await getVerifiedAdmin())) redirect("/admin/login");
  const [files] = await getAdminStorage().bucket().getFiles({ prefix: "uploads/" });
  const media = await Promise.all(files.filter((file) => file.name !== "uploads/").map(async (file) => {
    let [metadata] = await file.getMetadata();
    let token = metadata.metadata?.firebaseStorageDownloadTokens;
    if (!token) {
      token = randomUUID();
      [metadata] = await file.setMetadata({ metadata: { ...metadata.metadata, firebaseStorageDownloadTokens: token } });
    }
    const url = `https://firebasestorage.googleapis.com/v0/b/${file.bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`;
    return { name: file.name, url, size: Number(metadata.size ?? 0), contentType: metadata.contentType ?? "" };
  }));
  return <AdminShell><MediaLibrary initialFiles={media} /></AdminShell>;
}
