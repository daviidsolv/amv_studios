import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Photo } from "@/content/site";

export function Arrow({ direction = "up-right", className = "" }: { direction?: "up-right" | "down" | "left" | "right"; className?: string }) {
  return <svg className={`arrow arrow--${direction} ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function BrandMark({ className = "" }: { className?: string }) {
  return <svg className={`brand-mark ${className}`} viewBox="0 0 1150 190" fill="currentColor" role="img" aria-label="AMV Studio"><text x="0" y="166" fontSize="195" fontWeight="900" letterSpacing="-13" textLength="1140" lengthAdjust="spacing">AMV STUDIO</text></svg>;
}

export function PhotoImage({ photo, className = "", sizes = "(max-width: 809px) 100vw, 50vw", preload = false }: { photo: Photo; className?: string; sizes?: string; preload?: boolean }) {
  return <Image src={photo.src} alt={photo.alt} fill sizes={sizes} preload={preload} loading={preload ? "eager" : "lazy"} className={className} style={{ objectPosition: photo.position }} />;
}

export function RollingLink({ href, children, onClick, className = "" }: { href: string; children: ReactNode; onClick?: () => void; className?: string }) {
  return <Link href={href} className={`rolling-link ${className}`} onClick={onClick}><span>{children}</span><span aria-hidden="true">{children}</span></Link>;
}

export function ActionLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  return <Link href={href} className="action-link" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span className="action-link__icon" aria-hidden="true">↗</span><span>{children}</span></Link>;
}

export function SectionHeading({ label, title, centered = false, children }: { label: string; title: string; centered?: boolean; children?: ReactNode }) {
  return <div className={`section-heading ${centered ? "section-heading--centered" : ""}`}><p className="eyebrow">/ {label}</p><div className="section-heading__row"><h2>{title}</h2>{children}</div></div>;
}

export function PageHeading({ label, title }: { label: string; title: string }) {
  return <header className="page-heading"><span className="page-heading__arrow float-arrow"><Arrow direction="down" /></span><div className="page-heading__text"><p className="eyebrow">/ {label}</p><h1>{title}</h1></div></header>;
}
