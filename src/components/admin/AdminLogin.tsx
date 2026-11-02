"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    try {
      if (!isFirebaseClientConfigured()) throw new Error("Firebase client environment variables are not configured.");
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      const idToken = await credential.user.getIdToken(true);
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "This account cannot access the CMS.");
      }
      router.push("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login admin-card">
      <h1>Admin sign in</h1>
      <p>Sign in with an authorized email and password.</p>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <form className="admin-form" onSubmit={submit}>
        <label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="admin-button" disabled={loading} type="submit">{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
