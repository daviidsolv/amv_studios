import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content-store";
import { ActionLink, PageHeading, PhotoImage } from "@/components/ui";
import { PhotoMosaic, Reveal, StoryCarousel } from "@/components/visual-effects";

export async function generateMetadata(): Promise<Metadata> {
  const { studioContent } = await getSiteContent();
  return { title: "El estudio", description: studioContent.statement };
}

export default async function StudioPage() {
  const { brand, studioContent, process } = await getSiteContent();
  return <main id="contenido" className="inner-page studio-page"><div className="section-wrap"><Reveal lift><PageHeading label="El estudio" title={studioContent.title} /></Reveal><div className="studio-intro"><Reveal className="studio-intro__image"><PhotoImage photo={studioContent.photo} sizes="(max-width:809px) 100vw, 50vw" preload /></Reveal><Reveal className="studio-intro__copy"><p className="eyebrow">/ {brand.name} — {brand.location.replace(/,.*$/, "")}</p>{studioContent.paragraphs.map((paragraph, index) => <p className="content-lines" key={index}>{paragraph}</p>)}<ActionLink href="/contacto">Cuéntame tu idea</ActionLink></Reveal></div><Reveal className="studio-statement"><span className="eyebrow">La forma de mirar lo cambia todo.</span><h2>{studioContent.statement}</h2></Reveal></div><PhotoMosaic /><section className="studio-process section-wrap"><Reveal><div className="studio-process__heading"><p className="eyebrow">/ Sin fórmulas</p><h2>Empezamos<br />por conocernos.</h2></div><StoryCarousel items={process} label="Cómo trabajamos" /></Reveal></section></main>;
}
