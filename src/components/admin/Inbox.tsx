"use client";

import { useState } from "react";
import type { ContactSubmission } from "@/types/content";

export function Inbox({ initialMessages }: { initialMessages: ContactSubmission[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const shown = messages.filter((message) => `${message.name} ${message.email} ${message.subject} ${message.message}`.toLowerCase().includes(search.toLowerCase()));

  async function update(id: string, method: "PATCH" | "DELETE", read?: boolean) {
    setError("");
    if (method === "DELETE" && !window.confirm("Delete this contact submission? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/admin/inbox", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(method === "PATCH" ? { id, read } : { id }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to update inbox.");
      setMessages((current) => method === "DELETE"
        ? current.filter((message) => message.id !== id)
        : current.map((message) => message.id === id ? { ...message, read: Boolean(read) } : message));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update inbox.");
    }
  }

  return (
    <>
      <header className="admin-topbar"><h1>Contact inbox</h1><p>{messages.filter((message) => !message.read).length} unread messages</p></header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <section className="admin-card">
        <input className="admin-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages…" aria-label="Search contact messages" />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Sender</th><th>Subject / message</th><th>Received</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {shown.map((message) => (
                <tr key={message.id}>
                  <td>{message.name}<br /><a href={`mailto:${message.email}`}>{message.email}</a></td>
                  <td><strong>{message.subject}</strong><p>{message.message}</p></td>
                  <td>{new Date(message.createdAt).toLocaleString()}</td>
                  <td><span className={`admin-status ${message.read ? "" : "published"}`}>{message.read ? "Read" : "Unread"}</span></td>
                  <td><div className="admin-actions">
                    <button className="admin-button secondary" type="button" onClick={() => void update(message.id, "PATCH", !message.read)}>{message.read ? "Mark unread" : "Mark read"}</button>
                    <button className="admin-button danger" type="button" onClick={() => void update(message.id, "DELETE")}>Delete</button>
                  </div></td>
                </tr>
              ))}
              {shown.length === 0 && <tr><td colSpan={5}>Your inbox is empty.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
