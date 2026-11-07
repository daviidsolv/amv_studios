"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collectImageSources, sectionKeys, siteContentSchema, type ContentSnapshot, type MediaItem, type SiteContent } from "@/content/schema";
import { AdminApiError, adminRequest, errorMessage } from "./api";
import { ContentEditor, SeriesEditor, ServicesEditor, StoriesEditor, type ChangeContent } from "./editors";
import { PhotoPicker, type Photo, type PickPhoto } from "./fields";
import { MediaLibrary } from "./media-library";

type Session = { authenticated: boolean; configured: boolean; username?: string };
const tabs = [
  { key: "overview", label: "Resumen", icon: "◫", description: "Tu estudio, de un vistazo." },
  { key: "content", label: "Contenido", icon: "≡", description: "Las palabras y las imágenes de tu web." },
  { key: "series", label: "Series", icon: "▧", description: "Historias que merecen su propio espacio." },
  { key: "services", label: "Sesiones", icon: "◇", description: "Tu manera de fotografiar, explicada." },
  { key: "process", label: "Proceso", icon: "↗", description: "Cómo acompañas cada sesión." },
  { key: "faqs", label: "Preguntas frecuentes", icon: "?", description: "Respuestas para quien está a punto de dar el paso." },
  { key: "media", label: "Biblioteca", icon: "▦", description: "Todas tus fotografías, en un solo lugar." },
] as const;
type Tab = typeof tabs[number]["key"];

function Wordmark() {
  return <div className="admin-wordmark"><span>AMV<span className="admin-wordmark__dot">.</span></span><small>Studio / Administración</small></div>;
}

export function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function checkSession() {
    setLoading(true); setError("");
    try { setSession(await adminRequest<Session>("session")); }
    catch (error) { setError(errorMessage(error)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void checkSession(); }, []);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoggingIn(true);
    try {
      await adminRequest("login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      setSession(await adminRequest<Session>("session")); setPassword("");
    } catch (error) { setError(errorMessage(error)); }
    finally { setLoggingIn(false); }
  }
  if (session?.authenticated) return <ContentManager username={session.username ?? username} logout={async () => {
    await adminRequest("logout", { method: "POST" }); setSession({ authenticated: false, configured: true });
  }} />;
  return <main id="contenido" className="admin-login"><div className="admin-login__intro"><Wordmark /><div><p className="admin-eyebrow">Detrás de cada imagen</p><h1>Tu mirada.<br />Tu espacio.</h1><p>Un lugar para cuidar las historias, las fotografías y los detalles de tu estudio.</p></div><span className="admin-login__caption">AMV Studio · Área privada</span></div>
    <div className="admin-login__form-wrap"><div className="admin-login__form">
      {loading ? <div role="status" className="admin-loading"><span className="admin-loader" />Comprobando acceso…</div> : !session ? <><h2>No se ha podido conectar</h2><div className="admin-alert" role="alert">{error}</div><button className="admin-button" onClick={() => void checkSession()}>Volver a intentar</button></> : !session.configured ? <><p className="admin-eyebrow">Configuración inicial</p><h2>Acceso pendiente de configuración</h2><p>Configura las credenciales del administrador, la clave de sesión y la conexión de datos en Netlify para habilitar este espacio.</p><p>Cuando estén preparadas, vuelve a comprobar el acceso. Las credenciales se entregan de forma privada.</p><button className="admin-button" onClick={() => void checkSession()}>Comprobar acceso</button></> : <><p className="admin-eyebrow">Bienvenido al estudio</p><h2>Inicia sesión</h2><p>Accede para actualizar tu web.</p><form onSubmit={login}><fieldset disabled={loggingIn} className="admin-stack"><div className="admin-field"><label htmlFor="admin-username">Usuario</label><input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required /></div><div className="admin-field"><label htmlFor="admin-password">Contraseña</label><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></div>{error && <div role="alert" className="admin-alert">{error}</div>}<button className="admin-button" type="submit">{loggingIn ? "Entrando…" : "Entrar"}<span aria-hidden="true">↗</span></button></fieldset></form></>}
      <a className="admin-back-link" href="/">← Volver a la web</a>
    </div></div></main>;
}

