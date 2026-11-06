import type { Metadata } from "next";
import { brand, faqs, photos, services } from "@/content/site";
import { ActionLink, Arrow, PhotoImage } from "@/components/ui";
import { Reveal, StoryCarousel } from "@/components/visual-effects";

export const metadata: Metadata = { title: "Hablemos", description: "¿Quieres actualizar tu perfil? Escríbele a AMV Studio. Sesiones de retrato, boudoir y parejas en Barcelona." };

export default function ContactPage() {
  return <main id="contenido" className="contact-page"><section className="contact-hero"><div className="contact-hero__image"><PhotoImage photo={photos.sun} sizes="100vw" preload /></div><Reveal className="contact-panel" lift><p className="eyebrow">/ Tu próxima fotografía</p><h1>Todo empieza<br />con un hola.</h1><p className="contact-panel__intro">¿Quieres actualizar tu perfil?<br />¿Una sesión para ti o para los dos?<br />Cuéntame lo que tienes en mente.</p><div className="contact-types">{services.map((service, index) => <div key={service.title}><span>0{index + 1}</span><span>{service.title}</span><Arrow /></div>)}</div><ActionLink href={brand.instagram} external>Escríbeme en Instagram</ActionLink><div className="contact-panel__meta"><span>{brand.instagramHandle}</span><span>Barcelona, ES</span></div></Reveal></section><section className="faq-section section-wrap"><Reveal><p className="eyebrow">/ Por si te lo preguntabas</p><StoryCarousel items={faqs} label="Preguntas frecuentes" /></Reveal></section></main>;
}
