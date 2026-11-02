"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowUp, Menu, Moon, Sun, X } from "lucide-react";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("theme-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("theme-change", onChange);
  };
}

function getThemeSnapshot() {
  return window.localStorage.getItem("icon") === "fa-sun";
}

export function SiteHeader({ contactEmail }: { contactEmail: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const lightMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("light-mode", getThemeSnapshot());

    const updateScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
      setShowTop(window.scrollY >= 900);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove("hidden-scrolling");
  };

  const toggleMenu = () => {
    const nextOpen = !menuOpen;
    setMenuOpen(nextOpen);
    document.body.classList.toggle("hidden-scrolling", nextOpen);
  };

  const toggleTheme = () => {
    const nextLightMode = !lightMode;
    document.body.classList.toggle("light-mode", nextLightMode);
    window.localStorage.setItem("icon", nextLightMode ? "fa-sun" : "fa-moon");
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <header className="header" id="header">
        <div className="container">
          <div className="logo">
            <Link href="/" aria-label="thewebedits home">
              W
            </Link>
          </div>
          <nav className="links" aria-label="Main navigation">
            <ul>
              {navItems.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            aria-label={`Switch to ${lightMode ? "dark" : "light"} theme`}
            aria-pressed={lightMode}
            className="theme"
            onClick={toggleTheme}
            type="button"
          >
            {lightMode ? (
              <Sun aria-hidden="true" size={18} />
            ) : (
              <Moon aria-hidden="true" size={18} />
            )}
          </button>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`menu-btn${menuOpen ? " active" : ""}`}
            onClick={toggleMenu}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </header>
      <nav className={`nav-menu${menuOpen ? " open" : ""}`} aria-label="Mobile navigation">
        <button className="nav-close-btn" aria-label="Close menu" onClick={closeMenu} type="button">
          <X aria-hidden="true" size={22} />
        </button>
        <div className="nav-links">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="link-item" href={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="link-item" href="/courses" onClick={closeMenu}>
                Courses
              </Link>
            </li>
          </ul>
          <p className="copyright">
            © {new Date().getFullYear()}, thewebedits
            <br />
            {contactEmail}
          </p>
        </div>
      </nav>
      <a className={`move-up${showTop ? " active" : ""}`} href="#home" aria-label="Scroll to top">
        <span aria-hidden="true">
          <ArrowUp size={20} />
        </span>
      </a>
    </>
  );
}
