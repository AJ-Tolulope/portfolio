import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { getPostBySlug, getPublishedPosts } from "@/lib/services/content";
import { postReadingTime } from "@/lib/utils/content";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const image = post.coverImage || "/assets/blogs/post-four.jpeg";
  return {
    title,
    description,
    openGraph: { type: "article", title, description, images: [image], publishedTime: post.publishedAt ?? undefined },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPostBySlug(slug), getPublishedPosts()]);
  if (!post) notFound();

  return (
    <>
      <div className="blog-page light-mode">
        <header className="blog-logo">
          <Link href="/blog" aria-label="Back to blog">
            <Image src="/assets/blogs/logo.png" alt="thewebedits" width={200} height={80} priority />
          </Link>
        </header>
        <div className="container blog-section grid article-grid">
          <article className="blog article-content">
            <Image className="article-cover" src={post.coverImage || "/assets/blogs/post-four.jpeg"} alt={post.title} width={1100} height={650} priority />
            <h1>{post.title}</h1>
            <div className="author-date">
              <span className="author">thewebedits</span>
              {post.publishedAt && <time className="date" dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</time>}
              <span className="date">{postReadingTime(post)} min read</span>
            </div>
            <div className="article-markdown">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
            </div>
            <div className="post-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </article>
          <aside className="recent-post">
            <h2>Recent posts</h2>
            {posts.filter((item) => item.id !== post.id).slice(0, 4).map((item) => (
              <article className="post" key={item.id}>
                <div className="post-img">
                  <Link href={`/blog/${item.slug}`}>
                    <Image src={item.coverImage || "/assets/blogs/post-four.jpeg"} alt="" width={300} height={220} />
                  </Link>
                </div>
                <div className="post-info">
                  <div className="post-tags"><span>{item.category}</span></div>
                  <Link href={`/blog/${item.slug}`}><h3 className="post-title">{item.title}</h3></Link>
                </div>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </>
  );
}
