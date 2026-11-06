import Link from "next/link";

export default function NotFound() {
  return <main className="not-found section-wrap" id="contenido"><p className="eyebrow">/ 404</p><h1>Fuera de<br />encuadre.</h1><p>La página que buscas no está aquí.</p><Link className="action-link" href="/">↗ Volver al inicio</Link></main>;
}
