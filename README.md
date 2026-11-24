# Mecánica William — web

Sitio de una sola página para Mecánica William / William Rally Group, hecho con React y Vite.

## Cómo correrlo

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # versión final en dist/
npm run preview   # para ver el build
```

## Publicación (Cloudflare Pages)

La web se publica sola en Cloudflare Pages cada vez que se hace `git push` a `main`, desde el repo `Ferlara02/mecanicawilliam`.

- Rama `main` → producción.
- Cualquier otra rama → versión de prueba con su propia URL (sirve para mostrar cambios antes de publicarlos).
- Configuración en Cloudflare: comando de build `npm run build`, carpeta de salida `dist`. La versión de Node está fijada en `.node-version`.
- `public/_headers` define la caché de los archivos y algunas cabeceras de seguridad.

## Dónde cambiar cada cosa

| Qué | Dónde |
| --- | --- |
| Textos, servicios, años, opiniones, contacto y horarios | `src/data/site.js` |
| Colores, tipografías y medidas | `src/styles/tokens.css` |
| Orden de las secciones | `src/App.jsx` |
| Cada sección (estructura y estilos) | `src/sections/*.jsx` y `*.module.css` |
| Logo y trazos del auto | `src/components/Logo.jsx` y `src/components/carParts.js` |
| Herramientas dibujadas | `src/components/ToolIcon.jsx` |
| Maleta Autel (dibujo) y tiempos de la animación | `src/components/AutelCase.jsx` y `src/components/autelStages.js` |
| Logos de marcas y fotos | `src/assets/` |

## Animaciones

- **Logo del header**: el auto se dibuja al cargar la página.
- **Entradas al scrollear**: cualquier elemento con `data-reveal="up|left|right|title|photo|photo-r|pop|plate|sweep|line"` aparece al entrar en pantalla; un contenedor con `data-stagger="tipo"` anima a sus hijos uno tras otro (`data-delay` y `data-step` en segundos). Los estilos están en `src/styles/reveal.css` y la lógica en `src/hooks/reveal.js`.
- **Líneas del auto de fondo** (`CarLines`): cada sección dibuja partes del auto del logo a medida que entra en pantalla. Se ajustan con las props `parts`, `viewBox` y la clase de posición del CSS de cada sección.
- **Maleta Autel**: la sección queda fija mientras se scrollea y la maleta se abre por etapas. No sigue al scroll 1:1: lo persigue con un resorte (`stiffness` y `damping` en `src/sections/Autel.jsx`; menos damping = más rebote). La duración depende del alto de `.track` en `src/sections/Autel.module.css`.
- **Parallax** suave en las fotos grandes (`useParallax` en `src/hooks/scroll.js`).
- **Marcas**: cinta infinita en CSS; se pausa al pasar el mouse.
- Si el sistema tiene activado "reducir movimiento", todo se muestra quieto y completo.

## Pendientes

- Horario de atención (`contact.hours` en `src/data/site.js`).
- Confirmar la lista de servicios.
- Sumar logos de más marcas en `src/assets/marcas/` y agregarlos a `brands`.
- Reemplazar las fotos del equipo (400 × 200 px) por versiones en alta.
