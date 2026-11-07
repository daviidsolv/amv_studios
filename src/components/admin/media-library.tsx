"use client";

import { useRef, useState } from "react";
import type { MediaItem } from "@/content/schema";
import { adminRequest, errorMessage } from "./api";

export function MediaLibrary({ items, used, onUpload, onDelete }: {
  items: MediaItem[]; used: Set<string>; onUpload: (item: MediaItem) => void; onDelete: (id: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    if (!file) { setError("Selecciona una fotografía para subir."); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Selecciona una fotografía JPG, PNG o WebP."); return; }
    if (file.size > 4 * 1024 * 1024) { setError("La fotografía debe pesar como máximo 4 MB."); return; }
    if (!alt.trim()) { setError("Describe la fotografía antes de subirla."); return; }
    const body = new FormData(); body.set("file", file); body.set("alt", alt.trim());
    setUploading(true);
    try {
      const { item } = await adminRequest<{ item: MediaItem }>("media", { method: "POST", body });
      onUpload(item); setFile(null); setAlt(""); if (input.current) input.current.value = "";
      setNotice("Fotografía subida. Ya puedes seleccionarla en el contenido o en una serie.");
    } catch (error) { setError(errorMessage(error)); }
    finally { setUploading(false); }
  }
  async function remove(item: MediaItem) {
    if (!confirm(`¿Eliminar «${item.filename}» de la biblioteca?`)) return;
    setError(""); setNotice(""); setDeleting(item.id);
    try { await adminRequest(`media/${item.id}`, { method: "DELETE" }); onDelete(item.id); setNotice("Fotografía eliminada de la biblioteca."); }
    catch (error) { setError(errorMessage(error)); }
    finally { setDeleting(null); }
  }
  return <div className="admin-stack"><section className="admin-panel"><div className="admin-panel__heading"><h2>Subir una fotografía</h2><p>JPG, PNG o WebP · Hasta 4 MB por imagen. Se optimiza automáticamente al subir.</p></div>
    <form className="admin-upload" onSubmit={upload}><fieldset disabled={uploading}><div className="admin-grid"><div className="admin-field"><label htmlFor="admin-upload-file">Archivo de imagen</label><input id="admin-upload-file" ref={input} type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(""); }} /></div>
      <div className="admin-field"><label htmlFor="admin-upload-alt">Descripción de la imagen</label><input id="admin-upload-alt" value={alt} maxLength={300} required placeholder="Por ejemplo: retrato con luz natural" onChange={(event) => setAlt(event.target.value)} /></div></div><button type="submit" className="admin-button" disabled={!file || uploading}>{uploading ? "Subiendo fotografía…" : "Subir fotografía"}</button></fieldset></form>
  </section>{error && <div className="admin-alert" role="alert">{error}</div>}{notice && <p className="admin-notice" role="status">{notice}</p>}
  <div className="admin-section-action"><h2>Tu biblioteca <span className="admin-count">{items.length}</span></h2><p>Selecciona estas imágenes desde cualquier campo de fotografía.</p></div>
  {items.length ? <div className="admin-media-grid">{items.map((item) => <article className="admin-media-card" key={item.id}><div className="admin-media-card__image"><img src={item.src} alt={item.alt} loading="lazy" />{used.has(item.src) && <span className="admin-badge">En el contenido</span>}</div><div className="admin-media-card__body"><h3 title={item.filename}>{item.filename}</h3><p>{item.alt}</p><small>{item.width} × {item.height} px · {Math.round(item.bytes / 1024).toLocaleString("es-ES")} KB</small>
    <button type="button" className="admin-text-button admin-danger" disabled={deleting !== null || used.has(item.src)} aria-label={`Eliminar ${item.filename}`} onClick={() => void remove(item)}>{deleting === item.id ? "Eliminando…" : "Eliminar"}</button></div></article>)}</div> : <div className="admin-empty admin-empty--large"><span className="admin-empty-icon">↥</span><h3>Tu próxima historia empieza aquí</h3><p>Sube tus primeras fotografías para sustituir las imágenes de referencia.</p></div>}
  <p className="admin-hint">Las fotografías en el contenido guardado o en tu borrador están protegidas frente al borrado. Guarda primero cualquier cambio que deje de utilizarlas.</p></div>;
}
