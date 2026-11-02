import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPublishedItems } from "@/lib/services/content";

export const revalidate = 3600;

export async function generateStaticParams() {
  const courses = await getPublishedItems("courses");
  return courses.filter((course) => course.coursePath).map((course) => ({ course: course.coursePath }));
}

export async function generateMetadata({ params }: { params: Promise<{ course: string }> }): Promise<Metadata> {
  const { course } = await params;
  const lesson = (await getPublishedItems("courses")).find((item) => item.coursePath === course);
  if (!lesson) return { title: "Course not found" };
  const description = lesson.description;
  return {
    title: `${lesson.title} | WEBEDIT`,
    description,
    openGraph: { title: `${lesson.title} Course | thewebedits`, description, images: [lesson.image] },
    twitter: { card: "summary_large_image", title: `${lesson.title} Course | thewebedits`, description },
  };
}

export default async function CourseLessonPage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const lesson = (await getPublishedItems("courses")).find((item) => item.coursePath === course);
  if (!lesson) notFound();
  const topics = lesson.topics ?? [];
  return (
    <>
      <section className="home-section section active">
        <div className="container">
          <div className="row full-screen justify-content-between align-items">
            <div className="home-text">
              <p>thewebedits course</p>
              <h1><span className="hero-highlight">{lesson.title}</span></h1>
              <p>{lesson.description}</p>
              <Link className="btn" href="/courses">All Courses</Link>
            </div>
            <div className="home-img"><div className="img-box">{lesson.image && <Image src={lesson.image} alt="" width={500} height={400} />}</div></div>
          </div>
        </div>
      </section>
      <section className="about-section course-section section">
        <div className="container">
          <div className="row"><SectionTitle title="Course Info" eyebrow="Course guide" /></div>
          <div className="course-outline">
            <h2>{lesson.title} topics</h2>
            <ol>{topics.map((topic) => <li key={topic}>{topic}</li>)}</ol>
            {course === "html" && <Image src="/assets/codes/html_file.png" alt="Example HTML file" width={700} height={430} />}
          </div>
          <p><Link href="/#contact">Contact us about this course</Link></p>
        </div>
      </section>
    </>
  );
}
