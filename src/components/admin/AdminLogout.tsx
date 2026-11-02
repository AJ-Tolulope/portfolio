"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

export function AdminLogout() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function logout() {
    setError("");
    try {
      if (isFirebaseClientConfigured()) await signOut(getFirebaseAuth());
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to end the admin session.");
      router.replace("/admin/login");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign out.");
    }
  }

  return (
    <div>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <button className="admin-button secondary" onClick={() => void logout()} type="button">Sign out</button>
    </div>
  );
}
