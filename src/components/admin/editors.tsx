"use client";

import { useState } from "react";
import { categories, defaultContent, sectionKeys, type SiteContent } from "@/content/schema";
import { Field, PhotoField, SelectField, TextListEditor, type PickPhoto } from "./fields";

export type ChangeContent = (edit: (content: SiteContent) => void) => void;
type EditorProps = { content: SiteContent; change: ChangeContent; pick: PickPhoto };
const categoryOptions = categories.map((category) => ({ label: category, value: category }));
const sectionNames: Record<typeof sectionKeys[number], string> = {
  introduction: "Presentación", studio: "El estudio", portfolio: "Portfolio", sessions: "Sesiones", mosaic: "Mosaico de fotografías", process: "Cómo trabajamos", invitation: "Invitación de contacto",
};

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <section className="admin-panel"><div className="admin-panel__heading"><h2>{title}</h2>{description && <p>{description}</p>}</div><div className="admin-stack">{children}</div></section>;
}

export function ContentEditor({ content: c, change, pick }: EditorProps) {
  const [section, setSection] = useState("general");
  const tabs = [["general", "General"], ["home", "Inicio"], ["studio", "Estudio"], ["gallery", "Galería"], ["contact", "Contacto"], ["footer", "Pie de página"], ["visibility", "Visibilidad"]];
  return <><nav className="admin-subnav" aria-label="Apartados del contenido">{tabs.map(([key, label]) => <button key={key} type="button" aria-pressed={section === key} onClick={() => setSection(key)}>{label}</button>)}</nav>
    {section === "general" && <><Panel title="Identidad del estudio" description="Los datos que acompañan a tu marca en toda la web.">
      <div className="admin-grid"><Field label="Nombre del estudio" value={c.brand.name} onChange={(v) => change((d) => { d.brand.name = v; })} />
        <Field label="Ubicación" value={c.brand.location} onChange={(v) => change((d) => { d.brand.location = v; })} /></div>
      <Field label="Descripción del estudio" value={c.brand.description} multiline maxLength={500} onChange={(v) => change((d) => { d.brand.description = v; })} />
      <div className="admin-grid"><Field label="Usuario de Instagram" value={c.brand.instagramHandle} onChange={(v) => change((d) => { d.brand.instagramHandle = v; })} />
        <Field label="Enlace de Instagram" type="url" maxLength={2000} value={c.brand.instagram} onChange={(v) => change((d) => { d.brand.instagram = v; })} hint="Enlace completo con https://www.instagram.com/" /></div>
      <label className="admin-toggle"><input type="checkbox" checked={c.settings.imagesArePlaceholders} onChange={(e) => change((d) => { d.settings.imagesArePlaceholders = e.target.checked; })} /><span><strong>Mostrar aviso de imágenes de referencia</strong><small>Desactívalo cuando todas las fotografías sean tus trabajos reales.</small></span></label>
    </Panel><Panel title="Fotografías compartidas" description="Referencias visuales utilizadas en los mosaicos y composiciones del sitio.">
      {Object.entries(c.photos).map(([key, photo], index) => <PhotoField key={key} label={`Fotografía compartida ${index + 1}`} value={photo} pick={pick} onChange={(v) => change((d) => { d.photos[key as keyof SiteContent["photos"]] = v; })} />)}
    </Panel></>}
    {section === "home" && <><Panel title="Portada e introducción"><Field label="Texto superior" value={c.homeContent.eyebrow} onChange={(v) => change((d) => { d.homeContent.eyebrow = v; })} />
      <Field label="Título principal" value={c.homeContent.title} multiline onChange={(v) => change((d) => { d.homeContent.title = v; })} />
      {c.homeContent.hero.map((photo, index) => <PhotoField key={index} label={`Fotografía de portada ${index + 1}`} value={photo} pick={pick} onChange={(v) => change((d) => { d.homeContent.hero[index] = v; })} />)}
      <TextListEditor label="Presentación" items={c.homeContent.introduction} max={6} onChange={(v) => change((d) => { d.homeContent.introduction = v; })} />
    </Panel><Panel title="El estudio en el inicio"><Field label="Título del bloque de estudio" value={c.homeContent.studio.title} onChange={(v) => change((d) => { d.homeContent.studio.title = v; })} />
      <Field label="Texto del bloque de estudio" value={c.homeContent.studio.text} multiline maxLength={2000} onChange={(v) => change((d) => { d.homeContent.studio.text = v; })} />
      <PhotoField label="Fotografía del bloque de estudio" value={c.homeContent.studio.photo} pick={pick} onChange={(v) => change((d) => { d.homeContent.studio.photo = v; })} />
    </Panel><Panel title="Títulos de los apartados"><Field label="Título del portfolio" value={c.homeContent.portfolioTitle} onChange={(v) => change((d) => { d.homeContent.portfolioTitle = v; })} />
      <Field label="Título de las sesiones" value={c.homeContent.sessionsTitle} onChange={(v) => change((d) => { d.homeContent.sessionsTitle = v; })} />
      <Field label="Título del mosaico" value={c.homeContent.mosaicTitle} onChange={(v) => change((d) => { d.homeContent.mosaicTitle = v; })} />
      <PhotoField label="Fotografía del proceso" value={c.homeContent.processPhoto} pick={pick} onChange={(v) => change((d) => { d.homeContent.processPhoto = v; })} />
    </Panel></>}
    {section === "studio" && <Panel title="Página del estudio"><Field label="Título del estudio" value={c.studioContent.title} multiline onChange={(v) => change((d) => { d.studioContent.title = v; })} />
      <TextListEditor label="Texto del estudio" items={c.studioContent.paragraphs} max={8} onChange={(v) => change((d) => { d.studioContent.paragraphs = v; })} />
      <Field label="Frase destacada" value={c.studioContent.statement} multiline maxLength={500} onChange={(v) => change((d) => { d.studioContent.statement = v; })} />
      <PhotoField label="Retrato del estudio" value={c.studioContent.photo} pick={pick} onChange={(v) => change((d) => { d.studioContent.photo = v; })} />
    </Panel>}
    {section === "gallery" && <Panel title="Página de la galería" description="Gestiona los trabajos y sus fotografías desde Series."><Field label="Título de la galería" value={c.gallery.title} multiline onChange={(v) => change((d) => { d.gallery.title = v; })} />
      <Field label="Descripción de la galería" value={c.gallery.description} multiline maxLength={500} onChange={(v) => change((d) => { d.gallery.description = v; })} />
    </Panel>}
    {section === "contact" && <Panel title="Página de contacto"><Field label="Título de contacto" value={c.contact.title} multiline onChange={(v) => change((d) => { d.contact.title = v; })} />
      <Field label="Introducción de contacto" value={c.contact.introduction} multiline maxLength={2000} onChange={(v) => change((d) => { d.contact.introduction = v; })} />
      <PhotoField label="Fotografía de contacto" value={c.contact.photo} pick={pick} onChange={(v) => change((d) => { d.contact.photo = v; })} />
    </Panel>}
    {section === "footer" && <Panel title="Pie de página"><Field label="Invitación de contacto" value={c.footer.invitation} multiline onChange={(v) => change((d) => { d.footer.invitation = v; })} />
      <Field label="Texto sobre la invitación" value={c.footer.eyebrow} onChange={(v) => change((d) => { d.footer.eyebrow = v; })} />
      <PhotoField label="Fotografía del pie" value={c.footer.photo} pick={pick} onChange={(v) => change((d) => { d.footer.photo = v; })} />
    </Panel>}
    {section === "visibility" && <Panel title="Apartados visibles" description="Elige qué apartados aparecen en el inicio. El contenido se conserva cuando ocultas un apartado.">{sectionKeys.map((key) => <label className="admin-toggle" key={key}><input type="checkbox" checked={c.sections[key]} onChange={(e) => change((d) => { d.sections[key] = e.target.checked; })} /><span><strong>{sectionNames[key]}</strong><small>{c.sections[key] ? "Visible en la web" : "Oculto en la web"}</small></span></label>)}</Panel>}
  </>;
}

