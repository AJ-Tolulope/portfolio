import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { Inbox } from "@/components/admin/Inbox";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getAdminDb } from "@/lib/firebase/admin";
import type { ContactSubmission } from "@/types/content";

export default async function AdminInboxPage() {
  if (!(await getVerifiedAdmin())) redirect("/admin/login");
  const snapshot = await getAdminDb().collection("contactSubmissions").orderBy("createdAt", "desc").get();
  const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ContactSubmission[];
  return <AdminShell><Inbox initialMessages={messages} /></AdminShell>;
}
