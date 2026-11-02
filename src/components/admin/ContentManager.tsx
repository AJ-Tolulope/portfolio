"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { useMemo, useState } from "react";
import { slugify } from "@/lib/utils/content";
import type { ContentCollection } from "@/types/content";

type ContentRecord = Record<string, unknown> & { id: string };
type Field = { name: string; label: string; kind?: "textarea" | "select" | "file" | "date"; options?: string[]; help?: string };

const fieldsByCollection: Record<ContentCollection, Field[]> = {
  posts: [
    { name: "title", label: "Title" },
    { name: "slug", label: "Slug", help: "Generated from the title; edit if needed." },
    { name: "excerpt", label: "Excerpt", kind: "textarea" },
    { name: "content", label: "Markdown content", kind: "textarea" },
    { name: "coverImage", label: "Cover image URL", kind: "file" },
    { name: "tags", label: "Tags (comma separated)" },
    { name: "category", label: "Category" },
    { name: "status", label: "Status", kind: "select", options: ["draft", "published"] },
    { name: "publishedAt", label: "Publish date", kind: "date" },
    { name: "seoTitle", label: "SEO title" },
    { name: "seoDescription", label: "SEO description", kind: "textarea" },
  ],
  projects: [
    { name: "title", label: "Title" },
    { name: "slug", label: "Slug" },
    { name: "description", label: "Description", kind: "textarea" },
    { name: "category", label: "Category", kind: "select", options: ["video-editing", "brand-identity", "web-development"] },
    { name: "images", label: "Image URLs (comma separated)", kind: "textarea" },
    { name: "year", label: "Year" },
    { name: "client", label: "Client" },
    { name: "tools", label: "Tools" },
    { name: "website", label: "Website URL" },
    { name: "status", label: "Status", kind: "select", options: ["draft", "published"] },
  ],
  services: [
    { name: "title", label: "Title" }, { name: "description", label: "Description", kind: "textarea" },
    { name: "image", label: "Image URL", kind: "file" }, { name: "href", label: "Link URL" },
    { name: "status", label: "Status", kind: "select", options: ["draft", "published"] }, { name: "order", label: "Display order" },
  ],
  courses: [
    { name: "title", label: "Course title" }, { name: "description", label: "Course description", kind: "textarea" },
    { name: "image", label: "Course illustration", kind: "file" }, { name: "href", label: "Course route" },
    { name: "coursePath", label: "Lesson route slug" }, { name: "topics", label: "Course topics (comma separated)", kind: "textarea" },
    { name: "status", label: "Status", kind: "select", options: ["draft", "published"] }, { name: "order", label: "Display order" },
  ],
  skills: [
    { name: "title", label: "Title" }, { name: "description", label: "Description", kind: "textarea" },
    { name: "image", label: "Image URL", kind: "file" }, { name: "href", label: "Link URL" },
    { name: "status", label: "Status", kind: "select", options: ["draft", "published"] }, { name: "order", label: "Display order" },
  ],
  testimonials: [
    { name: "title", label: "Client name" }, { name: "description", label: "Testimonial", kind: "textarea" },
    { name: "image", label: "Portrait URL", kind: "file" }, { name: "href", label: "Link URL" },
    { name: "status", label: "Status", kind: "select", options: ["draft", "published"] }, { name: "order", label: "Display order" },
  ],
  socialLinks: [
    { name: "title", label: "Label" }, { name: "description", label: "Profile URL" },
    { name: "href", label: "Profile URL" }, { name: "image", label: "Icon URL" },
    { name: "status", label: "Status", kind: "select", options: ["draft", "published"] }, { name: "order", label: "Display order" },
  ],
};

const defaults: Record<string, string> = {
  status: "draft",
  category: "web-development",
  images: "",
  tags: "",
  publishedAt: new Date().toISOString().slice(0, 16),
  year: String(new Date().getFullYear()),
  order: "0",
};

function toFieldValue(field: Field, record: ContentRecord | undefined) {
  const value = record?.[field.name];
  if (field.name === "publishedAt" && typeof value === "string") return value.slice(0, 16);
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === null) return defaults[field.name] ?? "";
  return String(value);
}

function serializeForm(collection: ContentCollection, values: Record<string, string>) {
  const data: Record<string, unknown> = { ...values };
  if (collection === "posts") {
    data.tags = values.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    data.publishedAt = values.publishedAt ? new Date(values.publishedAt).toISOString() : null;
  }
  if (collection === "projects") data.images = values.images.split(",").map((image) => image.trim()).filter(Boolean);
  if (collection === "courses") data.topics = values.topics.split(",").map((topic) => topic.trim()).filter(Boolean);
  for (const numberField of ["order"]) {
    if (numberField in data) data[numberField] = Number(values[numberField]);
  }
  return data;
}

