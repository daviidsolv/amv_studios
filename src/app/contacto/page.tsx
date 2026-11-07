import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content-store";
import { ActionLink, Arrow, PhotoImage } from "@/components/ui";
import { Reveal, StoryCarousel } from "@/components/visual-effects";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getSiteContent();
  return { title: "Hablemos", description: contact.introduction };
}

export default async function ContactPage() {
  const { brand, contact, faqs, services } = await getSiteContent();
  return <main id="contenido" className="contact-page"><section className="contact-hero"><div className="contact-hero__image"><PhotoImage photo={contact.photo} sizes="100vw" preload /></div><Reveal className="contact-panel" lift><p className="eyebrow">/ Tu próxima fotografía</p><h1>{contact.title}</h1><p className="contact-panel__intro content-lines">{contact.introduction}</p><div className="contact-types">{services.map((service, index) => <div key={service.title}><span>0{index + 1}</span><span>{service.title}</span><Arrow /></div>)}</div><ActionLink href={brand.instagram} external>Escríbeme en Instagram</ActionLink><div className="contact-panel__meta"><span>{brand.instagramHandle}</span><span>{brand.location}</span></div></Reveal></section><section className="faq-section section-wrap"><Reveal><p className="eyebrow">/ Por si te lo preguntabas</p><StoryCarousel items={faqs} label="Preguntas frecuentes" /></Reveal></section></main>;
}
