"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { SiteContent } from "@/content/schema";
import { useSiteContent } from "./site-content";
import { ActionLink, Arrow, PhotoImage } from "./ui";

type Photo = SiteContent["photos"]["soft"];

export function Reveal({ children, className = "", lift = false }: { children: ReactNode; className?: string; lift?: boolean }) {
  const reduce = useReducedMotion();
  return <motion.div className={`reveal ${className}`} initial={reduce ? false : { opacity: 0, y: lift ? 20 : 0 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={reduce ? { duration: 0.15 } : { type: "spring", duration: 1.2, bounce: 0.2 }}>{children}</motion.div>;
}

export function HeroPhotos() {
  const { homeContent } = useSiteContent();
  const reduce = useReducedMotion();
  return <div className="hero-photos">{homeContent.hero.map((photo, index) => <motion.div key={index} className={`hero-photo hero-photo--${index === 1 ? "center" : "side"}`} initial={reduce ? false : { opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: 0 } : { type: "spring", duration: 1.2, bounce: 0.2, delay: 0.4 + index * 0.2 }}><PhotoImage photo={photo} preload={index === 1} sizes="(max-width:809px) 100vw, 34vw" /><span className="hero-photo__number" aria-hidden="true">0{index + 1} / AMV</span></motion.div>)}</div>;
}

export function ProgressiveBlur() {
  return <div className="progressive-blur" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ backdropFilter: `blur(${15 / 2 ** (7 - i)}px)`, WebkitBackdropFilter: `blur(${15 / 2 ** (7 - i)}px)`, maskImage: `linear-gradient(to bottom, transparent ${Math.max(0, i - 1) * 12.5}%, black ${i * 12.5}%, black ${(i + 1) * 12.5}%, transparent ${(i + 2) * 12.5}%)` }} />)}</div>;
}

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 50, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 600, damping: 50, mass: 0.5 });
  const [kind, setKind] = useState("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX); y.set(event.clientY); setVisible(true);
      setKind((event.target as Element).closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "default");
    };
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move); document.removeEventListener("mouseleave", leave);
      window.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  return <motion.div className={`custom-cursor custom-cursor--${kind}`} data-visible={visible} aria-hidden="true" style={{ x: sx, y: sy }}><motion.div className="custom-cursor__dot" animate={{ scale: kind === "open" ? 2.5 : pressed ? 0.67 : 1 }} transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}>{kind === "open" && <span>+</span>}</motion.div></motion.div>;
}

function MosaicRow({ images, speed, reverse, shift }: { images: Photo[]; speed: number; reverse?: boolean; shift: ReturnType<typeof useTransform<number, number>> }) {
  const cycle = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (cycle.current && track.current) track.current.style.animationDuration = `${cycle.current.getBoundingClientRect().width / speed}s`;
    });
    if (cycle.current) observer.observe(cycle.current);
    return () => observer.disconnect();
  }, [speed]);
  return <motion.div className="mosaic-row" style={{ x: shift }}><div ref={track} className={`mosaic-track ${reverse ? "mosaic-track--reverse" : ""}`} aria-hidden="true">{[0, 1, 2].map((copy) => <div className="mosaic-cycle" ref={copy === 0 ? cycle : undefined} key={copy}>{images.map((photo, index) => <div className="mosaic-tile" key={`${photo.src}-${index}`}><PhotoImage photo={{ ...photo, alt: "" }} sizes="300px" /></div>)}</div>)}</div></motion.div>;
}

export function PhotoMosaic() {
  const { brand, photos, homeContent } = useSiteContent();
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const left = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -250]);
  const right = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 250]);
  return <section ref={ref} className="mosaic" data-paused={paused} aria-label={`Más miradas de ${brand.name}`}>
    <div className="mosaic__mask"><MosaicRow images={[photos.soft, photos.copper, photos.sun, photos.man, photos.couple]} speed={20} shift={left} /><MosaicRow images={[photos.sun, photos.moment, photos.soft, photos.light, photos.copper]} speed={10} shift={right} reverse /><MosaicRow images={[photos.couple, photos.man, photos.copper, photos.sun, photos.soft]} speed={30} shift={left} /></div>
    <Reveal className="mosaic__content" lift><p className="eyebrow">/ Mucho más que una fotografía</p><h2>{homeContent.mosaicTitle}</h2><ActionLink href="/galeria">Descubrir todas las miradas</ActionLink></Reveal>
    <button className="mosaic__pause" onClick={() => setPaused(!paused)} aria-label={paused ? "Reanudar movimiento" : "Pausar movimiento"} aria-pressed={paused}>{paused ? "▷ Reanudar" : "Ⅱ Pausar"}</button>
  </section>;
}

export function StoryCarousel({ items, label }: { items: { title: string; text: string; label: string }[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();
  const change = (step: number) => { setDirection(step); setIndex((value) => (value + step + items.length) % items.length); };
  const activeIndex = index % items.length;
  const item = items[activeIndex];
  return <div className="story-carousel" role="region" aria-roledescription="carrusel" aria-label={label}>
    <div className="story-carousel__window" aria-live="polite" aria-atomic="true"><AnimatePresence initial={false} custom={direction} mode="popLayout"><motion.div key={activeIndex} className="story-carousel__slide" custom={direction} variants={{ enter: (dir: number) => ({ x: reduce ? 0 : `${dir * 100}%`, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (dir: number) => ({ x: reduce ? 0 : `${dir * -100}%`, opacity: 0 }) }} initial="enter" animate="center" exit="exit" transition={reduce ? { duration: 0.12 } : { type: "spring", stiffness: 200, damping: 40, mass: 1 }} drag={reduce ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 45 || Math.abs(info.velocity.x) > 350) change(info.offset.x < 0 ? 1 : -1); }}><p className="eyebrow content-lines">{item.label}</p><h3>{item.title}</h3><p className="content-lines">{item.text}</p></motion.div></AnimatePresence></div>
    <div className="carousel-controls"><button className="square-button" aria-label="Anterior" onClick={() => change(-1)}><Arrow direction="left" /></button><span className="carousel-count">{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span><button className="square-button" aria-label="Siguiente" onClick={() => change(1)}><Arrow direction="right" /></button></div>
  </div>;
}
