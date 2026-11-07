"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { navigation } from "@/content/site";
import { useSiteContent } from "./site-content";
import { BrandMark, RollingLink, Arrow } from "./ui";
import { Modal } from "./modal";

export function SiteHeader() {
  const { brand } = useSiteContent();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const compact = !isHome || scrolled;

  useEffect(() => {
    const measure = () => {
      const spacer = document.querySelector<HTMLElement>("[data-hero-spacer]");
      setScrolled(!spacer || spacer.getBoundingClientRect().bottom <= 0);
      const footer = document.querySelector("footer");
      setAtFooter(!!footer && footer.getBoundingClientRect().top < innerHeight * 0.4);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  return <>
    <header className={`site-header ${compact ? "is-compact" : "is-large"} ${atFooter ? "is-at-footer" : ""}`} inert={atFooter}>
      <motion.nav layout initial={isHome && !reduce ? { opacity: 0 } : false} animate={{ opacity: 1 }} aria-label="Navegación principal" className="site-nav" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 50, mass: 1, opacity: { type: "spring", duration: 2, bounce: 0.2, delay: 0.2 } }}>
        <motion.div layout className="site-nav__brand"><Link href="/" aria-label={`${brand.name} — inicio`}><BrandMark name={brand.name} /></Link></motion.div>
        <motion.div layout="position" className="site-nav__links">
          {navigation.map((item) => <RollingLink key={item.href} href={item.href}>{item.label}</RollingLink>)}
        </motion.div>
        <button className="menu-toggle" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(true)}><span /><span /></button>
      </motion.nav>
    </header>
    <Modal open={open} onClose={() => setOpen(false)} label="Menú de navegación" className="menu-dialog" drawer>
      <div className="menu-dialog__inside">
        <button className="close-button" aria-label="Cerrar menú" onClick={() => setOpen(false)}>×</button>
        <p className="menu-dialog__brand">{brand.name} / {brand.location}</p>
        <nav aria-label="Menú móvil">{navigation.map((item, index) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><span className="menu-dialog__index" aria-hidden="true">0{index + 1}</span>{item.label}<Arrow /></Link>)}</nav>
        <a className="menu-dialog__social" href={brand.instagram} target="_blank" rel="noopener noreferrer">Instagram <Arrow /></a>
        <p className="muted">Retrato. Boudoir. Parejas.<br />Tu historia, a tu manera.</p>
      </div>
    </Modal>
  </>;
}
