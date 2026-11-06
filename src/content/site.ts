export type Photo = { src: string; alt: string; position?: string };
export type Category = "Retrato" | "Boudoir" | "Parejas";
export type Project = {
  id: string;
  title: string;
  category: Category;
  format: "landscape" | "portrait";
  photos: [Photo, Photo];
};

export const brand = {
  name: "AMV Studio",
  location: "Barcelona, ES",
  instagram: "https://www.instagram.com/studio__amv/",
  instagramHandle: "@studio__amv",
  description: "Fotografía en Barcelona. Retrato, boudoir, parejas y una forma más personal de mirar. ¿Quieres actualizar tu perfil? Escríbeme.",
};

export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "El estudio", href: "/estudio" },
  { label: "Portfolio", href: "/galeria" },
  { label: "Sesiones", href: "/#sesiones" },
  { label: "Hablemos", href: "/contacto" },
];

export const photos = {
  soft: { src: "/images/portrait-soft.jpg", alt: "Retrato de referencia con luz suave y fondo oscuro", position: "50% 38%" },
  sun: { src: "/images/portrait-sun.jpg", alt: "Retrato de referencia con iluminación azul y violeta", position: "50% 38%" },
  copper: { src: "/images/portrait-copper.jpg", alt: "Retrato de referencia con tonos cálidos y fondo terracota", position: "50% 38%" },
  light: { src: "/images/portrait-light.jpg", alt: "Retrato de referencia de luz natural y gesto espontáneo" },
  man: { src: "/images/portrait-man.jpg", alt: "Retrato masculino de referencia con luz natural" },
  couple: { src: "/images/couple-portrait.jpg", alt: "Fotografía de referencia de una pareja a contraluz" },
  moment: { src: "/images/couple-moment.jpg", alt: "Fotografía de referencia de un momento compartido en pareja" },
  editorial: { src: "/images/portrait-editorial.jpg", alt: "Fotografía editorial de referencia en exterior" },
} satisfies Record<string, Photo>;

export const homeContent = {
  hero: [photos.copper, photos.soft, photos.sun],
  eyebrow: "Una mirada personal / Barcelona",
  title: "Tu forma de ser. Otra forma de mirar.",
  introduction: [
    "Retrato, boudoir, parejas. Fotografías que empiezan en una conversación y encuentran algo que solo puede ser tuyo.",
    "Una nueva imagen para tu perfil. Un recuerdo de los dos. O, simplemente, una forma distinta de reconocerte. Tú traes la historia. Yo pongo la mirada.",
  ],
  studio: {
    title: "Menos posar. Más ser tú.",
    text: "Me interesa lo que pasa cuando dejas de pensar en la cámara. Un gesto, una pausa, una mirada que no estaba planeada.",
    photo: photos.soft,
  },
  portfolioTitle: "Hay historias que no necesitan palabras.",
  sessionsTitle: "Una sesión. Tu propia historia.",
  mosaicTitle: "Cada persona, un universo.",
  processPhoto: photos.copper,
};

// Fotografías y series de referencia; sustituir por los trabajos reales desde el futuro CMS.
export const projects: Project[] = [
  { id: "luz-propia", title: "Luz propia", category: "Retrato", format: "landscape", photos: [photos.sun, photos.copper] },
  { id: "piel-y-sombra", title: "Entre piel y sombra", category: "Boudoir", format: "portrait", photos: [photos.soft, photos.sun] },
  { id: "lo-que-nos-une", title: "Lo que nos une", category: "Parejas", format: "landscape", photos: [photos.couple, photos.moment] },
  { id: "sin-personajes", title: "Sin personajes", category: "Retrato", format: "portrait", photos: [photos.copper, photos.man] },
  { id: "otra-forma", title: "Otra forma de verte", category: "Boudoir", format: "landscape", photos: [photos.soft, photos.light] },
  { id: "dos-miradas", title: "Dos miradas, un instante", category: "Parejas", format: "portrait", photos: [photos.moment, photos.couple] },
  { id: "a-tu-manera", title: "A tu manera", category: "Retrato", format: "landscape", photos: [photos.man, photos.sun] },
  { id: "fuera-del-guion", title: "Fuera del guion", category: "Retrato", format: "portrait", photos: [photos.editorial, photos.copper] },
];

export const services = [
  {
    title: "Retrato",
    description: "Una foto que no solo se parece a ti. Una foto que habla de ti.",
    detail: "Para tu perfil. Para ti.",
    photos: [photos.sun, photos.man],
  },
  {
    title: "Boudoir",
    description: "Intimidad, luz y una manera de mirarte desde otro lugar.",
    detail: "Tu espacio. Tu ritmo.",
    photos: [photos.soft, photos.copper],
  },
  {
    title: "Parejas",
    description: "Eso que hay entre los dos, sin tener que explicarlo.",
    detail: "Lo cotidiano. Lo vuestro.",
    photos: [photos.couple, photos.moment],
  },
];

export const process = [
  { title: "Todo empieza con un hola.", text: "Cuéntame qué tienes en mente. Una sesión para ti, una historia compartida o esa foto que llevas tiempo imaginando. Empezamos por escucharnos.", label: "01 / La idea" },
  { title: "Encontramos tu forma.", text: "La luz, el lugar, el tono. Damos forma a una sesión que tenga sentido contigo, sin tener que convertirte en otra persona.", label: "02 / La mirada" },
  { title: "Dejamos que suceda.", text: "No hace falta tener todas las respuestas delante de la cámara. A veces las mejores imágenes aparecen en los momentos entre una foto y la siguiente.", label: "03 / El instante" },
];

export const faqs = [
  { title: "¿Necesito saber posar?", text: "No necesitas experiencia delante de una cámara. Cuéntame qué buscas y qué te hace sentir a gusto. La sesión parte de ahí.", label: "01 / Antes de la sesión" },
  { title: "¿Dónde hacemos la sesión?", text: "Barcelona es el punto de partida. Podemos hablar del ambiente y del lugar que mejor encajen con tu idea antes de concretar la sesión.", label: "02 / El lugar" },
  { title: "¿Cómo puedo reservar?", text: "Escríbeme por Instagram a @studio__amv. Dime qué tipo de sesión te interesa y lo que tienes en mente; hablamos de los detalles y las fechas.", label: "03 / Hablemos" },
];

export const studioContent = {
  title: "Una cámara. Muchas formas de ser tú.",
  paragraphs: [
    "AMV Studio es una mirada a las personas. A lo que muestran, a lo que sienten y a esos pequeños detalles que hacen que una imagen sea de alguien y no de cualquiera.",
    "Desde Barcelona, el retrato, el boudoir y la fotografía de parejas son tres maneras de acercarse a la misma idea: crear imágenes en las que puedas reconocerte.",
    "No siempre buscas una gran ocasión. A veces solo quieres actualizar tu perfil, guardar un momento o verte de una forma nueva. Ese también es un buen comienzo.",
  ],
  statement: "Una buena fotografía no te transforma en otra persona. Te permite verte de otra manera.",
};
