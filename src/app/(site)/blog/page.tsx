import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/services/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes and guides on web development, design, and the creative process.",
  openGraph: {
    title: "Blog | thewebedits",
    description: "Notes and guides on web development, design, and the creative process.",
    images: ["/assets/blogs/post-four.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | thewebedits",
    images: ["/assets/blogs/post-four.jpeg"],
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const categories = [...new Set(posts.map((post) => post.category))];
  return (
    <>
      <div className="blog-page light-mode">
        <header className="blog-logo">
          <Link href="/" aria-label="thewebedits home">
            <Image src="/assets/blogs/logo.png" alt="thewebedits" width={200} height={80} priority />
          </Link>
        </header>
        <div className="container blog-section">
          <p className="sec">Categories:</p>
          <div className="categories">
            {categories.map((category) => <span className="btn category" key={category}>{category}</span>)}
          </div>
          <article>
            <p className="sec">Blog Posts</p>
            <div className="blogs">
              {posts.map((post) => (
                <article className="blog" key={post.id}>
                  <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                    <Image src={post.coverImage || "/assets/blogs/post-four.jpeg"} alt={post.title} width={760} height={440} />
                  </Link>
                  <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <div className="author-date">
                    <span className="author">thewebedits</span>
                    <time className="date" dateTime={post.publishedAt ?? undefined}>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" }) : "Draft"}
                    </time>
                  </div>
                  <p>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </article>
              ))}
              {posts.length === 0 && <p>No articles have been published yet.</p>}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
