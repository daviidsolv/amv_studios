import Link from "next/link";
import { homeContent, services } from "@/content/site";
import { Arrow, PhotoImage, SectionHeading } from "./ui";
import { Reveal } from "./visual-effects";

export function Sessions() {
  return <section className="sessions section-wrap" id="sesiones">
    <Reveal><SectionHeading label="Sesiones" title={homeContent.sessionsTitle} centered /></Reveal>
    <Reveal><div className="sessions-grid">{services.map((service, index) => <article className="session-card" key={service.title}><p className="eyebrow">/ 0{index + 1}</p><div className="session-card__photos" aria-hidden="true">{service.photos.map((photo, i) => <div className={`session-photo session-photo--${i === 0 ? "left" : "right"}`} key={photo.src}><div className="session-photo__small"><PhotoImage photo={{ ...photo, alt: "" }} sizes="100px" /></div><div className="session-photo__preview"><PhotoImage photo={{ ...photo, alt: "" }} sizes="200px" /></div></div>)}</div><div className="session-card__text"><h3>{service.title}</h3><p>{service.description}</p><span className="eyebrow">{service.detail}</span></div><Link className="session-card__link" href="/contacto" aria-label={`Consultar sesión de ${service.title}`}><Arrow /></Link></article>)}</div></Reveal>
    <p className="sessions-note">¿Tienes otra idea? <Link href="/contacto">La escucho. ↗</Link></p>
  </section>;
}
