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

## Contenido y futuro dashboard

Los textos, el enlace de Instagram, las fotografías, categorías, series y sesiones están en **`src/content/site.ts`**. Las páginas consumen ese módulo; no hay una capa de datos ni una base de datos ficticia.

Para reemplazar imágenes ahora, copiar los archivos a `public/images/` y actualizar `src`, `alt` y, cuando proceda, `position` en ese archivo. Las imágenes de referencia se identifican como provisionales en la web; sus URLs de origen están en `public/images/SOURCES.md`.

En la siguiente fase se podrá conectar el contenido a una base de datos y almacenamiento, y añadir el dashboard con autenticación, subida de imágenes y edición de apartados. Esta fase no incluye cuentas, uploads ni rutas administrativas. El contacto abre el perfil real de Instagram; no se simula el envío de formularios.

## Comprobaciones

```sh
npm run check
npm test
npm run build
```

Las pruebas usan Chrome instalado y arrancan el servidor local si no está funcionando. Si no hay Chrome disponible, instalar el navegador de Playwright y retirar `channel: "chrome"` de `playwright.config.ts`.

Cobertura de comportamiento: navegación, contacto, filtros y contador, visor y teclado, cierre/restauración de foco, menú móvil, vista de lista, centrado de texto y movimiento reducido. Capturas de revisión en `output/playwright/amv-*.png`.

La composición adapta la referencia al contenido real disponible: tres servicios, sin reseñas, clientes, precios, artículos o disponibilidad inventados. Se usa una imagen de fondo en contacto en lugar del vídeo de la demo. El blur inferior se retira al llegar al footer móvil para mantener legible el wordmark más horizontal de AMV Studio. Los reveals se activan al 15% de intersección para que los bloques altos también aparezcan en ventanas horizontales bajas.

La revisión táctil se ha realizado mediante emulación de navegador; queda pendiente la comprobación en teléfonos físicos y Safari.