export function ContentManager({
  collection,
  initialRecords,
}: {
  collection: ContentCollection;
  initialRecords: ContentRecord[];
}) {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<ContentRecord | null | undefined>(undefined);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const pageSize = 10;

  const filtered = useMemo(
    () => records.filter((record) => JSON.stringify(record).toLowerCase().includes(search.toLowerCase())),
    [records, search],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRecords = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const fields = fieldsByCollection[collection];

  async function save(form: FormData) {
    setSaving(true);
    setError("");
    const values = Object.fromEntries(fields.map((field) => [field.name, String(form.get(field.name) ?? "")]));
    if (collection === "posts" || collection === "projects") {
      if (!values.slug) values.slug = slugify(values.title);
    }
    const body = serializeForm(collection, values);
    try {
      const url = editing?.id ? `/api/admin/${collection}/${editing.id}` : `/api/admin/${collection}`;
      const response = await fetch(url, {
        method: editing?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { id?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to save content.");
      const saved = { ...body, id: result.id ?? editing?.id ?? "", updatedAt: Date.now() } as ContentRecord;
      setRecords((current) => editing ? current.map((item) => item.id === saved.id ? { ...item, ...saved } : item) : [saved, ...current]);
      setEditing(undefined);
      setNotice("Content saved.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save content.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(record: ContentRecord) {
    if (!window.confirm(`Delete “${String(record.title ?? record.id)}”? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/admin/${collection}/${record.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to delete content.");
      setRecords((current) => current.filter((item) => item.id !== record.id));
      setNotice("Content deleted.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete content.");
    }
  }

  return (
    <>
      <header className="admin-topbar"><h1>{collection === "posts" ? "Blog posts" : collection[0].toUpperCase() + collection.slice(1)}</h1></header>
      {notice && <p className="admin-alert success" role="status">{notice}</p>}
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <section className="admin-card">
        <div className="admin-toolbar">
          <input className="admin-search" type="search" placeholder="Search content…" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} aria-label="Search content" />
          <button className="admin-button" onClick={() => setEditing(null)} type="button">Create new</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {pageRecords.map((record) => (
                <tr key={record.id}>
                  <td>{String(record.title ?? record.id)}</td>
                  <td><span className={`admin-status ${String(record.status ?? "")}`}>{String(record.status ?? "active")}</span></td>
                  <td>{typeof record.updatedAt === "number" ? new Date(record.updatedAt).toLocaleDateString() : "—"}</td>
                  <td><div className="admin-actions">
                    <button className="admin-button secondary" onClick={() => setEditing(record)} type="button">Edit</button>
                    <button className="admin-button danger" onClick={() => void remove(record)} type="button">Delete</button>
                  </div></td>
                </tr>
              ))}
              {pageRecords.length === 0 && <tr><td colSpan={4}>No content found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <span>{filtered.length} item{filtered.length === 1 ? "" : "s"}</span>
          <div className="admin-actions">
            <button className="admin-button secondary" disabled={page === 0} onClick={() => setPage((value) => value - 1)} type="button">Previous</button>
            <span>Page {page + 1} of {pageCount}</span>
            <button className="admin-button secondary" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => value + 1)} type="button">Next</button>
          </div>
        </div>
      </section>
      {editing !== undefined && (
        <ContentEditor
          collection={collection}
          fields={fields}
          record={editing ?? undefined}
          saving={saving}
          onClose={() => setEditing(undefined)}
          onSave={save}
          onError={setError}
        />
      )}
    </>
  );
}

function ContentEditor({
  collection,
  fields,
  record,
  saving,
  onClose,
  onSave,
  onError,
}: {
  collection: ContentCollection;
  fields: Field[];
  record?: ContentRecord;
  saving: boolean;
  onClose: () => void;
  onSave: (form: FormData) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [preview, setPreview] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, toFieldValue(field, record)])),
  );
  const content = values.content ?? "";

  async function upload(file: File, input: HTMLInputElement) {
    const data = new FormData();
    data.set("file", file);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: data });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Upload failed.");
      const targetName = input.dataset.target;
      if (targetName) setValues((current) => ({ ...current, [targetName]: result.url ?? "" }));
    } catch (reason) {
      onError(reason instanceof Error ? reason.message : "Unable to upload media.");
    }
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="admin-card admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-heading">
        <header className="admin-topbar">
          <h2 id="editor-heading">{record ? "Edit content" : "Create content"}</h2>
          <button className="admin-button secondary" onClick={onClose} type="button">Close</button>
        </header>
        <form className="admin-form" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData();
          for (const [name, value] of Object.entries(values)) form.set(name, value);
          void onSave(form);
        }}>
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}
              {field.kind === "select" ? (
                <select name={field.name} value={values[field.name] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}>
                  {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : field.kind === "textarea" ? (
                <>
                  <textarea name={field.name} value={values[field.name] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} required={["content", "description", "excerpt"].includes(field.name)} />
                  {field.name === "content" && (
                    <>
                      <button className="admin-button secondary" onClick={() => setPreview((value) => !value)} type="button">{preview ? "Edit markdown" : "Preview"}</button>
                      {preview && <div className="admin-preview"><ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown></div>}
                    </>
                  )}
                </>
              ) : field.kind === "date" ? (
                <input name={field.name} type="datetime-local" value={values[field.name] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} />
              ) : (
                <>
                  <input
                    name={field.name}
                    type="text"
                    value={values[field.name] ?? ""}
                    required={["title", "slug", "category", "year"].includes(field.name)}
                    onChange={(event) => setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                      ...(field.name === "title" && !record && (collection === "posts" || collection === "projects") && !current.slug
                        ? { slug: slugify(event.target.value) }
                        : {}),
                    }))}
                  />
                  {field.help && <small>{field.help}</small>}
                  {field.kind === "file" && (
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      data-target={field.name}
                      aria-label={`Upload ${field.label}`}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          onError("Images must be smaller than 5 MB.");
                          return;
                        }
                        void upload(file, event.currentTarget);
                      }}
                    />
                  )}
                </>
              )}
            </label>
          ))}
          {record && typeof record.coverImage === "string" && record.coverImage.startsWith("http") && (
            <Image className="media-preview" src={record.coverImage} alt="Current cover" width={180} height={120} />
          )}
          <div className="admin-actions">
            <button className="admin-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            <button className="admin-button secondary" onClick={onClose} type="button">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}