export function SeriesEditor({ content, change, pick }: EditorProps) {
  const [selectedId, setSelectedId] = useState(content.projects[0]?.id);
  const index = content.projects.findIndex((item) => item.id === selectedId);
  const project = content.projects[index];
  const move = (offset: number) => change((draft) => {
    const projects = draft.projects;
    [projects[index], projects[index + offset]] = [projects[index + offset], projects[index]];
  });
  return <><div className="admin-section-action"><p>{content.projects.length} series · El orden de esta lista es el de la galería.</p><button className="admin-button" type="button" disabled={content.projects.length >= 100} onClick={() => {
    const id = `serie-${crypto.randomUUID().slice(0, 8)}`;
    change((d) => { d.projects.push({ id, title: "Nueva serie", category: "Retrato", format: "portrait", photos: [{ ...defaultContent.photos.soft }] }); }); setSelectedId(id);
  }}>Nueva serie</button></div><div className="admin-series-layout"><div className="admin-series-list" aria-label="Lista de series">{content.projects.map((item, i) => <button type="button" key={item.id} aria-pressed={selectedId === item.id} onClick={() => setSelectedId(item.id)}>
    <span className="admin-series-number">{String(i + 1).padStart(2, "0")}</span><img src={item.photos[0].src} alt="" loading="lazy" /><span><strong>{item.title || "Sin título"}</strong><small>{item.category} · {item.photos.length} fotos</small></span>
  </button>)}{!content.projects.length && <div className="admin-empty">Crea tu primera serie para mostrarla en la galería.</div>}</div>
  {project ? <fieldset className="admin-panel admin-series-card" aria-label={project.title}><legend className="admin-sr-only">{project.title}</legend><div className="admin-panel__heading admin-row"><div><h2>{project.title || "Sin título"}</h2><p>Serie {index + 1} de {content.projects.length}</p></div><div className="admin-inline-actions">
    <button type="button" className="admin-button admin-button--secondary admin-button--small" disabled={index === 0} onClick={() => move(-1)} aria-label="Mover serie hacia arriba">↑</button>
    <button type="button" className="admin-button admin-button--secondary admin-button--small" disabled={index === content.projects.length - 1} onClick={() => move(1)} aria-label="Mover serie hacia abajo">↓</button>
    <button type="button" className="admin-text-button admin-danger" onClick={() => { if (confirm(`¿Eliminar la serie «${project.title}»? Las fotografías seguirán en la biblioteca.`)) { change((d) => { d.projects.splice(index, 1); }); setSelectedId(content.projects[index + 1]?.id ?? content.projects[index - 1]?.id); } }}>Eliminar serie</button>
  </div></div><div className="admin-stack"><Field label="Título de la serie" value={project.title} onChange={(v) => change((d) => { d.projects[index].title = v; })} />
    <div className="admin-grid"><SelectField label="Categoría" value={project.category} options={categoryOptions} onChange={(v) => change((d) => { d.projects[index].category = v as typeof project.category; })} />
      <SelectField label="Formato de portada" value={project.format} options={[{ label: "Vertical", value: "portrait" }, { label: "Horizontal", value: "landscape" }]} onChange={(v) => change((d) => { d.projects[index].format = v as typeof project.format; })} /></div>
    <p className="admin-hint">La primera fotografía será la portada. Puedes incluir entre 1 y 30 fotografías.</p>
    {project.photos.map((photo, photoIndex) => <div className="admin-series-photo" key={photoIndex}><PhotoField label={`Fotografía ${photoIndex + 1}${photoIndex === 0 ? " · Portada" : ""}`} value={photo} pick={pick} onChange={(v) => change((d) => { d.projects[index].photos[photoIndex] = v; })} />
      <div className="admin-inline-actions"><button type="button" className="admin-text-button" disabled={photoIndex === 0} onClick={() => change((d) => { const list = d.projects[index].photos; [list[photoIndex - 1], list[photoIndex]] = [list[photoIndex], list[photoIndex - 1]]; })}>Mover antes</button>
        <button type="button" className="admin-text-button" disabled={photoIndex === project.photos.length - 1} onClick={() => change((d) => { const list = d.projects[index].photos; [list[photoIndex], list[photoIndex + 1]] = [list[photoIndex + 1], list[photoIndex]]; })}>Mover después</button>
        <button type="button" className="admin-text-button admin-danger" disabled={project.photos.length <= 1} onClick={() => { if (confirm("¿Quitar esta fotografía de la serie?")) change((d) => { d.projects[index].photos.splice(photoIndex, 1); }); }}>Quitar fotografía</button></div>
    </div>)}<button type="button" className="admin-button admin-button--secondary" disabled={project.photos.length >= 30} onClick={() => pick((photo) => change((d) => { d.projects[index].photos.push(photo); }))}>Añadir fotografía</button>
  </div></fieldset> : <div className="admin-empty">Selecciona una serie para editarla.</div>}</div></>;
}

