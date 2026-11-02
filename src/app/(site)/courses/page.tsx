import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPublishedItems, getSiteSettings } from "@/lib/services/content";
import { ContactForm } from "@/components/sections/HomeInteractions";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Frontend Development Course",
  description: "Start your frontend development journey with thewebedits.",
  openGraph: { title: "Frontend Development Course | thewebedits", images: ["/assets/course-project.png"] },
  twitter: { card: "summary_large_image", title: "Frontend Development Course | thewebedits" },
};

export default async function CoursesPage() {
  const [courses, settings] = await Promise.all([getPublishedItems("courses"), getSiteSettings()]);
  return (
    <>
      <section className="home-section section active course-overview">
        <div className="container">
          <div className="row full-screen justify-content-between align-items">
            <div className="home-text">
              <p>Welcome to thewebedits</p>
              <p>Front-end Web Development</p>
              <h1>Start Your <span className="hero-highlight">Frontend</span> Development Journey Today</h1>
              <a href="#about" className="btn">Start Now</a>
            </div>
            <div className="home-img">
              <div className="img-box"><Image src="/assets/proud_coder.svg" alt="Person coding on a laptop" width={500} height={500} /></div>
            </div>
          </div>
        </div>
      </section>
      <section className="about-section course-section section" id="about">
        <div className="container">
          <div className="row"><SectionTitle title="about course" eyebrow="main info" /></div>
          <div className="course-grid">
            {courses.map((course) => (
              <article className="service-item" key={course.href}>
                <div className="service-item-inner">
                  {course.image && <Image src={course.image} alt="" width={180} height={180} />}
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                  <Link className="btn" href={course.href}>Explore {course.title}</Link>
                </div>
              </article>
            ))}
          </div>
          <p className="course-contact"><Link href="/#contact">Get in touch</Link> to learn more.</p>
        </div>
      </section>
      <section className="contact-section section" id="contact">
        <div className="container">
          <div className="row"><SectionTitle title="Get In Touch" eyebrow="contact" /></div>
          <div className="row">
            <div className="contact-item">
              <div className="contact-item-inner"><span>Email</span><p><a href={`mailto:${settings.businessEmail}`}>{settings.businessEmail}</a></p></div>
            </div>
            <div className="contact-item">
              <div className="contact-item-inner"><span>Location</span><p>{settings.location}</p></div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
