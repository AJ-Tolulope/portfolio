"use client";

import { useState } from "react";
import type { SiteSettings } from "@/types/content";

export function SettingsEditor({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to update settings.");
      setMessage("Site settings saved.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <header className="admin-topbar"><h1>Site settings</h1></header>
      {message && <p className="admin-alert success" role="status">{message}</p>}
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <form className="admin-card admin-form" onSubmit={submit}>
        <label>Site title<input value={settings.title} onChange={(event) => setSettings({ ...settings, title: event.target.value })} required maxLength={100} /></label>
        <label>Site description<textarea value={settings.description} onChange={(event) => setSettings({ ...settings, description: event.target.value })} required maxLength={300} /></label>
        <label>Hero intro<input value={settings.heroIntro} onChange={(event) => setSettings({ ...settings, heroIntro: event.target.value })} required maxLength={160} /></label>
        <label>Hero title<input value={settings.heroTitle} onChange={(event) => setSettings({ ...settings, heroTitle: event.target.value })} required maxLength={240} /></label>
        <label>About text<textarea value={settings.about} onChange={(event) => setSettings({ ...settings, about: event.target.value })} required maxLength={3000} /></label>
        <label>Contact email<input type="email" value={settings.email} onChange={(event) => setSettings({ ...settings, email: event.target.value })} required /></label>
        <label>Business email<input type="email" value={settings.businessEmail} onChange={(event) => setSettings({ ...settings, businessEmail: event.target.value })} required /></label>
        <label>Phone / WhatsApp contact<input value={settings.phone} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} required maxLength={100} /></label>
        <label>Location<input value={settings.location} onChange={(event) => setSettings({ ...settings, location: event.target.value })} required maxLength={100} /></label>
        <label>Profile image path or URL<input value={settings.profileImage} onChange={(event) => setSettings({ ...settings, profileImage: event.target.value })} required /></label>
        <fieldset>
          <legend>Social links</legend>
          {settings.socialLinks.map((link, index) => (
            <div className="admin-grid" key={`${link.label}-${index}`}>
              <label>Label<input value={link.label} onChange={(event) => setSettings({
                ...settings,
                socialLinks: settings.socialLinks.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item),
              })} /></label>
              <label>URL<input type="url" value={link.href} onChange={(event) => setSettings({
                ...settings,
                socialLinks: settings.socialLinks.map((item, itemIndex) => itemIndex === index ? { ...item, href: event.target.value } : item),
              })} /></label>
              <button className="admin-button danger" type="button" onClick={() => setSettings({
                ...settings,
                socialLinks: settings.socialLinks.filter((_, itemIndex) => itemIndex !== index),
              })}>Remove link</button>
            </div>
          ))}
          <button className="admin-button secondary" type="button" onClick={() => setSettings({
            ...settings,
            socialLinks: [...settings.socialLinks, { label: "", href: "https://example.com" }],
          })}>Add social link</button>
        </fieldset>
        <button className="admin-button" disabled={saving} type="submit">{saving ? "Saving…" : "Save settings"}</button>
      </form>
    </>
  );
}
