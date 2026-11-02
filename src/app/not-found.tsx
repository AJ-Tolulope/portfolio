import Link from "next/link";

export default function NotFound() {
  return (
    <main className="route-error">
      <h1>Page not found</h1>
      <p>The page you’re looking for may have moved or been removed.</p>
      <Link href="/" className="btn">Return home</Link>
    </main>
  );
}
