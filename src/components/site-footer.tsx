"use client";

import Link from "next/link";
import { navigation } from "@/content/site";
import { BrandMark, PhotoImage, RollingLink, Arrow } from "./ui";
import { useSiteContent } from "./site-content";

export function SiteFooter() {
  const { brand, footer, settings } = useSiteContent();
  return <footer className="site-footer" id="contacto">
    <div className="site-footer__photo"><PhotoImage photo={footer.photo} sizes="100vw" /></div>
    <div className="site-footer__content">
      <div className="footer-invitation"><p className="eyebrow content-lines">/ {footer.eyebrow}</p><Link href="/contacto"><span className="content-lines">{footer.invitation}</span><Arrow /></Link></div>
      <div className="footer-top"><p>Fotografía con intención.<br />{brand.location}.</p><nav aria-label="Navegación de pie de página">{navigation.map((item) => <RollingLink key={item.href} href={item.href}>{item.label}</RollingLink>)}</nav></div>
      <div className="footer-meta"><p>© {new Date().getFullYear()} {brand.name}</p>{settings.imagesArePlaceholders && <p className="placeholder-note">Imágenes provisionales de referencia</p>}<a href={brand.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
      <Link href="/" className="footer-wordmark" aria-label={`${brand.name} — volver al inicio`}><BrandMark name={brand.name} /></Link>
    </div>
  </footer>;
}