export function ServicesEditor({ content, change, pick }: EditorProps) {
  return <div className="admin-stack">{content.services.map((service, index) => <Panel title={service.title} key={index}><Field label={`Descripción de ${service.title}`} value={service.description} multiline maxLength={2000} onChange={(v) => change((d) => { d.services[index].description = v; })} />
    <Field label={`Detalle de ${service.title}`} value={service.detail} onChange={(v) => change((d) => { d.services[index].detail = v; })} />
    {service.photos.map((photo, photoIndex) => <PhotoField label={`Fotografía ${photoIndex + 1} de ${service.title}`} key={photoIndex} value={photo} pick={pick} onChange={(v) => change((d) => { d.services[index].photos[photoIndex] = v; })} />)}
  </Panel>)}</div>;
}

export function StoriesEditor({ content, change, kind }: Omit<EditorProps, "pick"> & { kind: "process" | "faqs" }) {
  const items = content[kind];
  const isFaq = kind === "faqs";
  return <div className="admin-stack">{items.map((item, index) => <Panel key={index} title={`${String(index + 1).padStart(2, "0")} · ${item.title || "Sin título"}`}>
    <Field label={isFaq ? "Pregunta" : "Título del paso"} value={item.title} onChange={(v) => change((d) => { d[kind][index].title = v; })} />
    <Field label={isFaq ? "Respuesta" : "Descripción del paso"} value={item.text} multiline maxLength={2000} onChange={(v) => change((d) => { d[kind][index].text = v; })} />
    <Field label="Etiqueta" value={item.label} onChange={(v) => change((d) => { d[kind][index].label = v; })} hint="Por ejemplo: 01 / Antes de la sesión" />
    <div className="admin-inline-actions"><button type="button" className="admin-text-button" disabled={index === 0} onClick={() => change((d) => { [d[kind][index - 1], d[kind][index]] = [d[kind][index], d[kind][index - 1]]; })}>Mover antes</button>
      <button type="button" className="admin-text-button" disabled={index === items.length - 1} onClick={() => change((d) => { [d[kind][index], d[kind][index + 1]] = [d[kind][index + 1], d[kind][index]]; })}>Mover después</button>
      <button type="button" className="admin-text-button admin-danger" disabled={items.length <= 1} onClick={() => { if (confirm(`¿Eliminar ${isFaq ? "esta pregunta" : "este paso"}?`)) change((d) => { d[kind].splice(index, 1); }); }}>Eliminar</button>
    </div>
  </Panel>)}<button type="button" className="admin-button admin-button--secondary" disabled={items.length >= (isFaq ? 15 : 10)} onClick={() => change((d) => { d[kind].push({ title: isFaq ? "Nueva pregunta" : "Nuevo paso", text: "", label: `${String(items.length + 1).padStart(2, "0")} / ${isFaq ? "La sesión" : "El proceso"}` }); })}>{isFaq ? "Añadir pregunta" : "Añadir paso"}</button></div>;
}
