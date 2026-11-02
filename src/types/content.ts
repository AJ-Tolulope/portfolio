import { z } from "zod";

export const publishStateSchema = z.enum(["draft", "published"]);
export type PublishState = z.infer<typeof publishStateSchema>;

const mediaUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/assets/") ||
      value.startsWith("/courses/") ||
      z.string().url().safeParse(value).success,
    "Enter an absolute URL or a local public media path.",
  );

export const postSchema = z.object({
  title: z.string().trim().min(1).max(140),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().min(1).max(100_000),
  coverImage: mediaUrlSchema,
  tags: z.array(z.string().trim().min(1).max(32)).max(12),
  category: z.string().trim().min(1).max(60),
  status: publishStateSchema,
  publishedAt: z.string().datetime().nullable(),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(180),
  createdAt: z.number().finite(),
  updatedAt: z.number().finite(),
});
export type Post = z.infer<typeof postSchema> & { id: string };

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(140),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1).max(2000),
  category: z.enum(["video-editing", "brand-identity", "web-development"]),
  images: z.array(mediaUrlSchema).min(1).max(12),
  year: z.string().trim().min(4).max(4),
  client: z.string().trim().max(120),
  tools: z.string().trim().max(240),
  website: z.string().url().or(z.literal("")),
  status: publishStateSchema,
  createdAt: z.number().finite(),
  updatedAt: z.number().finite(),
});
export type Project = z.infer<typeof projectSchema> & { id: string };

export const managedItemSchema = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().max(2000),
  image: mediaUrlSchema,
  href: mediaUrlSchema,
  status: publishStateSchema,
  order: z.number().int().min(0).max(10000),
  coursePath: z.string().regex(/^[a-z0-9-]*$/).optional(),
  topics: z.array(z.string().trim().min(1).max(160)).max(30).optional(),
  createdAt: z.number().finite(),
  updatedAt: z.number().finite(),
});
export type ManagedItem = z.infer<typeof managedItemSchema> & { id: string };

export const siteSettingsSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(300),
  heroIntro: z.string().trim().min(1).max(160),
  heroTitle: z.string().trim().min(1).max(240),
  about: z.string().trim().min(1).max(3000),
  email: z.string().email(),
  businessEmail: z.string().email(),
  phone: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(100),
  profileImage: z.string().trim().min(1),
  socialLinks: z.array(z.object({
    label: z.string().trim().min(1).max(40),
    href: z.string().url(),
  })).max(12),
  updatedAt: z.number().finite(),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(5000),
});
export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type ContactSubmission = ContactSubmissionInput & {
  id: string;
  read: boolean;
  createdAt: number;
};

export const contentCollections = [
  "posts",
  "projects",
  "services",
  "testimonials",
  "skills",
  "socialLinks",
  "courses",
] as const;
export type ContentCollection = (typeof contentCollections)[number];
