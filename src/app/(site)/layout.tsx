import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollEffects } from "@/components/ui/ScrollEffects";
import { ToastProvider } from "@/components/ui/Toast";
import { getSiteSettings } from "@/lib/services/content";

export const revalidate = 3600;

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <ToastProvider>
      <ScrollEffects />
      <SiteHeader contactEmail={settings.email} />
      <main>{children}</main>
      <SiteFooter />
    </ToastProvider>
  );
}
