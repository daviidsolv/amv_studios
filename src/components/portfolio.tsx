"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { SiteContent } from "@/content/schema";
import { useSiteContent } from "./site-content";
import { Arrow, PhotoImage } from "./ui";
import { Modal } from "./modal";
import { Reveal } from "./visual-effects";

type Project = SiteContent["projects"][number];
type Category = Project["category"];

function ProjectCard({ project, index, onOpen, list }: { project: Project; index: number; onOpen: () => void; list: boolean }) {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0.12 } : { type: "spring" as const, stiffness: 300, damping: 60, mass: 1 };
  return <article className={`project-card project-card--${project.format}`} data-project-card>
    <button className="project-card__button" onClick={onOpen} data-cursor="open" aria-label={`Ver fotografías de ${project.title}`} onPointerEnter={(event) => { if (event.pointerType === "mouse" && !list) setHovered(true); }} onPointerLeave={() => setHovered(false)}>
      <div className="project-card__image">
        <motion.div className="project-card__layer project-card__layer--default" animate={{ opacity: hovered ? 0 : 1, scale: hovered && !reduce ? 1.1 : 1 }} transition={transition}><PhotoImage photo={project.photos[0]} /></motion.div>
        <motion.div className="project-card__layer" animate={{ opacity: hovered ? 1 : 0, scale: hovered || reduce ? 1 : 1.1 }} transition={{ ...transition, delay: hovered && !reduce ? 0.1 : 0 }}><PhotoImage photo={{ ...(project.photos[1] ?? project.photos[0]), alt: "" }} /></motion.div>
        <span className="project-card__expand" aria-hidden="true">↗</span>
      </div>
      <div className="project-card__details"><div className="project-card__meta"><span>/ {project.category}</span><span>Serie {String(index + 1).padStart(2, "0")}</span></div><h3>{project.title}</h3><span className="project-card__list-arrow" aria-hidden="true"><Arrow /></span></div>
    </button>
  </article>;
}

function Lightbox({ project, open, onClose }: { project: Project; open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => { if (open) setIndex(0); }, [project, open]);
  const change = (step: number) => setIndex((value) => (value + step + project.photos.length) % project.photos.length);
  const activeIndex = index % project.photos.length;

  return <Modal open={open} onClose={onClose} label="Visor de fotografías" className="lightbox" onKeyDown={(event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); change(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); change(-1); }
  }}>
    <div className="lightbox__inside">
      <div className="lightbox__top"><p>{project.category} / {project.title}</p><button className="close-button" aria-label="Cerrar visor" onClick={onClose}>×</button></div>
      <div className="lightbox__image"><AnimatePresence initial={false}><motion.div key={activeIndex} className="lightbox__frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2 }}><PhotoImage photo={project.photos[activeIndex]} sizes="90vw" /></motion.div></AnimatePresence></div>
      <div className="lightbox__bottom"><div className="lightbox__thumbnails">{project.photos.map((photo, i) => <button key={i} aria-label={`Ver fotografía ${i + 1}`} aria-pressed={activeIndex === i} onClick={() => setIndex(i)}><PhotoImage photo={{ ...photo, alt: "" }} sizes="70px" /></button>)}</div><div className="carousel-controls"><button className="square-button" aria-label="Anterior fotografía" disabled={project.photos.length === 1} onClick={() => change(-1)}><Arrow direction="left" /></button><span className="carousel-count" aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(project.photos.length).padStart(2, "0")}</span><button className="square-button" aria-label="Siguiente fotografía" disabled={project.photos.length === 1} onClick={() => change(1)}><Arrow direction="right" /></button></div></div>
    </div>
  </Modal>;
}

export function Portfolio({ featured = false }: { featured?: boolean }) {
  const { projects } = useSiteContent();
  const [category, setCategory] = useState<Category | "Todos">("Todos");
  const [view, setView] = useState("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const selected = projects.find((project) => project.id === selectedId);
  const visible = (featured ? projects.slice(0, 5) : projects).filter((project) => category === "Todos" || project.category === category);

  return <div className={`portfolio ${featured ? "portfolio--featured" : ""}`}>
    {!featured && <div className="portfolio-toolbar"><div className="portfolio-filters" role="group" aria-label="Filtrar fotografías">{(["Todos", "Retrato", "Boudoir", "Parejas"] as const).map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><p className="portfolio-count" aria-live="polite">{String(visible.length).padStart(2, "0")} series</p><div className="view-toggle" role="group" aria-label="Vista de galería"><button aria-label="Vista de cuadrícula" aria-pressed={view === "grid"} onClick={() => setView("grid")}><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2 2h6v6H2zm10 0h6v6h-6zM2 12h6v6H2zm10 0h6v6h-6z" /></svg></button><button aria-label="Vista de lista" aria-pressed={view === "list"} onClick={() => setView("list")}><svg viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 4h16M2 10h16M2 16h16" /></svg></button></div></div>}
    <div className={`portfolio-grid ${view === "list" ? "portfolio-grid--list" : ""}`}>{visible.map((project) => <Reveal key={project.id} className="portfolio-item"><ProjectCard project={project} index={projects.indexOf(project)} list={view === "list"} onOpen={() => { setSelectedId(project.id); setOpen(true); }} /></Reveal>)}</div>
    {visible.length === 0 && <p className="muted" role="status">No hay series en esta selección.</p>}
    {selected && <Lightbox key={selected.id} project={selected} open={open} onClose={() => setOpen(false)} />}
  </div>;
}
