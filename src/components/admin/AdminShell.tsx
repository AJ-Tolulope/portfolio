import type { ReactNode } from "react";
import Link from "next/link";
import { AdminLogout } from "@/components/admin/AdminLogout";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">thewebedits CMS</Link>
        <nav aria-label="Admin navigation">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/posts">Blog posts</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/content/services">Services</Link>
          <Link href="/admin/content/skills">Skills</Link>
          <Link href="/admin/content/testimonials">Testimonials</Link>
          <Link href="/admin/content/socialLinks">Social links</Link>
          <Link href="/admin/content/courses">Courses</Link>
          <Link href="/admin/settings">Site settings</Link>
          <Link href="/admin/inbox">Contact inbox</Link>
          <Link href="/admin/media">Media library</Link>
        </nav>
        <AdminLogout />
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
