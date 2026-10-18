// SaludConecta · sitio del proyecto: cabecera y pie, carrusel, visor de imágenes, video y equipo.
(function () {
    "use strict";

    var S = window.SITIO || {};
    var PAGINAS = [
        ["inicio", "index.html", "Inicio"],
        ["problema", "problema.html", "El problema"],
        ["solucion", "solucion.html", "La solución"],
        ["beneficiarios", "beneficiarios.html", "Beneficiarios"],
        ["prototipo", "prototipo.html", "Prototipo"],
        ["documento", "documento.html", "Documento"],
        ["video", "video.html", "Video"],
        ["acerca", "acerca.html", "Acerca del proyecto"]
    ];
    var reducirMovimiento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function el(tag, atributos, hijos) {
        var e = document.createElement(tag);
        Object.keys(atributos || {}).forEach(function (k) {
            if (k === "texto") e.textContent = atributos[k];
            else if (k === "html") e.innerHTML = atributos[k];
            else e.setAttribute(k, atributos[k]);
        });
        (hijos || []).forEach(function (h) { e.appendChild(h); });
        return e;
    }

    var LOGO = '<svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#0f6b6b"/><path d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z" fill="#fff"/></svg>';

    // ---------- Cabecera y pie ----------
    function cabecera() {
        var host = document.getElementById("cabecera");
        if (!host) return;
        var actual = document.body.getAttribute("data-pagina");
        var enlaces = PAGINAS.map(function (p) {
            return '<a href="' + p[1] + '"' + (p[0] === actual ? ' aria-current="page"' : "") + ">" + p[2] + "</a>";
        }).join("");
        host.innerHTML =
            '<div class="contenedor cabecera-int">' +
            '<a class="marca" href="index.html" aria-label="SaludConecta, inicio">' + LOGO + "<span>Salud<b>Conecta</b></span></a>" +
            '<button class="menu-boton" type="button" aria-expanded="false" aria-controls="menu">Menú ☰</button>' +
            '<nav class="menu" id="menu" aria-label="Principal">' + enlaces + "</nav></div>";
        var boton = host.querySelector(".menu-boton"), menu = host.querySelector(".menu");
        boton.addEventListener("click", function () {
            var abierto = menu.classList.toggle("abierto");
            boton.setAttribute("aria-expanded", abierto ? "true" : "false");
        });
        menu.addEventListener("click", function (e) { if (e.target.tagName === "A") menu.classList.remove("abierto"); });
    }

    function pie() {
        var host = document.getElementById("pie");
        if (!host) return;
        var links = PAGINAS.map(function (p) { return '<li><a href="' + p[1] + '">' + p[2] + "</a></li>"; }).join("");
        host.innerHTML =
            '<div class="contenedor"><div class="pie-rejilla">' +
            "<div><h2>SaludConecta</h2><p>Plataforma web para la gestión de citas y expedientes clínicos básicos en clínicas comunitarias.</p>" +
            "<p>" + (S.curso || "") + "<br>" + (S.universidad || "") + "<br>Docente: " + (S.docente || "") + "</p></div>" +
            "<div><h2>Navegar</h2><ul>" + links + "</ul></div>" +
            "<div><h2>Material</h2><ul>" +
            '<li><a href="documento.html">Documento final (Word)</a></li>' +
            '<li><a href="prototipo.html">Prototipo desarrollado</a></li>' +
            '<li><a href="video.html">Video de exposición</a></li></ul></div></div>' +
            '<p class="pie-legal">Prototipo académico · Todos los datos mostrados son ficticios</p></div>';
    }

    // ---------- Aparición al desplazarse ----------
    function aparicion() {
        var items = document.querySelectorAll(".aparece");
        if (!("IntersectionObserver" in window) || reducirMovimiento) {
            items.forEach(function (i) { i.classList.add("visible"); });
            return;
        }
        var obs = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
        }, { threshold: 0.12 });
        items.forEach(function (i) { obs.observe(i); });
    }

    // ---------- Carrusel ----------
    function carrusel() {
        var raiz = document.querySelector("[data-carrusel]");
        if (!raiz) return;
        var pista = raiz.querySelector(".carrusel-pista");
        var diapositivas = Array.prototype.slice.call(pista.children);
        var contenedorPuntos = raiz.querySelector(".carrusel-puntos");
        var btnPrev = raiz.querySelector("[data-prev]"), btnNext = raiz.querySelector("[data-next]"), btnPausa = raiz.querySelector("[data-pausa]");
        var n = diapositivas.length, actual = 0, temporizador = null, enPausa = reducirMovimiento, pausadoPorUsuario = reducirMovimiento;
        var puntos = diapositivas.map(function (d, i) {
            d.setAttribute("aria-label", (i + 1) + " de " + n);
            var p = el("button", { type: "button", "class": "carrusel-punto", "aria-label": "Ir a la diapositiva " + (i + 1) });
            p.addEventListener("click", function () { ir(i, true); });
            contenedorPuntos.appendChild(p);
            return p;
        });

        function marcar(i) {
            actual = i;
            puntos.forEach(function (p, k) { p.setAttribute("aria-current", k === i ? "true" : "false"); });
        }
        function ir(i, usuario) {
            i = (i + n) % n;
            diapositivas[i].scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", inline: "center", block: "nearest" });
            marcar(i);
            if (usuario) reiniciar();
        }
        function siguiente() { ir(actual + 1, false); }
        function iniciar() { detener(); if (!enPausa) temporizador = setInterval(siguiente, 7000); }
        function detener() { if (temporizador) { clearInterval(temporizador); temporizador = null; } }
        function reiniciar() { iniciar(); }

        btnPrev.addEventListener("click", function () { ir(actual - 1, true); });
        btnNext.addEventListener("click", function () { ir(actual + 1, true); });
        function etiquetaPausa() {
            if (!btnPausa) return;
            btnPausa.textContent = pausadoPorUsuario ? "▶ Reanudar" : "⏸ Pausar";
            btnPausa.setAttribute("aria-pressed", pausadoPorUsuario ? "true" : "false");
            pista.setAttribute("aria-live", pausadoPorUsuario ? "polite" : "off");
        }
        if (btnPausa) btnPausa.addEventListener("click", function () {
            pausadoPorUsuario = !pausadoPorUsuario;
            enPausa = pausadoPorUsuario;
            etiquetaPausa();
            iniciar();
        });
        ["mouseenter", "focusin", "touchstart"].forEach(function (ev) {
            raiz.addEventListener(ev, function () { enPausa = true; detener(); }, { passive: true });
        });
        ["mouseleave", "focusout"].forEach(function (ev) {
            raiz.addEventListener(ev, function () { enPausa = pausadoPorUsuario; iniciar(); });
        });
        raiz.addEventListener("keydown", function (e) {
            if (e.key === "ArrowRight") { ir(actual + 1, true); e.preventDefault(); }
            if (e.key === "ArrowLeft") { ir(actual - 1, true); e.preventDefault(); }
        });
        // Al deslizar con el dedo o la rueda, se actualizan los puntos.
        if ("IntersectionObserver" in window) {
            var obs = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.6) marcar(diapositivas.indexOf(e.target)); });
            }, { root: pista, threshold: [0.6] });
            diapositivas.forEach(function (d) { obs.observe(d); });
        }
        document.addEventListener("visibilitychange", function () { if (document.hidden) detener(); else iniciar(); });
        marcar(0);
        etiquetaPausa();
        iniciar();
    }

    // ---------- Visor de imágenes ----------
    function visor() {
        var botones = document.querySelectorAll("[data-grande]");
        if (!botones.length) return;
        var dlg = el("dialog", { "class": "visor", "aria-label": "Imagen ampliada" });
        dlg.innerHTML = '<div class="visor-caja"><img alt=""><div class="visor-barra"><p></p><button type="button" class="boton boton-verde">Cerrar</button></div></div>';
        document.body.appendChild(dlg);
        var img = dlg.querySelector("img"), pie = dlg.querySelector("p");
        dlg.querySelector("button").addEventListener("click", function () { dlg.close(); });
        dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
        botones.forEach(function (b) {
            b.addEventListener("click", function () {
                img.src = b.getAttribute("data-grande");
                img.alt = b.getAttribute("data-alt") || "";
                pie.textContent = b.getAttribute("data-alt") || "";
                if (dlg.showModal) dlg.showModal(); else window.open(img.src, "_blank");
            });
        });
    }

    // ---------- Equipo ----------
    function avatar(m) { return el("div", { "class": "avatar", style: "background:" + m.color, "aria-hidden": "true", texto: m.iniciales }); }

    function equipoMini() {
        var host = document.querySelector("[data-equipo-mini]");
        if (!host || !window.EQUIPO) return;
        window.EQUIPO.forEach(function (m) {
            var a = el("a", { href: "acerca.html#" + m.id }, [avatar(m), el("span", { texto: m.corto })]);
            host.appendChild(a);
        });
    }

    function equipoCompleto() {
        var host = document.querySelector("[data-equipo]");
        if (!host || !window.EQUIPO) return;
        window.EQUIPO.forEach(function (m) {
            var t = el("article", { "class": "tarjeta integrante aparece", id: m.id });
            t.appendChild(avatar(m));
            t.appendChild(el("h3", { texto: m.nombre }));
            t.appendChild(el("p", { "class": "rol", texto: m.rol }));
            var dl = el("dl");
            if (S.mostrarCarne) { dl.appendChild(el("dt", { texto: "Carné" })); dl.appendChild(el("dd", { texto: m.carne })); }
            dl.appendChild(el("dt", { texto: "Área de responsabilidad" })); dl.appendChild(el("dd", { texto: m.area }));
            dl.appendChild(el("dt", { texto: "Trabajo técnico y de gestión" })); dl.appendChild(el("dd", { texto: m.tecnico }));
            dl.appendChild(el("dt", { texto: "En el video" })); dl.appendChild(el("dd", { texto: m.video }));
            t.appendChild(dl);
            t.appendChild(el("p", { "class": "nota", style: "margin:.9rem 0 0", texto: "Siete secciones del documento final:" }));
            var ul = el("ul", { "class": "chips" });
            m.secciones.forEach(function (s) { ul.appendChild(el("li", { texto: s })); });
            t.appendChild(ul);
            host.appendChild(t);
        });
    }

    // ---------- Video ----------
    function idYoutube(url) {
        var m = /(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/.exec(url || "");
        return m ? m[1] : null;
    }

    function video() {
        var v = S.video || {};
        document.querySelectorAll(".insignia-ejemplo").forEach(function (i) { i.hidden = !v.esEjemplo; });
        var host = document.querySelector("[data-reproductor]");
        if (!host) return;
        host.innerHTML = "";
        var yt = idYoutube(v.youtube);
        if (yt) {
            host.appendChild(el("iframe", {
                src: "https://www.youtube-nocookie.com/embed/" + yt + "?rel=0", title: "Video de exposición de SaludConecta",
                allow: "accelerometer; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: ""
            }));
        } else if (v.archivo) {
            var vid = el("video", { controls: "", preload: "metadata", poster: v.poster || "", "aria-label": "Video de exposición de SaludConecta", playsinline: "" });
            vid.appendChild(el("source", { src: v.archivo }));
            vid.appendChild(el("p", { html: 'Su navegador no puede reproducir este video. <a href="' + v.archivo + '">Descárguelo aquí</a>.' }));
            host.appendChild(vid);
        } else {
            host.appendChild(el("p", { "class": "cargando", style: "color:#fff", texto: "El video todavía no está disponible." }));
        }
        var insignias = document.querySelectorAll(".insignia-ejemplo");
        insignias.forEach(function (i) { i.hidden = !v.esEjemplo; });
    }

    document.addEventListener("DOMContentLoaded", function () {
        cabecera(); pie(); carrusel(); visor(); equipoMini(); equipoCompleto(); video(); aparicion();
    });
})();
