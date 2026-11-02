import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  AboutTabs,
  ContactForm,
  HeroAnimations,
  PortfolioSection,
  TestimonialSlider,
} from "@/components/sections/HomeInteractions";
import type { ManagedItem, Project, SiteSettings } from "@/types/content";

function FloatingEffects() {
  return (
    <div className="effect-wrap" aria-hidden="true">
      <div className="effect effect-1">
        {Array.from({ length: 28 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
      <div className="effect effect-2">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
    </div>
  );
}

export function HomePage({
  settings,
  projects,
  services,
  skills,
  testimonials,
}: {
  settings: SiteSettings;
  projects: Project[];
  services: ManagedItem[];
  skills: ManagedItem[];
  testimonials: ManagedItem[];
}) {
  return (
    <>
      <section className="home-section section active" id="home">
        <FloatingEffects />
        <div className="container">
          <div className="row full-screen justify-content-between align-items">
            <div className="home-text" data-aos="fade-up" data-aos-delay="100">
              <p>{settings.heroIntro}</p>
              <HeroAnimations />
              <h1>
                {settings.heroTitle.split(/(Video Editor)/).map((part, index) =>
                  part === "Video Editor" ? (
                    <span className="hero-highlight" key={index}>
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </h1>
              <a href="#portfolio" className="btn">
                View Projects
              </a>
            </div>
            <div className="home-img" data-aos="fade-up" data-aos-delay="100">
              <div className="img-box">
                <Image
                  src={settings.profileImage}
                  alt="Tolulope Ajala"
                  width={540}
                  height={680}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section section" id="about">
        <FloatingEffects />
        <div className="container">
          <div className="row">
            <SectionTitle title="a little about me" eyebrow="main info" />
          </div>
          <div className="row">
            <div className="about-img">
              <div className="img-box" data-aos="fade-up" data-aos-delay="100">
                <Image
                  src="/assets/profile_1.jpg"
                  alt="Tolulope Ajala, creative professional"
                  width={430}
                  height={540}
                />
              </div>
              <div className="social-links">
                {settings.socialLinks.map((link) => (
                  <a
                    href={link.href}
                    key={link.label}
                    aria-label={link.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span aria-hidden="true">{link.label.slice(0, 1)}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="about-info">
              <p className="reveal-text" data-aos="fade-up">
                {settings.about}
              </p>
            </div>
          </div>
          <AboutTabs skills={skills} />
        </div>
      </section>

      <section className="service-section section" id="services">
        <div className="container">
          <div className="row">
            <SectionTitle title="What I Do" eyebrow="services" />
          </div>
          <div className="service-items grid grid-col-3">
            {services.map((service) => (
              <article
                className="service-item"
                key={service.id}
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <div className="service-item-inner">
                  <div className="icon" aria-hidden="true">
                    <Sparkles size={24} strokeWidth={1.6} />
                  </div>
                  <h3 className="reveal-text">{service.title}</h3>
                  <p className="reveal-text">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PortfolioSection projects={projects} />
      <TestimonialSlider testimonials={testimonials} />

      <section className="contact-section section" id="contact">
        <FloatingEffects />
        <div className="container">
          <div className="row">
            <SectionTitle title="Get In Touch" eyebrow="contact" />
          </div>
          <div className="row">
            <div className="contact-item">
              <div className="contact-item-inner">
                <Phone aria-hidden="true" size={22} strokeWidth={1.7} />
                <span>Contact</span>
                <p>{settings.phone}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-item-inner">
                <Mail aria-hidden="true" size={22} strokeWidth={1.7} />
                <span>Email</span>
                <p>
                  <a href={`mailto:${settings.businessEmail}`}>{settings.businessEmail}</a>
                </p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-item-inner">
                <MapPin aria-hidden="true" size={22} strokeWidth={1.7} />
                <span>Location</span>
                <p>{settings.location}</p>
              </div>
            </div>
          </div>
          <ContactForm />
          <p className="course-links">
            <Link href="/courses">Explore the frontend development course</Link>
          </p>
        </div>
      </section>
    </>
  );
}
