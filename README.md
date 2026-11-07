# AMV Studio

Portfolio de fotografía en **Next.js 16, React 19 y TypeScript**, inspirado en [las reglas de diseño de Sienna](SIENNA_REGLAS_DE_DISENO.md). Textos en español y contacto enlazado a [@studio__amv](https://www.instagram.com/studio__amv/).

## Ejecutar

Necesita Node.js 20.9 o superior y npm.

```sh
npm install
npm run dev
```

Abrir [localhost:3000](http://localhost:3000). Para producción:

```sh
npm run build
npm start
```

## Incluido

- Inicio, portfolio, estudio y contacto.
- Cabecera de gran formato que se transforma al hacer scroll.
- Entradas escalonadas, enlaces de texto desplazado y cursor de ampliación.
- Galería con filtros, vistas cuadrícula/lista y visor con miniaturas, flechas y teclado.
- Tarjetas de sesión con fotografías inclinadas y ampliación al hover.
- Mosaico de tres bandas, distintas velocidades, parallax y control de pausa.
- Carruseles manuales de proceso y preguntas frecuentes.
- Menú móvil y visor con `dialog` nativo, Escape y restauración de foco.
- Preferencia de movimiento reducido, foco visible y adaptación a 810/1200 px.
- DM Sans y fotografías almacenadas localmente: no se descargan fuentes al compilar.

## Dashboard y contenido

El panel está en **`/admin`**. Permite editar textos, contacto, fotografías, series y su orden, sesiones, proceso, preguntas frecuentes y visibilidad de los apartados de inicio. Los cambios se publican al pulsar **Guardar cambios**. Un conflicto entre dos pestañas conserva el borrador y pide recargar la versión más reciente.

La persistencia utiliza **Netlify Database** para contenido y metadatos, y **Netlify Blobs** para imágenes. La migración versionada está en `netlify/database/migrations/`; Netlify la aplica durante el despliegue. El contenido inicial se mantiene en `src/content/site.ts` y se valida mediante `src/content/schema.ts`. Sin conexión configurada se usa ese contenido para desarrollar la web pública localmente; el panel requiere configuración real.

La biblioteca admite JPG, PNG y WebP de hasta **4 MB** y 40 megapíxeles. El servidor comprueba el archivo real, lo orienta, elimina metadatos y genera WebP de hasta 2560 píxeles. Una imagen recién subida es privada hasta que se referencia en el contenido guardado. No se puede retirar una imagen que siga utilizándose; al retirarla de la biblioteca se archiva su registro y se conserva el archivo para recuperación. Las imágenes publicadas son accesibles a los visitantes y pueden descargarse.

Las fotografías de referencia se identifican como provisionales; sus URLs de origen están en `public/images/SOURCES.md`. El aviso puede desactivarse desde **Contenido / General** cuando se hayan sustituido.

## Acceso y configuración de Netlify

Un solo administrador, sin registro público. La sesión utiliza una cookie cifrada HttpOnly, SameSite Strict y Secure en producción, con vencimiento de ocho horas. Hay un límite compartido de diez intentos de acceso cada quince minutos. Cambiar el hash de contraseña invalida las sesiones anteriores.

Variables privadas del proyecto en Netlify. En el plan Free, los secretos utilizan los ámbitos Builds, Functions y Runtime, excluyendo Post processing, y valores explícitos para producción y previews:

- `AMV_ADMIN_USERNAME`: nombre del administrador.
- `AMV_ADMIN_PASSWORD_HASH`: hash scrypt, nunca la contraseña original.
- `AMV_SESSION_SECRET`: secreto aleatorio de al menos 32 caracteres.
- `AMV_SITE_ORIGIN`: origen HTTPS de la web pública.
- `NETLIFY_DB_URL`: conexión administrada por Netlify Database; no se copia al código.

`node scripts/create-admin.mjs https://tu-sitio.netlify.app` genera credenciales en `output/private/`, ignorado por Git. No reemplaza unas credenciales existentes. Guardar el acceso en un gestor de contraseñas; no publicar estos archivos. Para usar un dominio nuevo, actualizar también `AMV_SITE_ORIGIN` en Netlify.

Los previews utilizan su rama de base de datos y otro nombre de almacén para las nuevas imágenes. Las credenciales se configuran también en el contexto de preview; el contenido del panel sigue protegido por sesión. No introducir fotos reales en previews de prueba.

`next.config.ts` incorpora únicamente metadatos públicos del despliegue (contexto, identificador y URL) para autorizar su origen y separar la caché y las imágenes de las previews. Ninguna contraseña, hash o clave de sesión se incorpora mediante esa configuración.

La cuenta permanece en el plan gratuito, con su cupo de uso y sin recargas de pago activadas por esta aplicación. Tráfico, despliegues y base de datos consumen recursos del plan; revisar el consumo en Netlify. Conservar aparte los originales y copias de seguridad del contenido importante.

## Comprobaciones

```sh
npm run check
npm test
npm run build
```

Las pruebas usan Chrome instalado y arrancan el servidor local si no está funcionando. Si no hay Chrome disponible, instalar el navegador de Playwright y retirar `channel: "chrome"` de `playwright.config.ts`.

Cobertura de comportamiento: navegación pública, galería y teclado, menú móvil, movimiento reducido, login del panel, edición y conflictos, selección de fotos, validación de archivos, rechazo de accesos anónimos y otros orígenes, y persistencia sobre Postgres local aislado. Las pruebas de base de datos no utilizan producción. Capturas de revisión en `output/playwright/` y adjuntos de Playwright.

La composición adapta la referencia al contenido real disponible: tres servicios, sin reseñas, clientes, precios, artículos o disponibilidad inventados. Se usa una imagen de fondo en contacto en lugar del vídeo de la demo. El blur inferior se retira al llegar al footer móvil para mantener legible el wordmark más horizontal de AMV Studio. Los reveals se activan al 15% de intersección para que los bloques altos también aparezcan en ventanas horizontales bajas.

La revisión táctil se ha realizado mediante emulación de navegador; queda pendiente la comprobación en teléfonos físicos y Safari.
