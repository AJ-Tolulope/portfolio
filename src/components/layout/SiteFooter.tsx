import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer-section section" id="footer">
      <div className="container">
        <div className="row justify-content-between">
          <div className="footer-item">
            <h2>Quick links</h2>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/#portfolio">Portfolio</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/courses">Courses</Link></li>
            </ul>
          </div>
          <div className="footer-item">
            <p>© {new Date().getFullYear()} thewebedits. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
