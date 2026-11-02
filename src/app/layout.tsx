import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./site.css";
import "./blog.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "thewebedits | Creative Brand Identity, Video Editing & Web Development",
    template: "%s | thewebedits",
  },
  description:
    "Creative video editing, brand identity design, and web development by Tolulope Ajala.",
  openGraph: {
    type: "website",
    siteName: "thewebedits",
    title: "thewebedits | Creative Brand Identity, Video Editing & Web Development",
    description:
      "Creative video editing, brand identity design, and web development by Tolulope Ajala.",
    images: ["/assets/profile_main.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "thewebedits | Creative Brand Identity, Video Editing & Web Development",
    description:
      "Creative video editing, brand identity design, and web development by Tolulope Ajala.",
    images: ["/assets/profile_main.jpg"],
  },
  icons: { icon: "/assets/profile_main.jpg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
