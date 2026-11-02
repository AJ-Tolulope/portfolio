"use client";

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="route-error" role="alert">
      <h1>Something went wrong</h1>
      <p>We couldn’t load this page. Please try again.</p>
      <button className="btn" onClick={reset} type="button">Try again</button>
    </main>
  );
}
