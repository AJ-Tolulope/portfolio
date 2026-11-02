import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getVerifiedAdmin()) redirect("/admin");
  return <AdminLogin />;
}
