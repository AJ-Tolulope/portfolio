import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getSiteSettings } from "@/lib/services/content";

export default async function AdminSettingsPage() {
  if (!(await getVerifiedAdmin())) redirect("/admin/login");
  const settings = await getSiteSettings();
  return <AdminShell><SettingsEditor initialSettings={settings} /></AdminShell>;
}
