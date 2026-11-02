import { redirect } from "next/navigation";
import { ContentManager } from "@/components/admin/ContentManager";
import { AdminShell } from "@/components/admin/AdminShell";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { listAdminContent } from "@/lib/services/content";

export default async function AdminPostsPage() {
  if (!(await getVerifiedAdmin())) redirect("/admin/login");
  const records = await listAdminContent("posts");
  return <AdminShell><ContentManager collection="posts" initialRecords={records} /></AdminShell>;
}
