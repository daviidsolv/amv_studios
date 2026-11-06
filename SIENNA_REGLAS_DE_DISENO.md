# Sienna — análisis y reglas para replicar el diseño

Referencia: [sienna.framer.media](https://sienna.framer.media/). Inspección realizada el **6 de noviembre de 2026**.

Este documento especifica la composición, tipografía, adaptación responsive y comportamiento de la web publicada. La prioridad de la réplica es conservar su escala editorial, ritmo de espacios y movimiento. Las fotografías concretas pueden sustituirse, pero sus proporciones, encuadres y relaciones cromáticas forman parte del resultado.

## 1. Método, alcance y grado de certeza

Se ha utilizado un navegador Chromium real en Windows, inspección del DOM y estilos calculados, lectura de los módulos públicos de Framer, registro de llamadas a Web Animations API y capturas antes y después de interacciones.

| Etiqueta | Significado |
| --- | --- |
| **Exacto** | Valor leído del CSS, configuración publicada o estado calculado del navegador. |
| **Observado** | Comportamiento reproducido en el navegador; no implica conocer toda su implementación interna. |
| **Derivado** | Fórmula o regla deducida de medidas y estructura verificadas. |
| **Propuesta** | Forma de implementarlo fuera de Framer; no es un dato atribuido al original. |

Cobertura:

- Home completa, cabecera inicial/compacta/oculta y footer.
- Interacciones de enlaces, tarjetas de galería y fotografías de servicios.
- Mosaico animado, testimonios, navegación entre páginas y visor ampliado de fotografías.
- Páginas de presentación, galería en cuadrícula y lista, artículos, contacto y una ficha representativa de proyecto y artículo.
- Formulario personal/comercial, menú móvil y preguntas frecuentes.
- Viewports de 1920×1080, 1440×1000, 1024×900, 810×1000, 809×1000, 768×1024 y 390×844.
- Una comprobación adicional con emulación táctil real del navegador: viewport y contenido de 390 px, sin hover.
- Comprobación de `prefers-reduced-motion: reduce` durante la entrada inicial.

**Convención de medidas:** salvo indicación contraria, los ejemplos de escritorio corresponden a un viewport de **1440×1000**, con **1425 px útiles** por la barra de desplazamiento de Windows. No se deben restar 15 px manualmente en la réplica: las fórmulas utilizan el ancho útil real del contenedor.

No se ha accedido al proyecto editable de Framer. Las clases generadas sirven para localizar evidencias, no deben convertirse en nombres de componentes de la nueva implementación.

## 2. Identidad visual: lo que debe conservarse

1. **Negro dominante y fotografía protagonista.** El soporte gráfico es casi monocromo; rojos, azules, violetas y tonos cálidos proceden de las imágenes.
2. **Contraste de escalas.** Logotipo enorme, titulares ligeros y grandes, metadatos muy pequeños.
3. **Mayúsculas en casi todo el sistema.** También en párrafos y etiquetas; mantenerlo al valorar longitud y saltos de línea.
4. **Mucho vacío entre bloques.** La separación entre secciones es una decisión principal del diseño.
5. **Composición asimétrica.** La galería alterna imágenes apaisadas y verticales, parejas y una tarjeta centrada.
6. **Curvas discretas.** Radios de 3–10 px, evitando convertir los contenedores en pastillas.
7. **Movimiento suave con resortes amortiguados.** Hay entradas largas de presentación, cambios de layout y movimientos continuos lentos.
8. **Profundidad mediante máscaras y desenfoque.** Incluye una capa fija de desenfoque progresivo en el borde inferior de la ventana.

No añadir gradientes cromáticos de interfaz, sombras grandes a todas las tarjetas, títulos ultranegritos, tarjetas uniformes ni efectos de rebote exagerados: alterarían la identidad observada.

## 3. Tokens de color y superficie

Valores **exactos** de los tokens publicados y estilos calculados:

| Función | Valor |
| --- | --- |
| Fondo principal | `#000000` |
| Texto principal | `#FFFFFF` |
| Texto secundario/metadatos | `#A3A3A3` |
| Fondo de tarjetas y menú | `#171717` |
| Superficie de previsualización | `#242424` |
| Gris adicional | `#3B3B3B` |
| Blanco tenue disponible como token | `rgba(255,255,255,0.10)` |
| Texto secundario sobre testimonios | `rgba(255,255,255,0.50)` |
| Separador del footer | `rgba(255,255,255,0.30)` |
| Fondo del panel de testimonios | `rgba(0,0,0,0.20)` |

**Detalle importante:** varios componentes contienen un fallback `rgb(15,15,15)` en su código, pero el token activo resuelve a **`#171717`**. Replicar el valor calculado, no el fallback.

La cabecera utiliza `mix-blend-mode: difference`. Por eso el texto puede verse claro sobre negro y adquirir colores invertidos al pasar sobre fotografías. No es un cambio de tema ni un hover azul.

Fuente: [estructura y tokens publicados](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/script_main.BYWBmQHe.mjs), contrastados con [estilos calculados](output/playwright/sienna-desktop-dom.json).

## 4. Tipografía

### 4.1 Familia y pesos

La tipografía visual principal es **DM Sans**.

- **400:** titulares, cuerpo, categorías, fechas y títulos de tarjetas.
- **600:** navegación y enlaces pequeños destacados.
- **900:** construcción tipográfica del gran logotipo del footer.
- El logotipo de cabecera es un **SVG**, no un título escrito con una fuente aproximada.
- **Inter** aparece en elementos auxiliares de la plantilla/Framer. No sustituir DM Sans por Inter en el contenido del sitio.

Se encontraron pesos y cursivas adicionales precargados; su presencia en la red no significa que todos se utilicen en la página visible.

### 4.2 Escala exacta

| Rol | Escritorio ≥1200 | Tablet 810–1199 | Móvil <810 | Peso | Interlineado / tracking |
| --- | --- | --- | --- | --- | --- |
| Titular principal de sección | 64 px | 52 px | 36 px | 400 | `1em`; `-0.03em` |
| Titular secundario / presentación | 50 px | 40 px | 30 px | 400 | `1em`; `-0.03em` |
| Subtítulo editorial intermedio | 32 px en escritorio | Depende de la plantilla | Depende de la plantilla | 400 | `1.3em`; normal |
| Título de tarjeta / servicio / testimonio | 20 px | 18 px | 16 px | 400 | `1.3em`; normal |
| Cuerpo y metadatos | 14 px | 14 px | 14 px | 400 | `1.4em` = 19.6 px |
| Navegación compacta | 14 px | Menú desplegable | Menú desplegable | 600 | `1em`; tracking 0 |

Los titulares de 64 px tienen tracking calculado de **−1.92 px**; los de 50 px, **−1.5 px**. En móvil, 36 px → −1.08 px y 30 px → −0.9 px.

**Reglas de composición tipográfica:**

- Usar `text-transform: uppercase`, manteniendo los textos originales en su formato semántico.
- Controlar los saltos mediante el ancho del bloque y el tamaño de fuente antes de introducir `<br>`.
- Mantener titulares a peso 400. El contraste con el logotipo pesado es esencial.
- Cuerpo compacto, alineado a la izquierda en descripciones y centrado sobre los grandes retratos.
- No aumentar automáticamente los 14 px del original sin reconocer que cambia la densidad de la réplica.
- Activar suavizado de fuente, coherente con el original.

Fuentes públicas: [DM Sans 400 y variantes](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/mL6GQfUAq.DGGh2Ti_.mjs), [DM Sans 600/900 y navegación](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/R1ugpzHpT.Bu5sNguc.mjs). Se conserva la declaración `@font-face` inspeccionada en [sienna-fonts.css](output/playwright/sienna-fonts.css).

### 4.3 Logotipos

**Cabecera:** SVG blanco. La URL del recurso lleva parámetros `width=1177&height=261`; estos parámetros no deben confundirse con la caja efectiva de layout. La caja de presentación observada es de **1365×324.17 px** en escritorio; incluye el ajuste interno del componente de imagen. Utilizar el SVG original o un wordmark propio preparado expresamente, y comprobar su caja visible.

**Footer:** texto DM Sans 900 ajustado al ancho disponible. El estilo base declara 64 px, interlineado `0.77em` y tracking `−0.07em`, pero Framer lo representa con un sistema de ajuste/escalado. En 1440 px la caja visible mide aproximadamente **1365×315 px**. Copiar solamente `font-size:64px` produciría un resultado incorrecto.

**Propuesta fuera de Framer:** usar un wordmark SVG para ambas escalas o ajustar el texto a su contenedor; conservar proporción, ancho y recorte visible. No deformar cada letra por separado.

## 5. Sistema de layout y espaciado

### 5.1 Breakpoints

Los límites **exactos** son:

```css
/* Móvil */
@media (max-width: 809.98px) { /* ... */ }
/* Tablet */
@media (min-width: 810px) and (max-width: 1199.98px) { /* ... */ }
/* Escritorio */
@media (min-width: 1200px) { /* ... */ }
```

El cambio 810 → 809 px produce una recomposición importante, no una reducción gradual de escala. Las consultas se basan en el viewport, aunque la barra de scroll reduzca el ancho de contenido.

### 5.2 Medidas comunes

| Regla | Escritorio | Tablet | Móvil |
| --- | --- | --- | --- |
| Margen interior lateral normal | 30 px | 30 px | 16 px |
| Separación vertical entre secciones de home | 200 px | 120 px | 70 px |
| Separación encabezado/contenido habitual | 50 px | 50 px | 30 px |
| Separación entre tarjetas de servicios | 10 px | 10 px | 10 px |
| Columnas de servicios | 3 | 2 | 1 |
| Fotos iniciales visibles | 3 | 3 | 1, la central |
| Galería de home | Filas asimétricas | Parejas más compactas | Una columna |
| Navegación horizontal completa | Sí | Menú | Menú |

Algunos contenedores internos tienen `max-width:1920px`. No hay un contenedor global de 1200 px que estreche toda la página. En escritorio las fotografías ocupan prácticamente el ancho completo, descontando los márgenes.

Los tamaños son principalmente fluidos y proporcionales. **No fijar toda la home a una altura de página determinada.** Como referencia, se midieron aproximadamente 12 801 px de alto en 1440×1000 y 15 662 px en 1920×1080. La emulación táctil 390×844 produjo aproximadamente 10 018 px.

### 5.3 Capas

| Elemento | Orden observado |
| --- | --- |
| Contenido normal y fotografías | Base |
| Texto sobre mosaico | `z-index:2` dentro de su sección |
| Desenfoque inferior fijo | `z-index:8` |
| Contenedor del visor de fotografías | `z-index:9` |
| Cabecera y menú | `z-index:10` |
| Ampliación de fotografías de servicios | `z-index:11` |

El cursor y las inserciones de Framer pueden utilizar portales o capas adicionales. Aislar correctamente la mezcla de colores de la cabecera: cambiar sus ancestros puede alterar `mix-blend-mode` aunque el color CSS siga siendo blanco.

## 6. Anatomía completa de la home

### 6.1 Cabecera gigante y reserva de espacio

Estado inicial de escritorio:

- Cinco enlaces repartidos horizontalmente de extremo a extremo.
- Padding superior/lateral de 30 px.
- Enlaces a 14 px/600.
- Separación de 20 px entre fila de navegación y bloque del logotipo.
- Logotipo de ancho prácticamente completo.
- Cabecera alojada en un contenedor fijo superior, con mezcla `difference`.
- Una reserva de espacio en el flujo evita que las fotos empiecen detrás del logotipo.

La reserva utiliza una proporción **3.6363636:1** en escritorio y **3.5217391:1** en tablet/móvil, con máximo de 1920 px. En el caso de escritorio observado mide aproximadamente 391.88 px.

En tablet/móvil se oculta la fila de enlaces inicial. El gran wordmark permanece. El control de menú aparece con la versión compacta de la cabecera.

Referencia visual: [cabecera inicial](output/playwright/sienna-desktop-top.png), [versión táctil](output/playwright/sienna-touch-390.png).

### 6.2 Tres retratos iniciales

Contenedor horizontal con separación **20 px**, padding lateral normal y tres columnas iguales de ancho.

| Fotografía | Proporción de caja exacta | Resultado |
| --- | --- | --- |
| Izquierda | `0.9175 / 1` | Más corta |
| Central | `0.665454545 / 1` | Vertical y más alta |
| Derecha | `0.9175 / 1` | Más corta |

Las tres se alinean por arriba. Radios de **10 px**, recorte oculto y fotografía llenando su caja. El espacio negro bajo las laterales es intencionado.

Con ancho útil `W` y margen `P`, el ancho de cada imagen de escritorio es **`(W − 2P − 40) / 3`**. Para W=1425, P=30: **441.67 px**. Alturas aproximadas: **481.38 / 663.70 / 481.38 px**.

En móvil desaparecen las dos laterales y la central ocupa todo el ancho interior. No convertir las tres en un carrusel.

La distorsión de luces y rastros en estas fotos está integrada en la imagen; no corresponde a un shader animado ni a un vídeo.

### 6.3 Presentación de dos columnas

Después de 200 px en escritorio:

- Flecha pequeña descendente en una columna estrecha a la izquierda, solo en escritorio.
- Declaración de presentación a 50 px, ancho máximo del texto observado de 550 px.
- A la derecha, indicador de disponibilidad, dos párrafos y enlace de contacto.
- Contenedor con gap de 50 px; columnas útiles observadas de aproximadamente 617.5 px.
- Bloque derecho con gap de 30 px; interior con gap de 20 px.
- Punto de estado de 8×8 px dentro de su soporte.

En tablet/móvil la composición se apila. El título secundario pasa a 40/30 px. Conservar 14 px y el interlineado compacto de los párrafos.

### 6.4 Gran retrato de presentación

- Imagen de extremo a extremo, sin padding lateral ni marco de tarjeta.
- Proporción de caja de escritorio **1.090909:1**; a 1425 px mide 1306.25 px de alto.
- Degradado de máscara inferior: transparencia en el borde bajo y opacidad total alrededor del 60%.
- Bloque de dos párrafos centrado sobre el tercio inferior y enlace subrayado.
- El bloque de texto aparece con opacidad y desplazamiento vertical de 20 px.
- En móvil la caja se vuelve mucho más vertical: se observaron 375×673.06 px en el viewport estrecho con scrollbar.

El gran tamaño del rostro y la máscara producen la sensación cinematográfica. No se verificó un parallax vertical independiente de esta fotografía; no atribuírselo por la apariencia de una captura.

Referencia: [retrato y texto superpuesto](output/playwright/sienna-scroll-2000.png).

### 6.5 Galería seleccionada: composición editorial

La home presenta cinco proyectos. No usa una cuadrícula uniforme ni un masonry automático.

Estructura de escritorio:

1. Primera fila: dos tarjetas del mismo ancho; izquierda apaisada y más baja, derecha vertical.
2. Segunda fila: una tarjeta centrada, con ancho del **40% del contenedor**.
3. Tercera fila: izquierda vertical; derecha apaisada y centrada verticalmente respecto a su compañera.

El contenedor y las parejas usan gap de **150 px** en escritorio. Para el ejemplo de 1365 px interiores: tarjetas de las parejas de **607.5 px**, tarjeta central de **546 px**.

Medidas de control, no alturas que deban imponerse de forma universal:

| Tarjeta | Ancho | Alto observado |
| --- | --- | --- |
| Primera, apaisada | 607.5 px | 552.27 px |
| Segunda, vertical | 607.5 px | 834.53 px |
| Central | 546 px | 538.81 px |
| Cuarta, vertical | 607.5 px | 834.53 px |
| Quinta, apaisada | 607.5 px | 552.27 px |

Cada tarjeta:

- Fondo `#171717`, radio exterior 10 px, padding 10 px.
- Imagen con radio **7 px** y `overflow:hidden`.
- Dos fotografías superpuestas para el hover.
- Detalles con padding de 20 px.
- Categoría y fecha en una misma fila; título debajo con separación de 10 px.
- Metadatos grises de 14 px, título de 20 px/400.
- Título limitado a un ancho observado de unos 300 px en escritorio.

En móvil: una columna, separación compacta, títulos de 16 px y detalles con padding `20px 10px 10px`. Mantener la alternancia de proporciones fotográficas.

Referencias: [galería en reposo](output/playwright/sienna-scroll-3300.png), [hover](output/playwright/sienna-gallery-hover.png), [móvil](output/playwright/sienna-mobile-1900.png). Fuente de interacción: [componente publicado de tarjeta](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/v8JOvYikC.CiFPjJiT.mjs).

### 6.6 Servicios

- Encabezado centrado; título con ancho observado de 700 px.
- Seis tarjetas: tres columnas en escritorio, dos en tablet, una en móvil.
- Gap de 10 px entre tarjetas.
- Fondo `#171717`, radio 10 px.
- Número arriba, pareja de fotos al centro, nombre del servicio abajo.
- Padding interior **50 px** en escritorio/tablet y **30 px** en móvil.
- Gaps verticales de **70 / 50 / 30 px** según variante.
- Título a **20 / 18 / 16 px**.

Las miniaturas miden **100×130 px** en escritorio, **80×100 px** en tablet y **50×60 px** en móvil. Se colocan inclinadas **−20° y +20°** desde el estado de reposo, con radio 5 px —3 px en móvil— y sombra oscura discreta.

**Corrección de interpretación:** no se abre toda la pareja al entrar en la tarjeta. El hover es individual sobre cada miniatura: se eleva 10 px y muestra su ampliación flotante. La inclinación base permanece.

Referencia: [servicios en reposo](output/playwright/sienna-scroll-6300.png), [hover y ampliación](output/playwright/sienna-service-hover.png). Configuración: [componentes de home](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/btmSy8mdUFov0IOc9vWTT5vXYRhtJ7OSvAg06OccUXE.BMMoB_ub.mjs).

### 6.7 Mosaico fotográfico continuo

- Tres bandas horizontales de fotografías en bucle.
- Cajas de aproximadamente **300×350 px** en el ejemplo de escritorio, con gap de 10 px y radio 5 px.
- Cada banda tiene una altura de **35vh** en escritorio; en móvil **30vh**.
- El conjunto usa una máscara radial elíptica: centro visible y desvanecimiento hacia los bordes.
- Encima se coloca un título grande alineado a la izquierda y un enlace con pequeño icono.
- El texto está centrado verticalmente sobre el conjunto, con padding lateral normal.
- La capa fotográfica combina movimiento automático y desplazamiento horizontal vinculado al scroll.

No reconstruirlo con una sola imagen estática del collage: se perderían la diferencia de velocidades, la continuidad y la respuesta al desplazamiento.

Referencia: [mosaico](output/playwright/sienna-scroll-7600.png). Fuente: [componente de bandas y parallax](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/K1MKv3b4E.Cfsjnfh6.mjs).

### 6.8 Testimonios

- Fotografía de fondo de extremo a extremo con máscara oscura inferior.
- Panel central de **550×500 px** en el ejemplo de 1440 px.
- Fondo negro al 20%, borde tenue, radio 10 px y desenfoque del fondo.
- Texto centrado, 20 px/26 px; nombre separado del cuerpo y rol en blanco al 50%.
- Dos controles inferiores de **40×40 px**, radio 5 px, gap de 10 px.
- Tres testimonios, uno visible cada vez.
- Avance manual por controles y arrastre; **autoplay desactivado**.
- Sin puntos de paginación.

No activar el autoplay porque exista un parámetro de intervalo de 1.5 s: la configuración efectiva contiene `autoPlayControl:false`.

Referencia: [panel de testimonios](output/playwright/sienna-testimonials.png). Fuente: [configuración de home](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/btmSy8mdUFov0IOc9vWTT5vXYRhtJ7OSvAg06OccUXE.BMMoB_ub.mjs).

### 6.9 Artículos destacados

- Etiqueta de sección pequeña, titular de 64 px y enlace para acceder al archivo.
- Una tarjeta destacada grande a la izquierda y dos más pequeñas a la derecha.
- En escritorio, la grande equivale aproximadamente a la mitad del ancho y las pequeñas a un cuarto cada una, descontando los gaps.
- Se repiten fondo, radios, metadatos y jerarquía de la galería.
- En móvil se apilan.
- No asumir que su hover cambia de fotografía: el componente de artículos es diferente del componente de proyectos.

### 6.10 Footer fotográfico

- Gran retrato de fondo de extremo a extremo.
- Transición de máscara/degradado hacia negro para que el texto se lea.
- Frase breve a la izquierda y navegación secundaria a la derecha.
- Línea horizontal tenue, copyright y redes sociales.
- Wordmark gigante al final, ajustado al ancho.
- La cabecera superior entra en su variante de retirada al llegar a esta zona: sus enlaces y logotipo se desvanecen para evitar duplicaciones.

Referencia: [footer](output/playwright/sienna-scroll-12000.png). Fuente: [layout global y footer](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/script_main.BYWBmQHe.mjs).

## 7. Catálogo de animaciones: reglas exactas de réplica

### 7.1 Presets identificados

Los siguientes valores proceden de la configuración publicada. Las duraciones están en **segundos**, salvo los registros de WAAPI, que usan milisegundos.

```js
const motionPresets = {
  nav: { type: "spring", stiffness: 300, damping: 50, mass: 1 },
  navTablet: { type: "spring", stiffness: 300, damping: 40, mass: 1 },
  linkRoll: { type: "spring", stiffness: 300, damping: 50, mass: 1 },
  reveal: { type: "spring", duration: 1.2, bounce: 0.2, delay: 0 },
  galleryImage: { type: "spring", stiffness: 300, damping: 60, mass: 1 },
  serviceLift: { type: "spring", duration: 0.45, bounce: 0.25 },
  servicePreview: { type: "spring", stiffness: 300, damping: 40, mass: 1 },
  slideshow: { type: "spring", stiffness: 200, damping: 40, mass: 1 },
  cursor: { type: "spring", duration: 0.4, bounce: 0.2 },
  menuSlide: { type: "spring", duration: 1, bounce: 0 },
  lightbox: { type: "spring", stiffness: 300, damping: 50, mass: 1 },
};
```

Estos presets no son una librería obligatoria ni código de aplicación validado: documentan los parámetros. Si se utiliza otra tecnología, reproducir la curva resultante y contrastarla visualmente.

**No confundir la salida compilada con el diseño del movimiento:** Framer puede generar muchos keyframes con `easing:linear`, o una función CSS `linear(...)` con decenas de muestras. La trayectoria resultante sigue siendo un **resorte**, no una interpolación lineal simple. Un `transition: all 1.2s linear` no reproduce estos efectos.

### 7.2 Secuencia de entrada inicial

| Elemento | Estado inicial → final | Delay | Transición |
| --- | --- | --- | --- |
| Cabecera/contenedor del wordmark | Opacidad 0.001 → 1; sin recorrido propio | 0.2 s | Spring 2 s, bounce 0.2 |
| Retrato izquierdo | `y:50 → 0`, opacidad 0.001 → 1 | 0.4 s | Spring 1.2 s, bounce 0.2 |
| Retrato central | `y:50 → 0`, opacidad 0.001 → 1 | 0.6 s | Spring 1.2 s, bounce 0.2 |
| Retrato derecho | `y:50 → 0`, opacidad 0.001 → 1 | 0.8 s | Spring 1.2 s, bounce 0.2 |
| Control comercial auxiliar de plantilla | `y:50 → 0`, opacidad 0.001 → 1 | 2 s | Spring 300/50/1 |

El stagger fotográfico es de **200 ms**. Las imágenes parten con escala 1 y rotación 0. No añadir zoom inicial ni efecto de máquina de escribir al logotipo.

Los controles de compra de plantilla y la insignia de Framer pertenecen a la demo y a su alojamiento. Se registran para interpretar las capturas; no forman parte de los componentes necesarios de un portfolio propio.

En móvil solo permanece la foto central y **conserva el delay de 0.6 s**.

La entrada está asociada al montaje/carga. Los reveals interiores son otra familia de comportamiento.

Evidencia: `__framer__appearAnimationsContent` en [DOM registrado](output/playwright/sienna-desktop-dom.json), contrastado con [registro de ejecución](output/playwright/sienna-runtime.json).

### 7.3 Cambio de cabecera al hacer scroll

**Estados:**

1. Grande: wordmark a ancho completo y enlaces repartidos arriba.
2. Compacta: wordmark de **120 px de ancho** a la izquierda, cinco enlaces a la derecha con gap de **30 px**.
3. Retirada: se desvanecen wordmark y enlaces al entrar en la zona final.

El cambio grande → compacto se dispara por el objetivo de scroll de la reserva inicial. Se midió el estado grande a `scrollY=390` y el compacto a `391`, con el viewport de referencia. Es un umbral dependiente del layout; **no debe programarse como `scrollY > 391` para todos los dispositivos**.

La transición utiliza animación de layout de Framer/Motion: tamaños y posiciones se interpolan con el resorte de navegación. El wordmark y los enlaces se recolocan como un conjunto; no hay que sustituirlos por dos cabeceras que aparezcan de golpe.

El estado compacto queda fijo arriba. La caja observada mide aproximadamente **58.48 px de alto**, con 30 px de separación superior y el wordmark visible de unos 28.48 px de alto. La mezcla de colores sigue activa.

El cambio de estado es **reversible** al volver arriba. La retirada del footer también debe poder revertirse al subir.

Evidencias: [umbrales](output/playwright/sienna-thresholds.json), [estados calculados](output/playwright/sienna-interactions.json), [configuración global](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/script_main.BYWBmQHe.mjs).

### 7.4 Enlaces con texto que rueda verticalmente

La navegación y varios enlaces subrayados contienen dos copias visuales del mismo texto dentro de una caja con `overflow:hidden`.

- Reposo: primera copia visible; segunda fuera de la ventana de recorte.
- Hover: la primera sube y la segunda ocupa su lugar.
- Salida: el mismo resorte devuelve ambas a reposo, desde el progreso actual.
- Preset: **stiffness 300, damping 50, mass 1**.
- La variante subrayada conserva su borde inferior de 1 px.

No es un desvanecimiento de texto, un subrayado dibujándose ni un desplazamiento por letras.

La estructura generada coloca la segunda copia con `top:181%` en reposo y modifica posiciones/transformaciones entre variantes. **Propuesta:** reproducir la ventana de recorte y la distancia real de una línea con dos spans, sin depender de los porcentajes internos de Framer.

Para accesibilidad, conservar una sola etiqueta legible por tecnologías de asistencia; marcar la copia de animación con `aria-hidden`.

Fuente: [componente público de enlace](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/UhrBAkLIo.BTn-Ji7Q.mjs).

### 7.5 Enlaces con icono triangular

Los CTA discretos combinan texto en mayúsculas y una caja de icono de **20×20 px**, con un triángulo interior de unos 14 px y separación de 10 px respecto al texto.

En hover se transforma el tratamiento de la caja del icono: aparece el fondo claro y se invierte el contraste del triángulo. La transición del componente utiliza resorte **300/30/1**. No convertir estos enlaces en grandes botones sólidos.

Fuente: [componente de CTA](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/XJyE3rFS9.B6lINoIe.mjs).

### 7.6 Reveals al entrar en la ventana

El comportamiento común de home utiliza:

- Activación con **threshold 0.5** en el wrapper concreto.
- **Una sola vez** por montaje de página (`animateOnce:true`).
- Resorte de **1.2 s**, bounce **0.2**, sin delay adicional.
- Muchos encabezados y grupos de galería hacen **solo opacidad 0 → 1**, sin desplazarse.
- Texto sobre el gran retrato y el panel de testimonios: **opacidad 0 → 1 y `y:20 → 0`**.

El umbral corresponde al wrapper animado, no necesariamente a la mitad de toda una sección muy alta. Aplicarlo indiscriminadamente a secciones de más de dos pantallas podría impedir que se active.

No asignar un `fade-up` de 50 px a todo el sitio. Los **50 px** pertenecen sobre todo a entradas iniciales de página/fotos; el interior mezcla fades puros y desplazamientos de **20 px**.

Las páginas internas vuelven a utilizar entradas iniciales de 50 px y delays escalonados. En la ficha de proyecto se identificaron delays de **0.4 / 0.5 / 0.6 / 0.7 s**, además de un reveal posterior con delay de 1 s.

Fuente: [home y sus wrappers animados](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/btmSy8mdUFov0IOc9vWTT5vXYRhtJ7OSvAg06OccUXE.BMMoB_ub.mjs).

### 7.7 Flecha descendente e indicador de disponibilidad

| Elemento | Recorrido | Tiempo | Repetición |
| --- | --- | --- | --- |
| Flecha de presentación de home | `y:0 ↔ 30px` | 1 s por trayecto | Mirror infinito, delay 0 |
| Flechas de cabeceras internas inspeccionadas | Recorrido de 30 px, con dirección según variante | 1 s por trayecto | Mirror infinito |
| Punto de disponibilidad | `scale:1 ↔ 2` | 1 s por trayecto | Mirror infinito, delay 0 |

La interpolación configurada es **lineal** para estos bucles, a diferencia de los resortes de entrada. Un ciclo de ida y vuelta dura aproximadamente 2 s.

La flecha de presentación de home se oculta en tablet/móvil. No confundir la ampliación pulsante del punto con un cambio de color de estado.

### 7.8 Hover de tarjetas de galería

Se superponen fotografía A y fotografía B dentro de la misma caja:

| Capa | Reposo | Hover |
| --- | --- | --- |
| A, inicial | `opacity:1; scale:1` | `opacity:0; scale:1.1` |
| B, alternativa | `opacity:0; scale:1.1` | `opacity:1; scale:1` |

- Resorte **stiffness 300 / damping 60 / mass 1**.
- La entrada de B añade un delay de **0.1 s**.
- El retorno vuelve a los valores base; el delay adicional no se impone indiscriminadamente a la salida.
- La imagen queda recortada por la caja con radio 7 px.
- La estructura de la tarjeta y sus detalles no saltan ni cambian de alto.

En el navegador, la opacidad se resolvió en animaciones WAAPI de unos **1050 ms**. Esa duración es el asentamiento calculado del resorte, no un `duration` original que sustituya a sus parámetros.

La navegación al proyecto se activa con el clic. El cursor cambia a una esfera con signo de ampliación mientras se recorre la tarjeta.

### 7.9 Hover de fotos de servicios y ampliación flotante

**Miniatura:** conserva su rotación de −20° o +20° y sube **10 px** con spring de **0.45 s**, bounce **0.25**.

**Ampliación:**

- Se ancla encima de la miniatura, centrada, con offset vertical **−10 px**.
- Entrada de `opacity:0, y:20` a `opacity:1, y:0`.
- Salida inversa.
- Resorte **300/40/1**.
- Caja de escritorio de **200×300 px**, fondo `#242424`, radio **8 px**.
- Padding **10px 10px 20px**.
- En móvil la variante publicada define **100×140 px**, padding **5px 5px 10px** y radio 5 px.
- Portal por encima del contenido, `z-index:11`.

La presencia de una variante móvil no demuestra que el hover funcione correctamente en una pantalla táctil física. No hacer que esta ampliación sea necesaria para entender o usar el servicio.

### 7.10 Bandas automáticas y parallax horizontal

Configuración exacta por orden visual:

| Banda | Dirección automática | Velocidad observada/derivada | Desplazamiento por objetivo de scroll |
| --- | --- | --- | --- |
| Superior | Izquierda | 20 px/s | `x:0 → −250px` |
| Central | Derecha | 10 px/s | `x:0 → +250px` |
| Inferior | Izquierda | 30 px/s | `x:0 → −250px` |

La velocidad en px/s se deduce del recorrido y duración reales de WAAPI: **3100 px / 155 s = 20 px/s**, **3100 / 310 s = 10 px/s**, **3100 / 103.333 s = 30 px/s**.

Reglas:

- Interpolación automática **lineal** y repetición infinita.
- Duplicar las secuencias suficientes veces para cerrar el bucle sin salto.
- Calcular la duración con la longitud real del ciclo: `duración = recorrido / velocidad`.
- Hover configurado como `hoverFactor:1`: **no se pausa ni ralentiza al pasar el puntero**.
- Máscara de desvanecimiento de cada banda: ancho configurado del 30%, alpha de borde 0.
- Máscara global: `radial-gradient(59% 50% at 50% 50%, black 0%, transparent 100%)`.
- El desplazamiento adicional está ligado a un objetivo de scroll, con threshold de viewport **0.5**.

**Propuesta:** separar el transform del wrapper de parallax del transform del track continuo. Si ambos escriben `transform` sobre el mismo elemento, una animación pisará a la otra.

### 7.11 Testimonios y FAQ: carruseles manuales

- Transición horizontal con spring **stiffness 200, damping 40, mass 1**.
- Un elemento visible; drag habilitado.
- Testimonios: gap 0 entre diapositivas.
- FAQ: gap configurado de **100 px**.
- Ambos tienen **autoplay desactivado** y puntos ocultos.
- Controles de 40 px, radio 5 px, colocados abajo en el centro.
- El cambio de contenido debe aceptar interrupciones o cambios rápidos de dirección.

Se verificó que el botón siguiente de testimonios cambia al segundo texto. No se ha certificado el comportamiento de cada gesto o de todas las teclas en todos los carruseles.

Las FAQ son preguntas y respuestas completas dentro de un carrusel; **no son un acordeón**.

Fuentes: [slideshow](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/SlideShow.DzZ_zcjb.mjs), [FAQ](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/IeiUDKb38.CiYGPCAF.mjs).

### 7.12 Cursor personalizado

Tres variantes publicadas:

| Estado | Medida | Apariencia |
| --- | --- | --- |
| Normal | 24×24 px | Círculo blanco, mezcla `difference` |
| Pulsado | 16×16 px | Círculo reducido |
| Abrir | 60×60 px | Fondo `rgba(18,18,18,0.3)`, blur 5 px, signo + |
| Cerrar | 60×60 px | Mismo material, icono de cierre |

El componente de cursor utiliza spring de **0.4 s**, bounce **0.2**, para sus cambios de estado. Esto **no permite asegurar** que el seguimiento de la posición del ratón use exactamente ese mismo resorte: ese seguimiento lo gestiona el runtime de Framer.

**Propuesta:** implementarlo solo con puntero fino, mantenerlo fuera del flujo y usar `pointer-events:none`. Su función es indicar la acción de las superficies fotográficas, no reemplazar el foco visible de teclado.

Fuente: [cursor publicado](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/shared-lib.Bbj09sNf.mjs).

### 7.13 Desenfoque progresivo fijo inferior

Este efecto explica por qué textos y fotos se desenfocan al entrar en la franja inferior de las capturas.

- Capa **fija al viewport**, pegada abajo, ancho 100%.
- Altura de **20% del viewport**.
- `pointer-events:none`.
- `z-index:8`.
- Intensidad final de **15 px** de `backdrop-filter:blur(...)`.
- Ocho capas superpuestas con máscaras lineales escalonadas.
- Intensidades desde arriba: **0.1171875, 0.234375, 0.46875, 0.9375, 1.875, 3.75, 7.5 y 15 px**.
- Las máscaras ocupan bandas progresivas, con hitos separados por 12.5%.

**No es un blur de entrada aplicado a cada tarjeta.** El contenido atraviesa una capa espacial fija. Animar el filtro individualmente según scroll en todas las imágenes produciría un comportamiento diferente.

Existe una transición de filtro de 0.3 s en el componente, pero la configuración observada mantiene intensidades estáticas. El movimiento visible procede principalmente del contenido desplazándose por debajo.

Fuente: función del gradiente de blur en [layout global](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/script_main.BYWBmQHe.mjs).

### 7.14 Menú de tablet y móvil

- Botón cuadrado de **40×40 px**, blanco, radio 3 px.
- Dos trazos negros en reposo; giran a **−45° / +45°** para formar el cierre.
- Cabecera compacta: wordmark a la izquierda y botón a la derecha.
- Offset de esquina de 30 px en tablet y 16 px en móvil.
- Panel desde la derecha: ancho **`min(100vw,400px)`**, alto 100%.
- Fondo `#171717`.
- Entrada/salida horizontal **`x:400 ↔ 0`**, opacidad **0 ↔ 1**, spring de **1 s, bounce 0**.
- Control de cierre: fade con spring de **0.4 s, bounce 0.2**.
- Enlaces principales en columna; bloque de redes debajo.
- El bloque principal del menú observado utiliza aproximadamente 22 px; redes a 14 px/600.
- Escape cierra el panel; se comprobó su retirada.

La configuración original declara `blockDocumentScrolling:false`. **Propuesta para una implementación propia:** conservar la apariencia y decidir de forma expresa bloqueo de scroll y gestión del foco, en lugar de heredar accidentalmente la conducta del runtime.

Referencias: [menú completo](output/playwright/sienna-mobile-menu.png), [estado a 150 ms](output/playwright/sienna-mobile-menu-150.png).

### 7.15 Vista de lista de la galería

La lista utiliza filas horizontales con cuatro zonas: índice, nombre del proyecto, categoría y fecha. Separadores finos, fondo negro y una altura habitual cercana a **60 px**, mayor cuando se parten metadatos.

Hover de fila:

- Aparece una previsualización fotográfica flotante, enmarcada en gris oscuro.
- Opacidad **0 → 1**.
- Rotación **0° → −10°**.
- Spring **300/40/1**.
- El recurso interior se dimensiona a unos **240 px de ancho**; la caja total es algo mayor por el marco.
- Cursor de apertura de 60 px sobre la fila.

No es el mismo crossfade de dos fotos de la vista de tarjetas. No se verificó una ley exacta de seguimiento continuo del puntero para esta previsualización; no inventarla.

Referencia: [lista](output/playwright/sienna-gallery-list.png), [hover de lista](output/playwright/sienna-gallery-list-hover.png). Fuente: [vista de lista](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/snWIWaB0KhoTRmjgJocUL-HZ8StO0WLoU5ttcxiUbOE.g6ZLE7ue.mjs).

### 7.16 Visor ampliado de fotografías de proyecto

Se verificó el clic sobre una imagen dentro de la ficha de proyecto:

- Se abre una capa fija a pantalla completa, sin cambiar de URL.
- Oscurecimiento del contenido inferior.
- Fotografía grande centrada, ajustada con comportamiento de contención para conservarla completa.
- En 1440×1000, área de imagen observada con márgenes de **30 px** y comienzo alrededor de **80 px** desde arriba; zona de controles inferior de **70 px**.
- Tira horizontal de miniaturas bajo la imagen.
- Cursor de cierre sobre la zona ampliada.
- Escape cierra el visor.

El contenedor entra por **opacidad 0 → 1**, con spring **300/50/1**. El fondo de oscurecimiento tiene un cambio configurado sin duración. No se encontró en esta interacción una obligación de hacer zoom desde el rectángulo original mediante un shared element.

Miniaturas: opacidad base **0.3**, activa **1**, hover **1 y scale 1.1**; spring de **0.6 s, bounce 0.2**.

Referencia: [visor abierto](output/playwright/sienna-project-image-open.png). Fuente: [plantilla pública de proyecto y visor](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/PfDbvdM1dX1i4RQCUlv1G9_OPOeTlYUfAm6uEI1LxiY.zsoxwsxA.mjs).

### 7.17 Navegación entre páginas

Al navegar desde el footer a la página de presentación se observó cambio de ruta, vuelta al inicio y entrada del contenido nuevo con desplazamiento de **50 px** que se asienta en su posición.

La cabecera de páginas internas permanece compacta desde el inicio. No se observó una cortina de transición, una barra de carga de página ni un zoom global de salida en el recorrido probado. No añadirlos como parte supuestamente original.

## 8. Páginas internas y reglas de sus plantillas

### 8.1 Patrón de cabecera interna

Las páginas de presentación, archivo y detalle comparten:

- Navegación compacta fija.
- Contenido que empieza alrededor de **200 px** desde arriba en escritorio.
- Padding lateral de 30 px.
- Columna estrecha para flecha y desplazamiento del texto principal hasta aproximadamente **x=110 px**.
- Etiqueta pequeña de sección encima del titular.
- Titular de 64 px/400, con anchos acotados según página —600, 750 o 900 px—.
- Separación de unos 100 px entre la cabecera de sección y el bloque siguiente en los archivos inspeccionados.

La ficha de proyecto añade tres grupos de metadatos; la de artículo utiliza dos. Los anchos del encabezado determinan si el titular ocupa una, dos o tres líneas.

### 8.2 Presentación / About

Estructura observada:

1. Cabecera editorial.
2. Retrato grande a la izquierda y texto descriptivo a la derecha.
3. Afirmación editorial de tamaño intermedio.
4. Gran imagen de estudio.
5. Trayectoria en bloques cronológicos.
6. Banda de clientes.
7. Mosaico fotográfico compartido.
8. FAQ en carrusel.
9. Footer fotográfico.

Se repiten gaps de sección de 200 px en escritorio. La primera sección utiliza gap interno de 100 px. No transformar esta página en una lista convencional de tarjetas iguales.

Referencia: [página de presentación](output/playwright/sienna-page-about.png), [continuación](output/playwright/sienna-about-body.png). Fuente visual: [página original](https://sienna.framer.media/about).

### 8.3 Galería completa

- `/gallery/grid`: repite la composición asimétrica del portfolio y la extiende al archivo completo.
- `/gallery/list`: filas densas de cuatro columnas con preview al hover.
- Selector flotante centrado abajo para alternar cuadrícula/lista.
- En escritorio, su caja observada ocupa aproximadamente **262×56 px**, a **30 px del borde inferior**.
- Iconos de vista de 32 px; seleccionado con fondo claro y símbolo oscuro.
- Fondo oscuro translúcido/material de panel.

**No copiar literalmente el contador de la demo:** se observó una etiqueta de 15 colecciones mientras la lista tenía índices hasta 17. En una réplica con contenido propio, calcular el número a partir de los registros efectivos.

La diferencia de vista es una navegación de ruta, no un filtro de categoría demostrado.

Fuentes: [cuadrícula](https://sienna.framer.media/gallery/grid), [lista](https://sienna.framer.media/gallery/list).

### 8.4 Ficha de proyecto

- Titular grande y metadatos de categoría, cliente y fecha.
- Imagen de apertura casi a ancho completo, con radio 10 px.
- Descripción editorial con columna de lectura acotada.
- Galería de imágenes en composición alterna: parejas de distinta proporción, una grande a ancho completo y nuevas parejas desplazadas.
- Grandes espacios entre filas; se observaron distancias y desniveles de 150 px.
- Visor ampliado de imágenes.
- Testimonio del cliente sobre gran imagen.
- Cierre con enlace destacado a la siguiente colección.

En la ficha inspeccionada, el cierre es el bloque de siguiente colección; **no se debe asumir que lleva exactamente el mismo footer de navegación de la home**.

Fuente: [ficha inspeccionada](https://sienna.framer.media/gallery/luminous-nights-a-disco-inspired-portrait).

### 8.5 Archivo y detalle de artículos

Archivo:

- Primera fila con una pieza grande y dos pequeñas.
- Repetición por grupos, manteniendo asimetría.
- Gaps observados de **100 px verticales y 20 px horizontales** en el contenedor del archivo.

Detalle:

- Cabecera interna con categoría/fecha.
- Fotografía de apertura a ancho casi completo.
- Columna de lectura central de aproximadamente **652.5 px** en el escritorio de referencia.
- Subtítulos editoriales de **32 px / 41.6 px** en los apartados observados.
- Párrafos en mayúsculas con la misma familia del sistema.
- Artículos relacionados y footer fotográfico.

Fuentes: [archivo](https://sienna.framer.media/articles), [artículo inspeccionado](https://sienna.framer.media/articles/the-art-of-light).

### 8.6 Contacto / Enquire

El fondo es un **vídeo**, no una fotografía con parallax:

- Vídeo observado de **4096×2160**.
- `autoplay`, `loop`, `muted` y `playsInline` activos.
- Ajuste `object-fit:cover`, centrado.
- Poster fotográfico disponible para carga o reproducción fallida.
- Fuente publicada: [vídeo de fondo](https://grainient.b-cdn.net/%40Grainient-Freebies/8358807-uhd_4096_2160_25fps.mp4).

Panel:

- Ancho de **700 px** en escritorio, centrado; posición superior observada de **70 px**.
- Padding de **50 px**, interior útil de 600 px.
- Radio de 10 px, fondo oscuro translúcido y **backdrop blur de 10 px**.
- Titular secundario de 50 px.
- Dos variantes seleccionables de formulario: personal y comercial; activo blanco e inactivo gris.
- Campos en parejas de dos columnas cuando el ancho lo permite.
- Inputs con fondo claro muy tenue, borde sutil, radio pequeño y alturas aproximadas de 49 px.
- Mensaje de 100 px de alto en la variante personal observada.

La variante comercial añade empresa, web, teléfono, tipo de proyecto y presupuesto, además de cambiar la organización de campos. La altura del panel crece; no debe quedar limitada a la altura de la variante personal.

Los campos señuelo invisibles de protección del formulario original no son elementos de layout a replicar. La prueba no incluyó envío ni verificación del servicio receptor.

Debajo aparecen el carrusel de preguntas frecuentes y el footer. La versión personal y comercial se comprobaron visualmente; no se atribuye una curva exacta al cambio de pestaña porque no se aisló su timeline completo.

Referencias: [personal](output/playwright/sienna-page-enquire.png), [comercial](output/playwright/sienna-commercial.png), [FAQ](output/playwright/sienna-faq.png). Fuente: [formulario y vídeo publicados](https://framerusercontent.com/sites/3IXn5NyP9R5Ns5ogVA1EWF/c11W8NdhoXDT7IHzSoyh3YmoTp2oc_dYjDylcK5CYdg.C82nalZU.mjs).

## 9. Reglas de imágenes, materiales e iconografía

### 9.1 Fotografía

- Retratos editoriales de alto contraste y encuadre cerrado.
- En portada, afinidad cromática roja entre las tres imágenes.
- En galería, alternancia de imágenes apaisadas y verticales y de colores fríos/cálidos.
- Mantener un punto focal coherente al recortar; no centrar mecánicamente una cara si el encuadre original la desplaza.
- Las imágenes A/B de un proyecto deben pertenecer a la misma sesión para que el hover comunique continuidad.
- Conservar las cajas y proporciones antes de que termine de cargar el recurso.
- Separar fotografía de contenido de fotografías decorativas de fondo.

El inventario inicial del DOM se guarda en [sienna-assets.json](output/playwright/sienna-assets.json). Es una lista de recursos encontrados en esa captura, no una descarga exhaustiva de todas las colecciones del CMS. Los componentes y registros de runtime conservan las referencias adicionales consultadas.

### 9.2 Materiales

- Tarjetas sólidas sobre negro: `#171717`, radio 10 px.
- Popovers fotográficos: `#242424`, radio 8 px, sombra contenida.
- Paneles sobre fotografía/vídeo: transparencia oscura y blur del fondo.
- Máscaras lineales en retratos grandes y footer.
- Máscara radial en el conjunto de bandas.

Evitar usar `opacity` sobre todo un panel para oscurecerlo, porque también apagaría su texto. Oscurecer fondo o añadir una capa independiente.

### 9.3 Iconos

- Trazos simples, blancos/negros.
- Flechas lineales y triángulos pequeños.
- Botón de menú de dos líneas, no tres.
- Signos +/× dentro del cursor de apertura/cierre.
- Flechas de carrusel dentro de cuadrados discretos.

## 10. Traducción a una implementación propia

Esta sección contiene **propuestas**, no dependencias exigidas por el original.

### 10.1 Estructura mínima de componentes

| Componente | Responsabilidad |
| --- | --- |
| Cabecera | Estados grande/compacto/retirada, menú y mezcla de colores |
| Enlace animado | Texto duplicado recortado y variante subrayada |
| Retratos iniciales | Proporciones y secuencia de entrada |
| Reveal | Activación por intersección, fade o fade+20 px |
| Tarjeta de proyecto | Dos fotografías y metadatos |
| Tarjeta de servicio | Miniaturas inclinadas y preview individual |
| Mosaico | Tres tracks continuos y wrappers de parallax |
| Carrusel | Testimonios y FAQ con distinta composición interior |
| Visor fotográfico | Imagen contenida, miniaturas y cierre |
| Desenfoque inferior | Única capa fija global con máscaras |
| Footer | Navegación, metadatos y wordmark ajustado |

Reutilizar los componentes existentes del proyecto de destino si ya cumplen estas funciones. No es necesario rehacer el runtime de Framer.

### 10.2 Separar las tres fuentes de movimiento

1. **Tiempo desde montaje:** secuencias iniciales y reveals una vez activados.
2. **Estado de interacción:** hover, menú, cursor, carruseles y visor.
3. **Progreso de scroll:** cambio de cabecera y parallax de bandas.

No conducir las tres con una única animación de scroll. Tampoco usar un temporizador para un efecto que debe seguir la posición de la página.

### 10.3 Rendimiento y adaptación

- Priorizar `transform` y `opacity` en tracks, fotos y overlays.
- Para el cambio de layout de cabecera, utilizar FLIP/animación de layout o transformaciones entre rectángulos medidos.
- No recalcular las posiciones de toda la galería cada frame.
- Parar o pausar trabajo invisible cuando proceda, conservando el estado continuo de las bandas.
- Mantener `pointer-events:none` en cursor, máscaras decorativas y desenfoque fijo.
- Prever imagen poster en vídeo y reservar sus dimensiones.
- Cargar antes las fotos de portada; diferir las de secciones lejanas y las alternativas de hover cuando no estén próximas.
- Probar específicamente el coste de las ocho capas de blur en dispositivos móviles.
- No instalar una dependencia solo para un fade. Elegir la herramienta de movimiento que ya utilice el proyecto si reproduce los resortes.

### 10.4 Accesibilidad: conservar apariencia, resolver interacción

| Referencia observada | Regla para una implementación propia | Motivo |
| --- | --- | --- |
| Textos duplicados para el efecto de rodillo | Una etiqueta accesible y copia visual `aria-hidden` | Evitar lecturas duplicadas |
| Cursor personalizado | Activarlo con puntero fino; conservar foco y cursor funcional alternativo | Compatibilidad con teclado y táctil |
| Menú y visor mediante portales | Botones semánticos, foco gestionado, Escape y retorno al disparador | Evitar perder la posición de navegación |
| Movimiento decorativo continuo | Variante de movimiento reducido y opción de pausa cuando corresponda | Reducir movimiento no esencial |
| Blur decorativo inferior | Evitar que oculte controles enfocados o información imprescindible | Legibilidad |

**Resultado real de movimiento reducido:** al activar la preferencia se siguieron registrando animaciones iniciales de `translateY(50px)` procedentes de la optimización de entrada. Más tarde el runtime emitió animaciones de opacidad sin ese recorrido. Por tanto, esta inspección no permite afirmar que la referencia suprima todo desplazamiento desde el primer frame. En la réplica, decidir el modo reducido antes de construir los keyframes: mostrar el layout final, omitir parallax/recorridos/bucles decorativos y conservar fades breves cuando sean útiles.

En pantallas táctiles, ninguna información esencial debe depender de la ampliación por hover. La emulación táctil verificó que el layout de 390 px no tenía desbordamiento horizontal; no sustituye a probar un teléfono físico.

## 11. Criterios de aceptación visual y de movimiento

### 11.1 Layout y fuente

- [ ] DM Sans cargada realmente; títulos a peso 400 y navegación a 600.
- [ ] Wordmark con dimensiones equivalentes al original en grande y compacto.
- [ ] Márgenes 30/16 px y breakpoints 1200/810.
- [ ] Separaciones de sección 200/120/70 px.
- [ ] Las fotos laterales de portada terminan antes que la central.
- [ ] Móvil conserva solamente la fotografía central de portada.
- [ ] Galería editorial de cinco tarjetas con proporciones y alineaciones distintas.
- [ ] Servicios en 3/2/1 columnas y parejas inclinadas desde reposo.
- [ ] Grandes retratos a ancho completo y máscaras de desvanecimiento.
- [ ] Footer con logotipo ajustado a ancho completo.
- [ ] No aparece scroll horizontal en 390, 768, 809, 810, 1024 y 1440 px.

### 11.2 Movimiento

- [ ] Entrada inicial con delays 0.2/0.4/0.6/0.8 s donde corresponden.
- [ ] Retratos parten de y=50 px, escala 1.
- [ ] Cabecera cambia al alcanzar su objetivo de scroll y revierte al subir.
- [ ] Links ruedan verticalmente dentro de una máscara, sin duplicación accesible.
- [ ] Hover de galería intercambia A/B con escalas opuestas y delay 0.1 s en B.
- [ ] Miniaturas de servicios suben 10 px y abren preview anclado encima.
- [ ] Bandas en direcciones izquierda/derecha/izquierda y velocidades 20/10/30 px/s.
- [ ] Parallax adicional 0→−250/+250/−250 px separado del bucle automático.
- [ ] Bucles continuos sin salto al cerrar una repetición.
- [ ] Testimonios y FAQ avanzan por control/drag y no por autoplay.
- [ ] Cursor cambia de tamaño y símbolo según la superficie.
- [ ] Capa de blur inferior permanece fija mientras pasa el contenido.
- [ ] Menú entra desde la derecha y se puede cerrar con Escape.
- [ ] Fotografía de proyecto abre visor sin cambiar de ruta.
- [ ] Cambio de pestaña del formulario admite su distinta altura.
- [ ] Preferencia de movimiento reducido resuelta antes de la primera entrada.

### 11.3 Cómo comparar

1. Fijar viewport, escala del navegador y ancho útil iguales.
2. Esperar a que se carguen fuentes e imágenes antes de comparar el layout asentado.
3. Capturar portada en reposo, cabecera compacta, galería, servicios, mosaico, testimonios y footer.
4. Reproducir la entrada desde una carga nueva, no solo desde recarga con scroll restaurado.
5. Revisar entradas en cámara lenta o por muestreo temporal.
6. Probar entrada/salida rápida de hover y reversión de menú antes de asentarse.
7. Comparar posición final y trayectoria: una captura final correcta no prueba la animación.
8. Validar en móvil físico el scroll, las capas con blur, el vídeo y las interacciones táctiles.

La mayor parte de la identidad se pierde si se uniforman las tarjetas, se comprimen los espacios, se engordan los titulares o se sustituye todo el movimiento por el mismo fade-up.

## 12. Evidencias y límites del análisis

### 12.1 Registros técnicos locales

| Archivo | Contenido |
| --- | --- |
| [DOM de escritorio](output/playwright/sienna-desktop-dom.json) | Cajas, estilos calculados, fuentes, scripts de aparición y breakpoints |
| [Runtime y scroll](output/playwright/sienna-runtime.json) | Keyframes/tiempos observados, módulos públicos y muestras de desplazamiento |
| [Interacciones](output/playwright/sienna-interactions.json) | Estados de cabecera, hover de galería/servicios y controles |
| [Responsive](output/playwright/sienna-responsive.json) | Medidas en seis anchos adicionales |
| [Menú y movimiento reducido](output/playwright/sienna-menu.json) | Menú abierto y animaciones con preferencia reducida |
| [Páginas internas](output/playwright/sienna-pages.json) | Secciones, tamaños, formularios y enlaces por plantilla |
| [Detalles adicionales](output/playwright/sienna-details.json) | Lista, comercial, FAQ, siguiente testimonio y emulación táctil |
| [Verificaciones finales](output/playwright/sienna-final-checks.json) | Footer, navegación real, vídeo y apertura del visor |
| [Umbrales y visor](output/playwright/sienna-thresholds.json) | Cambio de cabecera entre 390/391 px y configuración de la ficha |
| [Fuentes](output/playwright/sienna-fonts.css) | Declaraciones públicas de las fuentes consultadas |
| [Inventario inicial de imágenes](output/playwright/sienna-assets.json) | URLs y dimensiones naturales encontradas en el DOM inicial |

### 12.2 Qué está comprobado y qué queda fuera

**Comprobado:** layout y tipos calculados; breakpoints; estados de navegación; secuencia inicial; parámetros publicados de resortes; crossfade de galería; miniatura/preview de servicios; bandas y parallax; siguiente testimonio; menú móvil y Escape; lista y preview; variantes del formulario; existencia/configuración del vídeo; apertura de visor de proyecto; ausencia de overflow en la emulación táctil de 390 px.

**No comprobado exhaustivamente:** todos los registros del CMS, todos los gestos y teclas de cada carrusel, envío/entrega de formularios, interacción con herramientas de asistencia, Safari/Firefox, teléfonos físicos, rendimiento/FPS en hardware móvil y todos los posibles estados de error.

**No fijado como valor exacto:** ecuación de seguimiento del cursor, timeline completo del cambio de pestaña del formulario, curva detallada de cualquier transición no aislada y duración del vídeo deducida solo de su nombre de archivo.

**Criterio final de fidelidad:** conservar primero geometría, familia y pesos, proporciones fotográficas, secuencia de estados y relación entre movimientos. Después ajustar la implementación contra las capturas y registros; no sustituir valores verificados por una animación genérica que simplemente parezca suave.
