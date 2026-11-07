# AMV Studio — dashboard y persistencia

**Petición:** El usuario ha desplegado AMV en Netlify y autoriza crear y conectar dashboard, base de datos y storage. Mantener el diseño público; plan gratuito, sin VPS ni Supabase.

**Decisión:** Netlify Database (Postgres administrado) para contenido, revisión, metadatos y límites de acceso. Netlify Blobs para fotografías WebP. Un administrador, sin registro público. Formularios en español, biblioteca de fotos y edición de apartados. Las credenciales iniciales se entregan en un archivo local ignorado por Git; solo su hash y la clave de sesión se configuran en Netlify.

## Interfaces compartidas

- `src/content/schema.ts`: `SiteContent`, `defaultContent`, `siteContentSchema`, `MediaItem`, `ContentSnapshot` (`{content,revision,updatedAt}`) y `sectionKeys`.
- `GET /api/admin/content`: ContentSnapshot. `PUT`: `{content,revision}`; 409 si hay una revisión posterior.
- `GET /api/admin/media`: `{items:MediaItem[]}`. `POST`: multipart `file`, `alt`; valida y optimiza. `DELETE /api/admin/media/[id]`: elimina solo imágenes no referenciadas.
- `POST /api/admin/login`: `{username,password}`. `POST /api/admin/logout`. `GET /api/admin/session`: `{authenticated:boolean,configured:boolean,username?:string}`.
- `GET /media/[filename]`: imágenes públicas del portfolio, nombres UUID y WebP; nunca acepta claves arbitrarias del almacenamiento.
- `getSiteContent()` en `src/lib/content-store.ts`: contenido público con caché e invalidación después de guardar. Sin conexión configurada, usa el contenido inicial para desarrollo local.
- `SiteContentProvider` / `useSiteContent()` en `src/components/site-content.tsx`: mismo contenido para todos los componentes públicos. El layout del admin no muestra la cabecera/efectos del portfolio.

## Trabajo

- [x] Implementar esquema y tests de validación y seguridad.
- [x] Implementar persistencia, migración, sesión, límites de acceso y API protegida.
- [x] Crear dashboard y biblioteca visual con edición y selección de imágenes.
- [x] Integrar contenido persistente en las cuatro páginas sin alterar su diseño.
- [ ] Verificar pruebas, build y revisión; desplegar primero una preview aislada y luego producción.
- [ ] Comprobar en producción login, guardado, subida y persistencia; entregar acceso y documentación.

## Restricciones y revisión

- Toda escritura exige sesión y origen válido. Cookie HttpOnly, SameSite y Secure en producción. No secretos en Git ni respuestas públicas.
- Validar JSON, tamaño/tipo/contenido real de imágenes; recodificar y retirar metadatos.
- Escrituras de contenido con control de revisión. Evitar borrado de recursos usados y carreras con guardados.
- Los previews no escriben en el storage de producción. Migraciones versionadas aplicadas por despliegue.
- No publicar fotos del usuario ni cambiar el contenido actual durante pruebas. Las pruebas alojadas utilizan recursos y documentos identificados de prueba en preview.
- Revisar galería vacía, una sola imagen, móvil, teclado y mensajes de error.

## Registro

- La CLI se ha autorizado con la intervención del usuario. Sitio existente: gorgeous-lebkuchen-5ba40e, conectado al repositorio daviidsolv/amv_studios. Plan Free, sin base de datos actualmente.
- Dashboard en español con biblioteca, editor de contenido, series ordenables, sesiones, proceso y FAQ. El diseño público conserva su composición y animaciones.
- Credenciales iniciales generadas en un archivo local ignorado por Git. Variables privadas configuradas mediante la CLI oficial, con ámbito Functions y contextos de producción y preview.
- Revisión independiente del backend realizada. Se reprodujo y corrigió un error de conexiones inactivas del pool; además se reprodujo y corrigió la validación de enlaces malformados. Los casos tienen pruebas de regresión.
- 2026-11-07: reanudado el trabajo; 20 pruebas correctas y build de producción completado. Pendiente la validación alojada antes de actualizar producción.
- Primer build remoto: detectada lectura prematura de tablas antes de la migración inicial. Se retrasa el acceso al contenido hasta la petición mediante `connection()`, manteniendo la caché compartida.
