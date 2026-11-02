"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Quote, X } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useToast } from "@/components/ui/Toast";
import type { ManagedItem, Project } from "@/types/content";

const quotes = [
  "The way to get started is to quit talking and begin doing.",
  "Your time is limited, so don't waste it living someone else's life.",
  "If you look at what you have in life, you'll always have more.",
];
const typewriterPhrase = "Video Editor & Brand Storyteller";

export function HeroAnimations() {
  return (
    <>
      <Typewriter />
      <div className="quotes">
        <QuoteRotator />
      </div>
    </>
  );
}

function Typewriter() {
  const [text, setText] = useState("");
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;

    let position = 0;
    let timer = 0;
    const typeNextCharacter = () => {
      position += 1;
      setText(typewriterPhrase.slice(0, position));
      if (position === typewriterPhrase.length) {
        timer = window.setTimeout(() => {
          position = 0;
          setText("");
          timer = window.setTimeout(typeNextCharacter, 180);
        }, 1800);
        return;
      }
      timer = window.setTimeout(typeNextCharacter, 75);
    };
    timer = window.setTimeout(typeNextCharacter, 120);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);
  return (
    <p className="typing-text" aria-label="Video Editor and Brand Storyteller">
      {reduceMotion ? typewriterPhrase : text}
    </p>
  );
}

