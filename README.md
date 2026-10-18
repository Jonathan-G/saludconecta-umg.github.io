# Sitio web del proyecto SaludConecta

Sitio **estático** (HTML, CSS y JavaScript, sin base de datos ni inicio de sesión), tal como define el documento
(sección «Sitio web del proyecto»). Presenta el problema, la solución, los beneficiarios, el prototipo, el documento
final (Word), el video de exposición y al equipo. La página de inicio tiene un **carrusel** con tres diapositivas
clicables: el documento, el proyecto desarrollado y el video.

## Verlo en esta computadora

```powershell
cd SitioWeb
.\Iniciar-Sitio.ps1          # abre http://localhost:8080 (necesita Node.js)
```

También puede abrir `index.html` con doble clic. En ese modo todo funciona **excepto** la lectura del Word dentro
de la página (el navegador bloquea ese acceso a archivos locales); el botón «Descargar Word» sí funciona.

## Estructura

| Ruta | Contenido |
|---|---|
| `index.html` … `acerca.html` | Las 8 páginas: Inicio, El problema, La solución, Beneficiarios, Prototipo, Documento, Video, Acerca del proyecto. |
| `datos/config.js` | **Configuración**: enlace del video, ruta del documento, dirección del prototipo. |
| `datos/equipo.js` | Datos de los 5 integrantes (nombre, rol, secciones, trabajo técnico). |
| `css/estilos.css`, `js/sitio.js`, `js/documento.js` | Estilos, carrusel, visor de imágenes, reproductor y visor del Word. |
| `lib/` | `docx-preview` y `jszip` (visor del Word), incluidos para funcionar sin conexión. |
| `media/documento/` | `Documento-Final-SaludConecta.docx`. |
| `media/video/` | `exposicion-ejemplo.mp4` (video de ejemplo). |
| `media/img/` | Portada del documento, capturas del prototipo y portada del video. |
| `servir.js`, `Iniciar-Sitio.ps1` | Servidor local mínimo (con soporte para adelantar el video). |

## Tareas frecuentes

**Publicar el video final.** Suba el video a YouTube como *no listado* y pegue el enlace en `video.youtube` de
`datos/config.js` (o copie el MP4 a `media/video/` y ponga su nombre en `video.archivo`). Cambie `video.esEjemplo`
a `false`. El video de ejemplo se puede borrar.

**Actualizar el documento.** Reemplace `media/documento/Documento-Final-SaludConecta.docx` por la versión nueva
(mismo nombre). La portada de la diapositiva está en `media/img/doc-portada.png`; si cambia la carátula, reemplácela
con una captura de la primera página.

**Agregar el PDF del documento (opcional).** En Word: *Archivo → Exportar → Crear documento PDF*. Copie el PDF a
`media/documento/` y escriba su ruta en `documento.pdf` de `datos/config.js`. Aparecerán los botones «Ver en PDF» y
«Abrir PDF en otra pestaña».

**Mostrar los carnés.** Por privacidad no se muestran en las tarjetas del equipo (sí están en el documento). Para
mostrarlos, ponga `mostrarCarne: true` en `datos/config.js`. El documento pide contar con la conformidad de los
integrantes antes de publicar sus nombres.

**Actualizar las capturas del prototipo.** Con la aplicación en ejecución y datos limpios:
`cd ..\SaludConecta\pruebas-e2e; node capturas-sitio.js`.

## Publicarlo en GitHub Pages (enlace público)

El documento define el enlace `https://saludconecta-umg.github.io`, publicado desde el repositorio público
`saludconecta-umg/saludconecta-umg.github.io`.

1. Cree en GitHub la organización o usuario `saludconecta-umg` y el repositorio público `saludconecta-umg.github.io`
   (o use otro nombre y ajuste el enlace que entregue al docente).
2. Suba **el contenido** de esta carpeta (que `index.html` quede en la raíz del repositorio), incluido el archivo `.nojekyll`.
3. En *Settings → Pages* elija la rama `main` y la carpeta `/ (root)`.
4. Espere un par de minutos y abra el enlace. Compruebe el caso **PF-28**: que abra sin iniciar sesión desde otra cuenta y
   desde un teléfono, y que muestre el documento y el video.

> El prototipo (ASP.NET Core) **no** se publica aquí: se ejecuta en la computadora de quien lo prueba. La página
> «Prototipo» lo presenta con capturas y explica cómo ejecutarlo.
"# saludconecta-umg.github.io" 
