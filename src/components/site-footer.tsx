import Link from "next/link";
import { brand, navigation, photos } from "@/content/site";
import { BrandMark, PhotoImage, RollingLink, Arrow } from "./ui";

export function SiteFooter() {
  return <footer className="site-footer" id="contacto">
    <div className="site-footer__photo"><PhotoImage photo={photos.soft} sizes="100vw" /></div>
    <div className="site-footer__content">
      <div className="footer-invitation"><p className="eyebrow">/ Hagamos una foto que sea muy tú</p><Link href="/contacto">¿Actualizamos<br />tu perfil?<Arrow /></Link></div>
      <div className="footer-top"><p>Fotografía con intención.<br />Barcelona, ES.</p><nav aria-label="Navegación de pie de página">{navigation.map((item) => <RollingLink key={item.href} href={item.href}>{item.label}</RollingLink>)}</nav></div>
      <div className="footer-meta"><p>© {new Date().getFullYear()} AMV Studio</p><p className="placeholder-note">Imágenes provisionales de referencia</p><a href={brand.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
      <Link href="/" className="footer-wordmark" aria-label="AMV Studio — volver al inicio"><BrandMark /></Link>
    </div>
  </footer>;
}
