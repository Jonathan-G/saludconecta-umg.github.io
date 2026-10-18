// Configuración del sitio. Edite este archivo para cambiar enlaces y activar el video final.
window.SITIO = {
    nombre: "SaludConecta",
    curso: "Microeconomía, Sección A · Proyecto Final Aplicado",
    universidad: "Facultad de Ingeniería en Sistemas, Universidad Mariano Gálvez de Guatemala",
    docente: "Lic. Raúl Estuardo Bonilla Berganza",

    // Dirección pública del prototipo publicado (para ejecutarlo en local: https://localhost:7064).
    prototipoUrl: "https://saludconecta-umg.runasp.net",

    // ---- VIDEO DE EXPOSICIÓN ----
    // Video final publicado (media/video/exposicion-final.mp4). Para cambiarlo haga UNA de estas dos cosas:
    //  1) Subirlo a YouTube como «no listado» y pegar el enlace en "youtube".
    //  2) Copiar el MP4 a media/video/ y poner su nombre en "archivo".
    // "esEjemplo": true muestra el aviso de video de ejemplo; en false, se quita.
    video: {
        youtube: "https://youtu.be/5UAvTAtZotU",
        archivo: "media/video/exposicion-final.mp4",
        poster: "media/img/video-poster.jpg",
        esEjemplo: false
    },

    documento: {
        word: "media/documento/Documento-Final-SaludConecta.docx",
        // Opcional: si exporta el Word a PDF (Archivo > Exportar), copie el PDF a media/documento/ y escriba aquí su ruta,
        // por ejemplo "media/documento/Documento-Final-SaludConecta.pdf". Vacío = no se muestra la opción PDF.
        pdf: ""
    },

    // Los carnés están en el documento, pero por privacidad no se muestran en las tarjetas del equipo.
    mostrarCarne: false
};
