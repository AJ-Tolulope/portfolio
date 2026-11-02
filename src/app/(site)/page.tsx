import type { Metadata } from "next";
import { HomePage } from "@/components/sections/HomePage";
import { getPublishedItems, getPublishedProjects, getSiteSettings } from "@/lib/services/content";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: { absolute: settings.title },
    description: settings.description,
    openGraph: {
      title: settings.title,
      description: settings.description,
      images: [settings.profileImage],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.title,
      description: settings.description,
      images: [settings.profileImage],
    },
  };
}

export default async function HomeRoute() {
  const [settings, projects, services, skills, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
    getPublishedItems("services"),
    getPublishedItems("skills"),
    getPublishedItems("testimonials"),
  ]);
  return (
    <HomePage
      settings={settings}
      projects={projects}
      services={services}
      skills={skills}
      testimonials={testimonials}
    />
  );
}
