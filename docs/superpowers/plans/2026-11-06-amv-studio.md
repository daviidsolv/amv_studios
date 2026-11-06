# AMV Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un portfolio de fotografía en Next.js para AMV Studio, Barcelona, siguiendo la referencia Sienna aprobada.

**Architecture:** App Router con cuatro páginas, componentes visuales compartidos y contenido tipado en un único módulo. Fotografías placeholder locales y fuentes locales. Los cambios de estado utilizan Motion y las interacciones modales usan `dialog` nativo para foco/Escape.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Motion, Playwright.

**Spec:** `SIENNA_REGLAS_DE_DISENO.md` y petición del usuario: AMV Studio; retrato, boudoir y parejas; contacto `https://www.instagram.com/studio__amv/`; imágenes provisionales; administración más adelante.

## Global Constraints

- Mantener fondo negro, DM Sans, composición editorial y breakpoints de 810/1200 px.
- Preservar la secuencia, los resortes y las máscaras documentadas, adaptando el wordmark al branding.
- No inventar clientes, reseñas, premios, precios, disponibilidad ni dirección física.
- No implementar dashboard, base de datos ni formularios con envío ficticio.
- Centralizar textos, recursos y servicios para su futura sustitución por contenido administrable.

## Review Focus

- El menú y el visor deben cerrar con Escape y devolver el foco al elemento que los abrió.
- Los filtros de galería deben actualizar tanto las tarjetas como su contador.
- No debe haber desbordamiento horizontal ni interacciones esenciales basadas en hover en móvil.
- El modo reducido debe evitar recorridos y bucles desde el primer render.
- La aplicación debe compilar sin depender de descargar fuentes durante el build.

## Task 1: Base y contenido

- [x] Instalar las dependencias; ejecutar los tests contra el esqueleto para comprobar los fallos esperados.
- [x] Crear `src/content/site.ts`, imágenes placeholder locales y fuentes locales.
- [x] Completar layout, metadata, icono y estilos base.

## Task 2: Experiencia visual

- [x] Crear cabecera, menú, enlaces, reveals, cursor y blur inferior.
- [x] Construir home: retratos, presentación, banner de estudio, portfolio, sesiones, mosaico, proceso y footer.
- [x] Construir `/galeria`, `/estudio` y `/contacto` con contenido en español.

## Task 3: Interacción y validación

- [x] Implementar filtros, grid/lista y visor con miniaturas/teclado.
- [x] Implementar carrusel manual de proceso/FAQ y controles de pausa del mosaico.
- [x] Ejecutar Playwright, comprobación TypeScript y build.
- [x] Revisar capturas de escritorio/móvil, corregir problemas y realizar una revisión independiente de la implementación.

## Decisiones

- El documento de referencia y la orden de crear la app constituyen la dirección de diseño para esta fase. Se implementa directamente en el workspace nuevo, que no contiene un repositorio Git ni código existente.
- La entrega de esta fase es la aplicación Next.js local, con instrucciones de ejecución; no se sustituye por el starter Vinext del servicio de hosting.
- Se omiten artículos y testimonios de clientes porque no se han proporcionado contenidos reales para esos apartados.

## Registro

- Plan creado antes de implementar la experiencia. Esqueleto de Next y pruebas de comportamiento preparados.
- Se observaron tres fallos iniciales esperados sobre el esqueleto y posteriormente seis pruebas verdes, comprobación TypeScript y build de producción correctos.
- Revisión independiente de código y navegador realizada. Detectó un umbral de reveal demasiado alto para bloques grandes, superposición del menú en pantallas muy bajas y ausencia de cursor nativo en el visor. Se añadieron reproducciones antes de corregir las causas compartidas.
- Verificación final: nueve pruebas de Playwright correctas, TypeScript sin errores y build de producción completado. Las cuatro páginas se revisaron en cinco anchos (1440, 1024, 810, 809 y 390 px), sin desbordamiento horizontal. Los tres problemas de la revisión tienen pruebas de regresión correctas. Pendiente únicamente la validación en dispositivos físicos y Safari.
