// Página «Documento»: renderiza el Word (.docx) dentro de la página y, si existe, muestra también el PDF.
(function () {
    "use strict";
    var S = window.SITIO || {};
    var d = S.documento || {};
    var visor = document.getElementById("visor");
    var nota = document.getElementById("notaVisor");
    var btnPdf = document.getElementById("verPdf");
    var btnWord = document.getElementById("verWord");
    var abrirPdf = document.getElementById("abrirPdf");
    var params = new URLSearchParams(location.search);
    var imprimir = params.has("imprimir");     // modo de impresión (sin cabecera ni pie)
    var wordCargado = false;

    if (document.getElementById("descargarWord")) document.getElementById("descargarWord").href = d.word;
    if (imprimir) document.body.classList.add("modo-impresion");

    // El PDF es opcional: sin ruta en datos/config.js no se muestran sus botones.
    var hayPdf = !!d.pdf;
    if (hayPdf) { abrirPdf.href = d.pdf; }
    else { btnPdf.hidden = true; abrirPdf.hidden = true; }

    function seleccionar(modo) {
        btnPdf.setAttribute("aria-selected", modo === "pdf" ? "true" : "false");
        btnWord.setAttribute("aria-selected", modo === "word" ? "true" : "false");
        btnPdf.className = "boton " + (modo === "pdf" ? "boton-verde" : "boton-contorno");
        btnWord.className = "boton " + (modo === "word" ? "boton-verde" : "boton-contorno");
    }

    function mostrarPdf() {
        seleccionar("pdf");
        visor.innerHTML = "";
        var marco = document.createElement("iframe");
        marco.src = d.pdf + "#view=FitH";
        marco.title = "Documento final de SaludConecta en PDF";
        visor.appendChild(marco);
        nota.textContent = "Si el PDF no aparece en su navegador, use «Abrir PDF en otra pestaña» o «Descargar Word».";
    }

    function mostrarWord() {
        seleccionar("word");
        if (wordCargado) return;
        if (location.protocol === "file:") {
            visor.innerHTML = '<p class="cargando">Para leer el Word dentro de la página, abra el sitio con el servidor local (<code>Iniciar-Sitio.ps1</code>) o publíquelo en un alojamiento web.<br>Mientras tanto puede <strong>descargar el Word</strong> con el botón de arriba.</p>';
            return;
        }
        visor.innerHTML = '<p class="cargando">Preparando el documento… (puede tardar unos segundos)<span class="barra-progreso" aria-hidden="true"><i id="progreso"></i></span></p>';
        var barra = document.getElementById("progreso");
        var avance = 5;
        var tic = setInterval(function () { avance = Math.min(92, avance + 3); if (barra) barra.style.width = avance + "%"; }, 400);

        fetch(d.word, { cache: "force-cache" })
            .then(function (r) { if (!r.ok) throw new Error("no se pudo leer el archivo (" + r.status + ")"); return r.arrayBuffer(); })
            .then(function (datos) {
                var cont = document.createElement("div");
                cont.className = "docx-contenedor";
                return window.docx.renderAsync(datos, cont, null, {
                    className: "docx", inWrapper: true, breakPages: true, ignoreLastRenderedPageBreak: false,
                    renderHeaders: true, renderFooters: true, renderFootnotes: true, renderEndnotes: true,
                    useBase64URL: true, experimental: true
                }).then(function () {
                    clearInterval(tic);
                    visor.innerHTML = "";
                    visor.appendChild(cont);
                    wordCargado = true;
                    nota.textContent = "Vista del Word en el navegador: la paginación puede diferir de Microsoft Word. Para el original use «Descargar Word».";
                    window.__documentoListo = true;
                });
            })
            .catch(function (e) {
                clearInterval(tic);
                visor.innerHTML = '<p class="cargando">No se pudo mostrar el Word aquí (' + e.message + '). Use «Descargar Word».</p>';
            });
    }

    btnPdf.addEventListener("click", mostrarPdf);
    btnWord.addEventListener("click", mostrarWord);

    if (hayPdf && !imprimir) mostrarPdf(); else mostrarWord();
})();
