import { redirect } from "next/navigation";
import { ContentManager } from "@/components/admin/ContentManager";
import { AdminShell } from "@/components/admin/AdminShell";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { listAdminContent } from "@/lib/services/content";

export default async function AdminProjectsPage() {
  if (!(await getVerifiedAdmin())) redirect("/admin/login");
  const records = await listAdminContent("projects");
  return <AdminShell><ContentManager collection="projects" initialRecords={records} /></AdminShell>;
}