function ContentManager({ username, logout }: { username: string; logout: () => Promise<void> }) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<ContentSnapshot | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [picker, setPicker] = useState<((photo: Photo) => void) | null>(null);
  const dirty = !!content && !!snapshot && JSON.stringify(content) !== JSON.stringify(snapshot.content);
  const currentTab = tabs.find((item) => item.key === tab)!;
  const change: ChangeContent = (edit) => {
    setContent((current) => { if (!current) return current; const next = structuredClone(current); edit(next); return next; }); setSaved(false);
  };
  const pick: PickPhoto = (select) => setPicker(() => select);
  async function load() {
    setLoading(true); setError("");
    try {
      const [next, library] = await Promise.all([adminRequest<ContentSnapshot>("content"), adminRequest<{ items: MediaItem[] }>("media")]);
      setSnapshot(next); setContent(structuredClone(next.content)); setMedia(library.items); setConflict(false); setSaved(false);
    } catch (error) { setError(errorMessage(error)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!dirty) return;
    const protect = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!snapshot || !content || saving || !dirty) return;
    setError(""); setSaved(false);
    const parsed = siteContentSchema.safeParse(content);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const groups: Record<string, string> = { brand: "Contenido / General", photos: "Contenido / General", homeContent: "Contenido / Inicio", studioContent: "Contenido / Estudio", gallery: "Contenido / Galería", contact: "Contenido / Contacto", footer: "Contenido / Pie de página", projects: "Series", services: "Sesiones", process: "Proceso", faqs: "Preguntas frecuentes" };
      setError(`Revisa ${groups[String(issue.path[0])] ?? "el contenido"}: ${issue.message}`); return;
    }
    setSaving(true);
    try {
      const next = await adminRequest<ContentSnapshot>("content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: parsed.data, revision: snapshot.revision }) });
      setSnapshot(next); setContent(structuredClone(next.content)); setConflict(false); setSaved(true); router.refresh();
    } catch (error) { setError(errorMessage(error)); if (error instanceof AdminApiError && error.status === 409) setConflict(true); }
    finally { setSaving(false); }
  }
  const leave = async () => {
    if (dirty && !confirm("Tienes cambios sin guardar. ¿Cerrar sesión y descartarlos?")) return;
    setLoggingOut(true); setError("");
    try { await logout(); } catch (error) { setError(errorMessage(error)); setLoggingOut(false); }
  };
  const reload = () => { if (!dirty || confirm("¿Cargar la versión guardada? Se descartarán tus cambios sin guardar.")) void load(); };
  const used = collectImageSources({ saved: snapshot?.content, draft: content });
  return <div className="admin-shell"><aside className="admin-sidebar"><Wordmark /><p className="admin-nav-label">Gestionar el estudio</p><nav aria-label="Administración">{tabs.map((item) => <button type="button" key={item.key} aria-current={tab === item.key ? "page" : undefined} onClick={() => setTab(item.key)}><span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>{item.label}{item.key === "series" && <span className="admin-nav-count" aria-hidden="true">{content?.projects.length ?? "—"}</span>}</button>)}</nav><div className="admin-sidebar__bottom"><a href="/" target="_blank" rel="noopener noreferrer">Ver la web <span aria-hidden="true">↗</span></a><div className="admin-account"><span className="admin-avatar">{username.slice(0, 1).toUpperCase() || "A"}</span><span><strong>{username || "Administrador"}</strong><small>Administrador</small></span></div><button type="button" className="admin-text-button" disabled={loggingOut || saving} onClick={() => void leave()}>{loggingOut ? "Cerrando sesión…" : "Cerrar sesión"}</button></div></aside>
    <main id="contenido" className="admin-main"><header className="admin-topbar"><span>AMV Studio <span className="admin-topbar__divider">/</span> {currentTab.label}</span><div className="admin-save-actions"><span className={`admin-save-state${dirty ? " is-dirty" : ""}`} role="status"><i />{saving ? "Guardando…" : dirty ? "Cambios sin guardar" : saved ? "Cambios guardados" : "Todo al día"}</span><button className="admin-button admin-button--small" type="submit" form="admin-content-form" disabled={loading || saving || !dirty}>Guardar cambios</button></div></header>
      <div className="admin-workspace"><div className="admin-page-heading"><p className="admin-eyebrow">Tu espacio de trabajo</p><h1>{currentTab.label}</h1><p>{currentTab.description}</p></div>
        {error && <div role="alert" className="admin-alert">{error}{conflict && <><p>Tu borrador sigue aquí. Carga la versión guardada para revisar los cambios de la otra sesión.</p><button className="admin-button admin-button--secondary admin-button--small" type="button" onClick={reload}>Cargar versión guardada</button></>}</div>}
        {loading ? <div className="admin-loading" role="status"><span className="admin-loader" />Cargando tu estudio…</div> : !content || !snapshot ? <div className="admin-empty"><p>No se ha podido cargar el contenido.</p><button className="admin-button" type="button" onClick={() => void load()}>Volver a intentar</button></div> : <>
          <form id="admin-content-form" onSubmit={save}><fieldset className="admin-editor" disabled={saving || loggingOut}>
            {tab === "overview" && <Overview content={content} media={media} snapshot={snapshot} navigate={setTab} />}
            {tab === "content" && <ContentEditor content={content} change={change} pick={pick} />}
            {tab === "series" && <SeriesEditor content={content} change={change} pick={pick} />}
            {tab === "services" && <ServicesEditor content={content} change={change} pick={pick} />}
            {(tab === "process" || tab === "faqs") && <StoriesEditor content={content} change={change} kind={tab} />}
          </fieldset></form>
          {tab === "media" && <MediaLibrary items={media} used={used} onUpload={(item) => setMedia((items) => [item, ...items])} onDelete={(id) => setMedia((items) => items.filter((item) => item.id !== id))} />}
          <footer className="admin-workspace-footer"><span>AMV Studio · Tu mirada, al día.</span><span>Revisión {snapshot.revision}</span></footer>
        </>}
      </div>
    </main>{picker && <PhotoPicker items={media} onClose={() => setPicker(null)} onSelect={(photo) => { picker(photo); setPicker(null); }} />}
  </div>;
}

