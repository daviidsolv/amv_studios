"use client";

import { useEffect, useId, useRef } from "react";
import { defaultContent, type MediaItem, type SiteContent } from "@/content/schema";

export type Photo = SiteContent["photos"]["soft"];
export type PickPhoto = (select: (photo: Photo) => void) => void;

export function Field({ label, value, onChange, multiline = false, maxLength = 180, type = "text", hint }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean;
  maxLength?: number; type?: string; hint?: string;
}) {
  const id = useId();
  const props = { id, value, maxLength, required: true, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return <div className="admin-field"><label htmlFor={id}>{label}</label>
    {multiline ? <textarea {...props} rows={4} /> : <input {...props} type={type} />}
    {hint && <small>{hint}</small>}
  </div>;
}

export function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options: readonly { value: string; label: string }[];
}) {
  const id = useId();
  return <div className="admin-field"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
  </select></div>;
}

export function PhotoField({ label, value, onChange, pick }: { label: string; value: Photo; onChange: (photo: Photo) => void; pick: PickPhoto }) {
  const position = (value.position ?? "50% 50%").split(" ").map((part) => parseInt(part));
  return <div className="admin-photo-field" role="group" aria-label={label}><p className="admin-field-label" aria-hidden="true">{label}</p><div className="admin-photo-field__body">
    <div className="admin-photo-preview"><img src={value.src} alt={value.alt} loading="lazy" style={{ objectPosition: value.position }} />
      <button type="button" className="admin-button admin-button--small" onClick={() => pick(onChange)}>Cambiar fotografía</button>
    </div>
    <div className="admin-photo-details"><Field label="Descripción de la fotografía" value={value.alt} maxLength={300} onChange={(alt) => onChange({ ...value, alt })} />
      <div className="admin-crop"><span>Encuadre</span>{["Horizontal", "Vertical"].map((axis, index) => <label key={axis}>{axis}<input aria-label={`Encuadre ${axis.toLowerCase()}`} type="range" min="0" max="100" value={position[index]} onChange={(event) => {
        const next = [...position]; next[index] = Number(event.target.value); onChange({ ...value, position: `${next[0]}% ${next[1]}%` });
      }} /><span>{position[index]}%</span></label>)}</div>
    </div>
  </div></div>;
}

export function TextListEditor({ label, items, max, onChange }: { label: string; items: string[]; max: number; onChange: (items: string[]) => void }) {
  return <div className="admin-stack"><p className="admin-field-label">{label}</p>{items.map((item, index) => <div className="admin-text-row" key={index}>
    <Field label={`Párrafo ${index + 1}`} value={item} multiline maxLength={2000} onChange={(value) => onChange(items.map((old, i) => i === index ? value : old))} />
    <button type="button" className="admin-text-button admin-danger" disabled={items.length <= 1} aria-label={`Eliminar párrafo ${index + 1}`} onClick={() => { if (confirm("¿Eliminar este párrafo?")) onChange(items.filter((_, i) => i !== index)); }}>Eliminar</button>
  </div>)}<button type="button" className="admin-button admin-button--secondary" disabled={items.length >= max} onClick={() => onChange([...items, ""])}>Añadir párrafo</button></div>;
}

export function PhotoPicker({ items, onSelect, onClose }: { items: MediaItem[]; onSelect: (photo: Photo) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  useEffect(() => { dialog.current?.showModal(); }, []);
  const select = (photo: Photo) => { dialog.current?.close(); onSelect(photo); };
  const references = Object.values(defaultContent.photos);
  return <dialog ref={dialog} className="admin-picker" aria-labelledby={title} onCancel={(event) => { event.preventDefault(); dialog.current?.close(); }} onClose={onClose}>
    <div className="admin-picker__header"><div><p className="admin-eyebrow">Biblioteca visual</p><h2 id={title}>Seleccionar fotografía</h2></div><button type="button" className="admin-button admin-button--secondary" onClick={() => dialog.current?.close()}>Cerrar</button></div>
    <div className="admin-picker__body"><h3>Tus fotografías <span>({items.length})</span></h3><p>Sube nuevas fotografías desde el apartado Biblioteca.</p>
      {items.length > 0 ? <div className="admin-picker-grid">{items.map((item) => <button type="button" key={item.id} aria-label={`Usar imagen ${item.filename}`} onClick={() => select({ src: item.src, alt: item.alt })}><img src={item.src} alt={item.alt} loading="lazy" /><span>{item.filename}</span></button>)}</div> : <div className="admin-empty">Todavía no has subido fotografías.</div>}
      <h3>Imágenes de referencia</h3><p>Disponibles mientras preparas tus fotografías definitivas.</p><div className="admin-picker-grid">{references.map((photo, index) => <button type="button" key={photo.src} aria-label={`Usar imagen de referencia ${index + 1}`} onClick={() => select({ ...photo })}><img src={photo.src} alt={photo.alt} loading="lazy" /><span>Referencia {String(index + 1).padStart(2, "0")}</span></button>)}</div>
    </div>
  </dialog>;
}