function QuoteRotator() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % quotes.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div aria-live="polite" className="quote-rotator">
      <AnimatePresence initial={false} mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
        >
          {quotes[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function Timeline({ items }: { items: { title: string; description: string }[] }) {
  return (
    <div className="row">
      <div className="timeline">
        {items.map((item) => (
          <article className="timeline-item" key={item.title}>
            <div className="timeline-item-inner">
              <span className="icon" aria-hidden="true">
                <BriefcaseBusiness size={18} strokeWidth={1.7} />
              </span>
              <h3>{item.title}</h3>
              <h4>thewebedits</h4>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AboutTabs({ skills }: { skills: ManagedItem[] }) {
  const [activeTab, setActiveTab] = useState<"education" | "tools">("education");
  return (
    <>
      <div className="row">
        <div className="about-tabs" role="tablist" aria-label="About information">
          <button
            className={`tab-item${activeTab === "education" ? " active" : ""}`}
            onClick={() => setActiveTab("education")}
            role="tab"
            aria-selected={activeTab === "education"}
            type="button"
          >
            education
          </button>
          <button
            className={`tab-item${activeTab === "tools" ? " active" : ""}`}
            onClick={() => setActiveTab("tools")}
            role="tab"
            aria-selected={activeTab === "tools"}
            type="button"
          >
            tools
          </button>
        </div>
      </div>
      <div className="row">
        <div
          className={`education tab-content${activeTab === "education" ? " active" : ""}`}
          role="tabpanel"
        >
          <Timeline
            items={[
              {
                title: "Video Editor & Content Creator",
                description:
                  "Specializing in video editing for events coverage, advertisement videos, and content creator collaborations. I transform raw footage into compelling narratives that engage audiences and drive results.",
              },
              {
                title: "Brand Identity Designer",
                description:
                  "Creating memorable brand identities, from logo design and color schemes to complete brand guidelines, that connect with your target audience.",
              },
              {
                title: "Web Developer",
                description:
                  "Building custom websites that align with your brand identity and business goals, optimized for performance, user experience, and search visibility.",
              },
            ]}
          />
        </div>
      </div>
      <div className="row">
        <div
          className={`tools tab-content${activeTab === "tools" ? " active" : ""}`}
          role="tabpanel"
        >
          <Timeline
            items={skills.map((item) => ({ title: item.title, description: item.description }))}
          />
        </div>
      </div>
    </>
  );
}

export function PortfolioSection({ projects }: { projects: Project[] }) {
  const categories = ["all", "video-editing", "brand-identity", "web-development"] as const;
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selected) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalRef.current?.querySelector<HTMLButtonElement>(".pp-back")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("hidden-scrolling");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("hidden-scrolling");
      previousFocus.current?.focus();
    };
  }, [selected]);

  const visibleProjects =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);
  return (
    <section className="portfolio-section section" id="portfolio">
      <div className="container">
        <div className="row">
          <SectionTitle title="latest work" eyebrow="portfolio" />
        </div>
        <div className="portfolio-filter" role="group" aria-label="Filter portfolio">
          {categories.map((category) => (
            <button
              type="button"
              className={`filter-item${filter === category ? " active" : ""}`}
              key={category}
              onClick={() => setFilter(category)}
            >
              {category.replaceAll("-", " ")}
            </button>
          ))}
        </div>
        <motion.div className="row portfolio-items" layout>
          <AnimatePresence initial={false} mode="popLayout">
            {visibleProjects.map((project) => {
              const firstImage = project.images[0];
              const youtubeId = firstImage ? getYoutubeId(firstImage) : null;
              return (
                <motion.article
                  className="portfolio-item show"
                  data-category={project.category}
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.985 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
                >
                  <button
                    className="portfolio-item-inner"
                    type="button"
                    onClick={() => setSelected(project)}
                    aria-label={`View ${project.title}`}
                  >
                    <div className="portfolio-item-img">
                      {youtubeId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?mute=1&controls=0&loop=1&playlist=${youtubeId}`}
                          title={project.title}
                          loading="lazy"
                        />
                      ) : firstImage ? (
                        <Image src={firstImage} alt={project.title} width={600} height={400} />
                      ) : null}
                      <span className="view-project">View Project</span>
                    </div>
                    <p className="portfolio-item-title">
                      {project.title}
                      <span>{project.year}</span>
                    </p>
                  </button>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
      {selected && (
        <div
          className="portfolio-popup active"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolioTitle"
          ref={modalRef}
          onKeyDown={(event) => {
            if (event.key !== "Tab" || !modalRef.current) return;
            const focusable = [
              ...modalRef.current.querySelectorAll<HTMLElement>(
                "button, a[href], iframe, video[controls]",
              ),
            ];
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="pp-main">
            <button
              className="pp-back"
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close project details"
            >
              <X aria-hidden="true" size={18} />
            </button>
            <div className="pp-details">
              <h2 id="portfolioTitle">{selected.title}</h2>
              <p id="portfolioCategory">{selected.category.replaceAll("-", " ")}</p>
              <p id="portfolioDescription">{selected.description}</p>
              <p>
                <strong>Year:</strong> {selected.year}
              </p>
              <p>
                <strong>Client:</strong> {selected.client}
              </p>
              <p>
                <strong>Tools:</strong> {selected.tools}
              </p>
              {selected.website && (
                <a id="portfolioWeb" href={selected.website} target="_blank" rel="noreferrer">
                  View project
                </a>
              )}
            </div>
            <div className="portfolio-gallery">
              {selected.images.map((image, index) => {
                const id = getYoutubeId(image);
                return id ? (
                  <iframe
                    key={image}
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title={`${selected.title} video ${index + 1}`}
                    allow="encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : image.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                  <video key={image} src={image} controls preload="metadata" />
                ) : (
                  <Image
                    key={image}
                    src={image}
                    alt={`${selected.title} image ${index + 1}`}
                    width={1000}
                    height={700}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function getYoutubeId(source: string) {
  try {
    const url = new URL(source);
    if (url.hostname.endsWith("youtu.be")) return url.pathname.slice(1);
    if (url.pathname.includes("/shorts/") || url.pathname.includes("/embed/")) {
      return url.pathname.split("/").filter(Boolean).at(-1) ?? null;
    }
    return url.searchParams.get("v");
  } catch {
    return null;
  }
}

export function TestimonialSlider({ testimonials }: { testimonials: ManagedItem[] }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeItem = testimonials[activeTestimonial];
  return (
    <section className="testimonial-section section" id="testimonial">
      <div className="container">
        <div className="row">
          <SectionTitle title="Client Speak" eyebrow="testimonial" />
        </div>
        <div className="testi-slider-container">
          <AnimatePresence initial={false} mode="wait">
            {activeItem && (
              <motion.article
                className="testi-item active"
                key={activeItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
                aria-live="polite"
              >
                <Quote
                  className="testimonial-quote"
                  aria-hidden="true"
                  size={26}
                  strokeWidth={1.5}
                />
                {activeItem.image && (
                  <Image src={activeItem.image} alt="" width={100} height={100} />
                )}
                <p>“{activeItem.description}”</p>
                <h3>{activeItem.title}</h3>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
        {testimonials.length > 1 && (
          <div className="testi-slider-nav">
            <button
              className="prev"
              onClick={() =>
                setActiveTestimonial(
                  (activeTestimonial + testimonials.length - 1) % testimonials.length,
                )
              }
              aria-label="Previous testimonial"
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={20} />
            </button>
            <button
              className="next"
              onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)}
              aria-label="Next testimonial"
              type="button"
            >
              <ChevronRight aria-hidden="true" size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function ContactForm() {
  const { notify } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Unable to send your message.");
      }
      form.reset();
      notify("Your message has been sent successfully.");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Unable to send your message.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submitForm}>
      <div className="row">
        <div className="w-50">
          <div className="input-group">
            <label className="sr-only" htmlFor="contact-name">
              Name
            </label>
            <input
              className="input-control name"
              id="contact-name"
              name="name"
              placeholder="Name"
              autoComplete="name"
              required
              maxLength={100}
            />
          </div>
          <div className="input-group">
            <label className="sr-only" htmlFor="contact-email">
              Email
            </label>
            <input
              className="input-control email"
              id="contact-email"
              name="email"
              placeholder="Email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </div>
          <div className="input-group">
            <label className="sr-only" htmlFor="contact-subject">
              Subject
            </label>
            <input
              className="input-control subject"
              id="contact-subject"
              name="subject"
              placeholder="Subject"
              required
              maxLength={160}
            />
          </div>
        </div>
        <div className="w-50">
          <div className="input-group">
            <label className="sr-only" htmlFor="contact-message">
              Message
            </label>
            <textarea
              className="input-control message"
              id="contact-message"
              name="message"
              placeholder="Message"
              required
              maxLength={5000}
            />
          </div>
        </div>
        <div className="submit-btn">
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </div>
      </div>
    </form>
  );
}