function Overview({ content, media, snapshot, navigate }: { content: SiteContent; media: MediaItem[]; snapshot: ContentSnapshot; navigate: (tab: Tab) => void }) {
  const visible = sectionKeys.filter((key) => content.sections[key]).length;
  return <div className="admin-stack"><section className="admin-welcome"><div><p className="admin-eyebrow">Todo empieza con una mirada</p><h2>Haz que tu web<br />hable de ti.</h2><p>Actualiza tus historias, prepara una nueva serie o da espacio a tus últimas fotografías.</p><button type="button" className="admin-button" onClick={() => navigate("series")}>Gestionar mis series <span aria-hidden="true">↗</span></button></div><div className="admin-welcome__photos" aria-hidden="true"><img src={content.homeContent.hero[0].src} alt="" /><img src={content.homeContent.hero[1].src} alt="" /></div></section>
    <div className="admin-stats">{[{ label: "Series en la galería", value: content.projects.length, target: "series" as Tab }, { label: "Fotografías subidas", value: media.length, target: "media" as Tab }, { label: "Apartados visibles", value: `${visible}/${sectionKeys.length}`, target: "content" as Tab }].map((stat) => <button key={stat.label} type="button" className="admin-stat" onClick={() => navigate(stat.target)}><span>{stat.label}</span><strong>{stat.value}</strong><span className="admin-stat-arrow" aria-hidden="true">↗</span></button>)}</div>
    <section className="admin-panel"><div className="admin-panel__heading"><h2>A tu ritmo, apartado a apartado</h2><p>Los cambios se publican al pulsar Guardar cambios.</p></div><div className="admin-quick-links">{[{ target: "content" as Tab, title: "Cuida tus palabras", description: "Títulos, textos, contacto y visibilidad." }, { target: "media" as Tab, title: "Prepara tus imágenes", description: "Sube fotografías y organízalas en tus series." }, { target: "services" as Tab, title: "Presenta tus sesiones", description: "Retrato, boudoir y parejas." }].map((item) => <button type="button" key={item.target} onClick={() => navigate(item.target)}><span><strong>{item.title}</strong><small>{item.description}</small></span><span aria-hidden="true">↗</span></button>)}</div></section>
    {content.settings.imagesArePlaceholders && <div className="admin-reference-note"><span aria-hidden="true">◎</span><div><strong>Tu web utiliza fotografías de referencia</strong><p>Sustitúyelas por tus trabajos y desactiva el aviso desde Contenido / General cuando estés listo.</p></div></div>}
    <p className="admin-hint">{snapshot.updatedAt ? `Último guardado: ${new Date(snapshot.updatedAt).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}.` : "El contenido inicial está listo para tu primera edición."}</p>
  </div>;
}
