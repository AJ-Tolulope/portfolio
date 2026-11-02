"use client";

import Image from "next/image";
import { useState } from "react";

type MediaFile = { name: string; url: string; size: number; contentType: string };

export function MediaLibrary({ initialFiles }: { initialFiles: MediaFile[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setError("");
    setNotice("");
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Use a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5 MB.");
      return;
    }
    setBusy(true);
    const data = new FormData();
    data.set("file", file);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: data });
      const result = (await response.json()) as MediaFile & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to upload media.");
      setFiles((current) => [result, ...current]);
      setNotice("Image uploaded.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to upload media.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(file: MediaFile) {
    if (!window.confirm(`Permanently delete ${file.name}?`)) return;
    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to delete media.");
      setFiles((current) => current.filter((item) => item.name !== file.name));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete media.");
    }
  }

  return (
    <>
      <header className="admin-topbar"><h1>Media library</h1><p>{files.length} uploaded images</p></header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {notice && <p className="admin-alert success" role="status">{notice}</p>}
      <section className="admin-card admin-form">
        <label>Upload image (JPEG, PNG, WebP, or GIF; max 5 MB)
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) void upload(file);
            event.currentTarget.value = "";
          }} />
        </label>
      </section>
      <div className="admin-grid">
        {files.map((file) => (
          <article className="admin-card" key={file.name}>
            <Image className="media-preview" src={file.url} alt={file.name.split("/").at(-1) ?? "Uploaded image"} width={180} height={120} unoptimized />
            <p>{file.name.split("/").at(-1)}</p>
            <p>{(file.size / 1024).toFixed(1)} KB · {file.contentType}</p>
            <button className="admin-button danger" onClick={() => void remove(file)} type="button">Delete image</button>
          </article>
        ))}
        {files.length === 0 && <p className="admin-card">No uploaded images yet.</p>}
      </div>
    </>
  );
}
