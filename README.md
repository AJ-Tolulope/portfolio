# thewebedits portfolio and CMS

A Next.js App Router rebuild of the original thewebedits portfolio. Public pages use server-rendered, ISR-cached Firestore content, while a Firebase Authentication-protected CMS manages portfolio projects, articles, site settings, courses, and contact messages.

## Stack

- Next.js App Router, React, TypeScript (strict mode)
- Motion for reduced-motion-aware transitions and Lucide React for interface icons
- Firebase Authentication (email/password), Cloud Firestore, Cloud Storage, Firebase Admin SDK
- Zod request and content validation
- CSS based on the original portfolio styles, with a small responsive admin design system
- React Markdown with HTML sanitization for article rendering and editor previews

## Routes and structure

- `/` — portfolio home
- `/blog` and `/blog/[slug]` — article index and detail pages
- `/courses`, `/courses/html`, `/courses/css`, `/courses/javascript` — course overview and lessons
- `/admin/login` — admin sign-in
- `/admin` — dashboard
- `/admin/posts`, `/admin/projects`, `/admin/content/[collection]` — CMS content
- `/admin/settings`, `/admin/inbox`, `/admin/media` — settings, contact inbox, and image library
- `/api/contact` — public, validated contact submission endpoint
- `/api/admin/*` — authenticated CMS APIs
- `/sitemap.xml` and `/robots.txt` — generated SEO endpoints

```text
src/
  app/                 App Router pages, API routes, metadata, global styles
  components/
    admin/             CMS editors, inbox, media library, shell
    layout/            Site navigation and footer
    sections/          Portfolio homepage and contact form
    ui/                Reusable titles, effects, and toast notifications
  content/             Typed fallback data and Firestore seed content
  lib/
    firebase/          Firebase browser and Admin SDK setup and auth
    services/           Firestore reads and cache revalidation
    utils/              Slugs and reading-time helpers
  types/                Zod schemas and shared data types
scripts/                One-time content seeder and admin-claim helper
public/assets/          Migrated original images and illustrations
public/courses/         Migrated course media
legacy/blogs/           Original article HTML used by the one-time seed script
firestore.rules         Firestore access policy
storage.rules           Storage access policy
```

The original stylesheets remain the visual baseline to preserve their selectors, theme variables, spacing, and responsive breakpoints. Poppins is loaded with `next/font`; obsolete AOS/GSAP/SplitType/EmailJS scripts and the broken client-side EmailJS configuration are not used in the Next.js application.

## Requirements and local setup

- Node.js 20.9 or newer (Node 24 is supported)
- A Firebase project with Auth, Firestore, and Storage enabled

1. Install packages:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the values below.

3. Configure Firebase as described in [Firebase setup](#firebase-setup).

4. Import the original content once:

   ```sh
   npm run seed
   ```

5. Start the development server:

   ```sh
   npm run dev
   ```

6. Open `http://localhost:3000`. To open the CMS, visit `/admin/login`.

The app falls back to typed sample content when no Admin SDK credentials are configured, so public routes can be developed before Firebase is connected. Contact submissions and CMS writes require Firebase configuration.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase browser app API key (Firebase Console → Project settings → Web app) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain, typically `<project-id>.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID used by the browser app |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket name |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase browser app sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase browser app ID |
| `FIREBASE_PROJECT_ID` | Project ID for the server-side Admin SDK |
| `FIREBASE_CLIENT_EMAIL` | Service-account client email for the Admin SDK |
| `FIREBASE_PRIVATE_KEY` | Service-account private key; in hosting dashboards preserve newlines or store escaped `\n` sequences |
| `ADMIN_EMAILS` | Comma-separated email allowlist checked by server-side CMS session creation |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin, e.g. `https://thewebedits.com` |

Never commit `.env.local`, service-account JSON, or real credentials. The example file intentionally contains empty values.

## Firebase setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. In **Authentication → Users**, add the initial administrator with a unique email and password.
4. Create a **Cloud Firestore** database in production mode.
5. Enable **Cloud Storage** and choose a bucket location.
6. Register a Firebase **Web app** in Project settings. Copy its configuration into the `NEXT_PUBLIC_FIREBASE_*` variables.
7. Create a service account under **Project settings → Service accounts**. Store its project ID, email, and private key in the server-only `FIREBASE_*` variables. Do not expose these values as `NEXT_PUBLIC_*`.
8. Add the initial admin's exact email to `ADMIN_EMAILS`. Use the same environment setting in local development and Vercel.
9. Grant the admin claim after the Firebase Auth user exists:

   ```sh
   npm run set-admin -- admin@example.com
   ```

   The helper requires the account email to be in `ADMIN_EMAILS`; signing in again refreshes the user's ID token to receive the claim.
10. Deploy the Firestore and Storage rules and indexes:

   ```sh
   npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage
   ```

   Select the correct project in the Firebase CLI first (`npx firebase-tools use <project-id>`).
11. Seed the migrated content with `npm run seed`.

Firestore collection model:

- `posts/{id}` — title, unique slug, Markdown body, excerpt, cover image, tags/category, SEO fields, draft/published state, dates.
- `projects/{id}` — title/slug, description, category, gallery URLs, client/year/tools, website, draft/published state.
- `services/{id}`, `skills/{id}`, `testimonials/{id}`, `socialLinks/{id}`, `courses/{id}` — managed display content and ordering (course documents also have `coursePath` and `topics`).
- `siteSettings/main` — homepage text, profile and contact details, and social links.
- `contactSubmissions/{id}` — validated name/email/subject/message, creation time, read state.

Public Firestore reads are restricted to published content (site settings are readable); only an administrator with the `admin` custom claim can write CMS documents. Contact submissions are create-only for direct public Firestore clients. The application writes submissions through its validated server endpoint using the Admin SDK. Storage rules restrict direct Storage access to admins; the CMS uses Firebase download-token URLs for public presentation of uploaded content. Treat those URLs as public links.

## CMS usage

- Sign in at `/admin/login`. Only accounts listed in `ADMIN_EMAILS` can establish a server session; private API endpoints verify the Firebase session cookie and allowlist again.
- Create and edit posts, projects, services, skills, testimonials, social links, and course entries from the sidebar. Post slugs are generated from titles, Markdown can be previewed, and publish status controls public visibility.
- Upload images in **Media library** or from an image field. The upload endpoint permits JPEG, PNG, WebP, and GIF files up to 5 MB.
- Manage contact messages from **Contact inbox**; mark messages read/unread or permanently delete them after confirmation.
- Content changes call Next.js on-demand revalidation for the affected public routes.

## Quality checks

```sh
npm run lint
npm run build
```

## Deploy to Vercel

1. Import the repository in Vercel and select the Next.js framework preset.
2. Add every required environment variable from `.env.example`; mark Admin SDK values as encrypted server-only secrets.
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical production URL and redeploy after changing environment variables.
4. Deploy Firestore/Storage rules and indexes to the matching Firebase project, then run `npm run seed` once with production credentials.
5. For content updates, the admin app triggers route revalidation. Redeploy only when application code or environment configuration changes.

Firebase Auth redirects are not required for password sign-in. Restrict administrator account creation to trusted operators and remove former staff from `ADMIN_EMAILS` and the Firebase custom claim.
