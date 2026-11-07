import { getSiteContent } from "@/lib/content-store";
import { ActionLink, Arrow, PhotoImage, RollingLink, SectionHeading } from "@/components/ui";
import { HeroPhotos, PhotoMosaic, Reveal, StoryCarousel } from "@/components/visual-effects";
import { Portfolio } from "@/components/portfolio";
import { Sessions } from "@/components/sessions";

export default async function Home() {
  const { brand, homeContent, process, sections, settings } = await getSiteContent();
  return <main id="contenido" className="home">
    <div className="hero-spacer" data-hero-spacer aria-hidden="true" />
    <section className="hero section-wrap" aria-label={`Fotografía de ${brand.name}`}><HeroPhotos /><div className="hero-caption"><p>Retrato. Boudoir. Parejas.</p><p>{brand.location} <span>41°23′N 2°10′E</span></p></div></section>
    {sections.introduction && <section className="introduction section-wrap home-section"><Reveal className="introduction__grid"><div className="introduction__title"><span className="float-arrow"><Arrow direction="down" /></span><div><p className="eyebrow content-lines">/ {homeContent.eyebrow}</p><h1>{homeContent.title}</h1></div></div><div className="introduction__copy"><p className="intro-kicker"><span className="status-dot" /> Personas, antes que poses.</p>{homeContent.introduction.map((paragraph, index) => <p className="content-lines" key={index}>{paragraph}</p>)}<ActionLink href="/galeria">Explorar el portfolio</ActionLink></div></Reveal></section>}
    {sections.studio && <section className="studio-banner home-section" id="estudio" aria-label={`La mirada de ${brand.name}`}><div className="studio-banner__image"><PhotoImage photo={homeContent.studio.photo} sizes="100vw" /></div><div className="studio-banner__top"><span>AMV / Una mirada personal</span><span>01 — 03</span></div><Reveal className="studio-banner__caption" lift><p className="eyebrow">/ El estudio</p><h2>{homeContent.studio.title}</h2><p className="content-lines">{homeContent.studio.text}</p><RollingLink href="/estudio" className="underlined">Conoce el estudio</RollingLink></Reveal></section>}
    {sections.portfolio && <section className="featured-work section-wrap home-section"><Reveal><SectionHeading label="Portfolio seleccionado" title={homeContent.portfolioTitle}><p className="section-aside">Personas reales.<br />Miradas diferentes.<br />{settings.imagesArePlaceholders && <span>Selección visual de referencia.</span>}</p></SectionHeading></Reveal><Portfolio featured /><div className="featured-work__more"><ActionLink href="/galeria">Ver el portfolio completo</ActionLink><span className="eyebrow">Seguir mirando ↓</span></div></section>}
    {sections.sessions && <div className="home-section"><Sessions /></div>}
    {sections.mosaic && <div className="home-section"><PhotoMosaic /></div>}
    {sections.process && <section className="process-banner home-section" aria-label="Así empieza una sesión"><div className="process-banner__image"><PhotoImage photo={homeContent.processPhoto} sizes="100vw" /></div><Reveal className="process-panel" lift><p className="eyebrow">/ La experiencia AMV</p><StoryCarousel items={process} label="El proceso de una sesión" /></Reveal></section>}
    {sections.invitation && <section className="last-word section-wrap home-section"><Reveal><p className="eyebrow">/ Barcelona. Tú. Una cámara.</p><h2>Hay una foto tuya<br />que todavía no existe.</h2><ActionLink href="/contacto">Hagámosla</ActionLink></Reveal></section>}
  </main>;
}
