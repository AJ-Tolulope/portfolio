import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVerifiedAdmin } from "@/lib/firebase/auth";
import { getContentCounts } from "@/lib/services/content";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  if (!(await getVerifiedAdmin())) redirect("/admin/login");
  const counts = await getContentCounts();
  return (
    <AdminShell>
      <header className="admin-topbar"><h1>Dashboard</h1><p>Manage your portfolio content.</p></header>
      <div className="admin-grid">
        {Object.entries(counts).map(([label, count]) => (
          <article className="admin-card" key={label}>
            <p>{label.charAt(0).toUpperCase() + label.slice(1)}</p>
            <p className="admin-stat">{count}</p>
          </article>
        ))}
      </div>
      <section className="admin-card">
        <h2>Manage site content</h2>
        <p>Update projects, articles, site information, and messages from the navigation.</p>
        <p><a href="/admin/posts">Manage blog posts →</a></p>
      </section>
    </AdminShell>
  );
}
