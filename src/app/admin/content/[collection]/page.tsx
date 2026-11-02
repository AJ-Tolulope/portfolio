import { notFound, redirect } from "next/navigation";
import { ContentManager } from "@/components/admin/ContentManager";
import { AdminShell } from "@/components/admin/AdminShell";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { listAdminContent } from "@/lib/services/content";
import { contentCollections } from "@/types/content";

export default async function AdminManagedContentPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  if (!(await getVerifiedAdmin())) redirect("/admin/login");
  const { collection } = await params;
  if (!contentCollections.includes(collection as (typeof contentCollections)[number]) || collection === "posts" || collection === "projects") notFound();
  const typedCollection = collection as "services" | "skills" | "testimonials" | "socialLinks" | "courses";
  const records = await listAdminContent(typedCollection);
  return <AdminShell><ContentManager collection={typedCollection} initialRecords={records} /></AdminShell>;
}
